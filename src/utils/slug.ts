import slugify from "slugify";

export const slug = (str: string) => {
  return slugify(str, {
    lower: true,
    locale: "en",
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
