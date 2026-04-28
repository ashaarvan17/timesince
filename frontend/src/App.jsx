import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import TimerPage from "./pages/TimerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Timer Page */}
        <Route path="/timer/:id" element={<TimerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;