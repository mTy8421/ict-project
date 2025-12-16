import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import UserHome from "./pages/user/home";
import UserWork from "./pages/user/work";
import UserWorkLoad from "./pages/user/workload";
import UserHistory from "./pages/user/history";

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
import AdminWorkStatus from "./pages/admin/work.status";
import AdminWorkUser from "./pages/admin/work.user";
import AdminWorkStatusDetail from "./pages/admin/work.detail";
import PriorityEdit from "./pages/admin/setting/priority.edit";

import UserChert from "./pages/user/chart/user.chart";
import HeadChart from "./pages/head/chart/head.chart";
import AdminChart from "./pages/admin/chart/admin.chart";

import ChartDean from "./pages/dean/chartdean";

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
        <Route path="/user/chart" element={<UserChert />} />

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
        <Route path="/head/chart" element={<HeadChart />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/user/new" element={<AdminWorkLoad />} />
        <Route path="/admin/user/edit/:id" element={<AdminEdit />} />
        <Route path="/admin/work" element={<AdminWork />} />
        <Route path="/admin/work/user/:id" element={<AdminWorkUser />} />
        <Route
          path="/admin/work/user/status/:id"
          element={<AdminWorkStatus />}
        />
        <Route
          path="/admin/work/detail/:id"
          element={<AdminWorkStatusDetail />}
        />
        <Route path="/admin/config" element={<AdminConfig />} />
        <Route path="/admin/config/priority" element={<PriorityView />} />
        <Route path="/admin/config/priority/add" element={<Priority />} />
        <Route
          path="/admin/config/priority/edit/:id"
          element={<PriorityEdit />}
        />
        <Route path="/admin/chart" element={<AdminChart />} />

        <Route path="/dean" element={<ChartDean />} />
      </Routes>
    </BrowserRouter>
  );
}
