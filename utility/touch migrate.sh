#!/bin/bash

# REALAiID BUREAU // MIGRATION & SANITATION PROTOCOL
# MODULE: migrate.sh
# ROLE: Cleans stale Mainframe artifacts and triggers environment sync.
# STATUS: PHL-01 STABLE

echo "[+] Starting Mainframe Migration & Sanitation..."

# 1. Clean up stale lock files that cause module errors
echo "[+] Sanitizing node_modules and lock files..."
rm -rf node_modules/.cache
rm -f package-lock.json

# 2. Re-install dependencies to ensure the mesh is aligned
echo "[+] Re-syncing Mainframe dependencies..."
npm install

# 3. Security Check
echo "[+] Running audit for PHL-01 integrity..."
npm audit fix --quiet

# 4. Finalization
echo "[+] Migration Complete. System ready for boot."
echo "[+] Run 'node server.js' to initialize the PHL-01 Mesh."