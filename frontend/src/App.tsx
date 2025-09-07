import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import UserHome from "./pages/user/home";
import UserWork from "./pages/user/work";
import UserWorkLoad from "./pages/user/workload";
import UserHistory from "./pages/user/history";
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
import EditUserWorkLoad from "./pages/user/edit";
import DetailUserWorkLoad from "./pages/user/detail";
import UserHistoryDetail from "./pages/user/historyDetail";
import DetailHeadWorkLoad from "./pages/head/detail";
import AdminConfig from "./pages/admin/config";
import AdminEdit from "./pages/admin/edit";
import Admin from "./pages/admin/admin";
import AdminWork from "./pages/admin/work";
import HeadWorkload from "./pages/head/workload";
import HeadWorkLoadAdd from "./pages/head/workload.add";
import Priority from "./pages/admin/setting/priority";
import HeadWorkLoadEdit from "./pages/head/workload.edit";
import HeadWorkLoadDetail from "./pages/head/workload.detail";
import HeadHistoryDetail from "./pages/head/history.detail";
import HeadWorkUser from "./pages/head/work.user";
import HeadWorkStatus from "./pages/head/work.status";
import PriorityView from "./pages/admin/setting/priority.view";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/user/work" element={<UserWork />} />
        <Route path="/user/work/new" element={<UserWorkLoad />} />
        <Route path="/user/work/edit/:id" element={<EditUserWorkLoad />} />
        <Route path="/user/work/detail/:id" element={<DetailUserWorkLoad />} />
        <Route path="/user/history" element={<UserHistory />} />
        <Route
          path="/user/history/detail/:id"
          element={<UserHistoryDetail />}
        />

        <Route path="/head" element={<Head />} />
        <Route path="/head/work" element={<HeadWork />} />
        <Route path="/head/work/user/:id" element={<HeadWorkUser />} />
        <Route path="/head/work/user/status/:id" element={<HeadWorkStatus />} />
        <Route path="/head/work/detail/:id" element={<DetailHeadWorkLoad />} />
        <Route path="/head/_workload" element={<HeadWorkload />} />
        <Route path="/head/_workload/new" element={<HeadWorkLoadAdd />} />
        <Route path="/head/_workload/edit/:id" element={<HeadWorkLoadEdit />} />
        <Route
          path="/head/_workload/detail/:id"
          element={<HeadWorkLoadDetail />}
        />
        <Route path="/head/history" element={<HeadHistory />} />
        <Route
          path="/head/history/detail/:id"
          element={<HeadHistoryDetail />}
        />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/user/new" element={<AdminWorkLoad />} />
        <Route path="/admin/user/edit/:id" element={<AdminEdit />} />
        <Route path="/admin/config" element={<AdminConfig />} />
        <Route path="/admin/config/priority" element={<PriorityView />} />
        <Route path="/admin/config/priority/add" element={<Priority />} />
        <Route path="/admin/work" element={<AdminWork />} />

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
