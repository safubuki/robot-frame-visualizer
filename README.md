# Robot Frame Visualizer

## プロジェクト概要

Robot Frame Visualizerは、ReactとThree.jsを使用してロボットのフレームを3Dで視覚化するインタラクティブなツールです。クォータニオンに基づく回転操作をサポートし、ロボットのフランジ（flange）とTCP（Tool Center Point）のオフセットをリアルタイムで調整できます。ロボットプログラミングやオフラインテストに役立つビジュアライザーです。

主な機能:

- 3Dシーンでのロボットフレームの視覚化
- フランジと目標TCPの回転設定
- TCPオフセットの調整
- 回転オフセットの探索とマッピング確認
- UR（Universal Robots）形式の回転ベクトル表示
- ローカル/グローバル回転モードの切り替え

## 技術スタック

- **ビルドツール**: Vite 7.1.6
- **フロントエンドフレームワーク**: React 19.1.1
- **3Dライブラリ**: Three.js 0.180.0
- **スタイリング**: Tailwind CSS 3.4.17
- **言語**: JavaScript (ES Modules)
- **開発ツール**: ESLint, PostCSS, Autoprefixer

## ワークスペースの構成

```text
robot-frame-visualizer/
├── .git/
├── .gitignore
├── eslint.config.js          # ESLint設定
├── index.html                # メインHTMLファイル
├── node_modules/             # 依存関係
├── package-lock.json         # npmロックファイル
├── package.json              # プロジェクト設定と依存関係
├── postcss.config.js         # PostCSS設定
├── public/
│   └── vite.svg              # Viteロゴ
├── README.md                 # このファイル
├── src/
│   ├── App.css               # Appコンポーネントのスタイル
│   ├── App.jsx               # メインアプリケーションコンポーネント
│   ├── assets/               # アセットファイル
│   ├── index.css             # グローバルスタイル（Tailwind CSS）
│   └── main.jsx              # エントリーポイント
├── tailwind.config.js        # Tailwind CSS設定
└── vite.config.js            # Vite設定
```

## 環境構築方法

### 前提条件

- Node.js バージョン 20.19+ または 22.12+ （推奨: 最新LTSバージョン）
- npm (Node.jsに同梱)

### インストール手順

1. リポジトリをクローンまたはダウンロード:

   ```bash
   git clone https://github.com/safubuki/robot-frame-visualizer.git
   cd robot-frame-visualizer
   ```

2. 依存関係をインストール:

   ```bash
   npm install
   ```

3. Node.jsのバージョン確認（必要に応じてアップグレード）:

   ```bash
   node --version
   ```

   バージョンが20.19未満の場合は、[Node.js公式サイト](https://nodejs.org/)から最新バージョンをダウンロードしてください。

## 実行方法

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173/` にアクセスしてアプリケーションを表示します。

### ビルド

```bash
npm run build
```

`dist/` ディレクトリに最適化された本番用ファイルが生成されます。

### プレビュー

ビルド後のファイルをローカルで確認:

```bash
npm run preview
```

### リンター実行

```bash
npm run lint
```

## GitHub Pagesでの表示

このプロジェクトをGitHub Pagesで公開するには、以下の手順を実行してください:

1. リポジトリをGitHubにプッシュ:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. GitHubリポジトリのSettings > Pagesタブを開く

3. Sourceを"GitHub Actions"に設定

4. 以下のワークフローファイルを作成: `.github/workflows/deploy.yml`

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v4
           if: github.ref == 'refs/heads/main'
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

5. ワークフローファイルをコミットしてプッシュ

6. Actionsタブでワークフローが完了するのを待つ

7. Settings > Pagesで公開URLを確認（例: `https://safubuki.github.io/robot-frame-visualizer/`）

## 使用方法

1. アプリケーションを起動後、3Dシーンが表示されます
2. 右側のコントロールパネルで以下の操作が可能です:
   - **事前設定**: フランジまたは目標TCPの回転を設定
   - **回転オフセットの探索**: 操作TCPの回転を調整
   - **マッピング確認**: 操作TCPと目標TCPの一致度を確認
   - **プリセット**: クイック設定

3. 左上のインセットビューで回転オフセットを確認できます

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 貢献

バグ報告や機能リクエストはGitHub Issuesでお願いします。プルリクエストも歓迎です。
