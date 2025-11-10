import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
    return (
        <>
            <Header />
            <main className="mt-10">
                <Outlet />
            </main>
            <Footer className="mt-10" />
        </>
    );
}
