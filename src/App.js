import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landingpage" element={<LandingPage />} />

          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
