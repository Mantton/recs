import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { RxMoon } from "react-icons/rx";

export default function Footer() {
  return (
    <footer className=" bg-slate-100 dark:bg-slate-500">
      <div className="mx-auto px-2 pt-8 pb-4 sm:px-6 ">
        <div className="flex justify-between">
          <div className="info">
            <div className="text-sm text-slate-500 sm:text-base">
              <Link
                href="https://solarsystem.nasa.gov/moons/saturn-moons/bebhionn/in-depth/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2">
                  <RxMoon /> Bebhionn
                </div>
              </Link>

              <Link
                href="https://mantton.com"
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-500 ease-in-out hover:text-purple-400"
              >
                <p>Created by Mantton 🚀</p>
              </Link>
            </div>
          </div>
          <div className="links flex items-center gap-4">
            <Link
              href="https://github.com/mantton/recs"
              target="_blank"
              rel="noreferrer"
              className="text-xl font-bold text-slate-500 hover:text-slate-700 sm:text-2xl"
            >
              <FaGithub />
            </Link>
            <Link
              href="https://twitter.com/ceresmir"
              target="_blank"
              rel="noreferrer"
              className="text-xl font-bold text-slate-500 hover:text-slate-700 sm:text-2xl"
            >
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
