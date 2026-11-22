param([switch]$NoBrowser)

$ErrorActionPreference = "Stop"

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8080

function Get-ContentType([string]$path) {
    switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
        ".html" { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "text/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".svg"  { return "image/svg+xml" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".ico"  { return "image/x-icon" }
        default  { return "application/octet-stream" }
    }
}

function Send-Response {
    param(
        [System.Net.Sockets.NetworkStream]$Stream,
        [int]$StatusCode,
        [string]$StatusText,
        [string]$ContentType,
        [byte[]]$Body,
        [bool]$HeadOnly = $false
    )

    $header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`nCache-Control: no-cache`r`n`r`n"
    $headerBytes = [Text.Encoding]::ASCII.GetBytes($header)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)
    if (-not $HeadOnly -and $Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
    $Stream.Flush()
}

$localIp = $null
try {
    $localIp = [System.Net.Dns]::GetHostEntry([System.Net.Dns]::GetHostName()).AddressList |
        Where-Object {
            $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and
            -not [System.Net.IPAddress]::IsLoopback($_)
        } |
        Select-Object -First 1
} catch {
    $localIp = $null
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
try {
    $listener.Start()
} catch {
    Write-Host "No se pudo iniciar Ruta Vital en el puerto $port." -ForegroundColor Red
    Write-Host "Cierra otra ventana de Ruta Vital que pueda estar abierta e intenta de nuevo."
    Read-Host "Presiona Enter para cerrar"
    exit 1
}

$localhostUrl = "http://localhost:$port/"
$networkUrl = if ($localIp) { "http://$($localIp.IPAddressToString):$port/" } else { $localhostUrl }

Clear-Host
Write-Host "RUTA VITAL - SERVIDOR LOCAL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pagina local:  $localhostUrl" -ForegroundColor Green
Write-Host "IP de la red:  $networkUrl" -ForegroundColor Green
Write-Host ""
Write-Host "La pagina se abrira automaticamente en el navegador."
Write-Host "Para detener el servidor, presiona Ctrl+C o cierra esta ventana."
Write-Host ""

if (-not $NoBrowser) {
    Start-Process $localhostUrl
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = [IO.StreamReader]::new($stream, [Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()

            while ($true) {
                $line = $reader.ReadLine()
                if ([string]::IsNullOrEmpty($line)) { break }
            }

            if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }
            $parts = $requestLine.Split(" ")
            if ($parts.Length -lt 2) { continue }

            $method = $parts[0].ToUpperInvariant()
            $headOnly = $method -eq "HEAD"
            if ($method -ne "GET" -and -not $headOnly) {
                $body = [Text.Encoding]::UTF8.GetBytes("Metodo no permitido")
                Send-Response $stream 405 "Method Not Allowed" "text/plain; charset=utf-8" $body $headOnly
                continue
            }

            $requestPath = $parts[1].Split("?")[0]
            $requestPath = [Uri]::UnescapeDataString($requestPath)
            if ($requestPath -eq "/") { $requestPath = "/index.html" }

            $relativePath = $requestPath.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
            $rootPath = [IO.Path]::GetFullPath($siteRoot + [IO.Path]::DirectorySeparatorChar)
            $filePath = [IO.Path]::GetFullPath((Join-Path $siteRoot $relativePath))

            if (-not $filePath.StartsWith($rootPath, [StringComparison]::OrdinalIgnoreCase)) {
                $body = [Text.Encoding]::UTF8.GetBytes("Acceso no permitido")
                Send-Response $stream 403 "Forbidden" "text/plain; charset=utf-8" $body $headOnly
                continue
            }

            if (-not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
                $body = [Text.Encoding]::UTF8.GetBytes("Archivo no encontrado")
                Send-Response $stream 404 "Not Found" "text/plain; charset=utf-8" $body $headOnly
                continue
            }

            $body = [IO.File]::ReadAllBytes($filePath)
            Send-Response $stream 200 "OK" (Get-ContentType $filePath) $body $headOnly
        } catch {
            Write-Host "Solicitud omitida: $($_.Exception.Message)" -ForegroundColor DarkYellow
        } finally {
            if ($stream) { $stream.Dispose() }
            $client.Dispose()
        }
    }
} finally {
    $listener.Stop()
}
