import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./layout/Layout";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<></>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
