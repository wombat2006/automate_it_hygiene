# ESET PROTECT On-Prem 11.1 Manager

ESET PROTECT On-Prem 11.1のJSON-RPC APIを使用して、クライアントPCのモニタリングとリモート操作を行うPythonツール。

## 機能

- **情報取得**: CSVファイルに記載されたPC名のESET状態を一括取得
  - ESETとの疎通状態
  - Anti-Virusのバージョン
  - 定義ファイルの更新日
  - Windowsのバージョン
  - PCの最終起動日

- **タスク実行**: リモートでのタスク発行
  - `SoftwareUninstallation` - AntiVirusのサイレントアンインストール
  - `SoftwareInstallation` - AntiVirusのサイレントインストール
  - `RunCommand` - 任意のコマンド実行
  - `Update` - ウイルス定義ファイルの更新
  - `OnDemandScan` - オンデマンドスキャン

- **dry-run機能**: 実際のAPI呼び出しを行わずに動作確認

## 動作環境

- Python 3.7以上
- Linux / Windows 両対応
- ESET PROTECT On-Prem 11.1

## インストール

```bash
pip install -r eset_requirements.txt
```

## 設定

### 方法1: 環境変数（推奨）

```bash
export ESET_HOST="eset-server.example.com"
export ESET_PORT="2223"
export ESET_USERNAME="Administrator"
export ESET_PASSWORD="your_password"
export ESET_VERIFY_SSL="false"
```

### 方法2: 設定ファイル

Linux: `~/.config/eset_manager/config.json`
Windows: `%APPDATA%\eset_manager\config.json`

```json
{
    "host": "eset-server.example.com",
    "port": 2223,
    "username": "Administrator",
    "password": "your_password",
    "verify_ssl": false,
    "timeout": 30,
    "retries": 3
}
```

## 使い方

### 情報取得

```bash
# 基本的な使い方
python3 eset_manager.py info --csv computers.csv --output results.csv

# 詳細ログ付き
python3 eset_manager.py -v info --csv computers.csv --output results.csv

# dry-runモード（API呼び出しなし）
python3 eset_manager.py --dry-run info --csv computers.csv --output results.csv
```

### タスク実行

```bash
# アンインストール（dry-run）
python3 eset_manager.py --dry-run task --csv computers.csv --type SoftwareUninstallation

# アンインストール（実行）
python3 eset_manager.py task --csv computers.csv --type SoftwareUninstallation

# インストール（パッケージパス指定）
python3 eset_manager.py task --csv computers.csv --type SoftwareInstallation \
    --package "\\\\server\\share\\eset_installer.msi"

# コマンド実行
python3 eset_manager.py task --csv computers.csv --type RunCommand \
    --command "ipconfig /all"

# ウイルス定義更新
python3 eset_manager.py task --csv computers.csv --type Update

# オンデマンドスキャン
python3 eset_manager.py task --csv computers.csv --type OnDemandScan
```

## 入力CSVフォーマット

```csv
name
DESKTOP-ABC001
DESKTOP-ABC002
LAPTOP-XYZ001
```

対応するカラム名: `name`, `computer`, `hostname`, `pc` （大文字小文字不問）

## 出力CSVフォーマット

| カラム | 説明 |
|--------|------|
| name | コンピュータ名 |
| uuid | ESET内部UUID |
| connected | 疎通状態 (True/False) |
| av_version | Anti-Virusバージョン |
| av_module_version | モジュールバージョン |
| definition_date | 定義ファイル更新日 |
| windows_version | Windowsバージョン |
| last_boot | 最終起動日時 |
| last_seen | 最終接続日時 |
| error | エラーメッセージ（あれば） |

## TaskType一覧（ESET PROTECT On-Prem 11.1）

| 番号 | 名称 | 説明 |
|------|------|------|
| 1 | ExportConfiguration | 設定エクスポート |
| 2 | OnDemandScan | オンデマンドスキャン |
| 3 | QuarantineManagement | 隔離管理 |
| 4 | QuarantineUpload | 隔離ファイルアップロード |
| 5 | Update | ウイルス定義更新 |
| 6 | UpdateRollback | 更新ロールバック |
| 7 | SysInspectorScript | SysInspectorスクリプト |
| 8 | SysInspectorLogRequest | SysInspectorログ要求 |
| 9 | RunCommand | コマンド実行 |
| 10 | SoftwareInstallation | ソフトウェアインストール |
| 11 | SoftwareUninstallation | ソフトウェアアンインストール |
| 12 | SystemUpdate | OSアップデート |

## トラブルシューティング

### SSL証明書エラー

自己署名証明書を使用している場合:
```bash
export ESET_VERIFY_SSL="false"
```

### 認証エラー

1. ユーザー名/パスワードを確認
2. ESET PROTECT管理者権限があることを確認
3. ポート2223が開放されていることを確認

### コンピュータが見つからない

1. ESET PROTECTコンソールで該当PCが登録されているか確認
2. PC名の大文字小文字を確認（内部では大文字小文字を無視してマッチング）
3. `--verbose`オプションで詳細ログを確認

### APIレスポンスのフィールド名が異なる

環境によりAPIレスポンスのフィールド名が異なる場合があります。
`--verbose`オプションでレスポンスを確認し、必要に応じて
`ComputerInfoExtractor.extract_info()`メソッドを調整してください。

## セキュリティに関する注意

- パスワードはコマンドライン引数ではなく、環境変数または設定ファイルで指定することを推奨
- 設定ファイルのパーミッションは`600`（所有者のみ読み書き可能）に設定
- ログ出力時にパスワードは自動的にマスクされます

## ライセンス

MIT License

## 参考資料

- [ESET PROTECT On-Prem API Documentation](https://help.eset.com/protect_install/11.1/api/)
- [ESET PROTECT On-Prem 11.1 API Examples](https://help.eset.com/protect_install/11.1/api_examples/)
- [ClientTaskConfiguration_Type Enum](https://help.eset.com/protect_install/12.1/api/Era/Common/DataDefinition/Task/ClientTaskConfiguration_Type.html)
