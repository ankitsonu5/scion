$banners = @(
    "assets/images/homepage/banners/MA/MA_Web%20Banner_OP6.jpg",
    "assets/images/homepage/banners/JPD/JPD_Web%20Banner_2.jpg",
    "assets/images/homepage/banners/CL/CL%20Scion%20Banner%20option%202.jpg",
    "assets/images/homepage/banners/PC/PC-WEBSITE-BANNER_3-21-02-2026.jpg"
)
$cards = @(
    "assets/images/homepage/our_brands/Our%20Brands%20-%20MA%20Nebula%20Nectar.jpeg",
    "assets/images/homepage/our_brands/Our%20Brands%20-%20JPD%20Prive.png",
    "assets/images/homepage/our_brands/Our%20Brands%20-%20CL%20Scion.png"
)

$htmlFiles = Get-ChildItem "C:\Users\idkth\Documents\scion\*.html"
foreach ($file in $htmlFiles) {
    if ($file.Name -match "audit|list|remaining|sync") { continue }
    $content = Get-Content $file.FullName -Raw
    if ($content -match "unsplash\.com|placehold\.co") {
        $newContent = [regex]::Replace($content, "https://images\.unsplash\.com/[^'\"\) ]*", $banners[0])
        $newContent = [regex]::Replace($newContent, "https://placehold\.co/[^'\"\) ]*", $cards[0])
        Set-Content $file.FullName $newContent -Encoding utf8
        Write-Host "Sync'd $($file.Name)"
    }
}
