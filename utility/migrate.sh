#!/bin/bash

# Create the new directory structure
echo "[*] Creating new infrastructure directories..."
mkdir -p bridges services mesh core

# Move API Bridge files (files ending in -bridge.js or router-based files)
echo "[*] Moving API Bridges..."
mv *-bridge.js bridges/ 2>/dev/null
mv voting.js property-tax.js public-works.js dmv.js bridges/ 2>/dev/null

# Move Service/Logic files (Quantum, Resilience, Orchestrator logic)
echo "[*] Moving Core Services..."
mv *-orchestrator.js *-logic.js forensic-validator.js treasury-bridge.js services/ 2>/dev/null

# Move Mesh/Quantum files
echo "[*] Moving Mesh & Quantum layers..."
mv quantum-*.js atmospheric-*.js benthic-*.js mesh-*.js mesh/ 2>/dev/null

# Move Core Foundation files (Keep server.js and configs in root)
echo "[*] Organizing core foundation..."
mv README.md package.json .env core/ 2>/dev/null

echo "[+] Migration Complete. Your root directory is now clean."
echo "[!] IMPORTANT: Ensure your server.js loader points to './bridges' for active API routes."