
export function formatString(str) {
  const value = str.trim().toLowerCase();

  if (["iphones", "iphone"].includes(value)) return "iPhones";
  if (["ipads", "ipad"].includes(value)) return "iPads";

  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase());
}
