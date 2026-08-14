import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import ParticipantsPage from "./pages/ParticipantsPage";
import ExhibitionPage from "./pages/ExhibitionPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import BoothPage from "./pages/BoothPage";
import BehindPage from "./pages/BehindPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/participants" element={<ParticipantsPage />} />
      <Route path="/exhibition" element={<ExhibitionPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="/booths" element={<BoothPage />} />
      <Route path="/behind" element={<BehindPage />} />
    </Routes>
  );
}
