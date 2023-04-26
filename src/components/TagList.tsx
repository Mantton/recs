import Link from "next/link";

const TagList = ({
  tags,
  link,
  nsfw,
}: {
  tags: string[];
  link: string;
  nsfw: boolean;
}) => {
  const tagClassName =
    "rounded-md bg-slate-100 px-2 py-[3px] text-sm text-gray-700 transition-colors hover:bg-slate-300 md:text-xs";
  return (
    <>
      <div className="my-2 flex flex-wrap gap-2">
        {nsfw && (
          <p className="cursor-pointer rounded-md bg-red-200 px-2 py-[3px] text-sm text-gray-700 transition-colors hover:bg-red-300 md:text-xs">
            NSFW
          </p>
        )}
        {tags.slice(0, 6).map((tag) => (
          <Link href={`/recs?t=${tag}`} key={tag}>
            <p className={tagClassName}>{tag}</p>
          </Link>
        ))}
        {tags.length > 6 && (
          <Link href={link}>
            <p className={tagClassName}>+ {tags.length - 6} more</p>
          </Link>
        )}
      </div>
    </>
  );
};

export default TagList;
