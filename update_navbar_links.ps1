$files = Get-ChildItem -Path "c:\Users\idkth\Documents\scion" -Filter "*.html" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Update Jean Paul Dupont
    $content = $content -replace 'href="products-luxury\.html">Jean Paul Dupont\s*</a>', 'href="products-jpd.html">Jean Paul Dupont </a>'
    
    # Update Creation Lamis
    $content = $content -replace 'href="products-luxury\.html">Creation Lamis</a>', 'href="products-cl.html">Creation Lamis</a>'
    
    # Update Paris Collection
    $content = $content -replace 'href="products-luxury\.html">Paris Collection</a>', 'href="products-pc.html">Paris Collection</a>'
    
    # Update CP Trendies
    $content = $content -replace 'href="products-luxury\.html">CP Trendies</a>', 'href="products-cpt.html">CP Trendies</a>'
    
    # Also handle single quotes just in case
    $content = $content -replace "href='products-luxury\.html'>Jean Paul Dupont\s*</a>", 'href="products-jpd.html">Jean Paul Dupont </a>'
    $content = $content -replace "href='products-luxury\.html'>Creation Lamis</a>", 'href="products-cl.html">Creation Lamis</a>'
    $content = $content -replace "href='products-luxury\.html'>Paris Collection</a>", 'href="products-pc.html">Paris Collection</a>'
    $content = $content -replace "href='products-luxury\.html'>CP Trendies</a>", 'href="products-cpt.html">CP Trendies</a>'

    Set-Content $file.FullName $content
}
