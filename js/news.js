// ==================================================
// AN:RIEL
// NEWS
// ==================================================


// ==================================================
// GET PUBLISHED NEWS
// ==================================================

async function getPublishedNews(
  limit = null,
  category = null
) {

  let query =
    supabaseClient
      .from("news")
      .select("*")
      .eq(
        "published",
        true
      )
      .order(
        "published_at",
        {
          ascending: false
        }
      );


  if (
    category &&
    category !== "ALL"
  ) {

    query =
      query.eq(
        "category",
        category
      );

  }


  if (
    Number.isInteger(limit) &&
    limit > 0
  ) {

    query =
      query.limit(limit);

  }


  const {
    data,
    error
  } =
    await query;


  if (error) {

    console.error(
      "NEWS取得エラー:",
      error
    );

    return [];

  }


  return data || [];

}


// ==================================================
// GET NEWS PAGE
// ==================================================

async function getPublishedNewsPage(
  page = 1,
  perPage = 10,
  category = null
) {

  const safePage =
    Math.max(
      1,
      Number(page) || 1
    );


  const safePerPage =
    Math.max(
      1,
      Number(perPage) || 10
    );


  const from =
    (safePage - 1) *
    safePerPage;


  const to =
    from +
    safePerPage -
    1;


  let query =
    supabaseClient
      .from("news")
      .select(
        "*",
        {
          count: "exact"
        }
      )
      .eq(
        "published",
        true
      );


  if (
    category &&
    category !== "ALL"
  ) {

    query =
      query.eq(
        "category",
        category
      );

  }


  const {
    data,
    error,
    count
  } =
    await query
      .order(
        "published_at",
        {
          ascending: false
        }
      )
      .range(
        from,
        to
      );


  if (error) {

    console.error(
      "NEWS取得エラー:",
      error
    );


    return {
      data: [],
      count: 0
    };

  }


  return {
    data:
      data || [],

    count:
      count || 0
  };

}


// ==================================================
// GET NEWS CATEGORIES
// ==================================================

async function getNewsCategories() {

  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "news_categories"
      )
      .select(
        "id, name, sort_order"
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
      "NEWSカテゴリー取得エラー:",
      error
    );

    return [];

  }


  return data || [];

}


// ==================================================
// DATE
// ==================================================

function formatNewsDate(
  value
) {

  if (!value) {

    return "";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  return (
    `${year}.${month}.${day}`
  );

}


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHTML(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


// ==================================================
// SAFE URL
// ==================================================

function getSafeNewsImageUrl(
  value
) {

  if (!value) {

    return null;

  }


  try {

    const url =
      new URL(value);


    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {

      return null;

    }


    return url.href;

  } catch (error) {

    return null;

  }

}


// ==================================================
// CREATE NEWS ITEM
// ==================================================

function createNewsItemHTML(
  item,
  articlePath
) {

  const slug =
    encodeURIComponent(
      item.slug || ""
    );


  const href =
    `${articlePath}?slug=${slug}`;


  return `
    <a
      href="${href}"
      class="news-item"
    >

      <time class="news-date">
        ${formatNewsDate(
          item.published_at
        )}
      </time>


      <span class="news-category">
        ${escapeHTML(
          item.category || "NEWS"
        )}
      </span>


      <h3 class="news-title-text">
        ${escapeHTML(
          item.title || ""
        )}
      </h3>

    </a>
  `;

}


// ==================================================
// RENDER NEWS LIST
// ==================================================

async function renderNewsList(
  selector,
  limit = null,
  articlePath = "news/article.html"
) {

  const container =
    document.querySelector(
      selector
    );


  if (!container) {

    return;

  }


  container.innerHTML = `
    <p class="news-loading">
      読み込み中...
    </p>
  `;


  const news =
    await getPublishedNews(
      limit
    );


  if (
    !news.length
  ) {

    container.innerHTML = `
      <p class="news-empty">
        現在お知らせはありません。
      </p>
    `;

    return;

  }


  container.innerHTML =
    news
      .map(
        (item) =>
          createNewsItemHTML(
            item,
            articlePath
          )
      )
      .join("");

}


// ==================================================
// GET CURRENT CATEGORY
// ==================================================

function getCurrentNewsCategory(
  availableCategories
) {

  const params =
    new URLSearchParams(
      window.location.search
    );


  const requestedCategory =
    params.get(
      "category"
    );


  if (!requestedCategory) {

    return "ALL";

  }


  const exists =
    availableCategories.some(
      (category) =>
        category.name ===
        requestedCategory
    );


  if (!exists) {

    return "ALL";

  }


  return requestedCategory;

}


// ==================================================
// CREATE CATEGORY FILTER
// ==================================================

function createNewsCategoryFilter(
  categories,
  currentCategory
) {

  const allButton = `
    <button
      type="button"
      class="news-category-button ${
        currentCategory === "ALL"
          ? "active"
          : ""
      }"
      data-news-category="ALL"
    >
      ALL
    </button>
  `;


  const categoryButtons =
    categories
      .map(
        (category) => {

          const active =
            currentCategory ===
            category.name;


          return `
            <button
              type="button"
              class="news-category-button ${
                active
                  ? "active"
                  : ""
              }"
              data-news-category="${escapeHTML(
                category.name
              )}"
            >
              ${escapeHTML(
                category.name
              )}
            </button>
          `;

        }
      )
      .join("");


  return `
    <div
      class="news-categories"
      aria-label="NEWSカテゴリー"
    >
      ${allButton}
      ${categoryButtons}
    </div>
  `;

}


// ==================================================
// CATEGORY BUTTON EVENTS
// ==================================================

function setupNewsCategoryButtons(
  container
) {

  const buttons =
    container.querySelectorAll(
      "[data-news-category]"
    );


  buttons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const category =
            button.dataset
              .newsCategory;


          const url =
            new URL(
              window.location.href
            );


          /*
            カテゴリー変更時は
            ページ番号を1ページ目に戻す
          */

          url.searchParams.delete(
            "page"
          );


          if (
            !category ||
            category === "ALL"
          ) {

            url.searchParams.delete(
              "category"
            );

          } else {

            url.searchParams.set(
              "category",
              category
            );

          }


          window.location.href =
            url.pathname +
            url.search +
            url.hash;

        }
      );

    }
  );

}


