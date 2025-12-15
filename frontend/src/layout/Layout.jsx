import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';


export default function Layout() {
    const location = useLocation();
    const isAboutPage = location.pathname === '/aboutus';
    const isMapPage = location.pathname === '/map';

    return (
        <div
            className={`flex flex-col ${isMapPage ? 'h-screen overflow-hidden' : 'min-h-screen'} ${isAboutPage ? 'bg-[#0B1120]' : 'bg-white'}`}
        >
            <Header isTransparent={isAboutPage} />
            <main className={`grow ${isMapPage ? 'relative' : ''}`}>
                <Outlet />
            </main>
            {!isAboutPage && !isMapPage && <Footer />}
        </div>
    );
}
