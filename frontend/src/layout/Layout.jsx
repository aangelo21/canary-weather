import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * Layout component that provides the main structure of the application.
 * It wraps the content with a Header and a Footer, and uses Outlet to render child routes.
 *
 * @returns {JSX.Element} The rendered Layout component.
 */
export default function Layout() {
    const location = useLocation();
    const isAboutPage = location.pathname === '/aboutus';

    return (
        <div className={`flex flex-col min-h-screen ${isAboutPage ? 'bg-[#0B1120]' : 'bg-white'}`}>
            <Header isTransparent={isAboutPage} />
            <main className={`grow ${isAboutPage ? '' : 'mt-6'}`}>
                <Outlet />
            </main>
            {!isAboutPage && <Footer />}
        </div>
    );
}
