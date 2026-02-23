Node.js インストール手順（簡潔版）

このプロジェクトをローカルで起動するための Node.js / npm のインストール手順をまとめます。
プロジェクトの起動コマンドはプロジェクトルートで次の通りです（参照: [`package.json`](package.json:1)）:

  cd /home/kxhar/projects/caculator
  npm install
  npm run dev

1) 推奨: nvm（Node Version Manager）を使う（Linux / macOS / WSL 推奨）

- nvm をインストール（公式インストールスクリプト）:

  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash

- シェルを再読み込み（または新しいターミナルを開く）: 

  source ~/.bashrc   # bash の場合
  source ~/.zshrc    # zsh の場合

- LTS をインストールしてデフォルトに設定:

  nvm install --lts
  nvm use --lts
  nvm alias default 'lts/*'

- 動作確認:

  node -v
  npm -v

2) Debian / Ubuntu 系（短絡的に apt を使う方法: 少し古いバージョンになる可能性あり）

  sudo apt update
  sudo apt install -y nodejs npm

推奨は上の nvm を使う方法です。最新の Node を使いたい場合は NodeSource のリポジトリ経由でインストールしてください。

3) Fedora / CentOS / RHEL 系

  sudo dnf module list nodejs
  sudo dnf module install nodejs:18/default   # 必要に応じてバージョンを選択

4) macOS

- Homebrew を利用する場合:

  brew update
  brew install node

- あるいは nvm を使う場合は上記 nvm 手順を利用

5) Windows

- 推奨: Windows の場合は公式インストーラ（https://nodejs.org/）から LTS をインストール
- 開発環境として WSL2 を使っている場合は、WSL 内で上記 Linux（nvm）手順を使用するのがベスト

6) インストール後の手順（プロジェクト起動）

プロジェクトルートに移動して依存関係をインストール、開発サーバーを起動します（参照: [`README.md`](README.md:1), [`src/App.jsx`](src/App.jsx:1)）:

  cd /home/kxhar/projects/caculator
  npm install
  npm run dev

- 注意: 環境によってはグローバルの npm パッケージや権限の問題が発生します。nvm を使えばこれらの問題はほとんど回避できます。

7) トラブルシュート

- エラー: /bin/sh: 1: npm: not found -> Node.js が正しくインストールされていないか、パスに通っていません。nvm をインストールしたらシェルを再起動して node -v / npm -v を確認してください。
- ポート競合: Vite がデフォルトで 5173 ポートを使います。既に別のプロセスが使っている場合は、Vite が代替ポートを提案します。

8) 補足: Tailwind のビルドについて

Tailwind はビルド時（`npm run dev`）に `postcss` 経由で処理されます。`package.json` に必要な devDependencies を含めていますが、最初の `npm install` でインストールされます。

関連ファイル:
- プロジェクト設定: [`package.json`](package.json:1)
- 開発サーバー起動手順: [`README.md`](README.md:1)
- メイン UI 実装: [`src/App.jsx`](src/App.jsx:1)

この手順で問題が発生したら、発生したエラーメッセージ（ターミナルの出力）を教えてください。具体的なエラーに合わせて次の解決手順を案内します。