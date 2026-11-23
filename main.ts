import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
if (!existsSync(src)) {
  console.error(`entry.txt not found next to main.ts: ${src}`);
  process.exit(1);
}
const text = readFileSync(src, "utf8");
const codePoints = [...text].length;
if (text.trim().length === 0 || codePoints < 1 || codePoints > 280) {
  console.error(`entry.txt invalid: ${codePoints} code points, must be 1-280 non-whitespace`);
  process.exit(1);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}
const dest = join(outDir, "entry.txt");
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
const a = readFileSync(src);
const b = readFileSync(dest);
if (!a.equals(b) || b.length !== a.length) {
  console.error("output differs from entry.txt");
  process.exit(1);
}
console.log(`wrote ${dest}: ${statSync(dest).size} bytes, ${codePoints} code points`);
