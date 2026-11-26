import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 构建自助结账机嘲讽语。
 * 要求：单行 UTF-8 文本，1..200 字符且非纯空白，体现机器对所购商品与装袋方式的刻薄挑剔。
 */
export function buildCheckoutRemark(): string {
  // 终稿：零铺垫直接以机器称重台命令开场，浓缩“0袋省钱+硬塞兜里+超市广播社死”三重笑点
  return "Put that '0 bags' hoodie pocket back on my scale before I announce 'four clearance pot pies, party of one' over the PA.";
}

/**
 * 校验输出文本是否满足 1~200 字符且非纯空白的赛题门控要求。
 */
export function validateRemark(text: string): {
  valid: boolean;
  chars: number;
  bytes: number;
  reason?: string;
} {
  const chars = Array.from(text).length;
  const bytes = Buffer.byteLength(text, "utf8");

  if (chars < 1) {
    return { valid: false, chars, bytes, reason: "Text must not be empty" };
  }
  if (chars > 200) {
    return {
      valid: false,
      chars,
      bytes,
      reason: `Text exceeds 200 characters (got ${chars})`,
    };
  }
  if (text.trim().length === 0) {
    return {
      valid: false,
      chars,
      bytes,
      reason: "Text must not contain only whitespace",
    };
  }
  if (/[\r\n\0]/.test(text)) {
    return {
      valid: false,
      chars,
      bytes,
      reason: "Remark must be a single line without line breaks or NUL bytes",
    };
  }

  return { valid: true, chars, bytes };
}

/**
 * 将最终合规的嘲讽语写入目标输出文件（默认 /output/entry.txt）。
 */
export function writeEntry(outputPath: string = "/output/entry.txt"): {
  outputPath: string;
  text: string;
  chars: number;
  bytes: number;
} {
  const text = buildCheckoutRemark();
  const check = validateRemark(text);
  if (!check.valid) {
    throw new Error(`Entry gate failed: ${check.reason}`);
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, "utf8");

  return {
    outputPath,
    text,
    chars: check.chars,
    bytes: check.bytes,
  };
}

// 兼容 Node 22.18+（含沙盒 Node 22.23.4）：使用 import.meta.url 判断主入口执行
const isMain =
  typeof process.argv[1] === "string" &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const targetPath = process.env.ENTRY_OUTPUT_PATH?.trim() || "/output/entry.txt";
  writeEntry(targetPath);
}
