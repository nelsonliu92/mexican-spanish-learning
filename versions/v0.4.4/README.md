# v0.4.4 — 修復 iOS Safari ES6 語法兼容性

**日期**：2026-09-21

## 修復

### [嚴重] iPhone 離線 Script Error

**根本原因**：`week1.html` 使用 `const`、`let`、`.includes()` 等 ES6 語法，舊版 iOS Safari（iOS 9 或以下，或 `file://` 協議下的安全模式）不支援，導致整段 `<script>` 區塊解析失敗。

**具體修改**：
- `const DICT` → `var DICT`
- `const FORM_MAP` → `var FORM_MAP`
- `const S1`..`S7` → `var S1`..`var S7`
- `const K1`..`K7` → `var K1`..`var K7`
- `const Q1`..`Q7` → `var Q1`..`var Q7`
- `const LESSONS` → `var LESSONS`
- `const STORAGE_KEY` → `var STORAGE_KEY`
- `let currentDay` → `var currentDay`
- `let progress` → `var progress`
- `let quizAnswered` → `var quizAnswered`
- `progress.completed.includes(day)` → `progress.completed.indexOf(day)>=0`
- `progress.completed.includes(currentDay)` → `progress.completed.indexOf(currentDay)>=0`
- `progress.completed.includes(i+1)` → `progress.completed.indexOf(i+1)>=0`

### [minor] index.html 同樣修復
- `const WEEKS` → `var WEEKS`
- `week1Progress.completed.includes(di+1)` → `week1Progress.completed.indexOf(di+1)>=0`

## 已知限制
- `Object.keys()` 在極舊 iOS（iOS 8 以下）可能不支援，但目前 DICT 結構必須使用
- 若仍有錯誤，可能需要將 DICT 改為陣列結構避免 `Object.keys()`

---
*此版本為相容性修復*
