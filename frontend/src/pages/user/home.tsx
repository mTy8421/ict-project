import Navbar from "../../components/user/navbar";

import type { Route } from "../home/+types/home";
import { HomeUser } from "../../components/user/content";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "User" }];
}

export default function user() {
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Navbar role="พนักงาน" name="พนักงาน" />
      </div>
      <div className="flex-1 overflow-auto p-4">
        <HomeUser name="Profile" />
      </div>
    </div>
  );
}
