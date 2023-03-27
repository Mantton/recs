import slugify from "slugify";

export const slug = (str: string) => {
  return slugify(str, {
    lower: true,
  });
};
