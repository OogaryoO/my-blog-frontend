import type { BlocksContent } from "@strapi/blocks-react-renderer";

export function blocksToPlainText(blocks: BlocksContent, max?: number): string {
  const text = extractText(blocks).replace(/\s+/g, " ").trim();

  if (!max || text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function extractText(nodes: readonly unknown[]): string {
  return nodes
    .map((node) => {
      if (!node || typeof node !== "object") return "";
      if ("text" in node && typeof node.text === "string") return node.text;
      if ("children" in node && Array.isArray(node.children)) {
        return extractText(node.children);
      }
      return "";
    })
    .join(" ");
}
