/* =========================================================
   AN:RIEL
   GOODS PUBLIC
========================================================= */


/* =========================================================
   STATE
========================================================= */

let publicGoodsItems = [];

let publicGoodsEvents = [];
let publicGoodsTalents = [];
let publicGoodsCategories = [];


/* =========================================================
   ELEMENTS
========================================================= */

const goodsList =
  document.getElementById("goodsList");

const goodsResultCount =
  document.getElementById("goodsResultCount");

const goodsEmpty =
  document.getElementById("goodsEmpty");

const goodsError =
  document.getElementById("goodsError");


/* =========================================================
   FILTER ELEMENTS
========================================================= */

const goodsEventFilter =
  document.getElementById("goodsEventFilter");

const goodsTalentFilter =
  document.getElementById("goodsTalentFilter");

const goodsCategoryFilter =
  document.getElementById("goodsCategoryFilter");

const goodsFilterReset =
  document.getElementById("goodsFilterReset");

const goodsEmptyReset =
  document.getElementById("goodsEmptyReset");

const goodsReloadButton =
  document.getElementById("goodsReloadButton");


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeGoodsHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   PRICE
========================================================= */

function formatGoodsPrice(price) {

  if (
    price === null ||
    price === undefined ||
    price === ""
  ) {
    return "";
  }

  const number =
    Number(price);

  if (Number.isNaN(number)) {
    return "";
  }

  return `¥${number.toLocaleString("ja-JP")}`;
}


/* =========================================================
   URL CHECK
========================================================= */

function getSafeExternalUrl(url) {

  if (!url) {
    return "";
  }

  try {

    const parsedUrl =
      new URL(url);

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      return "";
    }

    return parsedUrl.href;

  } catch {

    return "";

  }
}


/* =========================================================
   SHOW LOADING
========================================================= */

function showGoodsLoading() {

  if (goodsError) {
    goodsError.hidden = true;
  }

  if (goodsEmpty) {
    goodsEmpty.hidden = true;
  }

  if (goodsResultCount) {
    goodsResultCount.textContent =
      "読み込み中...";
  }

  if (goodsList) {

    goodsList.innerHTML = `
      <div class="goods-loading">

        <p>
          GOODSを読み込んでいます...
        </p>

      </div>
    `;
  }
}


/* =========================================================
   SHOW ERROR
========================================================= */

function showGoodsError() {

  if (goodsList) {
    goodsList.innerHTML = "";
  }

  if (goodsEmpty) {
    goodsEmpty.hidden = true;
  }

  if (goodsError) {
    goodsError.hidden = false;
  }

  if (goodsResultCount) {
    goodsResultCount.textContent =
      "読み込みに失敗しました";
  }
}


/* =========================================================
   LOAD EVENT CATEGORIES
========================================================= */

async function loadPublicGoodsEvents() {

  const {
    data,
    error
  } = await supabaseClient
    .from("goods_events")
    .select(
      "id,name,sort_order,created_at"
    )
    .order(
      "sort_order",
      {
        ascending: true
      }
    )
    .order(
      "created_at",
      {
        ascending: true
      }
    );

  if (error) {

    console.error(
      "PUBLIC GOODS EVENT ERROR:",
      error
    );

    throw error;
  }

  publicGoodsEvents =
    data || [];
}


/* =========================================================
   LOAD TALENTS
   TALENT管理の talents テーブルを使用
========================================================= */

async function loadPublicGoodsTalents() {

  const {
    data,
    error
  } = await supabaseClient
    .from("talents")
    .select(
      "id,name,published,sort_order"
    )
    .eq(
      "published",
      true
    )
    .order(
      "sort_order",
      {
        ascending: true
      }
    )
    .order(
      "id",
      {
        ascending: true
      }
    );

  if (error) {

    console.error(
      "PUBLIC GOODS TALENT ERROR:",
      error
    );

    throw error;
  }

  publicGoodsTalents =
    data || [];
}


/* =========================================================
   LOAD GOODS CATEGORIES
========================================================= */

