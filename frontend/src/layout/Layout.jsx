// Import Outlet from React Router to render child routes
import { Outlet } from "react-router-dom";
// Import Header and Footer components for consistent layout
import Header from "../components/Header";
import Footer from "../components/Footer";

// Layout component that provides the overall page structure
// This component wraps all pages with a header, main content area, and footer
export default function Layout() {
  return (
    // Flexbox container with full height and column direction
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header component at the top */}
      <Header />
      {/* Main content area that grows to fill available space */}
      <main className="grow mt-6">
        {/* Outlet renders the current route's component */}
        <Outlet />
      </main>
      {/* Footer component at the bottom */}
      <Footer />
    </div>
  );
}
