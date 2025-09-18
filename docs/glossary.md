# Reactフロントエンド開発用語集

このドキュメントでは、Robot Frame Visualizerプロジェクトで使用されているReact、Vite、その他のフロントエンド開発技術に関する用語をまとめています。

## React関連用語

### コンポーネント (Component)

Reactアプリケーションの基本的な構成要素。UIの一部を再利用可能な独立した部品として定義したもの。関数コンポーネントとクラスコンポーネントの2種類がある。

### JSX (JavaScript XML)

JavaScript内にHTMLのような構文を記述できるReactの拡張構文。JavaScriptの式を中括弧`{}`で埋め込むことができる。

### フック (Hooks)

React 16.8で導入された機能で、関数コンポーネント内でstateやライフサイクルなどのReact機能を扱えるようにするもの。

#### 主なフック

- **useState**: コンポーネントの状態を管理
- **useEffect**: 副作用（API呼び出し、DOM操作など）を処理
- **useRef**: DOM要素への参照や値を保持
- **useMemo**: 計算結果をメモ化してパフォーマンスを最適化
- **useCallback**: 関数をメモ化

### 状態管理 (State Management)

コンポーネントのデータ状態を管理する仕組み。ローカルstate（useState）とグローバルstate（Context API、Reduxなど）がある。

### ライフサイクル (Lifecycle)

コンポーネントの生成から破棄までの過程。クラスコンポーネントではcomponentDidMountなどのメソッドで管理。

### Context API

Reactに組み込まれた状態管理機能。props drillingを避けるために、コンポーネントツリー全体でデータを共有できる。

### 仮想DOM (Virtual DOM)

Reactが内部で管理する仮想的なDOM構造。実際のDOM操作を最小限に抑えてパフォーマンスを向上させる。

## Vite関連用語

### Vite

次世代のフロントエンドビルドツール。開発時はESモジュールをネイティブにサポートし、本番時は最適化されたバンドルを作成。

### HMR (Hot Module Replacement)

開発中にコードを変更すると、ブラウザをリロードせずに変更を反映する機能。開発効率を大幅に向上させる。

### ESモジュール (ES Modules)

JavaScriptの標準モジュールシステム。`import`と`export`を使用してモジュールを読み込み・エクスポートする。

### バンドル (Bundle)

複数のJavaScriptファイルやアセットを1つまたは少数のファイルにまとめるプロセス。本番環境での読み込みを最適化。

### 開発サーバー (Dev Server)

ローカル開発時に使用するHTTPサーバー。HMRや自動リロードなどの開発支援機能を提供。

## ビルド・パッケージ管理用語

### npm (Node Package Manager)

Node.jsのパッケージマネージャー。JavaScriptライブラリのインストール、バージョン管理、スクリプト実行を行う。

### package.json

プロジェクトの設定ファイル。依存関係、スクリプト、プロジェクト情報などを定義。

### node_modules

インストールされたnpmパッケージが格納されるディレクトリ。通常Gitignoreに含める。

### package-lock.json

インストールされたパッケージの正確なバージョンを記録したファイル。依存関係の再現性を保証。

### トランスパイル (Transpile)

あるプログラミング言語を別の言語に変換するプロセス。例: TypeScript → JavaScript, JSX → JavaScript。

## Three.js関連用語

### Three.js

WebGLをベースとしたJavaScript 3Dライブラリ。3Dシーンの作成、レンダリング、インタラクションを容易にする。

### WebGL (Web Graphics Library)

ブラウザで3Dグラフィックスを描画するためのJavaScript API。GPUを活用した高速な3Dレンダリングが可能。

### シーン (Scene)

3D空間を表すコンテナ。カメラ、光源、3Dオブジェクトなどを含む。

### カメラ (Camera)

3Dシーンを撮影する視点。PerspectiveCamera（透視投影）とOrthographicCamera（正投影）がある。

### メッシュ (Mesh)

3Dオブジェクトの基本単位。ジオメトリ（形状）とマテリアル（表面の質感）から構成される。

### ジオメトリ (Geometry)

3Dオブジェクトの形状を定義。頂点、辺、面などの情報を持つ。

