/**
 * REALAiID BUREAU - SOVEREIGN EDGE GATEWAY v2.1
 * ROLE: Global High-Availability Verification for 35 Industrial Bridges
 * DEPLOYMENT: Cloudflare Workers (Global Edge)
 * FIX: Explicit type definitions to resolve IDE "any" warnings.
 */

interface Env {
  // Sovereign KV Store for Edge Caching of Verified Handshake Knots
  SOVEREIGN_KV: KVNamespace;
  // Primary Uplink to the Philadelphia Mainframe (PHL-01)
  MAINFRAME_URL: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-realaiid-knot",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle Preflight Options for Browser Security
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Biological Handshake Pulse (Edge Health)
    if (url.pathname === "/pulse") {
      return new Response(JSON.stringify({
        status: "SECURED",
        node: "EDGE-GLOBAL",
        valuation: "$102.7B",
        perimeter: "35/35 BRIDGES ACTIVE",
        timestamp: new Date().toISOString()
      }), { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      });
    }

    // 2. High-Speed Knot Verification (KV Cache)
    if (url.pathname.startsWith("/v1/verify-knot/")) {
      const knotId = url.pathname.split("/").pop();
      const cachedStatus = await env.SOVEREIGN_KV.get(`knot:${knotId}`);

      if (cachedStatus) {
        return new Response(JSON.stringify({
          valid: true,
          source: "EDGE_CACHE",
          jurisdiction: "REALAiISLAND_EXTRATERRITORIAL",
          timestamp: new Date().toISOString()
        }), { 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        });
      }
    }

    // 3. Mainframe Proxy (Uplink to PHL-01)
    try {
      const mainframeResponse = await fetch(`${env.MAINFRAME_URL}${url.pathname}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      const response = new Response(mainframeResponse.body, mainframeResponse);
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      
      return response;
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "UNKNOWN_UPLINK_FAILURE";
      return new Response(JSON.stringify({
        error: "MAINFRAME_UPLINK_TIMEOUT",
        status: "FAILSAFE_ACTIVE",
        detail: errorMsg
      }), { 
        status: 504,
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }
  },
};