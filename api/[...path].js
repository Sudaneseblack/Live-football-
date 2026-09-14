export default async function handler(req, res) {
  const key = process.env.API_FOOTBALL_KEY;

  if (!key) {
    return res.status(500).json({
      error: "API_FOOTBALL_KEY غير موجود"
    });
  }

  try {
    const path = req.query.path;

    let endpoint = Array.isArray(path) ? path.join("/") : path || "";

    const params = new URLSearchParams();

    for (const [name, value] of Object.entries(req.query)) {
      if (name !== "path" && value !== undefined) {
        params.set(name, value);
      }
    }

    if (endpoint === "today") {
      endpoint = "fixtures";
      params.set(
        "date",
        new Date().toISOString().slice(0, 10)
      );
    }

    if (endpoint === "live") {
      endpoint = "fixtures";
      params.set("live", "all");
    }

    const url =
      "https://v3.football.api-sports.io/" +
      endpoint +
      "?" +
      params.toString();

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": key
      }
    });

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "حدث خطأ في الاتصال بـ API-Football"
    });
  }
}
