# ESET Manager なのだ

エンタープライズ環境向けの本番対応ESET PROTECT API管理ツールなのだ。

## 概要

ESET Managerは大規模なエンタープライズネットワーク全体でESETアンチウイルス展開を管理するための包括的なソリューションなのだ。自動ヘルスモニタリング、リモートソフトウェア管理、マルチチャンネル通知を提供するのだ。なかなか多機能ではないか。

### 主な機能

- **自動ヘルスモニタリング**: 全エンドポイントのESETインストールを継続的に監視するのだ
- **リモート管理**: 問題のあるデバイスでESETをリモートでアンインストール・再インストールできるのだ
- **大規模運用**: 並行性制御付きで1000台以上のデバイスを効率的にバッチ処理するのだ
- **マルチチャンネル通知**: Slack、Microsoft Teams、Emailでアラートを送れるのだ
- **エンタープライズセキュリティ**: OAuth2認証、TLS 1.2+、改ざん検出付き監査ログに対応しているのだ
- **レート制限**: APIスロットリングを防ぐ適応型トークンバケットアルゴリズムを使っているのだ
- **リトライロジック**: 一時的な障害には指数バックオフで対応するのだ

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                        ESET Manager                          │
├─────────────────────────────────────────────────────────────┤
│  CLI (eset-cli.ts)                                          │
│  ├─ ヘルスチェックコマンド                                   │
│  ├─ タスク管理コマンド                                       │
│  └─ デバイス管理コマンド                                     │
├─────────────────────────────────────────────────────────────┤
│  Manager Layer (eset-manager.ts)                            │
│  ├─ ヘルスモニタリング                                       │
│  ├─ アンインストール/再インストール操作                       │
│  └─ 並行性制御付きバッチ操作                                 │
├─────────────────────────────────────────────────────────────┤
│  API Client (eset-client.ts)                                │
│  ├─ トークンキャッシュ付きOAuth2認証                        │
│  ├─ レート制限（トークンバケット + 適応型）                  │
│  ├─ 指数バックオフ付きリトライロジック                       │
│  ├─ TLS 1.2+強制                                            │
│  └─ 監査ログ                                                │
├─────────────────────────────────────────────────────────────┤
│  Notifier Layer (eset-notifier.ts)                         │
│  ├─ Slack通知                                               │
│  ├─ Microsoft Teams通知                                     │
│  └─ Email通知（HTMLレポート）                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │   ESET PROTECT API (Cloud/On-Prem)   │
        └───────────────────────────────────────┘
```

## インストール

### 前提条件

- Node.js 18.0.0以上
- ESET PROTECT Cloudアカウントまたはオンプレミスインストール
- OAuth2クライアント認証情報（Client IDとSecret）

### 方法1: ローカルインストール

```bash
# リポジトリをクローンするのだ
git clone <repository-url>
cd code_exp_dev

# 依存関係をインストールするのだ
npm install

# TypeScriptをビルドするのだ
npm run build

# CLIをグローバルにリンク（任意）
npm link
```

### 方法2: Dockerインストール

```bash
# Dockerイメージをビルドするのだ
docker build -t eset-manager:latest .

# またはDocker Composeを使うのだ
docker-compose up -d
```

## 設定

### ステップ1: 設定の初期化

```bash
# 設定テンプレートを作成するのだ
eset-manager config init

