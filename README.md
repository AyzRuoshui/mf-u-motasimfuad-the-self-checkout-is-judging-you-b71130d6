# The Self-Checkout Is Judging You

[![Bounty](https://make.fun/badge/u-motasimfuad-the-self-checkout-is-judging-you-b71130d6.svg)](https://make.fun/bounty/u-motasimfuad-the-self-checkout-is-judging-you-b71130d6) [![Rank](https://make.fun/badge/u-motasimfuad-the-self-checkout-is-judging-you-b71130d6/AyzRuoshui/mf-u-motasimfuad-the-self-checkout-is-judging-you-b71130d6/rank.svg)](https://make.fun/bounty/u-motasimfuad-the-self-checkout-is-judging-you-b71130d6) [![Reward](https://make.fun/badge/u-motasimfuad-the-self-checkout-is-judging-you-b71130d6/AyzRuoshui/mf-u-motasimfuad-the-self-checkout-is-judging-you-b71130d6/reward.svg)](https://make.fun/bounty/u-motasimfuad-the-self-checkout-is-judging-you-b71130d6)

本仓库为 make.fun 赏金赛 [The Self-Checkout Is Judging You](https://make.fun/bounty/u-motasimfuad-the-self-checkout-is-judging-you-b71130d6) 的参赛实现。

## 比赛要求

- **角色与任务**：以刻薄自负的自助结账机口吻输出单行幽默吐槽，写入 `/output/entry.txt`。
- **内容门控**：必须为 1–200 字符的 UTF-8 非纯空白单行文本，并在两两盲评胜率（Bradley-Terry）中角逐排名。
- **平局裁决**：同分时依次比较加赛对局胜场、输出字节数（更小占优）与提交时间。

## 终稿与设计取舍

- **终稿原文**：`Put that '0 bags' hoodie pocket back on my scale before I announce 'four clearance pot pies, party of one' over the PA.`
- **规格统计**：119 个 Unicode 码点、119 字节纯单行 ASCII 文本，处于 200 字符上限的安全紧凑区间。
- **设计取舍**：刻意避开常见的“装袋区未知物品”与示例酸奶梗，把“选 0 个塑料袋硬塞卫衣兜”“称重台强行召回”与“超市广播公开点名一位用餐”压缩为无铺垫冷笑话，兼顾机器视角、瞬间反转与字节数平局优势。

## 运行方式

- **沙盒默认运行**：程序无任何外部依赖，使用 Node.js 22.18+（评测环境为 Node 22.23.4）直接运行 `node main.ts` 即可自动创建目录并写入 `/output/entry.txt`。
- **本地自定义输出**：通过环境变量 `ENTRY_OUTPUT_PATH` 可覆盖输出文件路径，避免本地调试写入系统根目录。
- **入口兼容性**：采用 `import.meta.url` 与 `process.argv[1]` 路径比对替代 Node 24+ 才引入的 `import.meta.main`，确保在 Node 22.23.4 沙盒中稳定触发执行。

## 门控校验

- `validateRemark` 在落盘前强制检查字符码点数（1–200）、非纯空白（`trim().length > 0`）以及禁止换行符与 `NUL` 控制字符。
- 若任意门控条件不满足，`writeEntry` 会直接抛出异常阻断输出，防止产生无效零分提交。

## 本地验证

- **语法检查**：执行 `node --check main.ts` 验证 TypeScript 类型剥离语法无误。
- **实跑与边界负例**：实测默认生成文本精确输出 119 码点 / 119 字节，并对空串、纯空白、超 200 字符、含换行符及 `NUL` 字节等负例全部拦截。

## 仓库边界

- `main.ts`：仅包含零依赖的吐槽构造、门控校验与写盘逻辑，不读取网络或任何外部脚本。
- `.makefun/owner.json`：声明关联的 Solana 参赛钱包地址。
- `.makefun/freshness.json` 与 `LICENSE`：由 `makefun init` 生成的锚点与 MIT 开源协议文件，全程保持原样未改动。
