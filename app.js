const app = document.querySelector("#app");

let page = "home";

let dark = localStorage.dark === "1";

let fav = new Set(
  JSON.parse(localStorage.fav || "[]")
);

document.body.classList.toggle("dark", dark);


async function api(path) {
  try {
    const response = await fetch("/api/" + path);

    if (!response.ok) {
      throw new Error("API Error");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    return null;
  }
}


function getFixtures(data) {
  return data?.response || data?.fixtures || [];
}


function formatMatch(match) {
  const fixture = match.fixture || {};
  const teams = match.teams || {};
  const goals = match.goals || {};

  const id = fixture.id || match.id;

  const home =
    teams.home?.name ||
    match.home ||
    "الفريق الأول";

  const away =
    teams.away?.name ||
    match.away ||
    "الفريق الثاني";

  const homeScore =
    goals.home ?? match.homeScore ?? "-";

  const awayScore =
    goals.away ?? match.awayScore ?? "-";

  const status =
    fixture.status?.short ||
    match.status ||
    "NS";

  const timestamp = fixture.date;

  let time = "";

  if (timestamp) {
    time = new Date(timestamp).toLocaleTimeString(
      "ar",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  }

  return {
    id,
    league:
      match.league?.name ||
      match.league ||
      "كرة القدم",

    home,
    away,

    score:
      status === "NS"
        ? "-"
        : `${homeScore} - ${awayScore}`,

    time,

    status
  };
}


function card(m) {
  const id = String(m.id);

  const isFav = fav.has(id);

  const live =
    [
      "1H",
      "2H",
      "HT",
      "ET",
      "P",
      "LIVE"
    ].includes(m.status);

  return `
    <div class="card">

      <div class="row">

        <span class="badge">
          ${m.league}
        </span>

        <button
          onclick="toggleFav('${id}')"
        >
          ${isFav ? "★" : "☆"}
        </button>

      </div>

      <div class="match">

        <div class="team">
          ${m.home}
        </div>

        <div>

          <div class="${live ? "live" : ""}">
            ${
              live
                ? "مباشر"
                : m.status === "NS"
                  ? "لم تبدأ"
                  : m.status
            }
          </div>

          <div class="score">
            ${m.score}
          </div>

          <small>
            ${m.time}
          </small>

        </div>

        <div class="team">
          ${m.away}
        </div>

      </div>

    </div>
  `;
}


function toggleFav(id) {

  if (fav.has(id)) {
    fav.delete(id);
  } else {
    fav.add(id);
  }

  localStorage.fav =
    JSON.stringify([...fav]);

  render();
}


async function homePage() {

  app.innerHTML = `
    <div class="wrap">

      <div class="hero">
        <h1>⚽ كورة بلس</h1>
        <div>
          جميع مباريات كرة القدم
        </div>
      </div>

      <h2>مباريات اليوم</h2>

      <div class="loading">
        جاري تحميل المباريات...
      </div>

    </div>
  `;

  const data = await api("today");

  const matches =
    getFixtures(data).map(formatMatch);

  if (!matches.length) {

    app.innerHTML += `
      <div class="empty">
        لا توجد مباريات اليوم أو تعذر الاتصال بالخدمة.
      </div>
    `;

    return;
  }

  app.innerHTML = `
    <div class="wrap">

      <div class="hero">
        <h1>⚽ كورة بلس</h1>
        <div>
          جميع مباريات كرة القدم
        </div>
      </div>

      <h2>
        مباريات اليوم
      </h2>

      ${matches.map(card).join("")}

    </div>
  `;
}


async function livePage() {

  app.innerHTML = `
    <div class="wrap">

      <div class="hero">
        <h1>🔴 مباشر</h1>
        <div>
          المباريات الجارية الآن
        </div>
      </div>

      <div class="loading">
        جاري البحث عن المباريات المباشرة...
      </div>

    </div>
  `;

  const data = await api("live");

  const matches =
    getFixtures(data).map(formatMatch);

  app.innerHTML = `
    <div class="wrap">

      <div class="hero">
        <h1>🔴 مباشر</h1>
        <div>
          النتائج لحظة بلحظة
        </div>
      </div>

      ${
        matches.length
          ? matches.map(card).join("")
          : `
            <div class="empty">
              لا توجد مباريات مباشرة الآن.
            </div>
          `
      }

    </div>
  `;
}


function leaguesPage() {

  const leagues = [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "UEFA Champions League",
    "Saudi Pro League",
    "Egyptian Premier League",
    "Sudanese Premier League"
  ];

  app.innerHTML = `
    <div class="wrap">

      <div class="hero">
        <h1>🏆 البطولات</h1>
      </div>

      <div class="grid">

        ${leagues.map(league => `
          <div class="card">
            <b>${league}</b>
          </div>
        `).join("")}

      </div>

    </div>
  `;
}


async function favPage() {

  const data = await api("today");

  const matches =
    getFixtures(data)
      .map(formatMatch)
      .filter(m =>
        fav.has(String(m.id))
      );

  app.innerHTML = `
    <div class="wrap">

      <div class="hero">
        <h1>⭐ المفضلة</h1>
      </div>

      ${
        matches.length
          ? matches.map(card).join("")
          : `
            <div class="empty">
              لا توجد مباريات مفضلة.
            </div>
          `
      }

    </div>
  `;
}


async function render() {

  document
    .querySelectorAll("nav button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === page
      );

    });

  if (page === "home") {
    await homePage();
  }

  if (page === "live") {
    await livePage();
  }

  if (page === "leagues") {
    leaguesPage();
  }

  if (page === "fav") {
    await favPage();
  }
}


document
  .querySelectorAll("nav button")
  .forEach(button => {

    button.onclick = () => {

      page = button.dataset.page;

      render();

    };

  });


document
  .querySelector("#theme")
  .onclick = () => {

    dark = !dark;

    localStorage.dark =
      dark ? "1" : "0";

    document.body.classList.toggle(
      "dark",
      dark
    );
  };


document
  .querySelector("#refresh")
  .onclick = render;


render();


setInterval(() => {

  if (page === "live") {
    render();
  }

}, 30000);
