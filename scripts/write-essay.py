"""Write an edition essay file with safely-quoted YAML frontmatter. Usage: python3 scripts/write-essay.py <spec.json>"""
import json, sys
spec = json.load(open(sys.argv[1]))
lines = ['---', f"thread: {spec['thread']}", f"title: {json.dumps(spec['title'], ensure_ascii=False)}", 'claims:']
for k, c in spec['claims'].items():
    lines.append(f"  {k}:")
    lines.append(f"    text: {json.dumps(c['text'], ensure_ascii=False)}")
    lines.append(f"    citations: {json.dumps(c['citations'], ensure_ascii=False)}")
    for opt in ('status', 'contestNote'):
        if opt in c: lines.append(f"    {opt}: {json.dumps(c[opt], ensure_ascii=False)}")
    if c.get('secondarySummary'): lines.append("    secondarySummary: true")
lines += ['---', spec['body'].strip(), '']
open(f"content/essays/{spec['thread']}.md", 'w').write('\n'.join(lines))
print('wrote', spec['thread'], len(spec['body'].split()), 'words')
