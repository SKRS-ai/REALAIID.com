export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 1. Parse the incoming search ID or test data
    const input = await request.json();
    const searchId = input.anchor_id || input.searchId;

    // 2. Query the BUREAU_MAINFRAME KV store
    // This uses the binding you just created in the dashboard
    const identityData = await env.BUREAU_MAINFRAME.get(searchId);

    if (!identityData) {
      // If it's a test write, let's save the data instead
      if (searchId === "TEST-NODE-PHL-001") {
        await env.BUREAU_MAINFRAME.put(searchId, JSON.stringify(input));
        return new Response(JSON.stringify({ success: true, message: "Test Anchor Recorded" }), {
          headers: { "Content-Type": "application/json" }
        });
      }
      
      return new Response(JSON.stringify({ error: "Identity Not Found" }), { status: 404 });
    }

    // 3. Return the identity results to the dashboard
    return new Response(identityData, {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Mainframe Connection Failed", details: err.message }), { status: 500 });
  }
}
