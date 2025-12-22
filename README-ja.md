# GCal Auto Fill

[![CI](https://github.com/harunonsystem/gcal-auto-fill/actions/workflows/ci.yml/badge.svg)](https://github.com/harunonsystem/gcal-auto-fill/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/harunonsystem/gcal-auto-fill)](https://github.com/harunonsystem/gcal-auto-fill/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](README.md) | 日本語

Google Calendar の説明欄から日時やミーティングURLを自動抽出するブラウザ拡張機能です。

## 機能

- 📅 **日時抽出** - 自然言語から日時をパース（英語・日本語対応）
- 🔗 **ミーティングURL検出** - Zoom, Teams, Webex, Google Meet, Slack Huddles に対応
- 📝 **タイトル自動入力** - 説明文からタイトルを生成
- 🌐 **多言語対応** - 英語・日本語UI
- 🌙 **ダークモード** - システム設定に追従

## インストール

### GitHub Releases から

1. [Releases](https://github.com/harunonsystem/gcal-auto-fill/releases) から最新のzipをダウンロード
2. zipを解凍
3. Chrome: `chrome://extensions` を開く
4. 「デベロッパーモード」を有効化
5. 「パッケージ化されていない拡張機能を読み込む」をクリック
6. 解凍したフォルダを選択

### ソースから

```bash
bun install
bun run build
```

Chrome にロード:
1. `chrome://extensions` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `.output/chrome-mv3` を選択

## 開発

```bash
bun run dev      # 開発サーバー
bun run build    # 本番ビルド
bun run check    # 型チェック
bun run lint     # Lint
bun run test     # ユニットテスト
```

## 使い方

1. Google Calendar を開き、新しいイベントを作成
2. 説明欄に日時やミーティングURLを含むテキストを貼り付け
3. 「✨ 自動入力」ボタンをクリック
4. 確認して適用

## 技術スタック

- [WXT](https://wxt.dev/) - 拡張機能フレームワーク
- [TypeScript](https://www.typescriptlang.org/)
- [chrono-node](https://github.com/wanasit/chrono) - 日時パーサー
- [Vitest](https://vitest.dev/) - テスト
- [Bun](https://bun.sh/) - パッケージマネージャー

## ライセンス

[MIT](LICENSE)
