// import { NavbarBrand } from "@nextui-org/react";
import Link from "next/link";
export default function Menu() {
  return (
    <>
  <nav className="flex flex-wrap justify-center items-center">
    <Link href="/" className="m-2 p-2 text-gray-800 hover:text-gray-600 transition duration-300 ease-in-out">Kintuni</Link>
    <Link href="/horoscope" className="m-2 p-2 text-gray-800 hover:text-gray-600 transition duration-300 ease-in-out">Horoscope</Link>
    <Link href="/natalchart" className="m-2 p-2 text-gray-800 hover:text-gray-600 transition duration-300 ease-in-out">Natal Chart</Link>
    <Link href="/login" className="m-2 p-2 text-gray-800 hover:text-gray-600 transition duration-300 ease-in-out">Login</Link>

  </nav>
</>

  );
}