// ==================================================
// RENDER PAGINATED NEWS LIST
// ==================================================

async function renderPaginatedNewsList(
  selector,
  articlePath = "news/article.html",
  perPage = 10
) {

  const container =
    document.querySelector(
      selector
    );


  if (!container) {

    return;

  }


  container.innerHTML = `
    <p class="news-loading">
      NEWSを読み込んでいます...
    </p>
  `;


  // ------------------------------------------
  // CATEGORIES
  // ------------------------------------------

  const categories =
    await getNewsCategories();


  const currentCategory =
    getCurrentNewsCategory(
      categories
    );


  // ------------------------------------------
  // PAGE
  // ------------------------------------------

  const params =
    new URLSearchParams(
      window.location.search
    );


  const requestedPage =
    Number.parseInt(
      params.get("page"),
      10
    );


  let currentPage =
    Number.isInteger(
      requestedPage
    ) &&
    requestedPage >= 1
      ? requestedPage
      : 1;


  // ------------------------------------------
  // LOAD NEWS
  // ------------------------------------------

  let result =
    await getPublishedNewsPage(
      currentPage,
      perPage,
      currentCategory
    );


  const totalCount =
    result.count;


  let totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
        perPage
      )
    );


  // ------------------------------------------
  // INVALID PAGE
  // ------------------------------------------

  if (
    totalCount > 0 &&
    currentPage > totalPages
  ) {

    currentPage =
      totalPages;


    result =
      await getPublishedNewsPage(
        currentPage,
        perPage,
        currentCategory
      );


    const correctedUrl =
      new URL(
        window.location.href
      );


    if (
      currentPage === 1
    ) {

      correctedUrl.searchParams.delete(
        "page"
      );

    } else {

      correctedUrl.searchParams.set(
        "page",
        String(currentPage)
      );

    }


    window.history.replaceState(
      {},
      "",
      correctedUrl
    );

  }


  // ------------------------------------------
  // CATEGORY FILTER HTML
  // ------------------------------------------

  const categoryHTML =
    createNewsCategoryFilter(
      categories,
      currentCategory
    );


  // ------------------------------------------
  // EMPTY
  // ------------------------------------------

  if (
    !result.data.length
  ) {

    container.innerHTML = `
      ${categoryHTML}

      <p class="news-empty">
        ${
          currentCategory === "ALL"
            ? "現在お知らせはありません。"
            : "このカテゴリーのお知らせはありません。"
        }
      </p>
    `;


    setupNewsCategoryButtons(
      container
    );


    return;

  }


  // ------------------------------------------
  // NEWS HTML
  // ------------------------------------------

  const newsHTML =
    result.data
      .map(
        (item) =>
          createNewsItemHTML(
            item,
            articlePath
          )
      )
      .join("");


  // ------------------------------------------
  // PAGINATION
  // ------------------------------------------

  let paginationHTML =
    "";


  if (
    totalPages > 1
  ) {

    paginationHTML =
      createNewsPagination(
        currentPage,
        totalPages,
        currentCategory
      );

  }


  // ------------------------------------------
  // RENDER
  // ------------------------------------------

  container.innerHTML = `
    ${categoryHTML}

    <div class="news-items">
      ${newsHTML}
    </div>

    ${paginationHTML}
  `;


  setupNewsCategoryButtons(
    container
  );

}


