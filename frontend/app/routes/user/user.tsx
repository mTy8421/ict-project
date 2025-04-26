import Navbar from "~/components/user/navbar"

import type { Route } from "../+types/home";

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
          <Navbar role="พนักงาน" name="พนักงาน" />
        </div>
        <div className="col-span-5">
          <p className="text-9xl text-center">hello world</p>
        </div>
      </div>
    </>
  )
}