async function loadPublicGoodsCategories() {

  const {
    data,
    error
  } = await supabaseClient
    .from("goods_categories")
    .select(
      "id,name,sort_order,created_at"
    )
    .order(
      "sort_order",
      {
        ascending: true
      }
    )
    .order(
      "created_at",
      {
        ascending: true
      }
    );

  if (error) {

    console.error(
      "PUBLIC GOODS CATEGORY ERROR:",
      error
    );

    throw error;
  }

  publicGoodsCategories =
    data || [];
}


/* =========================================================
   LOAD GOODS
========================================================= */

async function loadPublicGoods() {

  const {
    data,
    error
  } = await supabaseClient
    .from("goods")
    .select(`
      id,
      name,
      price,
      description,
      image_url,
      external_url,
      published,
      sort_order,
      created_at,

      goods_event_links (
        event_id,
        goods_events (
          id,
          name
        )
      ),

      goods_talent_links (
        talent_id,
        talents (
          id,
          name
        )
      ),

      goods_category_links (
        category_id,
        goods_categories (
          id,
          name
        )
      )
    `)
    .eq(
      "published",
      true
    )
    .order(
      "sort_order",
      {
        ascending: true
      }
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (error) {

    console.error(
      "PUBLIC GOODS LOAD ERROR:",
      error
    );

    throw error;
  }

  publicGoodsItems =
    data || [];
}


/* =========================================================
   RENDER EVENT FILTER
========================================================= */

function renderGoodsEventFilter() {

  if (!goodsEventFilter) {
    return;
  }

  const currentValue =
    goodsEventFilter.value;

  goodsEventFilter.innerHTML = `
    <option value="">
      ALL
    </option>
  `;

  publicGoodsEvents.forEach(
    (event) => {

      const option =
        document.createElement("option");

      option.value =
        String(event.id);

      option.textContent =
        event.name;

      goodsEventFilter.appendChild(
        option
      );
    }
  );

  if (
    currentValue &&
    publicGoodsEvents.some(
      (event) =>
        String(event.id) ===
        String(currentValue)
    )
  ) {

    goodsEventFilter.value =
      currentValue;
  }
}


/* =========================================================
   RENDER TALENT FILTER
========================================================= */

function renderGoodsTalentFilter() {

  if (!goodsTalentFilter) {
    return;
  }

  const currentValue =
    goodsTalentFilter.value;

  goodsTalentFilter.innerHTML = `
    <option value="">
      ALL
    </option>
  `;

  publicGoodsTalents.forEach(
    (talent) => {

      const option =
        document.createElement("option");

      option.value =
        String(talent.id);

      option.textContent =
        talent.name;

      goodsTalentFilter.appendChild(
        option
      );
    }
  );

  if (
    currentValue &&
    publicGoodsTalents.some(
      (talent) =>
        String(talent.id) ===
        String(currentValue)
    )
  ) {

    goodsTalentFilter.value =
      currentValue;
  }
}


/* =========================================================
   RENDER CATEGORY FILTER
========================================================= */

function renderGoodsCategoryFilter() {

  if (!goodsCategoryFilter) {
    return;
  }

  const currentValue =
    goodsCategoryFilter.value;

  goodsCategoryFilter.innerHTML = `
    <option value="">
      ALL
    </option>
  `;

  publicGoodsCategories.forEach(
    (category) => {

      const option =
        document.createElement("option");

      option.value =
        String(category.id);

      option.textContent =
        category.name;

      goodsCategoryFilter.appendChild(
        option
      );
    }
  );

  if (
    currentValue &&
    publicGoodsCategories.some(
      (category) =>
        String(category.id) ===
        String(currentValue)
    )
  ) {

    goodsCategoryFilter.value =
      currentValue;
  }
}


/* =========================================================
   RENDER ALL FILTERS
========================================================= */

function renderGoodsFilters() {

  renderGoodsEventFilter();
  renderGoodsTalentFilter();
  renderGoodsCategoryFilter();
}


/* =========================================================
   GET SELECTED FILTER VALUES
========================================================= */

function getGoodsFilterValues() {

  return {

    eventId:
      goodsEventFilter?.value || "",

    talentId:
      goodsTalentFilter?.value || "",

    categoryId:
      goodsCategoryFilter?.value || ""

  };
}


/* =========================================================
   FILTER GOODS
========================================================= */

function getFilteredGoods() {

  const {
    eventId,
    talentId,
    categoryId
  } = getGoodsFilterValues();

  return publicGoodsItems.filter(
    (item) => {

      /*
       * EVENT
       */

      if (eventId) {

        const matched =
          (
            item.goods_event_links ||
            []
          )
            .some(
              (link) =>
                String(link.event_id) ===
                String(eventId)
            );

        if (!matched) {
          return false;
        }
      }


      /*
       * TALENT
       */

      if (talentId) {

        const matched =
          (
            item.goods_talent_links ||
            []
          )
            .some(
              (link) =>
                String(link.talent_id) ===
                String(talentId)
            );

        if (!matched) {
          return false;
        }
      }


      /*
       * CATEGORY
       */

      if (categoryId) {

        const matched =
          (
            item.goods_category_links ||
            []
          )
            .some(
              (link) =>
                String(link.category_id) ===
                String(categoryId)
            );

        if (!matched) {
          return false;
        }
      }

      return true;
    }
  );
}


/* =========================================================
   CREATE META BADGES
========================================================= */

function createGoodsMetaHTML(item) {

  const categoryNames =
    (
      item.goods_category_links ||
      []
    )
      .map(
        (link) =>
          link.goods_categories?.name
      )
      .filter(Boolean);

  const eventNames =
    (
      item.goods_event_links ||
      []
    )
      .map(
        (link) =>
          link.goods_events?.name
      )
      .filter(Boolean);

  const talentNames =
    (
      item.goods_talent_links ||
      []
    )
      .map(
        (link) =>
          link.talents?.name
      )
      .filter(Boolean);

  let html = "";


  /*
   * CATEGORY
   */

  categoryNames.forEach(
    (name) => {

      html += `
        <span class="goods-card-category">
          ${escapeGoodsHTML(name)}
        </span>
      `;
    }
  );


  /*
   * EVENT
   */

  eventNames.forEach(
    (name) => {

      html += `
        <span class="goods-card-event">
          ${escapeGoodsHTML(name)}
        </span>
      `;
    }
  );


  /*
   * TALENT
   */

  talentNames.forEach(
    (name) => {

      html += `
        <span class="goods-card-talent">
          ${escapeGoodsHTML(name)}
        </span>
      `;
    }
  );

  return html;
}


/* =========================================================
   CREATE IMAGE
========================================================= */

function createGoodsImageHTML(item) {

  if (!item.image_url) {

    return `
      <div class="goods-card-image">

        <div class="goods-card-no-image">
          NO IMAGE
        </div>

      </div>
    `;
  }

  return `
    <div class="goods-card-image">

      <img
        src="${escapeGoodsHTML(item.image_url)}"
        alt="${escapeGoodsHTML(item.name)}"
        loading="lazy"
      >

    </div>
  `;
}


/* =========================================================
   CREATE CARD
========================================================= */

function createGoodsCardHTML(item) {

  const safeExternalUrl =
    getSafeExternalUrl(
      item.external_url
    );

  const imageHTML =
    createGoodsImageHTML(item);

  const metaHTML =
    createGoodsMetaHTML(item);

  const priceHTML =
    item.price !== null &&
    item.price !== undefined
      ? `
        <p class="goods-card-price">
          ${escapeGoodsHTML(
            formatGoodsPrice(item.price)
          )}
        </p>
      `
      : "";

  const descriptionHTML =
    item.description
      ? `
        <p class="goods-card-description">
          ${escapeGoodsHTML(
            item.description
          )}
        </p>
      `
      : "";


  /*
   * 販売URLあり
   */

  if (safeExternalUrl) {

    return `
      <article
        class="goods-card"
        data-goods-id="${item.id}"
      >

        <a
          href="${escapeGoodsHTML(safeExternalUrl)}"
          target="_blank"
          rel="noopener noreferrer"
          class="goods-card-image-link"
          aria-label="${escapeGoodsHTML(item.name)}の販売ページを開く"
        >

          ${imageHTML}

          <span
            class="goods-card-external"
            aria-hidden="true"
          >
            ↗
          </span>

        </a>


        <div class="goods-card-content">

          ${
            metaHTML
              ? `
                <div class="goods-card-meta">
                  ${metaHTML}
                </div>
              `
              : ""
          }

          <h2 class="goods-card-title">
            ${escapeGoodsHTML(item.name)}
          </h2>

          ${priceHTML}

          ${descriptionHTML}

          <a
            href="${escapeGoodsHTML(safeExternalUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="goods-card-link"
          >
            販売ページを見る
          </a>

        </div>

      </article>
    `;
  }


  /*
   * URLなし
   */

  return `
    <article
      class="goods-card"
      data-goods-id="${item.id}"
    >

      <div class="goods-card-image-link">

        ${imageHTML}

      </div>


      <div class="goods-card-content">

        ${
          metaHTML
            ? `
              <div class="goods-card-meta">
                ${metaHTML}
              </div>
            `
            : ""
        }

        <h2 class="goods-card-title">
          ${escapeGoodsHTML(item.name)}
        </h2>

        ${priceHTML}

        ${descriptionHTML}

      </div>

    </article>
  `;
}


/* =========================================================
   RENDER GOODS
========================================================= */

function renderPublicGoods() {

  if (!goodsList) {
    return;
  }

  if (goodsError) {
    goodsError.hidden = true;
  }

  const filteredGoods =
    getFilteredGoods();


  /*
   * RESULT COUNT
   */

  if (goodsResultCount) {

    goodsResultCount.textContent =
      `${filteredGoods.length} ITEMS`;
  }


  /*
   * EMPTY
   */

  if (!filteredGoods.length) {

    goodsList.innerHTML = "";

    if (goodsEmpty) {
      goodsEmpty.hidden = false;
    }

    return;
  }


  /*
   * SHOW
   */

  if (goodsEmpty) {
    goodsEmpty.hidden = true;
  }

  goodsList.innerHTML =
    filteredGoods
      .map(createGoodsCardHTML)
      .join("");
}


/* =========================================================
   RESET FILTERS
========================================================= */

function resetGoodsFilters() {

  if (goodsEventFilter) {
    goodsEventFilter.value = "";
  }

  if (goodsTalentFilter) {
    goodsTalentFilter.value = "";
  }

  if (goodsCategoryFilter) {
    goodsCategoryFilter.value = "";
  }

  renderPublicGoods();
}


/* =========================================================
   LOAD EVERYTHING
========================================================= */

async function initializePublicGoods() {

  showGoodsLoading();

  try {

    /*
     * EVENT・TALENT・カテゴリー・商品を並行取得
     */

    await Promise.all([

      loadPublicGoodsEvents(),

      loadPublicGoodsTalents(),

      loadPublicGoodsCategories(),

      loadPublicGoods()

    ]);


    /*
     * FILTER
     */

    renderGoodsFilters();


    /*
     * GOODS
     */

    renderPublicGoods();

  } catch (error) {

    console.error(
      "GOODS INITIALIZE ERROR:",
      error
    );

    showGoodsError();
  }
}


/* =========================================================
   FILTER EVENTS
========================================================= */

goodsEventFilter
  ?.addEventListener(
    "change",
    renderPublicGoods
  );


goodsTalentFilter
  ?.addEventListener(
    "change",
    renderPublicGoods
  );


goodsCategoryFilter
  ?.addEventListener(
    "change",
    renderPublicGoods
  );


/* =========================================================
   RESET EVENTS
========================================================= */

goodsFilterReset
  ?.addEventListener(
    "click",
    resetGoodsFilters
  );


goodsEmptyReset
  ?.addEventListener(
    "click",
    resetGoodsFilters
  );


/* =========================================================
   RELOAD
========================================================= */

goodsReloadButton
  ?.addEventListener(
    "click",
    initializePublicGoods
  );


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializePublicGoods
);