# またはカスタムパスを指定するのだ
eset-manager config init --output /path/to/config.json
```

これで `~/.eset-manager-config.json`（または指定したパス）に設定ファイルが作成されるのだ。

### ステップ2: 設定を編集

認証情報を入力して設定ファイルを編集するのだ：

```json
{
  "apiEndpoint": "https://your-tenant.eset.systems/api/v1",
  "auth": {
    "clientId": "YOUR_CLIENT_ID",
    "clientSecret": "YOUR_CLIENT_SECRET",
    "vaultEnabled": false
  },
  "tlsConfig": {
    "minVersion": "TLS1.2",
    "verifyCertificate": true
  },
  "rateLimiting": {
    "requestsPerMinute": 60,
    "burstSize": 10,
    "adaptiveEnabled": true
  },
  "auditLog": {
    "enabled": true,
    "logPath": "/var/log/eset-manager/audit.log",
    "tamperDetection": true
  },
  "monitoring": {
    "healthCheckInterval": 60,
    "thresholds": {
      "offlineDeviceHours": 24,
      "outdatedDefinitionDays": 7,
      "threatCountCritical": 5,
      "moduleErrorThreshold": 2
    },
    "notifications": {
      "slack": {
        "enabled": true,
        "webhookUrl": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
        "channel": "#eset-alerts"
      },
      "teams": {
        "enabled": false,
        "webhookUrl": ""
      },
      "email": {
        "enabled": true,
        "smtpConfig": {
          "host": "smtp.gmail.com",
          "port": 587,
          "secure": false,
          "auth": {
            "user": "alerts@example.com",
            "pass": "your-app-password"
          }
        },
        "recipients": ["admin@example.com", "security@example.com"]
      }
    }
  }
}
```

### ステップ3: ESET PROTECT API認証情報を取得

#### ESET PROTECT Cloudの場合:

1. ESET PROTECT Cloudコンソールにログインするのだ
2. **More** → **API Applications** に移動するのだ
3. **Add Application** をクリックするのだ
4. 必要な権限を付与するのだ：
   - `devices:read` - デバイス情報を表示
   - `devices:write` - デバイスを管理
   - `tasks:read` - タスクを表示
   - `tasks:write` - タスクを作成・管理
5. **Client ID** と **Client Secret** をメモするのだ

#### ESET PROTECT On-Premiseの場合:

1. ESET PROTECTコンソールにログインするのだ
2. **More** → **Server Settings** → **API** に移動するのだ
3. APIアクセスを有効にするのだ
4. 適切な権限で新しいAPIユーザーを作成するのだ
5. OAuth2認証情報を生成するのだ

## 使い方

### ヘルスモニタリング

#### ヘルスチェックを実行

```bash
# 基本的なヘルスチェック
eset-manager health check

# 通知付き
eset-manager health check --notify

# 結果をファイルに保存
eset-manager health check --output health-report.json

# カスタム設定を使用
eset-manager health check --config /path/to/config.json
```

#### 問題のあるデバイスを一覧表示

```bash
# 全ての問題
eset-manager health list-issues

# クリティカルな問題のみ
eset-manager health list-issues --severity critical

# 警告のみ
eset-manager health list-issues --severity warning
```

### リモートアンインストール

```bash
# 特定のデバイスからアンインストール
eset-manager task uninstall --devices uuid-1 uuid-2 uuid-3

# ファイルからデバイスを指定（1行に1つのUUID）
eset-manager task uninstall --file devices.txt

# 強制再起動付き
eset-manager task uninstall --devices uuid-1 --reboot --reboot-delay 10

# 実行前に承認を要求
eset-manager task uninstall --devices uuid-1 --approval
```

### リモート再インストール

```bash
# 特定のデバイスに再インストール
eset-manager task reinstall \
  --devices uuid-1 uuid-2 \
  --package "https://your-server.com/eset-installer.exe"

# 強制再起動付き
eset-manager task reinstall \
  --devices uuid-1 \
  --package "https://your-server.com/eset-installer.exe" \
  --reboot \
  --reboot-delay 5
```

### アンインストールと再インストールの組み合わせ

問題のあるインストールを修正するにはこの方法がおすすめなのだ：

```bash
# アンインストールして再インストール（自動的にアンインストール完了を待つ）
eset-manager task uninstall-reinstall \
  --devices uuid-1 uuid-2 uuid-3 \
  --package "https://your-server.com/eset-installer.exe" \
  --reboot-delay 5

# ファイルから
eset-manager task uninstall-reinstall \
  --file problematic-devices.txt \
  --package "https://your-server.com/eset-installer.exe"

# 承認ワークフロー付き
eset-manager task uninstall-reinstall \
  --file devices.txt \
  --package "https://your-server.com/eset-installer.exe" \
  --approval
