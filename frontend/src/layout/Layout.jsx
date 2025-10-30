import { Outlet, Link } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>
                <nav>
                    <h1>CanaryWeather</h1>
                    <Link to="/pois">Puntos de Interés</Link>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
