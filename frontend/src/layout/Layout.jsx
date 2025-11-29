import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

/**
 * Layout component that provides the main structure of the application.
 * It wraps the content with a Header and a Footer, and uses Outlet to render child routes.
 *
 * @returns {JSX.Element} The rendered Layout component.
 */
export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="grow mt-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
