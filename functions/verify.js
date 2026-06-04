export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. Get the Search ID from your frontend request
    const { searchId } = await request.json();

    if (!searchId) {
      return new Response(JSON.stringify({ error: "No ID provided" }), { status: 400 });
    }

    // 2. Query the BUREAU_MAINFRAME database
    // This 'env.BUREAU_MAINFRAME' name must match your Binding in Cloudflare Settings
    const identityData = await env.BUREAU_MAINFRAME.get(searchId);

    // 3. Handle a missing identity
    if (!identityData) {
      return new Response(JSON.stringify({ error: "Identity not found in Registry" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 4. Return the data to your dashboard
    return new Response(identityData, {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Mainframe Connection Error", details: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
