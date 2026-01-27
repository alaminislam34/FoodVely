"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import NavbarSkeleton from "../Skeletons/NavbarSkeleton";
import { Menu, Search, X } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Service", href: "/service" },
  { name: "Contact", href: "/contact" },
];

function Navbar() {
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
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
                    className="max-h-20 sm:max-h-22 md:max-h-26 w-auto object-contain"
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
                        className={`md:text-lg lg:text-xl font-Sofia font-semibold transition-colors duration-300 ${
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
              <div className="hidden md:flex items-center gap-4">
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
              <div className="md:hidden">
                <button
                  className="py-2 px-3 rounded-2xl border border-rose-500 bg-white text-rose-600 hover:bg-rose-500 backdrop-blur-lg hover:text-white duration-300 hover:scale-105"
                  onClick={() => setOpenModal(!openModal)}
                >
                  <Menu />
                </button>
              </div>
              <div
                className={`h-screen w-full fixed inset-0 top-0 bg-black/50 border border-black duration-500 ease-in-out ${openModal ? "left-0" : "-left-200"}`}
              >
                <div className="flex flex-col justify-between gap-12 p-6 bg-rose-50 max-w-xs h-screen relative">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="p-2 rounded-2xl absolute top-2 -right-12 border border-rose-500 bg-rose-500 text-white hover:bg-white/10 backdrop-blur-lg hover:scale-95 hover:text-rose-600 duration-300"
                  >
                    <X />
                  </button>
                  <div className="flex flex-col gap-10">
                    <div className="shrink-0 py-4 flex items-center justify-center">
                      <Link href={"/"}>
                        <Image
                          src={"/logos/foodvely.jpg"}
                          height={200}
                          width={400}
                          alt="Website logo"
                          priority
                          className="max-h-20 sm:max-h-22 md:max-h-26 w-auto object-contain"
                        />
                      </Link>
                    </div>
                    {/* Navigation Links */}
                    <div className="py-6">
                      <ul className="flex flex-col gap-2">
                        {links.map(({ name, href }) => (
                          <li key={href}>
                            <Link
                              href={href}
                              className={`md:text-lg lg:text-xl p-2 w-full inline-block font-Sofia font-semibold transition-colors duration-300 ${
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
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Search your menu..."
                          className="text-sm border border-rose-500/20 bg-white py-2.5 px-4 rounded-2xl focus:outline-rose-500"
                        />
                        <button className="py-2.5 px-4 border border-rose-500 bg-rose-500 text-white hover:bg-rose-600 rounded-2xl w-full flex items-center  justify-center duration-300">
                          <Search />
                        </button>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex flex-row gap-4 w-full">
                        <Link
                          href={"/account/signup"}
                          className="py-2 px-6 rounded-2xl flex items-center justify-center font-Sofia font-semibold outline-2 outline-rose-600 bg-rose-500 hover:bg-rose-600 duration-300 hover:shadow text-white whitespace-nowrap w-full"
                        >
                          Sign Up
                        </Link>
                        <Link
                          href={"/account/signin"}
                          className="py-2 px-6 rounded-2xl flex items-center justify-center font-Sofia font-semibold outline-2 outline-rose-600 text-rose-600 hover:bg-rose-500 hover:text-white duration-300 hover:shadow whitespace-nowrap w-full"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="hidden items-center gap-4 py-2 px-3.5 rounded-2xl hover:bg-rose-100 hover:-translate-y-0.5 duration-300 shadow-md shadow-rose-500/10 hover:shadow-rose-500/50 bg-rose-500/5 cursor-pointer">
                      <div>
                        <Image
                          src={"/logos/user.jpg"}
                          height={200}
                          width={200}
                          alt="User icons"
                          className="aspect-square max-w-8 rounded-full outline-2 outline-rose-600 shadow-md shadow-rose-600"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-semibold">Al Amin Islam</h3>
                        <p className="text-[11px] truncate text-gray-400">
                          alaminislam4122.bd@gmail.com
                        </p>
                      </div>
                    </div>
                    <div>
                      <button className="py-2 px-6 rounded-2xl font-Sofia font-semibold outline-2 outline-rose-600 bg-rose-50 hover:bg-rose-600/90 duration-300 hover:shadow text-rose-600 hover:text-white whitespace-nowrap w-full hover:-translate-y-0.5 shadow-md shadow-rose-500/10 hover:shadow-rose-500/50">
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
