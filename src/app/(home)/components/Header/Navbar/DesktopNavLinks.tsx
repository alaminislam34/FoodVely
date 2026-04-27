import Link from "next/link";

const links = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Blog", href: "/blog" },
  { name: "Restaurant", href: "/restaurant" },
  { name: "Contact", href: "/contact" },
];

export default function DesktopNavLinks({ pathName }: { pathName: string }) {
  return (
    <ul className="flex flex-row gap-4 items-center">
      {links.map(({ name, href }) => (
        <li key={href}>
          <Link
            href={href}
            className={`px-4 py-1.5 rounded-lg font-Sofia font-semibold transition-all duration-300 relative group ${
              pathName === href
                ? "bg-linear-to-r from-rose-500 to-orange-600 text-white shadow-md"
                : "text-gray-700 hover:text-rose-600"
            }`}
          >
            {name}
            {pathName !== href && (
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-rose-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