// ==================================================
// CREATE PAGINATION
// ==================================================

function createNewsPagination(
  currentPage,
  totalPages,
  currentCategory = "ALL"
) {

  const pages =
    getPaginationPages(
      currentPage,
      totalPages
    );


  const prevDisabled =
    currentPage <= 1;


  const nextDisabled =
    currentPage >= totalPages;


  // ------------------------------------------
  // PREVIOUS
  // ------------------------------------------

  const prevHTML =
    prevDisabled

      ? `
        <span
          class="
            news-pagination-arrow
            disabled
          "
        >
          ← PREV
        </span>
      `

      : `
        <a
          href="${createNewsPageUrl(
            currentPage - 1,
            currentCategory
          )}"
          class="news-pagination-arrow"
        >
          ← PREV
        </a>
      `;


  // ------------------------------------------
  // NEXT
  // ------------------------------------------

  const nextHTML =
    nextDisabled

      ? `
        <span
          class="
            news-pagination-arrow
            disabled
          "
        >
          NEXT →
        </span>
      `

      : `
        <a
          href="${createNewsPageUrl(
            currentPage + 1,
            currentCategory
          )}"
          class="news-pagination-arrow"
        >
          NEXT →
        </a>
      `;


  // ------------------------------------------
  // PAGE NUMBERS
  // ------------------------------------------

  const numbersHTML =
    pages
      .map(
        (page) => {

          if (
            page === "..."
          ) {

            return `
              <span class="news-pagination-dots">
                …
              </span>
            `;

          }


          if (
            page === currentPage
          ) {

            return `
              <span
                class="
                  news-pagination-number
                  active
                "
              >
                ${page}
              </span>
            `;

          }


          return `
            <a
              href="${createNewsPageUrl(
                page,
                currentCategory
              )}"
              class="news-pagination-number"
            >
              ${page}
            </a>
          `;

        }
      )
      .join("");


  return `
    <nav
      class="news-pagination"
      aria-label="NEWSページ送り"
    >

      ${prevHTML}

      <div class="news-pagination-numbers">
        ${numbersHTML}
      </div>

      ${nextHTML}

    </nav>
  `;

}


// ==================================================
// PAGINATION PAGE NUMBERS
// ==================================================

function getPaginationPages(
  currentPage,
  totalPages
) {

  if (
    totalPages <= 7
  ) {

    return Array.from(
      {
        length:
          totalPages
      },
      (_, index) =>
        index + 1
    );

  }


  if (
    currentPage <= 4
  ) {

    return [
      1,
      2,
      3,
      4,
      5,
      "...",
      totalPages
    ];

  }


  if (
    currentPage >=
    totalPages - 3
  ) {

    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ];

  }


  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages
  ];

}


// ==================================================
// CREATE PAGE URL
// ==================================================

function createNewsPageUrl(
  page,
  category = "ALL"
) {

  const url =
    new URL(
      window.location.href
    );


  // ------------------------------------------
  // PAGE
  // ------------------------------------------

  if (
    page <= 1
  ) {

    url.searchParams.delete(
      "page"
    );

  } else {

    url.searchParams.set(
      "page",
      String(page)
    );

  }


  // ------------------------------------------
  // CATEGORY
  // ------------------------------------------

  if (
    !category ||
    category === "ALL"
  ) {

    url.searchParams.delete(
      "category"
    );

  } else {

    url.searchParams.set(
      "category",
      category
    );

  }


  return (
    url.pathname +
    url.search +
    url.hash
  );

}


