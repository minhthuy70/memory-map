with open('SharedAlbums.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and modify the formData useState initialization
for i, line in enumerate(lines):
    if 'const [formData, setFormData] = useState({' in line:
        # Insert memories and members before name
        indent = '    '
        new_lines = [
            f'{indent}memories: [] as string[],\n',
            f'{indent}members: [] as Array<{{ id: string; name: string; role: "owner" | "editor" | "viewer" }}>,\n',
        ]
        # Find where to insert (before name)
        for j in range(i+1, len(lines)):
            if 'name:' in lines[j]:
                lines[j:j] = new_lines
                break
        break

# Find and modify the resetForm function
for i, line in enumerate(lines):
    if 'const resetForm = () => {' in line:
        # Find the setFormData call inside
        for j in range(i+1, len(lines)):
            if 'setFormData({' in lines[j]:
                indent = '      '
                new_lines = [
                    f'{indent}memories: [],\n',
                    f'{indent}members: [],\n',
                ]
                # Find where to insert (before name)
                for k in range(j+1, len(lines)):
                    if 'name:' in lines[k]:
                        lines[k:k] = new_lines
                        break
                break
        break

with open('SharedAlbums.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
