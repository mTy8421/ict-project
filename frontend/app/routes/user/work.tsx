import Navbar from "~/components/user/navbar"

import type { Route } from "../home/+types/home";
import { WorkUser } from "~/components/user/content";
import Form from "~/components/user/form";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Work" },
  ];
}

export default function work() {
  return (
    <>
      <div className="grid grid-cols-6">

        <div className="col-span-1">
          <Navbar role="พนักงาน" name="พนักงาน" />
        </div>

        <div className="col-span-5">
          <WorkUser />
          <Form />
        </div>

      </div>
    </>
  )
}
