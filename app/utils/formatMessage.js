function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatAiMessage(rawText) {
  if (!rawText) return "";

  let safe = escapeHtml(rawText);

  // Convert fenced code blocks ```...``` into styled <pre><code> blocks
  safe = safe.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="my-2.5 p-3 rounded-xl bg-slate-950/90 text-slate-100 text-xs overflow-x-auto border border-slate-800"><code>${code.trim()}</code></pre>`;
  });

  // Convert inline `code`
  safe = safe.replace(/`([^`\n]+)`/g, (_, inlineCode) => {
    return `<code class="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 text-xs">${inlineCode}</code>`;
  });

  // Convert **bold** or __bold__ into <strong>
  safe = safe.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  safe = safe.replace(/__([^_\n]+)__/g, "<strong>$1</strong>");

  // Process line-by-line for clean bullet points and stray asterisks
  const lines = safe.split("\n").map((line) => {
    const trimmed = line.trim();

    // Turn leading "* " or "- " bullets into clean "• " bullets
    if (/^(\*|-)\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^(\*|-)\s+/, "");
      return `<div class="flex items-start gap-2 my-1"><span class="text-indigo-400 font-bold leading-5">•</span><span class="flex-1">${itemText}</span></div>`;
    }

    // Remove any leftover single or double asterisks that aren't inside <pre>
    return line.replace(/\*+/g, "");
  });

  return lines.join("<br />");
}