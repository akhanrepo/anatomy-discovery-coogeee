#!/usr/bin/env bash
# PostToolUse hook: after Claude edits source, content or tests, run the fast suite.
# On failure, exit 2 so the failing output is fed straight back into Claude's context.
input="$(cat)"
file="$(printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write((j.tool_input&&(j.tool_input.file_path||j.tool_input.notebook_path))||"")}catch{}})')"
case "$file" in
  */src/*|*/content/*|*/tests/*|*/scripts/*|*/docs/features/*|*.config.ts|*.config.mjs) ;;
  *) exit 0 ;;
esac
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel)}" || exit 0
out="$(CLAUDE_HOOK=1 timeout 120 npx vitest run 2>&1)"
status=$?
if [ $status -ne 0 ]; then
  echo "Tests failed after editing $file:" >&2
  printf '%s\n' "$out" | grep -vE '^\s*$' | tail -60 >&2
  exit 2
fi
exit 0
