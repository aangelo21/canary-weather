import React from "react";

export default function Footer() {
    return (
        <footer className="bg-[#0f6fa8] text-white py-4 shadow-[0_-2px_6px_rgba(0,0,0,0.08)]">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
                <div className="text-sm">
                    ©CanaryWeather |{" "}
                    <a
                        href="https://canaryweather.com"
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2 hover:text-gray-100"
                    >
                        canaryweather.com
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/aangelo21/canary_weather"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2C6.477 2 2 6.486 2 12.02c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.699-2.782.605-3.369-1.343-3.369-1.343-.454-1.157-1.11-1.466-1.11-1.466-.909-.621.069-.609.069-.609 1.004.072 1.532 1.032 1.532 1.032.893 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.22-.254-4.555-1.113-4.555-4.951 0-1.093.39-1.986 1.03-2.684-.103-.254-.447-1.277.098-2.66 0 0 .84-.27 2.75 1.026A9.563 9.563 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.026 2.748-1.026.547 1.383.204 2.406.1 2.66.64.698 1.028 1.59 1.028 2.684 0 3.848-2.338 4.694-4.566 4.943.36.31.682.923.682 1.861 0 1.343-.012 2.427-.012 2.757 0 .268.18.581.688.482A10.015 10.015 0 0022 12.02C22 6.486 17.523 2 12 2z"
                                fill="#fff"
                            />
                        </svg>
                    </a>

                    <a
                        href="https://x.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="X"
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22 5.924c-.63.28-1.307.47-2.017.556.726-.435 1.283-1.125 1.546-1.945-.68.403-1.433.696-2.232.854C18.943 4.5 18.03 4 17.01 4c-1.683 0-3.046 1.366-3.046 3.052 0 .24.026.473.08.697-2.532-.127-4.777-1.34-6.283-3.186-.262.452-.412.977-.412 1.538 0 1.06.54 1.994 1.36 2.543-.503-.016-.978-.154-1.394-.385v.039c0 1.482 1.047 2.717 2.437 3.0-.253.068-.52.103-.796.103-.194 0-.383-.02-.567-.056.383 1.196 1.494 2.066 2.81 2.092-1.03.804-2.33 1.283-3.738 1.283-.243 0-.483-.014-.718-.042 1.334.855 2.92 1.354 4.623 1.354 5.548 0 8.58-4.593 8.58-8.578v-.391c.591-.427 1.104-.96 1.512-1.57-.54.24-1.116.403-1.716.476.619-.372 1.093-.958 1.318-1.657z"
                                fill="#fff"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}