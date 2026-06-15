const ENTITY_DECODE_PASSES = 5;

export function renderArticleContent(value: string | null | undefined): string {
  const normalized = decodeHtmlEntitiesDeep(value || "").trim();

  if (!normalized) return "";

  return looksLikeHtml(normalized) ? sanitizeLegacyHtml(normalized) : renderMarkdownLike(normalized);
}

export function decodeHtmlEntitiesDeep(value: string): string {
  let decoded = value;

  for (let pass = 0; pass < ENTITY_DECODE_PASSES; pass += 1) {
    const next = decodeHtmlEntitiesOnce(decoded);

    if (next === decoded) break;

    decoded = next;
  }

  return decoded;
}

function decodeHtmlEntitiesOnce(value: string): string {
  return value
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => decodeCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => decodeCodePoint(Number.parseInt(decimal, 10)))
    .replace(/&amp;/gi, "&");
}

function decodeCodePoint(codePoint: number): string {
  if (!Number.isFinite(codePoint)) return "";

  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return "";
  }
}

function looksLikeHtml(value: string): boolean {
  return /<\/?(p|div|span|br|h[1-6]|ul|ol|li|strong|b|em|i|a|img|blockquote|table|thead|tbody|tr|td|th|hr)\b/i.test(
    value
  );
}

function sanitizeLegacyHtml(value: string): string {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<(iframe|object|embed|link|meta|base)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(iframe|object|embed|link|meta|base)\b[^>]*\/?>/gi, "")
    .replace(/<\/?(html|head|body)\b[^>]*>/gi, "")
    .replace(/\sstyle\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, ' $1="#"')
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]*/gi, ' $1="#"');
}

function renderMarkdownLike(value: string): string {
  const blocks = escapeHtml(value)
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean);

  return blocks
    .map(block => {
      const lines = block.split("\n").map(line => line.trim());
      const firstLine = lines[0] || "";

      if (firstLine.startsWith("### ")) {
        return `<h3>${firstLine.slice(4)}</h3>`;
      }

      if (firstLine.startsWith("## ")) {
        return `<h2>${firstLine.slice(3)}</h2>`;
      }

      if (lines.every(line => line.startsWith("- "))) {
        return `<ul>${lines.map(line => `<li>${line.slice(2)}</li>`).join("")}</ul>`;
      }

      return `<p>${lines.join("<br>")}</p>`;
    })
    .join("");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
