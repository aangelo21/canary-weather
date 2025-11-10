import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                        <p className="text-gray-700 leading-relaxed mb-8 text-center md:text-left">
                            Canary Weather provides accurate and comprehensive
                            weather forecasts for any location worldwide.
                            Registered users may personalize their experience,
                            by specifying their favorite locations and selecting
                            the weather metrics most relevant forecasts.
                            Additionally, the platform offers detailed reports
                            for global points of interest, ensuring users stay
                            informed about weather conditions in the Canary
                            Islands.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate("/map")}
                                className="bg-[#0768A9] text-white px-6 py-3 rounded-lg hover:bg-[#055f93] transition-colors font-medium"
                            >
                                Explore the map
                            </button>
                            <button
                                onClick={() => navigate("/pois")}
                                className="bg-[#0768A9] text-white px-6 py-3 rounded-lg hover:bg-[#055f93] transition-colors font-medium"
                            >
                                Point of interest
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
