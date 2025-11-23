$content = Get-Content public\style.css
$content = $content -replace "url\\\(''\.\./assets/images/col2\.jpg''\\\)", "url('../assets/images/col2.jpg')"
$content | Set-Content public\style.css