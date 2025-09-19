export const cpfFormat = {
  mask: "___.___.___-__",
  replacement: { _: /\d/ },
};

export const phoneDDDFormat = {
  mask: "___",
  replacement: { _: /\d/ },
};

export const phoneFormat = {
  mask: "(__) __________",
  replacement: { _: /\d/ },
};
