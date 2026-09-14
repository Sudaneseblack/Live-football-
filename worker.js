export default {
  async fetch(request, env) {
    const API_KEY = "44ea4b8edc33abe2c42ab6318fd4651a";

    const u = new URL(request.url);
    if (!u.pathname.startsWith("/api/")) return fetch(request);

    let endpoint = u.pathname.replace("/api/", "");
    let params = new URLSearchParams(u.search);

    if (endpoint === "today") {
      params.set("date", new Date().toISOString().slice(0, 10));
      endpoint = "fixtures";
    }

    if (endpoint === "live") {
      params.set("live", "all");
      endpoint = "fixtures";
    }

    const target =
      "https://v3.football.api-sports.io/" +
      endpoint +
      "?" +
      params.toString();

    const r = await fetch(target, {
      headers: {
        "x-apisports-key": API_KEY
      }
    });

    return new Response(await r.text(), {
      status: r.status,
      headers: {
        "content-type": "application/json",
        "cache-control": "public,max-age=15"
      }
    });
  }
};
