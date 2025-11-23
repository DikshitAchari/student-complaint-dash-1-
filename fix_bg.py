with open('public/style.css', 'r') as file:
    content = file.read()

# Replace the escaped URL with the correct one
content = content.replace("url\\('../assets/images/col2.jpg'\\)", "url('../assets/images/col2.jpg')")

with open('public/style.css', 'w') as file:
    file.write(content)