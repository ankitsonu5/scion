Add-Type -AssemblyName System.Drawing

$root = Join-Path $PSScriptRoot 'assets'
$quality = 82L

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } |
    Select-Object -First 1

if (-not $jpegCodec) {
    throw 'JPEG encoder not available.'
}

$encoder = [System.Drawing.Imaging.Encoder]::Quality

$stats = [ordered]@{
    Processed = 0
    Updated = 0
    Skipped = 0
    Failed = 0
    SavedBytes = 0L
}

function Save-JpegOptimized {
    param(
        [string]$SourcePath,
        [string]$TempPath
    )

    $image = $null
    $bitmap = $null

    try {
        $image = [System.Drawing.Image]::FromFile($SourcePath)
        $bitmap = New-Object System.Drawing.Bitmap($image)
        $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, $quality)
        $bitmap.Save($TempPath, $jpegCodec, $params)
    }
    finally {
        if ($bitmap) { $bitmap.Dispose() }
        if ($image) { $image.Dispose() }
    }
}

function Save-PngOptimized {
    param(
        [string]$SourcePath,
        [string]$TempPath
    )

    $image = $null
    $bitmap = $null

    try {
        $image = [System.Drawing.Image]::FromFile($SourcePath)
        $bitmap = New-Object System.Drawing.Bitmap($image)
        $bitmap.Save($TempPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        if ($bitmap) { $bitmap.Dispose() }
        if ($image) { $image.Dispose() }
    }
}

$files = Get-ChildItem -Path $root -Recurse -File |
    Where-Object { $_.Extension.ToLowerInvariant() -in '.jpg', '.jpeg', '.png' }

foreach ($file in $files) {
    $stats.Processed++
    $tempPath = "$($file.FullName).codex-tmp"

    try {
        switch ($file.Extension.ToLowerInvariant()) {
            '.jpg' { Save-JpegOptimized -SourcePath $file.FullName -TempPath $tempPath }
            '.jpeg' { Save-JpegOptimized -SourcePath $file.FullName -TempPath $tempPath }
            '.png' { Save-PngOptimized -SourcePath $file.FullName -TempPath $tempPath }
        }

        if (-not (Test-Path $tempPath)) {
            $stats.Skipped++
            continue
        }

        $originalSize = $file.Length
        $newSize = (Get-Item $tempPath).Length

        if ($newSize -lt $originalSize) {
            Move-Item -Path $tempPath -Destination $file.FullName -Force
            $stats.Updated++
            $stats.SavedBytes += ($originalSize - $newSize)
        }
        else {
            Remove-Item -Path $tempPath -Force
            $stats.Skipped++
        }
    }
    catch {
        if (Test-Path $tempPath) {
            Remove-Item -Path $tempPath -Force
        }
        $stats.Failed++
        Write-Warning ("Failed: " + $file.FullName + " :: " + $_.Exception.Message)
    }
}

[pscustomobject]@{
    Processed = $stats.Processed
    Updated = $stats.Updated
    Skipped = $stats.Skipped
    Failed = $stats.Failed
    SavedMB = [math]::Round(($stats.SavedBytes / 1MB), 2)
}
