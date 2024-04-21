// import { NavbarBrand } from "@nextui-org/react";
import Link from "next/link";
export default function Menu() {
  return (
    <>
      <Link href="/">Nzo</Link>
      <Link href="/horoscope">Horoscope</Link>
      <Link href="/config">Config</Link>
      <Link href="/natalchart">Natal Chart</Link>
    </>
  );
}
