import Register from "./pages/Register";
import "./style.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<Register />} />
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
