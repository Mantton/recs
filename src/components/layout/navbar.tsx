import Link from "next/link";
import { useRouter } from "next/router";
import AuthButton from "../AuthButton";
import CreateCollectionButton from "../CreateCollectionButton";
export default function NavBar() {
  const { pathname } = useRouter();
  const hideAuthButton = !!["/sign-in*", "/sign-up*", "/profile*"].find((x) =>
    pathname.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
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
        <div className="hidden items-center gap-4 md:flex">
          <CreateCollectionButton />
          <div hidden={hideAuthButton}>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
