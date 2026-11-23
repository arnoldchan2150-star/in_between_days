# Moving In-Between Days off Manus

The code no longer depends on Manus. These are the steps to move the live site.
**Keep the Manus site running until step 7 is confirmed.** It is your only copy
of the database and the images until they've been copied across.

## 0. Before anything: get your data out of Manus

In the Manus project settings, find the database connection string (`DATABASE_URL`).
If it isn't shown, ask Manus support for a full export (SQL dump) of the project's
database. **Do not cancel Manus without this.**

## 1. Create the accounts

| What | Suggested | Notes |
|---|---|---|
| Hosting (Node server) | [Railway](https://railway.app) | Deploys from GitHub on every push |
| Database (MySQL) | Railway MySQL (same project) | Or Aiven / any MySQL 8 |
| File storage | [Cloudflare R2](https://dash.cloudflare.com) | Create bucket `inbetweenday-media` and an API token with read/write on it |

## 2. Copy the database

On a computer with the MySQL client installed (`brew install mysql-client` on a Mac):

```bash
# export from Manus (take the parts from the Manus DATABASE_URL)
mysqldump --single-transaction --set-gtid-purged=OFF --no-tablespaces \
  -h OLD_HOST -P OLD_PORT -u OLD_USER -p OLD_DBNAME > inbetweenday.sql

# import into the new database
mysql -h NEW_HOST -P NEW_PORT -u NEW_USER -p NEW_DBNAME < inbetweenday.sql
```

If the Manus database requires SSL, add `--ssl-mode=REQUIRED` to `mysqldump`.

## 3. Copy the images

The script finds every `/manus-storage/...` file used in the database and code,
downloads each one through the live site, and uploads it to R2 with the same name.
The links saved in your articles therefore keep working unchanged.

```bash
pnpm install
# in .env: DATABASE_URL (new DB from step 2), S3_* (R2)
pnpm tsx scripts/copy-storage.ts --dry-run   # see what will be copied
pnpm tsx scripts/copy-storage.ts             # copy (safe to re-run)
```

It also lists **other Manus-hosted links** (e.g. the Kumano guide on
`kumano-guide-….manus.space`, files on `files.manuscdn.com`). Those are separate
Manus pages or files, and each one needs a new home before Manus is cancelled.

## 4. Deploy

In Railway: **New project → Deploy from GitHub repo → in_between_days**.

- Build command: `pnpm install && pnpm build`
- Start command: `pnpm start`
- Variables: everything in `.env.example` (generate a new `JWT_SECRET`)

## 5. Test on the temporary Railway URL

- Home page and article images load
- `/admin/login` works (same email/password as before, since it's stored in the database)
- Upload an image in the admin, then check that it shows
- Subscribe with a test address, then check that the confirmation email arrives

## 6. Switch the domain

- Railway → Settings → Domains → add `inbetweenday.com` (and `www`)
- At your domain registrar, change the DNS records to what Railway shows
- **Don't touch the Resend DNS records** (DKIM/SPF). Leave them as they are.

## 7. After the switch

- Stripe Dashboard → Webhooks → set the endpoint to
  `https://inbetweenday.com/api/stripe/webhook`, and update `STRIPE_WEBHOOK_SECRET`
  if Stripe issues a new one
- Re-run `scripts/copy-storage.ts` one last time if you added images on Manus
  in the meantime
- Wait a week, then cancel Manus
