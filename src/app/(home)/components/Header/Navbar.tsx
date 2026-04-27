"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/hooks/useAuth";
import Logo from "./Navbar/Logo";
import DesktopNavLinks from "./Navbar/DesktopNavLinks";
import AuthButtons from "./Navbar/AuthButtons";
import MobileMenuButton from "./Navbar/MobileMenuButton";
import UserMenu from "./Navbar/UserMenu";

function Navbar() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const pathName: string = usePathname();
  const [sticky, setSticky] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  useEffect(() => {
    const handleSticky = () => {
      if (window.scrollY > 100) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleSticky);
    return () => window.removeEventListener("scroll", handleSticky);
  }, []);

  return (
    <header
      className={`w-full sticky border border-black/10 z-40 transition-all duration-300 ${sticky ? " top-0 bg-[#fffdf7] backdrop-blur-xl shadow-md" : ""}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="nav-content"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <nav className="max-w-360 mx-auto w-11/12 flex items-center justify-between py-4">
            <motion.div
              className="shrink-0"
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Logo />
            </motion.div>

            <div className="hidden lg:block">
              <DesktopNavLinks pathName={pathName} />
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {/* Wishlist and Cart icons can be modularized further if needed */}
              {/* ...existing code for wishlist/cart... */}
              {isAuthenticated ? (
                <UserMenu
                  user={user}
                  logout={logout}
                  userMenuOpen={userMenuOpen}
                  setUserMenuOpen={setUserMenuOpen}
                />
              ) : (
                <AuthButtons />
              )}
            </div>
            <div className="lg:hidden">
              <MobileMenuButton onClick={() => setOpenModal(!openModal)} />
            </div>
            {/* Mobile menu drawer can be modularized as well if needed */}
            {/* ...existing code for mobile menu... */}
          </nav>
        </motion.div>
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
