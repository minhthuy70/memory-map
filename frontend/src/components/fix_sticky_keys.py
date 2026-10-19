with open('StickyKeysSupport.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the duplicate className on lines around 205
for i, line in enumerate(lines):
    if 'className="disabled:opacity-50"' in line and i > 0:
        # Check if previous line also has className
        if 'className=' in lines[i-1]:
            # Remove this duplicate line
            lines.pop(i)
            break

with open('StickyKeysSupport.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
