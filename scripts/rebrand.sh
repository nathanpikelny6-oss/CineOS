#!/bin/sh
# scripts/rebrand.sh
# Run from the repository root. Replaces common product strings with "Oblivian" variants.
# WARNING: This modifies files in-place. Make a backup or run in a branch (we already created rename/oblivian).

set -eu

OLD_NAMES=("CineOS" "Cine OS" "cineos" "Cineos")
NEW_NAME="Oblivian"

printf "Rebranding: will replace occurrences of ${OLD_NAMES[*]} with ${NEW_NAME}\n"

for OLD in "${OLD_NAMES[@]}"; do
  # find files excluding node_modules, .git and large binary directories
  grep -RIl --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=Videos --exclude=*.mp4 "$OLD" . || true
  # replace in-place where possible
  find . -type f \
    ! -path "./.git/*" \
    ! -path "./node_modules/*" \
    ! -path "./Videos/*" \
    ! -name "*.mp4" -print0 \
    | xargs -0 grep -Il "$OLD" 2>/dev/null || true \
    | xargs -r sed -i "s/${OLD}/${NEW_NAME}/g"
done

printf "Rebrand script finished. Review changes and commit them.\n"
