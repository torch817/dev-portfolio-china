#!/usr/bin/env bash
set -euo pipefail

# Performance Budget Constants (in bytes)
MAX_JS_GZIP_BYTES=$((90 * 1024))   # 90 kB
MAX_CSS_GZIP_BYTES=$((12 * 1024))  # 12 kB
MAX_RASTER_BYTES=$((200 * 1024))   # 200 kB

FAILED=0

echo "=== Performance Budget Gate Check ==="

if [ ! -d "dist/assets" ]; then
  echo "ERROR: dist/assets directory not found. Please run 'npm run build' first."
  exit 1
fi

echo "--- 1. JavaScript Assets (Gzip Limit: 90 kB) ---"
for file in dist/assets/*.js; do
  if [ -f "$file" ]; then
    size=$(gzip -c "$file" | wc -c)
    size_kb=$(awk "BEGIN {printf \"%.2f\", $size / 1024}")
    filename=$(basename "$file")
    if [ "$size" -le "$MAX_JS_GZIP_BYTES" ]; then
      echo "  [PASS] $filename: ${size_kb} kB (limit 90 kB)"
    else
      echo "  [FAIL] $filename: ${size_kb} kB EXCEEDS 90 kB limit ($size bytes)"
      FAILED=1
    fi
  fi
done

echo "--- 2. CSS Assets (Gzip Limit: 12 kB) ---"
for file in dist/assets/*.css; do
  if [ -f "$file" ]; then
    size=$(gzip -c "$file" | wc -c)
    size_kb=$(awk "BEGIN {printf \"%.2f\", $size / 1024}")
    filename=$(basename "$file")
    if [ "$size" -le "$MAX_CSS_GZIP_BYTES" ]; then
      echo "  [PASS] $filename: ${size_kb} kB (limit 12 kB)"
    else
      echo "  [FAIL] $filename: ${size_kb} kB EXCEEDS 12 kB limit ($size bytes)"
      FAILED=1
    fi
  fi
done

echo "--- 3. Raster Image Assets (Limit: 200 kB per file) ---"
RASTER_COUNT=0
while IFS= read -r -d '' file; do
  if [ -f "$file" ]; then
    RASTER_COUNT=$((RASTER_COUNT + 1))
    size=$(wc -c < "$file")
    size_kb=$(awk "BEGIN {printf \"%.2f\", $size / 1024}")
    if [ "$size" -le "$MAX_RASTER_BYTES" ]; then
      echo "  [PASS] $file: ${size_kb} kB (limit 200 kB)"
    else
      echo "  [FAIL] $file: ${size_kb} kB EXCEEDS 200 kB limit ($size bytes)"
      FAILED=1
    fi
  fi
done < <(find public dist -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" -o -iname "*.gif" -o -iname "*.ico" \) -print0 2>/dev/null || true)

if [ "$RASTER_COUNT" -eq 0 ]; then
  echo "  (No raster image assets found in public/ or dist/ — clean vector-only setup)"
fi

echo "======================================"
if [ "$FAILED" -eq 0 ]; then
  echo "All performance and asset budgets PASSED."
  exit 0
else
  echo "Performance budget check FAILED."
  exit 1
fi