### マテリアル (Material)

3Dオブジェクトの表面の質感を定義。色、透明度、光の反射など。

### ライト (Light)

3Dシーンを照らす光源。DirectionalLight（平行光源）、PointLight（点光源）、AmbientLight（環境光）など。

### OrbitControls

Three.jsのカメラコントロール。マウス操作でカメラを回転、ズーム、パンできる。

### クォータニオン (Quaternion)

3D回転を表す数学的な表現。オイラー角よりもジンバルロックを避けられる。

## スタイリング関連用語

### Tailwind CSS

ユーティリティファーストのCSSフレームワーク。クラス名で直接スタイルを適用できる。

### PostCSS

CSSを変換・処理するツール。Autoprefixerなどのプラグインと組み合わせる。

### Autoprefixer

CSSにベンダープレフィックスを自動的に追加するPostCSSプラグイン。

### CSS Modules

CSSクラス名をローカルスコープに限定する仕組み。スタイルの競合を防ぐ。

### Responsive Design

画面サイズに応じてレイアウトが適応するデザイン手法。モバイルファーストのアプローチ。

## 開発ツール・環境用語

### ESLint

JavaScript/TypeScriptのコード品質チェックツール。構文エラーやコーディング規約の違反を検出。

### Prettier

コードフォーマッター。コードのスタイルを自動的に統一。

### Git

分散型バージョン管理システム。コードの変更履歴を管理。

### GitHub

Gitリポジトリのホスティングサービス。コラボレーション機能を提供。

### GitHub Pages

GitHubが提供する静的サイトホスティングサービス。リポジトリから直接Webサイトを公開できる。

### CI/CD (Continuous Integration/Continuous Deployment)

継続的インテグレーションと継続的デプロイ。自動化されたビルド、テスト、デプロイのプロセス。

### GitHub Actions

GitHubが提供するCI/CDプラットフォーム。ワークフローで自動化タスクを実行。

## ブラウザ・Web API用語

### DOM (Document Object Model)

HTML文書の構造を表すプログラミングインターフェース。JavaScriptで動的に操作できる。

### BOM (Browser Object Model)

ブラウザのウィンドウや機能を操作するAPI。window, navigator, locationなど。

### Canvas API

HTML5の描画API。JavaScriptで2Dグラフィックスを描画。

### WebGL

ブラウザで3Dグラフィックスを描画するためのAPI。Three.jsなどのライブラリの基盤。

### Service Worker

バックグラウンドで動作するスクリプト。オフライン機能やプッシュ通知を実現。

### Progressive Web App (PWA)

Webアプリをネイティブアプリのように動作させる技術。オフライン対応、インストール可能。

## パフォーマンス関連用語

### Code Splitting

大きなJavaScriptバンドルを小さなチャンクに分割する技術。初期読み込みを高速化。

### Lazy Loading

必要な時にのみリソースを読み込む手法。画像やコンポーネントの遅延読み込み。

### Tree Shaking

使用されていないコードをバンドルから除去する最適化手法。ファイルサイズを削減。

### Minification

コードから不要な文字（空白、コメントなど）を除去してファイルサイズを小さくする。

### Compression

ファイルを圧縮して転送サイズを小さくする。gzip, brotliなどのアルゴリズムを使用。

### Caching

ブラウザやCDNでリソースを一時保存し、再読み込みを高速化。

## セキュリティ関連用語

### CORS (Cross-Origin Resource Sharing)

異なるオリジン間のリソース共有を制御する仕組み。セキュリティのために制限。

### CSP (Content Security Policy)

XSSなどの攻撃を防ぐためのセキュリティポリシー。実行可能なリソースを制限。

### HTTPS

暗号化されたHTTP通信。データの盗聴や改ざんを防ぐ。

### XSS (Cross-Site Scripting)

悪意あるスクリプトをWebページに注入する攻撃。CSPなどで防ぐ。

### CSRF (Cross-Site Request Forgery)

ユーザーの意図しないリクエストを送信する攻撃。トークンなどで防ぐ。

---

**最終更新**: 2025年9月18日