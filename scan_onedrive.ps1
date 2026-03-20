$targetDate = Get-Date "2026-03-19"
$files = Get-ChildItem "C:\Users\idkth\OneDrive" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime.Date -eq $targetDate.Date }

if ($files.Count -eq 0) {
    Write-Output "NO FILES FOUND FOR 2026-03-19"
    Write-Output "--- Listing ALL recent files (last 7 days) ---"
    $recent = Get-ChildItem "C:\Users\idkth\OneDrive" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) } | Sort-Object LastWriteTime -Descending
    foreach ($f in $recent) {
        Write-Output ("{0}|{1}|{2}|{3}" -f $f.FullName, $f.Length, $f.Extension, $f.LastWriteTime.ToString("yyyy-MM-dd HH:mm"))
    }
} else {
    foreach ($f in $files) {
        Write-Output ("{0}|{1}|{2}|{3}" -f $f.FullName, $f.Length, $f.Extension, $f.LastWriteTime.ToString("yyyy-MM-dd HH:mm"))
    }
}
