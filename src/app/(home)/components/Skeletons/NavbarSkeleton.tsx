"use client";

function NavbarSkeleton() {
  return (
    <div className="w-full">
      <nav className="max-w-360 mx-auto w-11/12 py-4 flex items-center justify-between animate-pulse">
        <div className="h-14 w-46 md:h-12 md:w-40 bg-rose-400 rounded-md"></div>

        <div className="hidden md:block">
          <ul className="flex flex-row gap-8 items-center">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="h-5 w-16 bg-rose-400 rounded"></li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block h-9 w-20 md:h-10 md:w-24 bg-rose-400 rounded-2xl"></div>

          <div className="hidden sm:block h-9 w-20 md:h-10 md:w-24 bg-rose-400 rounded-2xl"></div>

          <div className="md:hidden h-12 w-12 bg-rose-400 rounded-lg"></div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarSkeleton;
