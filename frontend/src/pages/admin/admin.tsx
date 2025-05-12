import Navbar from "../../components/admin/navbar";
import type { Route } from "../home/+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Admin" },
  ];
}

export default function admin() {
  return (
    <>
      <Navbar role="admin" name="test" />
    </>
  )
}
