import Link from "next/link";
export default function NavBar() {
  return (
    <nav className="sticky top-0 z-30 w-full bg-gray-200 px-2 py-4">
      <div className="flex justify-between">
        <Link href="/">
          <div>
            <h1 className="hidden text-lg font-extrabold sm:inline sm:text-2xl">
              Recs
            </h1>
          </div>
        </Link>
        <div className="hidden items-center gap-4 md:flex">Login</div>
      </div>
    </nav>
  );
}
