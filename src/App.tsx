import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import ParticipantsPage from "./pages/ParticipantsPage";
import ExhibitionPage from "./pages/ExhibitionPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import BoothPage from "./pages/BoothPage";
import BehindPage from "./pages/BehindPage";
import DirectionsPage from "./pages/DirectionsPage";
import GuestbookPage from "./pages/GuestbookPage";
import SiteLayout from "./layouts/SiteLayout";
import { ROUTES } from "./constants/routes";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path={ROUTES.splash} element={<SplashPage />} />
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.participants} element={<ParticipantsPage />} />
        <Route path={ROUTES.exhibition} element={<ExhibitionPage />} />
        <Route path={ROUTES.directions} element={<DirectionsPage />} />
        <Route path={ROUTES.projects} element={<ProjectsPage />} />
        <Route path={ROUTES.projectDetail} element={<ProjectDetailPage />} />
        <Route path={ROUTES.booths} element={<BoothPage />} />
        <Route path={ROUTES.guestbook} element={<GuestbookPage />} />
        <Route path={ROUTES.behind} element={<BehindPage />} />
      </Route>
    </Routes>
  );
}
