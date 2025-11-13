import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PointsOfInterest from "./Pages/PointsOfInterest";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Map from "./pages/Map";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/pois" element={<PointsOfInterest />} />
                        <Route path="/map" element={<Map />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
