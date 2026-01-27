"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import NavbarSkeleton from "../Skeletons/NavbarSkeleton";

const links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Service", href: "/service" },
  { name: "Contact", href: "/contact" },
];

function Navbar() {
  const [isLoading, setIsLoading] = useState(true);
  const pathName: string = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="w-full bg-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <NavbarSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="nav-content"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <nav className="max-w-360 mx-auto w-11/12 py-4 flex items-center justify-between">
              {/* Logo */}
              <div className="shrink-0">
                <Link href={"/"}>
                  <Image
                    src={"/logos/foodvely.jpg"}
                    height={200}
                    width={400}
                    alt="Website logo"
                    priority
                    className="max-h-26 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:block">
                <ul className="flex flex-row gap-8 items-center">
                  {links.map(({ name, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`md:text-lg font-Sofia font-semibold transition-colors duration-300 ${
                          pathName === href
                            ? "text-red-500 font-bold"
                            : "text-black hover:text-rose-500"
                        }`}
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Link
                  href={"/account/signup"}
                  className="py-2 px-6 rounded-2xl font-Sofia font-semibold border border-rose-600 bg-rose-500 hover:bg-rose-600 duration-300 hover:shadow text-white whitespace-nowrap"
                >
                  Sign Up
                </Link>
                <Link
                  href={"/account/signin"}
                  className="py-2 px-6 rounded-2xl font-Sofia font-semibold border border-rose-600 text-rose-600 hover:bg-rose-200 duration-300 hover:shadow whitespace-nowrap"
                >
                  Sign In
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
