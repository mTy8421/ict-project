import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Home" },
  ];
}

export default function Home() {
  return (
    <>
      <h1>this is home page</h1>
    </>
  )
}

