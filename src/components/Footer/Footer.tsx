import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className={`relative w-full ${styles.bgGrainy} rounded-t-[60%_40%] text-white`}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-15">
        {/* About / Info Section */}
        <div>
          <h3 className="font-bold text-lg mb-3">About Us</h3>
          <p className="text-sm text-gray-200">
            This is a generic company footer. You can add your mission, vision,
            or short description here.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="font-bold text-lg mb-3">Contact</h3>
          <ul className="text-sm text-gray-200 space-y-1">
            <li>Email: info@example.com</li>
            <li>Phone: +1 (123) 456-7890</li>
            <li>Address: 123 Main Street, City, Country</li>
          </ul>
        </div>

        {/* Socials / Links Section */}
        <div>
          <h3 className="font-bold text-lg mb-3">Follow Us</h3>
          <ul className="text-sm text-gray-200 space-y-1">
            <li>
              <Link href="#" className="hover:underline">
                Facebook
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Twitter
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline">
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-6 py-4 text-center text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} All rights reserved. Developed by{" "}
        <span className="font-semibold">iconyyc</span>.
      </div>
    </footer>
  );
}
