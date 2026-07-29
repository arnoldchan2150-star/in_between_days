import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import PostDetail from "./pages/PostDetail";
import Destinations from "./pages/Destinations";
import Snow from "./pages/Snow";
import Culture from "./pages/Culture";
import Booklet from "./pages/Booklet";
import About from "./pages/About";


// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostEditor from "./pages/admin/AdminPostEditor";
import AdminBooklets from "./pages/admin/AdminBooklets";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminAbout from "./pages/admin/AdminAbout";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/:slug" component={PostDetail} />
      <Route path="/destinations" component={Destinations} />
      <Route path="/destinations/:slug" component={PostDetail} />
      <Route path="/snow" component={Snow} />
      <Route path="/snow/:slug" component={PostDetail} />
      <Route path="/culture" component={Culture} />
      <Route path="/booklet" component={Booklet} />
      <Route path="/about" component={About} />

      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/posts" component={AdminPosts} />
      <Route path="/admin/posts/new" component={AdminPostEditor} />
      <Route path="/admin/posts/:id/edit" component={AdminPostEditor} />
      <Route path="/admin/booklets" component={AdminBooklets} />
      <Route path="/admin/subscribers" component={AdminSubscribers} />
      <Route path="/admin/about" component={AdminAbout} />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
