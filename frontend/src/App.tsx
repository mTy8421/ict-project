import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import UserHome from "./pages/user/home";
import UserWork from "./pages/user/work";
import UserWorkLoad from "./pages/user/workload";
import UserHistory from "./pages/user/history";
import Admin from "./pages/admin/admin";
import DeanDashboard from "./pages/dean/dashboard";
import DeanWorkload from "./pages/dean/workload";
import DeanWorkloadNew from "./pages/dean/workload-new";
import DeanUsers from "./pages/dean/users";
import StrategyDashboard from "./pages/vice-dean/strategy/dashboard";
import StrategyWorkload from "./pages/vice-dean/strategy/workload";
import AcademicDashboard from "./pages/vice-dean/academic/dashboard";
import AcademicWorkload from "./pages/vice-dean/academic/workload";
import DisciplineDashboard from "./pages/vice-dean/discipline/dashboard";
import StudentQualityDashboard from "./pages/vice-dean/student-quality/dashboard";
import Head from "./pages/head/head";
import HeadWork from "./pages/head/work";
import HeadHistory from "./pages/head/history";
import AdminWorkLoad from "./pages/admin/workload";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/work" element={<UserWork />} />
        <Route path="/user/work/new" element={<UserWorkLoad />} />
        <Route path="/user/history" element={<UserHistory />} />
        <Route path="/head" element={<Head />} />
        <Route path="/head/work" element={<HeadWork />} />
        <Route path="/head/history" element={<HeadHistory />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/work/new" element={<AdminWorkLoad />} />
        <Route path="/dean" element={<DeanDashboard />} />
        <Route path="/dean/workload" element={<DeanWorkload />} />
        <Route path="/dean/workload/new" element={<DeanWorkloadNew />} />
        <Route path="/dean/users" element={<DeanUsers />} />
        <Route path="/vice-dean/strategy" element={<StrategyDashboard />} />
        <Route
          path="/vice-dean/strategy/workload"
          element={<StrategyWorkload />}
        />
        <Route path="/vice-dean/academic" element={<AcademicDashboard />} />
        <Route
          path="/vice-dean/academic/workload"
          element={<AcademicWorkload />}
        />
        <Route path="/vice-dean/discipline" element={<DisciplineDashboard />} />
        <Route
          path="/vice-dean/student-quality"
          element={<StudentQualityDashboard />}
        />
        <Route path="/test" element={<div>Test Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
