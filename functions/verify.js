export async function onRequest(context) {
    const { request, env } = context;
    const { searchParams } = new URL(request.url);
    const vssnId = searchParams.get('id');

    // 1. Bridge to your Secrets (Stored in Cloudflare Dashboard)
    const DISCORD_URL = env.DISCORD_WEBHOOK_URL;
    const MONGO_URI = env.MONGODB_URI; // Ready for future database expansion

    if (!vssnId) {
        return new Response(JSON.stringify({ error: "No ID provided" }), { status: 400 });
    }

    try {
        // 2. Existing KV Registry Lookup
        // Ensure 'VSSN_REGISTRY' is bound in your Cloudflare Settings
        const record = await env.VSSN_REGISTRY.get(vssnId);

        // 3. THE NOTIFICATION BRIDGE: Alert Discord of the verification attempt
        if (DISCORD_URL) {
            await fetch(DISCORD_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `📡 **Verification Requested**\n**ID:** \`${vssnId}\`\n**Result:** ${record ? "✅ Active" : "❌ Inactive"}`
                })
            }).catch(err => console.error("Discord Notification Failed", err));
        }

        if (record) {
            const data = JSON.parse(record);
            return new Response(JSON.stringify({ 
                active: true, 
                owner: data.name, 
                status: data.status,
                anchoredAt: data.anchoredAt
            }), {
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ active: false }), {
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: "Mainframe Connection Error" }), { status: 500 });
    }
}
