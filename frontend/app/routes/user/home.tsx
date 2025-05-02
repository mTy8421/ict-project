import Navbar from "~/components/user/navbar"

import type { Route } from "../home/+types/home";
import { HomeUser } from "~/components/user/content";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "User" },
  ];
}

export default function user() {
  return (
    <>
      <div className="grid grid-cols-6">

        <div className="col-span-1">
          <div className="fixed">
            <Navbar role="พนักงาน" name="พนักงาน" />
          </div>
        </div>

        <div className="col-span-5 mt-4">
          <HomeUser name="Profile" />
        </div>

      </div>
    </>
  )
}
