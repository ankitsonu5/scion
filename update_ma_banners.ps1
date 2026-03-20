$files = Get-ChildItem -Path "C:\Users\idkth\Documents\scion\product-ma-*.html"

foreach ($file in $files) {
    # Extract product slug, e.g., product-ma-eternal-oud from product-ma-eternal-oud.html
    $slug = $file.BaseName
    
    # Find matching image ending with -7
    $imagePath = Get-ChildItem -Path "C:\Users\idkth\Documents\scion\assets\$slug-7.*" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($imagePath) {
        $imgName = $imagePath.Name
        $content = Get-Content -Path $file.FullName -Raw
        $newContent = $content -replace 'https://images\.unsplash\.com/photo-1616999696985-2c262ad97c32\?q=80&w=2000&auto=format&fit=crop', "assets/$imgName"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.Name) with $imgName"
    } else {
        Write-Host "Could not find image 7 for $($file.Name)"
    }
}
