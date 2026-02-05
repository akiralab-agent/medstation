import { Outlet, useLocation } from 'react-router-dom';
import { Navbar, Footer } from './ui';

const noLayoutRoutes = ['/login', '/signup', '/forgot-password', '/register'];

export function Layout() {
  const location = useLocation();
  const showLayout = !noLayoutRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="app-container">
      {showLayout && <Navbar />}
      <main className="main-content">
        <Outlet />
      </main>
      {showLayout && <Footer />}
    </div>
  );
}
