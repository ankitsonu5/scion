$baseDir = "C:\Users\idkth\Documents\scion\assets\images\brands\pc"
$folders = @{
    "PC 3PCS Regime Kit" = "regime-kit"
    "PC Aloe Vera Gel 200ml" = "aloe-vera"
    "PC Baby Care PLP" = "baby-care"
    "PC Combo image" = "combo"
    "PC_Hair Cream" = "hair-cream"
    "PC_Hair Food" = "hair-food"
    "PC_Hair Oil" = "hair-oil"
    "PC_Perfumed Body Lotion" = "body-lotion"
}

$html = ""

foreach ($key in $folders.Keys) {
    echo "Processing $key"
    $filterAttr = $folders[$key]
    $categoryName = $key -replace 'PC_', '' -replace 'PC ', ''

    $path = Join-Path $baseDir $key
    if (Test-Path $path) {
        $files = Get-ChildItem -Path $path -File
        foreach ($file in $files) {
            $imgName = $file.Name
            $encodedImgName = $imgName.Replace(' ', '%20').Replace('''', '%27')
            $encodedKey = $key.Replace(' ', '%20').Replace('''', '%27')
            $imgPath = "assets/images/brands/pc/$encodedKey/$encodedImgName"
            
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

Set-Content -Path "C:\Users\idkth\Documents\scion\pc_products_raw.html" -Value $html
Write-Host "Generated pc_products_raw.html"
