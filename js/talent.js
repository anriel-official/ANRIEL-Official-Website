/*
  AN:RIEL
  TALENT
*/

// ==================================================
// ELEMENTS
// ==================================================

const talentGenerationList =
  document.getElementById("talentGenerationList");

// ==================================================
// HTML ESCAPE
// ==================================================

function escapeTalentHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ==================================================
// GENERATION ENGLISH LABEL
// ==================================================

function getGenerationEnglishLabel(generationName) {
  const match = String(generationName).match(/^(\d+)期生$/);
  if (!match) return escapeTalentHtml(generationName);

  const number = Number(match[1]);
  let suffix = "th";
  if (number % 100 < 11 || number % 100 > 13) {
    if (number % 10 === 1) suffix = "st";
    else if (number % 10 === 2) suffix = "nd";
    else if (number % 10 === 3) suffix = "rd";
  }
  return `${number}${suffix} GENERATION`;
}

// ==================================================
// TALENT CARD
// ==================================================

function createTalentCard(talent) {
  const name = escapeTalentHtml(talent.name);
  const slug = encodeURIComponent(talent.slug);
  const imageUrl = talent.list_image_url
    ? escapeTalentHtml(talent.list_image_url)
    : "";

  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" alt="${name}" loading="lazy">`
    : `<div class="talent-image-placeholder"><span>NO IMAGE</span></div>`;

  return `
    <a
      href="talent/profile.html?slug=${slug}"
      class="talent-list-card"
      aria-label="${name}のプロフィールを見る"
    >
      <div class="talent-list-image">
        ${imageHtml}
      </div>
      <p class="talent-list-name">${name}</p>
    </a>
  `;
}

// ==================================================
// GENERATION SECTION
// ==================================================

function createGenerationSection(generation, talents) {
  const generationName = escapeTalentHtml(generation.name);
  const englishLabel = getGenerationEnglishLabel(generation.name);

  if (talents.length === 0) {
    return `
      <section class="talent-generation-section coming-generation">
        <div class="talent-list-inner">
          <div class="generation-heading">
            <p class="generation-number">${englishLabel}</p>
            <h2 class="generation-title">${generationName}</h2>
          </div>
          <div class="generation-coming-soon"><p>COMING SOON</p></div>
        </div>
      </section>
    `;
  }

  const cards = talents.map(createTalentCard).join("");
  return `
    <section class="talent-generation-section">
      <div class="talent-list-inner">
        <div class="generation-heading">
          <p class="generation-number">${englishLabel}</p>
          <h2 class="generation-title">${generationName}</h2>
        </div>
        <div class="talent-list" style="--generation-columns: ${Math.min(5, Math.max(1, Number(generation.columns_count) || 3))}">${cards}</div>
      </div>
    </section>
  `;
}

// ==================================================
// LOAD TALENTS
// ==================================================

async function loadTalentPage() {
  if (!talentGenerationList) return;

  talentGenerationList.innerHTML = `
    <div class="talent-loading"><p>LOADING...</p></div>
  `;

  try {
    const { data: generations, error: generationError } =
      await supabaseClient
        .from("talent_generations")
        .select("id,name,sort_order,columns_count")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    if (generationError) throw generationError;

    const { data: talents, error: talentError } =
      await supabaseClient
        .from("talents")
        .select(`
          id,
          name,
          name_en,
          slug,
          generation_id,
          list_image_url,
          main_color,
          status,
          sort_order,
          published
        `)
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("id", { ascending: true });

    if (talentError) throw talentError;

    if (!generations || generations.length === 0) {
      talentGenerationList.innerHTML = `
        <section class="talent-generation-section">
          <div class="talent-list-inner">
            <div class="generation-coming-soon"><p>COMING SOON</p></div>
          </div>
        </section>
      `;
      return;
    }

    const talentData = talents || [];
    const html = generations
      .map(generation => {
        const generationTalents = talentData.filter(
          talent => Number(talent.generation_id) === Number(generation.id)
        );
        return createGenerationSection(generation, generationTalents);
      })
      .join("");

    talentGenerationList.innerHTML = html;
  } catch (error) {
    console.error("TALENTページ取得エラー:", error);
    talentGenerationList.innerHTML = `
      <section class="talent-generation-section">
        <div class="talent-list-inner">
          <div class="generation-coming-soon">
            <p>TALENT情報を読み込めませんでした。</p>
          </div>
        </div>
      </section>
    `;
  }
}

// ==================================================
// INITIALIZE
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
  loadTalentPage();
});
