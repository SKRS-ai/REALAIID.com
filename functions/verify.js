export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const vssnId = searchParams.get('id');

    if (!vssnId) {
        return new Response(JSON.stringify({ error: "No ID provided" }), { status: 400 });
    }

    try {
        // This looks up the ID in your Cloudflare KV database
        const record = await context.env.VSSN_REGISTRY.get(vssnId);

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
