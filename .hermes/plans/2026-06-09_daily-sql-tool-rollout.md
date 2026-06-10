# 每日一工具：sqlformat.io SQL 工具矩阵扩充计划

**创建日期**：2026-06-09  
**状态**：按天自动执行  
**目标**：每天新增一个 SQL 专项工具，9天完整 SQL 工具链

---

## 已有工具（5个）

Formatter / Minifier / SQL→JSON / Validator / Escape

## 新增清单（9天）

| 天数 | 工具 | 文件名 | 核心功能 | 难度 |
|:---:|------|--------|----------|:---:|
| 1 | **SQL Diff/对比** | `diff.html` | 左右两栏粘贴 SQL → 结构化 diff（不是纯文本 diff），高亮表名/字段/条件差异 | ⭐⭐ |
| 2 | **Explain 计划可视化** | `explain.html` | 粘贴 EXPLAIN 输出 → 树形图/流程图展示执行计划，标注关键节点（全表扫描/索引使用）| ⭐⭐ |
| 3 | **SQL 数据生成器** | `data-generator.html` | 输入表结构 → 生成 INSERT 语句（Mock Data），支持指定行数和数据类型 | ⭐⭐ |
| 4 | **多方言转换** | `dialect-converter.html` | MySQL ↔ PostgreSQL ↔ SQLite 语法转换（LIMIT/TOP、AUTO_INCREMENT/SERIAL、引号规则等）| ⭐⭐⭐ |
| 5 | **ER 图生成** | `er-diagram.html` | 粘贴 CREATE TABLE DDL → 生成 ER 关系图（实体+字段+外键连线）| ⭐⭐⭐ |
| 6 | **SQL 美化打印** | `pretty-print.html` | 格式化 + 语法高亮 + 导出为图片/PDF，适合文档/博客配图 | ⭐⭐ |
| 7 | **SQL 片段库** | `snippets.html` | 常用 SQL 模板库：分页、递归CTE、窗口函数、行转列等，一键复制 | ⭐ |
| 8 | **SQL 统计分析** | `stats.html` | 粘贴 SQL → 统计表名、JOIN 数量、子查询深度、复杂度评分 | ⭐⭐ |
| 9 | **正则替换批处理** | `regex-replace.html` | 批量替换 SQL 中的表名/字段名/注释，支持正则 + 预览 | ⭐⭐ |

---

## 架构约束

- **纯前端**：所有 SQL 处理在浏览器完成，不提交到服务器
- **暗色主题**：与 sqlformat.io 现有风格统一（深蓝背景）
- **单文件 HTML**：内联 CSS/JS
- **干净 URL**：`https://sqlformat.io/<name>`（CF Pages 自动去 .html）
- **SEO 落地页配套**：每工具配一个长尾关键词落地页（如 `/sql-diff-online`）

---

## 每日执行流程

### Step 1：检查进度
按 Day 1→9 顺序检查文件是否已存在。如果全部完成 → 输出完成报告，结束。

### Step 2：构建工具页
- 文件：`~/sqlformat.io/public/<文件名>.html`
- 暗色主题，响应式
- title + meta description 为 SEO 优化

### Step 3：更新首页导航
- `~/sqlformat.io/public/index.html`：工具列表加入新链接

### Step 4：创建配套 SEO 落地页
- 文件：`~/sqlformat.io/public/<长尾关键词>.html`
- 200-300 字独有内容 + 嵌入工具 iframe/链接 + JSON-LD + 内链

### Step 5：更新 sitemap
- 添加工具页 URL 和 SEO 落地页 URL（无 .html 后缀）
- 更新所有 lastmod 为当天

### Step 6：Git 提交推送
```bash
cd ~/sqlformat.io && git add public/ && git diff --cached --quiet || git commit -m "feat: add <工具名> — SQL每日一工具 Day N" && git push origin master
```

---

## 输出格式

```
🔧 sqlformat.io SQL每日一工具 — Day N

✅ 今日新增：<工具名>
📁 文件：/<链接路径>
🔗 链接：https://sqlformat.io/<链接路径>
📊 进度：N/9

⏳ 明天：<下一个工具>
```