// ==================================================
// GET NEWS BY SLUG
// ==================================================

async function getNewsBySlug(
  slug
) {

  if (!slug) {

    return null;

  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from("news")
      .select("*")
      .eq(
        "slug",
        slug
      )
      .eq(
        "published",
        true
      )
      .single();


  if (error) {

    console.error(
      "NEWS記事取得エラー:",
      error
    );

    return null;

  }


  return data || null;

}


// ==================================================
// FORMAT ARTICLE BODY
// ==================================================

function formatArticleBody(
  body
) {

  if (!body) {

    return "";

  }


  /*
    [[image:https://example.com/image.webp]]

    ↑これを記事画像に変換します。

    通常の文章は必ずescapeHTMLしてから
    HTMLへ変換するので、
    NEWS本文に直接HTMLを書いても
    実行されないようにしています。
  */


  const imageRegex =
    /\[\[image:(https?:\/\/[^\]]+)\]\]/g;


  const parts = [];

  let lastIndex = 0;

  let match;


  while (
    (
      match =
        imageRegex.exec(body)
    ) !== null
  ) {

    // 画像より前の文章

    const textBefore =
      body.slice(
        lastIndex,
        match.index
      );


    if (
      textBefore
    ) {

      parts.push({
        type:
          "text",

        value:
          textBefore
      });

    }


    // 画像

    parts.push({
      type:
        "image",

      value:
        match[1]
    });


    lastIndex =
      imageRegex.lastIndex;

  }


  // 最後に残った文章

  const remainingText =
    body.slice(
      lastIndex
    );


  if (
    remainingText
  ) {

    parts.push({
      type:
        "text",

      value:
        remainingText
    });

  }


  return parts
    .map(
      (part) => {

        // ==============================
        // IMAGE
        // ==============================

        if (
          part.type === "image"
        ) {

          const safeUrl =
            getSafeNewsImageUrl(
              part.value
            );


          if (
            !safeUrl
          ) {

            return "";

          }


          return `
            <figure class="article-image">

              <img
                src="${escapeHTML(
                  safeUrl
                )}"
                alt=""
                loading="lazy"
                decoding="async"
              >

            </figure>
          `;

        }


        // ==============================
        // TEXT
        // ==============================

        const escaped =
          escapeHTML(
            part.value
          );


        /*
          空行2つ以上
          ↓
          段落として分割
        */

        const paragraphs =
          escaped
            .split(
              /\n{2,}/
            )
            .map(
              (paragraph) =>
                paragraph.trim()
            )
            .filter(Boolean);


        return paragraphs
          .map(
            (paragraph) => {

              const withBreaks =
                paragraph
                  .replace(
                    /\n/g,
                    "<br>"
                  );


              return `
                <p>
                  ${withBreaks}
                </p>
              `;

            }
          )
          .join("");

      }
    )
    .join("");

}


// ==================================================
// RENDER ARTICLE
// ==================================================

async function renderArticle() {

  const container =
    document.getElementById(
      "article"
    );


  if (!container) {

    return;

  }


  container.innerHTML = `
    <p class="news-loading">
      読み込み中...
    </p>
  `;


  const params =
    new URLSearchParams(
      window.location.search
    );


  const slug =
    params.get(
      "slug"
    );


  if (!slug) {

    container.innerHTML = `
      <div class="article-not-found">

        <p>
          記事が見つかりませんでした。
        </p>

      </div>
    `;

    return;

  }


  const article =
    await getNewsBySlug(
      slug
    );


  if (!article) {

    container.innerHTML = `
      <div class="article-not-found">

        <p>
          記事が見つかりませんでした。
        </p>

      </div>
    `;

    return;

  }


  // ブラウザタイトル

  document.title =
    `${article.title} | AN:RIEL`;


  container.innerHTML = `

    <article class="news-article">


      <!-- ARTICLE HEADER -->

      <header class="article-header">

        <div class="article-meta">

          <time class="article-date">
            ${formatNewsDate(
              article.published_at
            )}
          </time>

          <span class="article-category">
            ${escapeHTML(
              article.category ||
              "NEWS"
            )}
          </span>

        </div>


        <h1 class="article-title">
          ${escapeHTML(
            article.title ||
            ""
          )}
        </h1>

      </header>


      <!-- ARTICLE BODY -->

      <div class="article-body">

        ${formatArticleBody(
          article.body ||
          ""
        )}

      </div>


    </article>
  `;

}