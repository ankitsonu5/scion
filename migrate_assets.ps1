$SourceBase = "C:\Users\idkth\Downloads\OneDrive_2026-03-19 (2)\2. Shared with agency folder"
$DestBase = "C:\Users\idkth\Documents\scion\assets\images"
$VideoDest = "C:\Users\idkth\Documents\scion\assets\videos"

# Helper function to copy files
function Copy-AssetFolder {
    param (
        [string]$SourcePath,
        [string]$DestPath
    )
    if (Test-Path $SourcePath) {
        if (-not (Test-Path $DestPath)) {
            New-Item -ItemType Directory -Force -Path $DestPath | Out-Null
        }
        Copy-Item -Path "$SourcePath\*" -Destination $DestPath -Recurse -Force
        Write-Host "Copied $SourcePath to $DestPath"
    } else {
        Write-Host "Source path not found: $SourcePath"
    }
}

# 2. Brand Assets
Copy-AssetFolder -SourcePath "$SourceBase\Brands\CPT" -DestPath "$DestBase\brands\cpt"
Copy-AssetFolder -SourcePath "$SourceBase\Brands\CL" -DestPath "$DestBase\brands\cl"
Copy-AssetFolder -SourcePath "$SourceBase\Brands\JPD" -DestPath "$DestBase\brands\jpd"
Copy-AssetFolder -SourcePath "$SourceBase\Brands\MA" -DestPath "$DestBase\brands\ma"
Copy-AssetFolder -SourcePath "$SourceBase\Brands\PC" -DestPath "$DestBase\brands\pc"

# 3. Handle Videos for PC
if (-not (Test-Path $VideoDest)) {
    New-Item -ItemType Directory -Force -Path $VideoDest | Out-Null
}
$pcSource = "$SourceBase\Brands\PC"
if (Test-Path $pcSource) {
    Get-ChildItem -Path $pcSource -Recurse -Include *.mp4 | ForEach-Object {
        $destFile = Join-Path -Path $VideoDest -ChildPath $_.Name
        Copy-Item -Path $_.FullName -Destination $destFile -Force
        Write-Host "Copied video $_.Name to $VideoDest"
    }
}

Write-Host "Brand Asset Migration Complete."
