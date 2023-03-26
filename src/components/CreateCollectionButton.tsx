import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function CreateCollectionButton() {
  const { user } = useUser();
  const router = useRouter();
  const handle = async () => {
    if (!user) await router.push("/sign-in");
    else await router.push("/collections/create");
  };
  return (
    <>
      <button type="button" onClick={() => void handle()}>
        <div className="rounded-md bg-slate-300 px-2 py-1 text-slate-700 transition-colors duration-300 hover:bg-slate-400">
          Create
        </div>
      </button>
    </>
  );
}
