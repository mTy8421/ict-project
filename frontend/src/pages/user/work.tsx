import Navbar from "../../components/user/navbar"
import type { Route } from "../home/+types/home";
import { WorkUser } from "../../components/user/content";
import Form from "../../components/user/form";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Work" },
  ];
}

export default function Work() {
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Navbar role="พนักงาน" name="พนักงาน" />
      </div>
      <div className="flex-1 overflow-auto p-4">
        <WorkUser />
      </div>
    </div>
  );
}
