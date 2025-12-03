<#
.SYNOPSIS
    ESET PROTECT APIエンドポイントをテストするスクリプト

.DESCRIPTION
    複数のエンドポイントパターンを試して、正しいAPI接続先を特定する。

.EXAMPLE
    .\Test-EsetApi.ps1 -Host "172.16.1.64" -Username "Administrator" -Password "YourPassword"

.NOTES
    薬の効能を確かめるには、まず試してみるしかない。
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$EsetHost,

    [Parameter(Mandatory=$true)]
    [string]$Username,

    [Parameter(Mandatory=$true)]
    [string]$Password,

    [int]$Port = 443
)

# SSL証明書検証をスキップ（古いPowerShell用）
if ($PSVersionTable.PSVersion.Major -lt 6) {
    Add-Type @"
using System.Net;
using System.Security.Cryptography.X509Certificates;
public class TrustAllCertsPolicy : ICertificatePolicy {
    public bool CheckValidationResult(
        ServicePoint srvPoint, X509Certificate certificate,
        WebRequest request, int certificateProblem) {
        return true;
    }
}
"@
    [System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12
}

$baseUrl = "https://${EsetHost}:${Port}"

# テストするエンドポイントとリクエストボディのパターン
$tests = @(
    @{
        Name = "Test 1: /era/rpc (標準JSON-RPC形式)"
        Url = "$baseUrl/era/rpc"
        Body = @{
            jsonrpc = "2.0"
            id = 1
            method = "Authenticator.Login"
            params = @{
                username = $Username
                password = $Password
            }
        } | ConvertTo-Json -Depth 5
    },
    @{
        Name = "Test 2: /api (ESET独自形式)"
        Url = "$baseUrl/api"
        Body = @{
            "Era.Common.NetworkMessage.ConsoleApi.SessionManagement.RpcAuthLoginRequest" = @{
                username = $Username
                password = $Password
                isDomainUser = $false
                locale = "en-US"
            }
        } | ConvertTo-Json -Depth 5
    },
    @{
        Name = "Test 3: /era/api (ESET独自形式)"
        Url = "$baseUrl/era/api"
        Body = @{
            "Era.Common.NetworkMessage.ConsoleApi.SessionManagement.RpcAuthLoginRequest" = @{
                username = $Username
                password = $Password
                isDomainUser = $false
                locale = "en-US"
            }
        } | ConvertTo-Json -Depth 5
    },
    @{
        Name = "Test 4: /era/webconsole/api (WebConsole配下)"
        Url = "$baseUrl/era/webconsole/api"
        Body = @{
            "Era.Common.NetworkMessage.ConsoleApi.SessionManagement.RpcAuthLoginRequest" = @{
                username = $Username
                password = $Password
                isDomainUser = $false
                locale = "en-US"
            }
        } | ConvertTo-Json -Depth 5
    },
    @{
        Name = "Test 5: /era/rpc (ESET独自形式)"
        Url = "$baseUrl/era/rpc"
        Body = @{
            "Era.Common.NetworkMessage.ConsoleApi.SessionManagement.RpcAuthLoginRequest" = @{
                username = $Username
                password = $Password
                isDomainUser = $false
                locale = "en-US"
            }
        } | ConvertTo-Json -Depth 5
    }
)

Write-Host "`n=== ESET PROTECT API Endpoint Test ===" -ForegroundColor Cyan
Write-Host "Target: $baseUrl" -ForegroundColor Gray
Write-Host "Username: $Username" -ForegroundColor Gray
Write-Host ""

foreach ($test in $tests) {
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    Write-Host $test.Name -ForegroundColor Yellow
    Write-Host "URL: $($test.Url)" -ForegroundColor Gray

    try {
        $params = @{
            Uri = $test.Url
            Method = "POST"
            ContentType = "application/json"
            Body = $test.Body
        }

        # PowerShell 6+の場合は-SkipCertificateCheckを使用
        if ($PSVersionTable.PSVersion.Major -ge 6) {
            $params["SkipCertificateCheck"] = $true
        }

        $response = Invoke-WebRequest @params -ErrorAction Stop

        Write-Host "Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Cyan

        # レスポンスをパースして表示
        try {
            $json = $response.Content | ConvertFrom-Json
            $json | ConvertTo-Json -Depth 5 | Write-Host
        }
        catch {
            Write-Host $response.Content
        }

        Write-Host "`n*** SUCCESS! This endpoint works! ***" -ForegroundColor Green -BackgroundColor DarkGreen

    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $statusDesc = $_.Exception.Response.StatusDescription

        if ($statusCode) {
            Write-Host "Status: $statusCode $statusDesc" -ForegroundColor Red
        }
        else {
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        }

        # レスポンスボディがあれば表示
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errorBody = $reader.ReadToEnd()
            if ($errorBody) {
                Write-Host "Response Body: $errorBody" -ForegroundColor DarkYellow
            }
        }
        catch {
            # レスポンスボディなし
        }
    }

    Write-Host ""
}

Write-Host "========================================" -ForegroundColor DarkGray
Write-Host "Test completed." -ForegroundColor Cyan
Write-Host ""
