import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function processInline(text: string): string {
	// Bold
	text = text.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold'>$1</strong>");
	// Inline code
	text = text.replace(/`([^`]+)`/g, "<code class='bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>");
	// Links
	text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
	return text;
}

function markdownToHtml(markdown: string): string {
	let html = markdown;

	// Store code blocks temporarily
	const codeBlocks: string[] = [];
	html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
		const id = `__CODE_BLOCK_${codeBlocks.length}__`;
		codeBlocks.push(
			`<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || ""}">${escapeHtml(code.trim())}</code></pre>`
		);
		return id;
	});

	// Process tables before other formatting
	html = html.replace(/\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
		const headerCells = header
			.split("|")
			.map((cell) => cell.trim())
			.filter((cell) => cell);
		const headers = headerCells.map((h) => `<th class="border border-gray-300 px-4 py-2 text-left font-semibold">${processInline(h)}</th>`).join("");

		const rowLines = rows
			.trim()
			.split("\n")
			.filter((row) => row.trim())
			.map((row) => {
				const cells = row
					.split("|")
					.map((cell) => cell.trim())
					.filter((cell) => cell);
				return `<tr>${cells.map((cell) => `<td class="border border-gray-300 px-4 py-2">${processInline(cell)}</td>`).join("")}</tr>`;
			})
			.join("");
		return `<table class="border-collapse border border-gray-300 w-full my-6"><thead><tr>${headers}</tr></thead><tbody>${rowLines}</tbody></table>`;
	});

	// Process headers
	html = html.replace(/^###### (.*)$/gim, "<h6 class='text-lg font-semibold mt-6 mb-3'>$1</h6>");
	html = html.replace(/^##### (.*)$/gim, "<h5 class='text-xl font-semibold mt-6 mb-3'>$1</h5>");
	html = html.replace(/^#### (.*)$/gim, "<h4 class='text-xl font-semibold mt-6 mb-3'>$1</h4>");
	html = html.replace(/^### (.*)$/gim, "<h3 class='text-2xl font-semibold mt-8 mb-4'>$1</h3>");
	html = html.replace(/^## (.*)$/gim, "<h2 class='text-3xl font-semibold mt-8 mb-4'>$1</h2>");
	html = html.replace(/^# (.*)$/gim, "<h1 class='text-4xl font-bold mt-8 mb-4'>$1</h1>");

	// Process lists line by line (skip already processed HTML)
	const lines = html.split("\n");
	const processedLines: string[] = [];
	let currentList: { type: "ol" | "ul"; items: string[] } | null = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		
		// Skip if already HTML (headers, tables, code blocks)
		if (line.match(/^<(h[1-6]|table|pre|th|td|tr|thead|tbody)/) || line.startsWith("__CODE_BLOCK_")) {
			if (currentList) {
				// Close current list
				const tag = currentList.type === "ol" ? "ol" : "ul";
				processedLines.push(`<${tag} class="list-${currentList.type === "ol" ? "decimal" : "disc"} list-inside my-4 space-y-2 ml-4">${currentList.items.join("")}</${tag}>`);
				currentList = null;
			}
			processedLines.push(line);
			continue;
		}

		const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
		const bulletMatch = line.match(/^\*\s+(.+)$/);

		if (numberedMatch) {
			const content = processInline(numberedMatch[2]);
			if (currentList?.type === "ol") {
				currentList.items.push(`<li class='ml-6 mb-2'>${content}</li>`);
			} else {
				if (currentList) {
					// Close previous list
					const tag = currentList.type === "ol" ? "ol" : "ul";
					processedLines.push(`<${tag} class="list-${currentList.type === "ol" ? "decimal" : "disc"} list-inside my-4 space-y-2 ml-4">${currentList.items.join("")}</${tag}>`);
				}
				currentList = { type: "ol", items: [`<li class='ml-6 mb-2'>${content}</li>`] };
			}
		} else if (bulletMatch) {
			const content = processInline(bulletMatch[1]);
			if (currentList?.type === "ul") {
				currentList.items.push(`<li class='ml-6 mb-2'>${content}</li>`);
			} else {
				if (currentList) {
					// Close previous list
					const tag = currentList.type === "ol" ? "ol" : "ul";
					processedLines.push(`<${tag} class="list-${currentList.type === "ol" ? "decimal" : "disc"} list-inside my-4 space-y-2 ml-4">${currentList.items.join("")}</${tag}>`);
				}
				currentList = { type: "ul", items: [`<li class='ml-6 mb-2'>${content}</li>`] };
			}
		} else {
			if (currentList) {
				// Close current list
				const tag = currentList.type === "ol" ? "ol" : "ul";
				processedLines.push(`<${tag} class="list-${currentList.type === "ol" ? "decimal" : "disc"} list-inside my-4 space-y-2 ml-4">${currentList.items.join("")}</${tag}>`);
				currentList = null;
			}
			processedLines.push(line);
		}
	}

	// Close any remaining list
	if (currentList) {
		const tag = currentList.type === "ol" ? "ol" : "ul";
		processedLines.push(`<${tag} class="list-${currentList.type === "ol" ? "decimal" : "disc"} list-inside my-4 space-y-2 ml-4">${currentList.items.join("")}</${tag}>`);
	}

	html = processedLines.join("\n");

	// Process paragraphs (split by double newlines)
	const blocks = html.split(/\n\n+/);
	const processedBlocks = blocks.map((block) => {
		const trimmed = block.trim();
		if (!trimmed) return "";
		// Skip if already a block element
		if (trimmed.match(/^<(h[1-6]|ul|ol|table|pre|li)/)) {
			return trimmed;
		}
		// Process inline markdown in paragraphs
		return `<p class="my-4 leading-relaxed">${processInline(trimmed)}</p>`;
	});

	html = processedBlocks.filter((b) => b).join("\n\n");

	// Restore code blocks
	codeBlocks.forEach((codeBlock, index) => {
		html = html.replace(`__CODE_BLOCK_${index}__`, codeBlock);
	});

	return html;
}

export async function load() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = join(__filename, "..", "..", "..", "..");
	const readmePath = join(__dirname, "README.md");
	const readmeContent = readFileSync(readmePath, "utf-8");
	const readmeHtml = markdownToHtml(readmeContent);

	return {
		readmeHtml
	};
}