```

### タスク監視

```bash
# タスク状態を取得
eset-manager task status <taskId>

# リアルタイムでタスクを監視（自動更新）
eset-manager task monitor <taskId>
```

### デバイス管理

```bash
# 全デバイスを一覧表示
eset-manager device list

# ページネーション付き
eset-manager device list --page 2 --page-size 50

# フィルター付き
eset-manager device list --filter "os.platform=Windows"
```

## Docker デプロイメント

### Docker Composeを使う（推奨）

1. 設定ディレクトリを作成するのだ：

```bash
mkdir -p config
cp ~/.eset-manager-config.json config/eset-manager-config.json
```

2. サービスを起動するのだ：

```bash
# バックグラウンドで起動
docker-compose up -d

# ログを表示
docker-compose logs -f

# サービスを停止
docker-compose down
```

3. `eset-scheduler`サービスが毎時自動的にヘルスチェックを実行して通知するのだ。

### 手動でDockerを実行

```bash
# イメージをビルド
docker build -t eset-manager:latest .

# ヘルスチェックを実行
docker run --rm \
  -v $(pwd)/config/eset-manager-config.json:/etc/eset-manager/config.json:ro \
  eset-manager:latest \
  node dist/features/eset-cli.js health check --config /etc/eset-manager/config.json --notify

# アンインストール・再インストールを実行
docker run --rm \
  -v $(pwd)/config/eset-manager-config.json:/etc/eset-manager/config.json:ro \
  eset-manager:latest \
  node dist/features/eset-cli.js task uninstall-reinstall \
  --config /etc/eset-manager/config.json \
  --devices uuid-1 uuid-2 \
  --package "https://your-server.com/eset-installer.exe"
```

## 自動化とスケジューリング

### Cron Job (Linux)

crontabに追加するのだ：

```bash
# 毎時ヘルスチェックと通知
0 * * * * /usr/local/bin/eset-manager health check --notify >> /var/log/eset-manager/health-check.log 2>&1

# 毎日9時にレポート付きヘルスチェック
0 9 * * * /usr/local/bin/eset-manager health check --notify --output /var/reports/health-$(date +\%Y\%m\%d).json
```

### Windows Task Scheduler

スケジュールタスクを作成するのだ：

```powershell
# 毎日9時にヘルスチェックを実行
$action = New-ScheduledTaskAction -Execute "eset-manager" -Argument "health check --notify"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "ESET Health Check" -Description "Daily ESET health monitoring"
```

### Systemd Timer (Linux)

`/etc/systemd/system/eset-health-check.service` を作成するのだ：

```ini
[Unit]
Description=ESET Health Check
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/eset-manager health check --notify
User=esetmanager
StandardOutput=journal
StandardError=journal
```

`/etc/systemd/system/eset-health-check.timer` を作成するのだ：

```ini
[Unit]
Description=Run ESET Health Check hourly

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target
```

有効化して起動するのだ：

```bash
sudo systemctl enable eset-health-check.timer
sudo systemctl start eset-health-check.timer
```

## 典型的なワークフロー

### ワークフロー1: 日次ヘルスモニタリング

```bash
# 朝のヘルスチェックと通知
eset-manager health check --notify

# クリティカルな問題を確認
eset-manager health list-issues --severity critical

# 問題のあるデバイスを修正
eset-manager task uninstall-reinstall \
  --file critical-devices.txt \
  --package "https://your-server.com/eset-installer.exe"
```

### ワークフロー2: 大規模再インストール

メジャーアップデート後など、複数のデバイスにESETを再インストールする必要があるときはこうするのだ：

```bash
# 1. 全デバイスのリストを取得
eset-manager device list > all-devices.txt

# 2. デバイスUUIDを抽出（手動またはスクリプト）
# 1行に1つのUUIDでdevices-to-update.txtを作成

# 3. アンインストール・再インストールを実行
eset-manager task uninstall-reinstall \
  --file devices-to-update.txt \
  --package "https://your-server.com/eset-installer-v10.exe" \
  --reboot-delay 10

