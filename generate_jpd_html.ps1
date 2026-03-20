$baseDir = "C:\Users\idkth\Documents\scion\assets\images\brands\jpd"
$folders = @{
    "JPD Circuit" = "circuit"
    "JPD Connect" = "connect"
    "JPD Nova" = "nova"
    "JPD Prive'" = "prive"
    "JPD Promo Pack" = "promo-pack"
    "JPD Scripture" = "scripture"
    "JPD Tant" = "tant"
}

$html = ""

foreach ($key in $folders.Keys) {
    echo "Processing $key"
    $filterAttr = $folders[$key]
    $categoryName = $key -replace 'JPD ', ''
    $categoryName = $categoryName -replace '''', ''

    $path = Join-Path $baseDir $key
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -File
        foreach ($file in $files) {
            $imgName = $file.Name
            $encodedImgName = $imgName.Replace(' ', '%20').Replace('''', '%27')
            $encodedKey = $key.Replace(' ', '%20').Replace('''', '%27')
            $imgPath = "assets/images/brands/jpd/$encodedKey/$encodedImgName"
            
            # Use filename without extension as product title
            $title = $file.BaseName -replace '-',' ' -replace '_',' '
            
            $html += @"
                <!-- Product Card ($categoryName) -->
                <div class="product-card-luxury" data-brand="$filterAttr">
                    <div class="product-img-wrap-luxury">
                        <img src="$imgPath" alt="$title" class="product-img-luxury">
                    </div>
                    <div class="product-info-luxury">
                        <span class="product-cat-luxury">$categoryName</span>
                        <h3 class="product-title-luxury">$title</h3>
                        <div class="product-actions-luxury">
                            <a href="#" class="add-btn-luxury">View Details</a>
                        </div>
                    </div>
                </div>
"@ + "`r`n`r`n"
        }
    }
}

Set-Content -Path "C:\Users\idkth\Documents\scion\jpd_products_raw.html" -Value $html
Write-Host "Generated jpd_products_raw.html"
