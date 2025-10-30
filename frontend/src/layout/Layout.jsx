import { Outlet, Link } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header
                style={{
                    background: "#2c3e50",
                    color: "white",
                    padding: "1rem",
                    marginBottom: "2rem",
                }}
            >
                <nav
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                    }}
                >
                    <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
                        CanaryWeather
                    </h1>
                    <Link
                        to="/pois"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.backgroundColor =
                                "rgba(255,255,255,0.1)")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                        }
                    >
                        Puntos de Interés
                    </Link>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
