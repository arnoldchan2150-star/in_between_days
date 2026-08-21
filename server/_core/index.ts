import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // Sitemap and robots.txt
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { getPublishedPosts, getPublicBooklets } = await import("../db");
      const posts = await getPublishedPosts();
      const booklets = await getPublicBooklets();
      const host = req.get("host") || "inbetweenbd-ni9eppcf.manus.space";
      const protocol = req.protocol || "https";
      const baseUrl = `${protocol}://${host}`;

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Static pages
      const staticPaths = ["", "/journal", "/destinations", "/culture", "/snow", "/booklet", "/about"];
      for (const p of staticPaths) {
        xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${p === "" ? "1.0" : "0.8"}</priority>\n  </url>\n`;
      }

      // Posts
      for (const post of posts) {
        const detailPath = post.type === "snow" ? `/snow/${post.slug}` : post.type === "culture" ? `/culture/${post.slug}` : `/journal/${post.slug}`;
        const lastMod = post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : new Date(post.createdAt).toISOString().split("T")[0];
        xml += `  <url>\n    <loc>${baseUrl}${detailPath}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }

      // Booklets
      for (const b of booklets) {
        xml += `  <url>\n    <loc>${baseUrl}/booklet?guide=${b.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }

      xml += `</urlset>`;
      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "inbetweenbd-ni9eppcf.manus.space";
    const protocol = req.protocol || "https";
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nSitemap: ${protocol}://${host}/sitemap.xml\n`);
  });

  // Newsletter confirmation and unsubscription endpoints
  app.get("/api/newsletter/confirm", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      return res.status(400).send("無效的確認連結");
    }
    try {
      const { confirmSiteSubscriber } = await import("../db");
      const ok = await confirmSiteSubscriber(token);
      if (ok) {
        res.send(`
          <!DOCTYPE html>
          <html lang="zh-TW">
          <head>
            <meta charset="utf-8">
            <title>訂閱確認成功 | In-Between Days</title>
            <style>
              body { font-family: 'Noto Serif TC', serif; background: #fbf9f5; color: #3a3a3a; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #fff; padding: 40px; border: 1px solid #e0e0e0; max-width: 480px; text-align: center; }
              h1 { font-weight: 400; font-size: 22px; margin-bottom: 16px; letter-spacing: 0.05em; }
              p { font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 24px; }
              a { display: inline-block; padding: 10px 24px; background: #3a3a3a; color: #fff; text-decoration: none; font-size: 13px; letter-spacing: 0.05em; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>訂閱確認成功</h1>
              <p>感謝您的確認！您已成功訂閱 In-Between Days 網站更新通知，未來有新遊記或小冊子發布時，將會準時寄送到您的信箱。</p>
              <a href="/">返回首頁</a>
            </div>
          </body>
          </html>
        `);
      } else {
        res.status(400).send("確認連結無效或已過期。");
      }
    } catch (err) {
      res.status(500).send("伺服器錯誤，請稍後再試。");
    }
  });

  app.get("/api/newsletter/unsubscribe", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token : "";
    if (!token) {
      return res.status(400).send("無效的取消訂閱連結");
    }
    try {
      const { unsubscribeSiteSubscriber } = await import("../db");
      const ok = await unsubscribeSiteSubscriber(token);
      if (ok) {
        res.send(`
          <!DOCTYPE html>
          <html lang="zh-TW">
          <head>
            <meta charset="utf-8">
            <title>已取消訂閱 | In-Between Days</title>
            <style>
              body { font-family: 'Noto Serif TC', serif; background: #fbf9f5; color: #3a3a3a; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #fff; padding: 40px; border: 1px solid #e0e0e0; max-width: 480px; text-align: center; }
              h1 { font-weight: 400; font-size: 22px; margin-bottom: 16px; letter-spacing: 0.05em; }
              p { font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 24px; }
              a { display: inline-block; padding: 10px 24px; background: #3a3a3a; color: #fff; text-decoration: none; font-size: 13px; letter-spacing: 0.05em; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>已成功取消訂閱</h1>
              <p>您已不再接收 In-Between Days 的網站更新信件。如果這是誤會，隨時歡迎重新回到首頁訂閱。</p>
              <a href="/">返回首頁</a>
            </div>
          </body>
          </html>
        `);
      } else {
        res.status(400).send("取消訂閱連結無效或已失效。");
      }
    } catch (err) {
      res.status(500).send("伺服器錯誤，請稍後再試。");
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
