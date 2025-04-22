import Navbar from "~/components/navbar";

import type { Route } from "../+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin" },
  ];
}

export default function admin() {
  return (
    <>
      <Navbar />
    </>
  )
}
