export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>

        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-400 transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-400 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
