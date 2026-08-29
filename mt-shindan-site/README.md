# mt-shindan.com 静的サイト(Astro)

## 開発
npm install
npm run dev

## ビルド
npm run build
→ dist/ に静的ファイルが生成されます

## Cloudflare Pagesへのデプロイ手順

1. GitHubに新しいリポジトリを作成し、このプロジェクト一式をpush
   git init
   git add .
   git commit -m "initial"
   git branch -M main
   git remote add origin <あなたのGitHubリポジトリURL>
   git push -u origin main

2. Cloudflareダッシュボード(dash.cloudflare.com) → Workers & Pages → 「作成」→「Pages」→「Gitに接続」
3. 上記リポジトリを選択
4. ビルド設定:
   - フレームワークプリセット: Astro
   - ビルドコマンド: npm run build
   - ビルド出力ディレクトリ: dist
5. 「保存してデプロイ」
6. デプロイ完了後、「カスタムドメイン」タブから mt-shindan.com を追加
   (現在のDNS管理元でCNAME/Aレコードの向き先をCloudflare Pagesに変更する必要があります)

## 今後のブログ更新(Claude Codeでの運用)
- 新しい記事: src/content/blog/ に .md ファイルを追加(フロントマターは既存ファイルを参考に)
- 追加後、git add / commit / push すると、Cloudflare Pagesが自動でビルド・再デプロイします

## 未対応・要確認事項
- 記事内で使われている画像33枚はすべて public/images/ に移行済み、リンクも差し替え済みです。
- 下書き状態だった9件の投稿は移行していません(公開済みの36件のみ移行済み)。
- お問い合わせフォームの送信機能は未実装です(旧サイトはContact Form 7で送信していたため、
  Cloudflare Pages Functions + メール送信サービス、またはフォーム送信サービス(Formspree等)との
  連携が別途必要です)。
