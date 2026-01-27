"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Menu",
    href: "/menu",
  },
  {
    name: "Service",
    href: "/service",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

function Navbar() {
  const pathName: string = usePathname();
  return (
    <div>
      <nav className="max-w-360 mx-auto w-11/12 py-4 flex items-center justify-between">
        <div>
          <Image
            src={"/logos/foodvely.jpg"}
            height={200}
            width={400}
            alt="Website logo"
            className="h-30 w-auto object-contains"
          />
        </div>
        <div>
          <ul className="flex flex-row gap-8 items-center">
            {links.map(({ name, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${pathName === href ? "text-red-500" : "text-black"}`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <button className="py-2 px-6 rounded-2xl border border-rose-600 bg-rose-600 text-white">
            Sign Up
          </button>
          <button className="py-2 px-6 rounded-2xl border border-rose-600 text-rose-600">
            Sign In
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
