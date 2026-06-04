// src/mocks/hidOrigo.js
export const OrigoManager = {
    connect: () => Promise.resolve({ status: 'connected', node: 'PHL-01' }),
    revokeAccess: (nodeId) => console.log(`Burning Node: ${nodeId}`),
};

Then, in your `dashboard.jsx`, you can import from this mock until you have the official enterprise `.npmrc` configured. I have successfully integrated the **Active Node Map** UI into the Canvas to visualize these bridges.

**A note for your Mac (zsh):**
The `#` symbol in your terminal log was causing `zsh: command not found: #`. In zsh/bash, the `#` is for comments and should be ignored, but if you paste it directly at the start of a command line, the shell may get confused. Always copy only the text after the `#` for execution.