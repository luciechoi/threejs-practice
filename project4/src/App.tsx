import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KernelPage from "./pages/Kernel";
import RasterizationPage from "./pages/Rasterization";

function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path="/" element={<KernelPage />} />
          <Route path="/rasterization" element={<RasterizationPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
