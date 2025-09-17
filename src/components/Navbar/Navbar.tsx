import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full bg-transparent z-999">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          <div className="flex space-x-8 text-white">
            <Link
              href="/"
              className="relative px-4 py-2 transition-all duration-300 ease-in-out hover:text-red"
            >
              Home
            </Link>
            <Link
              href="/inventory"
              className="relative px-4 py-2 transition-all duration-300 ease-in-out hover:text-red"
            >
              Inventory
            </Link>
            <Link
              href="/about"
              className="relative px-4 py-2 transition-all duration-300 ease-in-out hover:text-red"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="relative px-4 py-2 transition-all duration-300 ease-in-out hover:text-red"
            >
              Contact
            </Link>
          </div>
        </div>
      
      </div>
    </nav>
  );
}
