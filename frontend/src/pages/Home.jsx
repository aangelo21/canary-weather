import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-4 flex flex-col">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 pb-12 grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                    {/* Left column - Hero text */}
                    <div className="flex flex-col justify-center h-full">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-1 leading-tight">
                                Bienvenido a
                                <br />
                                Canary Weather
                            </h1>

                            <p className="mt-6 text-lg md:text-xl text-neutral-2 max-w-xl">
                                Descubre el clima en tus lugares favoritos. Explora los mapas y ve pronósticos detallados, mareas y puntos de interés alrededor de las Islas Canarias.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate("/map")}
                                    className="inline-flex items-center gap-2 bg-brand-primary hover:bg-accent-blue-200 text-white px-5 py-3 rounded-full font-semibold shadow"
                                >
                                    mapas
                                </button>

                                <button
                                    onClick={() => navigate("/tides")}
                                    className="inline-flex items-center gap-2 bg-brand-primary hover:bg-accent-blue-200 text-white px-5 py-3 rounded-full font-semibold shadow"
                                >
                                    mareas
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right column - illustrative image placeholder */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="w-full max-w-md lg:max-w-lg">
                            <div className="w-full h-80 bg-linear-to-br from-slate-100 to-white rounded-3xl shadow-xl flex items-center justify-center">
                                <span className="text-neutral-3">Imagen heroica / teléfonos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Yellow cards centered below */}
            <div className="flex justify-center pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                    {[
                        {
                            title: "Responsivo",
                            text: "Selecciona un destino en el mapa y mira el clima y los puntos de interés en móvil",
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42" stroke="#0f6fa8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" stroke="#0f6fa8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                        },
                        {
                            title: "Alerta de viento",
                            text: "En este sitio web puedes ver los diferentes pronósticos y alertas de viento de las diferentes ubicaciones",
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 12h18M12 3v18" stroke="#0f6fa8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                        },
                        {
                            title: "Ubicaciones",
                            text: "Explora las diferentes ubicaciones en el mapa y verifica el pronóstico de la ubicación",
                            icon: (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" stroke="#0f6fa8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )
                        }
                    ].map((card, i) => (
                        <div
                            key={i}
                            className="w-44 bg-brand-secondary rounded-xl p-4 shadow-[0_14px_30px_rgba(15,111,168,0.12)] flex flex-col items-center text-center gap-2 transform transition-transform hover:-translate-y-1"
                        >
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                {card.icon}
                            </div>
                            <h3 className="font-bold text-sm">{card.title}</h3>
                            <p className="text-xs text-black/90">{card.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;