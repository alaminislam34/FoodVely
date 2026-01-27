"use client";

function NavbarSkeleton() {
  return (
    <div className="w-full bg-white border-b border-gray-100">
      <nav className="max-w-360 mx-auto w-11/12 py-4 flex items-center justify-between animate-pulse">
        <div className="h-10 w-24 md:h-12 md:w-40 bg-gray-200 rounded-md"></div>

        <div className="hidden md:block">
          <ul className="flex flex-row gap-8 items-center">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="h-5 w-16 bg-gray-200 rounded"></li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-9 w-20 md:h-10 md:w-24 bg-gray-200 rounded-2xl"></div>

          <div className="hidden sm:block h-9 w-20 md:h-10 md:w-24 bg-gray-200 rounded-2xl"></div>

          <div className="md:hidden h-8 w-8 bg-gray-100 rounded-lg"></div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarSkeleton;
