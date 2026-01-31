import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChooseUsername from "./pages/ChooseUsername";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import VoteRoom from "./pages/VoteRoom";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/username" element={<ChooseUsername />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/vote" element={<VoteRoom />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}
