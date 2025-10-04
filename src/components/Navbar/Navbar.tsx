import Link from "next/link";

export default function Navbar({
  css,
  items,
}: {
  css?: string;
  items: { href: string; label: string }[];
}) {
  const links = items;
  return (
    <nav className={`absolute top-0 w-full z-50 ${css} transition-all`}>
      <div className="flex justify-center items-center h-16 space-x-10 text-white">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative px-2 py-1 font-medium transition-colors duration-300 hover:text-red"
          >
            <span
              className="relative z-10 pb-2
                   after:absolute after:left-0 after:bottom-0 after:w-full 
                   after:border-b-2 after:border-red-500 
                   after:scale-x-0 after:origin-left after:transition-transform 
                   after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
