import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      className="bg-repeat bg-center text-white"
      style={{
        backgroundImage: "url('/images/footer.jpg')",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8 text-sm md:text-base">
        <div className="flex flex-col gap-4 items-start">
          <Logo />
          <p className="uppercase tracking-wide font-semibold">
            Seamless food ordering experience
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Find us</h4>
          <p>3, Fola Osibo street</p>
          <p>Lekki, Lagos</p>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Opening Hours</h4>
          <p>Monday – Sunday</p>
          <p>9:00 AM to 11:30 PM</p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-semibold">Connect with us</h4>
          <div className="flex gap-4">
            <a href="#" className="bg-white/10 p-2 rounded-full">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full">
              <FaInstagram />
            </a>
            <a href="#" className="bg-white/10 p-2 rounded-full">
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © 2025 Menuja. Proudly Powered by{" "}
        <Link href="#" className="underline">
          Samson Ude
        </Link>
      </div>
    </footer>
  );
}
