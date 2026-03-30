export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 1. Get the ID from the website's search bar
    const { vssn } = await request.json();

    // 2. Reach into the "Philadelphia Node" (The KV Binding)
    const data = await env.BUREAU_MAINFRAME.get(vssn);

    // 2.5 THE BRIDGE: Notify Discord of the Search (Securely)
    // This uses the Secret you saved in the Cloudflare Dashboard
    if (env.DISCORD_WEBHOOK_URL) {
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🔍 **Bureau Search Initiated**\n**VSSN:** \`${vssn}\`\n**Status:** ${data ? "✅ Found" : "❌ Not Found"}`
        })
      }).catch(err => console.error("Discord Bridge Failed:", err));
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "ID NOT FOUND IN LEDGER" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Return the secured identity data to the screen
    return new Response(data, {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "NODE CONNECTION ERROR" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
