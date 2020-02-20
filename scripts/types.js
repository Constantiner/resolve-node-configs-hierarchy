import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const generatedTypeFilePath = resolve(__dirname, "../types/index.d.ts");
const content = readFileSync(generatedTypeFilePath, "utf-8");

const newContent = content.replace(/^(\s*)function\s+(.*;)\s*$/gm, "$1export function $2");

writeFileSync(generatedTypeFilePath, newContent);
