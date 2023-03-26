import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AnilistMangaSearch from "@/components/AnilistMangaSearch";

const schema = z.object({
  title: z.string().min(1).max(50).trim(),
  description: z.string().min(1).max(240).trim().optional(),
});
export default function CreateCollectionsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  return (
    <>
      <Head>
        <title>Recs | Create Collection</title>
        <meta
          name="description"
          content="Manga/Manhwa recommendations made easy!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <h1 className="text-2xl font-bold">Create Collection</h1>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit((d) => console.log(d));
          }}
        >
          <div>
            <label className="mb-2 block text-lg font-medium " htmlFor="title">
              Title
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="Untitled Collection"
              required
              className="w-3/4 rounded-md border border-slate-600 px-3 py-3 shadow-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700"
            />
          </div>
          <div>
            <label
              className="mb-2 block text-lg font-medium "
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              id="message"
              rows={4}
              className="block w-3/4 rounded-md border border-slate-600 bg-gray-50 px-3 py-3 text-sm shadow-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700"
            />
          </div>

          <AnilistMangaSearch />
          <div className="mt-4 flex w-3/4 justify-center">
            <button
              type="submit"
              className="focus: flex w-1/2 justify-center rounded-md border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-sm ring-slate-400 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Create Collection
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
