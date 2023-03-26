import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AnilistMangaSearch, {
  SelectionContext,
} from "@/components/AnilistMangaSearch";
import { type AnilistMedia } from "@/types";
import { useState } from "react";
import { api } from "@/utils/api";
import { LoadingSpinner } from "@/components/loading";
import { useRouter } from "next/router";
import slugify from "slugify";

const schema = z.object({
  title: z.string().min(3).max(50).trim(),
  description: z.string().min(1).max(240).trim().optional(),
});
export default function CreateCollectionsPage() {
  const router = useRouter();

  const { mutate, isLoading } = api.collection.createCollection.useMutation({
    onSuccess: (data) => {
      void router.push(`/collections/${data.id}/${slugify(data.title)}`);
    },
  });
  const [selections, setSelections] = useState<AnilistMedia[]>([]);

  const submitNewCollection = ({
    title,
    description,
    selections,
  }: z.infer<typeof schema> & { selections: AnilistMedia[] }) => {
    mutate({
      title,
      description,
      includedManga: selections.map((v) => v.id),
    });
  };

  const insertMedia = (m: AnilistMedia) => {
    if (selections.length == 50) {
      // TODO: Handle Toast Event
      console.log("Reached Collection Limit");
    }
    const isAlreadySaved = !!selections.find((v) => v.id == m.id);
    if (!isAlreadySaved) {
      setSelections([...selections, m]);
    }
  };

  const removeMedia = (m: AnilistMedia) => {
    setSelections([...selections.filter((v) => v.id !== m.id)]);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  return (
    <>
      <Head>
        <title>Recs | Create Collection</title>
        <meta name="description" content="Create a new collection!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <h1 className="text-2xl font-bold">Create Collection</h1>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            // Manga list guard
            if (!selections[0]) {
              // TODO: Display Error Toast
              console.log("No Manga Added");
              e.preventDefault();
              return;
            }
            const handler = handleSubmit(
              (d) => submitNewCollection({ ...d, selections }), // TODO: Make TRPC Mutation Request
              (e) => console.log(e)
            );
            const run = async () => {
              await handler(e);
            };
            void run();
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
              required
              id="message"
              rows={4}
              className="block w-3/4 rounded-md border border-slate-600 bg-gray-50 px-3 py-3 text-sm shadow-sm focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700"
            />
          </div>
          <SelectionContext.Provider
            value={{ insertMedia, removeMedia, selections }}
          >
            <AnilistMangaSearch />
          </SelectionContext.Provider>
          <div className="mt-4 flex w-3/4 justify-center">
            <button
              disabled={isLoading || !selections[0]}
              type="submit"
              className="flex w-1/2 justify-center rounded-md border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-sm ring-slate-400 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              {!isLoading && <p>Create Collection</p>}
              {isLoading && <LoadingSpinner />}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
