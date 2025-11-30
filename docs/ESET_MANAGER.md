# ESET Manager なのだ

ESET PROTECT On-Prem 11.1のJSON-RPC APIを使って、クライアントPCのモニタリングとリモート操作を行うPythonツールなのだ。CSVファイルでPC名を指定して一括操作できるのだ。

## 概要

ESET Managerは社内のESETアンチウイルス展開を管理するためのシンプルなツールなのだ。CSVファイルに記載されたPC名に対して、ヘルスモニタリングやリモートタスク実行ができるのだ。

### 主な機能

- **情報取得**: CSVファイルに記載されたPC名のESET状態を一括取得するのだ
  - ESETとの疎通状態
  - Anti-Virusのバージョン
  - 定義ファイルの更新日
  - Windowsのバージョン
  - PCの最終起動日
- **リモート管理**: 問題のあるデバイスでESETをリモートでアンインストール・再インストールできるのだ
- **タスク実行**: ウイルス定義更新、オンデマンドスキャン、任意のコマンド実行ができるのだ
- **dry-run機能**: 実際のAPI呼び出しを行わずに動作確認できるのだ

## 動作環境

- Python 3.7以上
- Linux / Windows 両対応
- ESET PROTECT On-Prem 11.1

## インストール

```bash
pip install -r eset_requirements.txt
```

簡単なのだ。

## 設定

### 方法1: 環境変数（推奨）

```bash
export ESET_HOST="eset-server.example.com"
export ESET_PORT="2223"
export ESET_USERNAME="Administrator"
export ESET_PASSWORD="your_password"
export ESET_VERIFY_SSL="false"
export ESET_USE_HTTP="true"  # HTTPを使用する場合
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
    "use_http": true,
    "timeout": 30,
    "retries": 3
}
```

`use_http`を`true`にするとHTTPS代わりにHTTPを使用するのだ。社内ネットワークなど、HTTPで十分な環境では便利なのだ。

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

対応するカラム名: `name`, `computer`, `hostname`, `pc` （大文字小文字不問）なのだ。柔軟に対応しているのだ。

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

なかなか種類が多いのだ。

## 典型的なワークフロー

### ワークフロー1: 日次ヘルスモニタリング

```bash
# 1. CSVファイルを準備（対象PCのリスト）
cat computers.csv
# name
# DESKTOP-ABC001
# DESKTOP-ABC002

# 2. 情報取得
python3 eset_manager.py info --csv computers.csv --output results.csv

# 3. 結果を確認
cat results.csv
```

### ワークフロー2: 問題のあるPCの修復

```bash
# 1. 問題のあるPCをCSVファイルに記載
echo "name" > problem_pcs.csv
echo "DESKTOP-ABC001" >> problem_pcs.csv

# 2. アンインストール実行
python3 eset_manager.py task --csv problem_pcs.csv --type SoftwareUninstallation

# 3. 再インストール実行
python3 eset_manager.py task --csv problem_pcs.csv --type SoftwareInstallation \
    --package "\\\\server\\share\\eset_installer.msi"
```

### ワークフロー3: ウイルス定義の一括更新

```bash
# 全PCの定義ファイルを更新
python3 eset_manager.py task --csv all_computers.csv --type Update
```

## トラブルシューティング

### SSL証明書エラー

自己署名証明書を使用している場合はこうするのだ：
```bash
export ESET_VERIFY_SSL="false"
```

### HTTPを使いたい場合

社内ネットワークでHTTPSが不要な場合：
```bash
export ESET_USE_HTTP="true"
```

または設定ファイルで：
```json
{
    "use_http": true
}
```

### 認証エラー

1. ユーザー名/パスワードを確認するのだ
2. ESET PROTECT管理者権限があることを確認するのだ
3. ポート2223が開放されていることを確認するのだ

### コンピュータが見つからない

1. ESET PROTECTコンソールで該当PCが登録されているか確認するのだ
2. PC名の大文字小文字を確認するのだ（内部では大文字小文字を無視してマッチングしているのだ）
3. `--verbose`オプションで詳細ログを確認するのだ

### APIレスポンスのフィールド名が異なる

環境によりAPIレスポンスのフィールド名が異なる場合があるのだ。
`--verbose`オプションでレスポンスを確認して、必要に応じて
`ComputerInfoExtractor.extract_info()`メソッドを調整するのだ。

まあ、そういうこともあるのだ。

## セキュリティに関する注意

- パスワードはコマンドライン引数ではなく、環境変数または設定ファイルで指定することを推奨するのだ
- 設定ファイルのパーミッションは`600`（所有者のみ読み書き可能）に設定するのだ
- ログ出力時にパスワードは自動的にマスクされるのだ
- HTTPを使用する場合は、社内ネットワークなど信頼できる環境に限定するのだ

## ライセンス

MIT License

## 参考資料

- [ESET PROTECT On-Prem API Documentation](https://help.eset.com/protect_install/11.1/api/)
- [ESET PROTECT On-Prem 11.1 API Examples](https://help.eset.com/protect_install/11.1/api_examples/)
- [ClientTaskConfiguration_Type Enum](https://help.eset.com/protect_install/12.1/api/Era/Common/DataDefinition/Task/ClientTaskConfiguration_Type.html)

何かわからないことがあったら、これらのドキュメントを見るといいのだ。
