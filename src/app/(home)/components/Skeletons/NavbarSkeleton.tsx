"use client";

function NavbarSkeleton() {
  return (
    <div className="w-full bg-white border-b border-gray-100 overflow-hidden">
      {/* The 'after:' classes below create the "shimmer" light effect 
        that sweeps across the skeleton.
      */}
      <nav
        className="max-w-360 mx-auto w-11/12 py-4 flex items-center justify-between relative 
                      after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] 
                      after:bg-linear-to-r after:from-transparent after:white/40 after:to-transparent"
      >
        {/* Logo - Matches your 400x200 logic */}
        <div className="h-10 w-24 md:h-12 md:w-40 bg-gray-200 rounded-md animate-pulse"></div>

        {/* Navigation Links */}
        <div className="hidden md:block">
          <ul className="flex flex-row gap-8 items-center">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="h-5 w-16 bg-gray-100 rounded animate-pulse"
              ></li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Sign Up Button */}
          <div className="h-9 w-20 md:h-10 md:w-24 bg-gray-200 rounded-2xl animate-pulse"></div>

          {/* Sign In Button */}
          <div className="hidden sm:block h-9 w-20 md:h-10 md:w-24 bg-gray-100 border border-gray-50 rounded-2xl animate-pulse"></div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden h-8 w-8 bg-gray-50 rounded-lg animate-pulse"></div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarSkeleton;