# 4. タスクを監視
eset-manager task monitor <taskId>
```

### ワークフロー3: インシデント対応

脅威が検出されたときはこうするのだ：

```bash
# 1. 脅威の詳細をヘルスチェック
eset-manager health check --output incident-report.json

# 2. 脅威のあるデバイスを確認
cat incident-report.json | jq '.issues[] | select(.issueType=="threat_detected")'

# 3. 必要なら感染したデバイスに再インストール
eset-manager task uninstall-reinstall \
  --devices uuid-of-infected-device \
  --package "https://your-server.com/eset-installer.exe" \
  --approval
```

## トラブルシューティング

### 認証エラー

```bash
# 認証情報を確認
eset-manager config show

# API接続をテスト
curl -X POST https://your-tenant.eset.systems/api/v1/oauth2/token \
  -d "grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET"
```

### レート制限

クライアントは適応型スロットリングで自動的にレート制限を処理するのだ。頻繁にレート制限の警告が出る場合は：

1. 設定で `requestsPerMinute` を減らすのだ
2. バースト処理を改善するため `burstSize` を増やすのだ
3. `adaptiveEnabled` を有効にするのだ（デフォルトで有効のはず）

### TLS証明書の問題

自己署名証明書やカスタムCAの場合：

```json
{
  "tlsConfig": {
    "minVersion": "TLS1.2",
    "verifyCertificate": true,
    "caCertPath": "/path/to/ca-bundle.crt"
  }
}
```

### デバイスが見つからない

インストール直後はデバイスがすぐに表示されないことがあるのだ。初期同期のために5〜10分待つのだ。

## セキュリティのベストプラクティス

### 1. 認証情報管理

**本番環境では認証情報を平文で保存してはいけないのだ！**

本番環境ではHashiCorp Vaultを使うのだ：

```json
{
  "auth": {
    "vaultEnabled": true,
    "vaultPath": "secret/eset-manager/credentials"
  }
}
```

### 2. 最小権限の原則

必要なAPI権限のみを付与するのだ：
- 監視には `devices:read`
- タスクを展開する必要があるオペレーターにのみ `tasks:write`

### 3. 監査ログ

改ざん検出付きで監査ログを有効にするのだ：

```json
{
  "auditLog": {
    "enabled": true,
    "logPath": "/var/log/eset-manager/audit.log",
    "tamperDetection": true
  }
}
```

定期的にログを確認するのだ：

```bash
tail -f /var/log/eset-manager/audit.log | jq '.'
```

### 4. ネットワークセキュリティ

- HTTPSのみを使うのだ（HTTPフォールバックなし）
- TLS 1.2以上を有効にするのだ
- 本番環境では証明書を検証するのだ
- ファイアウォールルールでAPIアクセスを制限するのだ

### 5. コンテナセキュリティ

Dockerで実行する場合：
- 非rootユーザーを使うのだ（すでに設定済み）
- 読み取り専用ファイルシステムを有効にするのだ
- リソース制限を使うのだ
- ベースイメージを定期的に更新するのだ

## APIリファレンス

### ヘルスチェックの閾値

| 閾値 | デフォルト | 説明 |
|-----------|---------|-------------|
| `offlineDeviceHours` | 24 | デバイスがオフラインとみなされるまでの時間 |
| `outdatedDefinitionDays` | 7 | 定義が古いとみなされるまでの日数 |
| `threatCountCritical` | 5 | クリティカルアラートまでの脅威数 |
| `moduleErrorThreshold` | 2 | 警告までのモジュールエラー数 |

### レート制限パラメータ

| パラメータ | デフォルト | 説明 |
|-----------|---------|-------------|
| `requestsPerMinute` | 60 | 1分あたりの最大APIリクエスト |
| `burstSize` | 10 | バースト容量（トークンバケットサイズ） |
| `adaptiveEnabled` | true | 429エラー時に自動的にレートを下げる |

## サポートとコントリビューション

問題、質問、コントリビューションについては、TechSapoサポートに連絡するか、GitHubイシューを提出するのだ。

## ライセンス

MIT License - 詳細はLICENSEファイルを見るのだ。
