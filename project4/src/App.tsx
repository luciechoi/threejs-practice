import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KernelPage from "./pages/Kernel";
import TextureMappingPage from "./pages/TextureMapping";

function App() {
  return (
    <>
    <Router>
        <Routes>
          <Route path="/kernel" element={<KernelPage />} />
          <Route path="/texturemapping" element={<TextureMappingPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
