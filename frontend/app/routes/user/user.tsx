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
      <Navbar />
    </>
  )
}
