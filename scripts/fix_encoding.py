import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

files = [
    os.path.join(BASE, 'pages', 'como-contribuir.html'),
    os.path.join(BASE, 'pages', 'como-contribuir-local.html'),
    os.path.join(BASE, 'pages', 'como-contribuir-codespace.html'),
]

# Tabla de mojibake Latin-1 re-interpretado como UTF-8
replacements = [
    ('Ã³', 'ó'), ('Ã©', 'é'), ('Ã­', 'í'), ('Ãº', 'ú'), ('Ã±', 'ñ'),
    ('Ã¡', 'á'), ('Ã"', 'Ó'), ('Ã‰', 'É'), ('Ãš', 'Ú'), ('Â¿', '¿'),
    ('Â¡', '¡'), ('Ã\x83', 'Ã'), ('â€¢', '\u2022'), ('â€"', '\u2014'),
    ('â€™', '\u2019'), ('â€œ', '\u201c'), ('â€\x9d', '\u201d'),
    ('Â·', '\u00b7'), ('Ã\x81', 'Á'), ('Ã\x89', 'É'), ('Ã\x8d', 'Í'),
    ('Ã\x93', 'Ó'), ('Ã\x9a', 'Ú'), ('Ã\x91', 'Ñ'),
    ('Ã\xa0', 'à'), ('Ã\xa8', 'è'), ('Ã\xb6', 'ö'), ('Ã\xbc', 'ü'),
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for bad, good in replacements:
        content = content.replace(bad, good)
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {filepath}')
    else:
        print(f'No changes needed: {filepath}')
