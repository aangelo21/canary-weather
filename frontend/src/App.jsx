import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";
import PointsOfInterest from "./components/PointsOfInterest";
import Users from "./components/Users";
import Home from "./Pages/Home"; 

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />       
                        <Route path="/pois" element={<PointsOfInterest />} />
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;