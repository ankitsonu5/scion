# Update-MA-PDP-v3.ps1
$DataFile = "C:\Users\idkth\Documents\scion\ma_extracted_data.json"
$ProductsData = Get-Content $DataFile -Raw | ConvertFrom-Json
$MaFiles = Get-ChildItem -Path "c:\Users\idkth\Documents\scion" -Filter "product-ma-*.html"

foreach ($file in $MaFiles) {
    $slug = $file.BaseName -replace 'product-ma-', ''
    $data = $ProductsData.$slug
    
    if ($null -eq $data) {
        Write-Host "No data found for slug: $slug" -ForegroundColor Yellow
        continue
    }

    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # 1. Update Title
    $titleHtml = "<h1 class=`"pdp-title`">$($data.title)</h1>"
    $content = $content -replace '<h1 class="pdp-title">.*?</h1>', $titleHtml

    # 2. Remove Price
    $content = $content -replace '<div class="pdp-price">.*?</div>', ''

    # 3. Create "About the product" Box
    $bulletItems = ""
    foreach ($bullet in $data.bullets) {
        $bulletItems += "                    <li>$bullet</li>`n"
    }
    
    $aboutBoxHtml = @"
                <div class="pdp-about-box">
                    <h3>About the product</h3>
                    <ul class="pdp-about-list">
$bulletItems                    </ul>
                </div>
"@
    
    # Replace description with About Box
    $content = $content -replace '<p class="pdp-description">.*?</p>', $aboutBoxHtml

    # 4. Update Enquiry Button & Add Amazon Section
    $enquiryText = "ADD TO ENQUIRY"
    $amazonLink = $data.link
    
    $purchaseSectionHtml = @"
                <div class="pdp-purchase-actions">
                    <div class="pdp-main-action">
                        <button class="pdp-btn">$enquiryText</button>
                        <button class="pdp-btn-outline"><i class="far fa-heart"></i></button>
                    </div>
                    <div class="pdp-amazon-wrap">
                        <a href="$amazonLink" target="_blank" class="btn-amazon">
                            <i class="fab fa-amazon"></i> Available on Amazon
                        </a>
                        <div class="pdp-flags">
                            <div class="pdp-flag-item">
                                <img src="https://flagcdn.com/w40/us.png" alt="USA" class="pdp-flag-img">
                                <span class="pdp-flag-label">USA</span>
                            </div>
                            <div class="pdp-flag-item">
                                <img src="https://flagcdn.com/w40/in.png" alt="India" class="pdp-flag-img">
                                <span class="pdp-flag-label">India</span>
                            </div>
                        </div>
                    </div>
                </div>
"@

    # Replace existing actions (buttons)
    $content = $content -replace '<div class="pdp-actions">.*?</div>', $purchaseSectionHtml

    $content | Out-File $file.FullName -Encoding UTF8 -Force
    Write-Host "Updated $($file.Name)" -ForegroundColor Green
}
