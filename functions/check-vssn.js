export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 1. Get the ID from the website's search bar
    const { vssn } = await request.json();

    // 2. Reach into the "Philadelphia Node" (The KV Binding)
    // This MUST match the 'Variable name' in your Cloudflare settings
    const data = await env.BUREAU_MAINFRAME.get(vssn);

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
