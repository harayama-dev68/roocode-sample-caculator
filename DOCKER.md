Docker での実行手順

- 事前条件: Docker / docker-compose がインストールされていること（確認: `docker --version`）

1) プロダクションビルド（multi-stage）を使う方法

  docker build -t caculator:prod .
  docker run --rm -p 8080:80 caculator:prod

- ビルドすると、アプリは nginx で配信され、ローカルでは http://localhost:8080 で確認できます。

2) 開発モード（ホットリロード）

  docker-compose up --build dev

- もしくは直接:
  docker run --rm -it -v "$PWD":/app -w /app -p 5173:5173 node:18 sh -c "npm install --legacy-peer-deps && npm run dev -- --host 0.0.0.0"

- Vite のデフォルトポート 5173 を公開しているため、ホストからは http://localhost:5173 でアクセスできます。

注意点
- 依存インストール時に peerDependencies による警告やインストール失敗が起きる場合があります。`--legacy-peer-deps` オプションを使うと回避できる場合があります。
- Windows/WSL 環境ではボリュームマウントのパフォーマンスに注意してください。
