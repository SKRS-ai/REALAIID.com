export async function onRequest(context) {
    const { request, env } = context;
    const { searchParams } = new URL(request.url);
    const vssnId = searchParams.get('id');

    // 1. Bridge to your Secrets (Stored in Cloudflare Dashboard)
    const DISCORD_URL = env.DISCORD_WEBHOOK_URL;

    if (!vssnId) {
        return new Response(JSON.stringify({ error: "No ID provided" }), { status: 400 });
    }

    try {
        // 2. Corrected KV Lookup - Must match your Dashboard Variable Name
        // We are using BUREAU_MAINFRAME as the primary node
        const record = await env.BUREAU_MAINFRAME.get(vssnId);

        // 3. The Notification Bridge
        if (DISCORD_URL) {
            await fetch(DISCORD_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `📡 **Identity Verification Attempt**\n**VSSN:** \`${vssnId}\`\n**Status:** ${record ? "✅ Verified" : "❌ Not Found"}`
                })
            }).catch(err => console.error("Discord Bridge Offline", err));
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
        return new Response(JSON.stringify({ error: "Node Connection Failure" }), { status: 500 });
    }
}
