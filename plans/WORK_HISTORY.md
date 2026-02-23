作業履歴 — 電卓アプリ（React + Vite + Tailwind）

概要
- 目的: ブラウザで動くシンプルな電卓アプリを作成し、Docker で実行できるようにする。
- 選定スタック: React + Vite + Tailwind（ユーザー選択）

主要な作業ログ（時系列）
1. プロジェクト雛形作成
   - 追加/作成した主要ファイル:
     - [`index.html`](index.html:1)
     - [`src/main.jsx`](src/main.jsx:1)
     - [`src/App.jsx`](src/App.jsx:1)  ← メイン実装（UI + ロジック）
     - [`src/index.css`](src/index.css:1)
     - [`package.json`](package.json:1)
     - [`vite.config.js`](vite.config.js:1)
     - Tailwind 設定: [`tailwind.config.cjs`](tailwind.config.cjs:1), [`postcss.config.cjs`](postcss.config.cjs:1)
   - 目的: 最小限のモダン開発環境で UI 実装とロジックを実装するため。

2. 計算ロジックとキーボード対応実装
   - 実装箇所: [`src/App.jsx`](src/App.jsx:1)
   - 特徴: 四則演算、パーセント、符号反転、バックスペース、C（クリア）、キーボード入力対応。

3. Docker 化
   - 追加ファイル:
     - [`Dockerfile`](Dockerfile:1)（multi-stage: Node ビルド -> nginx 配信）
     - [`docker-compose.yml`](docker-compose.yml:1)（prod web サービス + dev サービス）
     - [`.dockerignore`](.dockerignore:1)
     - [`DOCKER.md`](DOCKER.md:1)（実行手順）
   - 実行コマンド（例）:
     - プロダクション: docker build -t caculator-web . && docker run --rm -p 8080:80 caculator-web
     - docker-compose: docker compose up --build -d web
     - 開発ホットリロード: docker-compose の dev サービスを利用（`5173` を公開）

4. 環境トラブルと対応
   - Node/npm が未インストールであることを検出。対処ガイドを [`INSTALL.md`](INSTALL.md:1) に記載。
   - Docker ビルド時に Tailwind/PostCSS エラーが発生: `postcss` と `tailwindcss` の組み合わせ設定を修正。
   - 依存関係の調整（`package.json` の devDependencies を修正）を実施して Docker ビルド成功に導いた。

5. バグ検出と修正（ユーザー報告）
   - 現象: = を押した後に数値を入力すると、計算結果の末尾にその数値が連結される（ユーザー報告）
   - 調査: デバッグログを追加して挙動を確認（[`src/App.jsx`](src/App.jsx:1) に console.debug を追加）
   - 修正内容:
     - 計算直後を示す state フラグ `justComputed` を追加
     - `compute()` 実行時に `setJustComputed(true)` をセット
     - 次の数値入力時に `justComputed === true` なら表示を置換してフラグをクリアする処理を `handleInput()` に追加
     - バックスペース / クリア操作でも `justComputed` をリセット
   - 試験: Docker イメージを再ビルドして起動。挙動が改善されることを確認（http://localhost:8080）。

現在の状態
- コンテナは Docker 上でビルド・起動済み。`caculator-web` イメージを作成し、`caculator-web-1` コンテナがポート 8080 で稼働中。
- 修正済みコードはすべてワークスペースに反映済み（特に [`src/App.jsx`](src/App.jsx:1)）。

復帰時の手順（短期リスト）
1. 最新状態を確認
   - ファイル: [`src/App.jsx`](src/App.jsx:1), [`package.json`](package.json:1), [`Dockerfile`](Dockerfile:1), [`docker-compose.yml`](docker-compose.yml:1)
2. ローカルで再現/編集する場合
   - 開発用（ホットリロード）: docker compose up --build dev
   - 直接ローカルで実行する場合: Node.js をインストール（参照: [`INSTALL.md`](INSTALL.md:1)）してから npm install && npm run dev
3. 本番イメージを再ビルドする場合
   - docker compose up --build -d web
4. 主要なテストシナリオ
   - 3 + 5 = → 表示 8 → その直後に数字 2 を押す -> 表示は '2' に置換される
   - パーセント・小数・符号反転の基本動作確認
   - Edge ケース: 連続演算子入力、Error 表示時のリセット

補足メモ
- 開発中に利用したコマンドログやコンテナログはターミナルに残っています。再開時にログが必要であれば教えてください。
- 実装は小規模デモ向けの簡易評価（Function による式評価）を使用しています。セキュリティや複雑な式対応が必要なら、数式パーサ導入を推奨します。

関連ファイル（クリックして参照）
- 実装: [`src/App.jsx`](src/App.jsx:1)
- ビルド/起動: [`Dockerfile`](Dockerfile:1), [`docker-compose.yml`](docker-compose.yml:1), [`DOCKER.md`](DOCKER.md:1)
- インストール手順: [`INSTALL.md`](INSTALL.md:1)
- プロジェクト設定: [`package.json`](package.json:1)

---
作業履歴はこのファイルを参照してください。
コスト評価：全作業に10円程度
![コスト証跡](cost.png)