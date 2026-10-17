// NEWS permission state, populated by admin/news/index.html after server verification.
function newsCanEdit() { return window.ANRIEL_NEWS_ACCESS?.edit === true; }
function newsCanView() { return window.ANRIEL_NEWS_ACCESS?.view === true; }
function requireNewsEdit() { if (!newsCanEdit()) { alert("NEWS編集権限なし"); return false; } return true; }
// ==================================================

// AN:RIEL

// ADMIN

// NEWS MANAGEMENT

// ==================================================

// ==================================================

// SETTINGS

// ==================================================

const NEWS_IMAGE_BUCKET =

  "news-images";

const NEWS_IMAGE_MAX_SIZE =

  5 * 1024 * 1024;

const NEWS_IMAGE_ALLOWED_TYPES = [

  "image/jpeg",

  "image/png",

  "image/webp",

  "image/gif"

];

const NEWS_PER_PAGE = 10;

// ==================================================

// STATE

// ==================================================

let currentNewsImages = [];

let lastNewsBodySelectionStart = 0;

let lastNewsBodySelectionEnd = 0;

let currentNewsPage = 1;

let totalNewsCount = 0;

let currentEditingNewsSlug = "";

// ==================================================

// ELEMENTS

// ==================================================

const newNewsButton =

  document.getElementById(

    "newNewsButton"

  );

const newsFormArea =

  document.getElementById(

    "newsFormArea"

  );

const newsForm =

  document.getElementById(

    "newsForm"

  );

const newsFormTitle =

  document.getElementById(

    "newsFormTitle"

  );

const newsFormMessage =

  document.getElementById(

    "newsFormMessage"

  );

const newsCancelButton =

  document.getElementById(

    "newsCancelButton"

  );

const newsCancelButtonBottom =

  document.getElementById(

    "newsCancelButtonBottom"

  );

const reloadNewsButton =

  document.getElementById(

    "reloadNewsButton"

  );

const adminNewsList =

  document.getElementById(

    "adminNewsList"

  );

const newsListCount =

  document.getElementById(

    "newsListCount"

  );

const newsPagination =

  document.getElementById(

    "newsPagination"

  );

const newsBody =

  document.getElementById(

    "newsBody"

  );

const newsSlugInput =

  document.getElementById(

    "newsSlug"

  );

const newsTitleInput =

  document.getElementById(

    "newsTitle"

  );

const newsIdInput =

  document.getElementById(

    "newsId"

  );

const newsPublishedAtInput =

  document.getElementById(

    "newsPublishedAt"

  );

const newsPublishedInput =

  document.getElementById(

    "newsPublished"

  );

// ==================================================

// IMAGE ELEMENTS

// ==================================================

const newsImageDropZone =

  document.getElementById(

    "newsImageDropZone"

  );

const newsImageInput =

  document.getElementById(

    "newsImageInput"

  );

const newsImageList =

  document.getElementById(

    "newsImageList"

  );

const newsImageMessage =

  document.getElementById(

    "newsImageMessage"

  );

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

    .replace(

      /&/g,

      "&amp;"

    )

    .replace(

      /</g,

      "&lt;"

    )

    .replace(

      />/g,

      "&gt;"

    )

    .replace(

      /"/g,

      "&quot;"

    )

    .replace(

      /'/g,

      "&#039;"

    );

}

// ==================================================

// FORMAT DATE TIME

// ==================================================

function formatDateTime(

  value

) {

  if (!value) {

    return "日時未設定";

  }

  const date =

    new Date(value);

  if (

    Number.isNaN(

      date.getTime()

    )

  ) {

    return "日時未設定";

  }

  return date.toLocaleString(

    "ja-JP",

    {

      year: "numeric",

      month: "2-digit",

      day: "2-digit",

      hour: "2-digit",

      minute: "2-digit"

    }

  );

}

// ==================================================

// DATETIME LOCAL

// ==================================================

function toDateTimeLocal(

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

  const pad =

    (number) =>

      String(number)

        .padStart(

          2,

          "0"

        );

  return (

    date.getFullYear()

    + "-"

    + pad(

      date.getMonth() + 1

    )

    + "-"

    + pad(

      date.getDate()

    )

    + "T"

    + pad(

      date.getHours()

    )

    + ":"

    + pad(

      date.getMinutes()

    )

  );

}

// ==================================================

// FORM MESSAGE

// ==================================================

function setNewsFormMessage(

  message,

  type = ""

) {

  if (!newsFormMessage) {

    return;

  }

  newsFormMessage.textContent =

    message;

  newsFormMessage.className =

    "form-message";

  if (type) {

    newsFormMessage.classList.add(

      type

    );

  }

}

// ==================================================

// IMAGE MESSAGE

// ==================================================

function setNewsImageMessage(

  message,

  type = ""

) {

  if (!newsImageMessage) {

    return;

  }

  newsImageMessage.textContent =

    message;

  newsImageMessage.className =

    "news-image-message";

  if (type) {

    newsImageMessage.classList.add(

      type

    );

  }

}

// ==================================================

// SLUG INPUT FILTER

// ==================================================

if (newsSlugInput) {

  newsSlugInput.addEventListener(

    "input",

    () => {

      const filteredValue =

        newsSlugInput.value

          .replace(

            /[^A-Za-z0-9-]/g,

            ""

          );

      if (

        newsSlugInput.value !==

        filteredValue

      ) {

        newsSlugInput.value =

          filteredValue;

      }

    }

  );

}

// ==================================================

// SLUG VALIDATION

// ==================================================

function isValidNewsSlug(

  value

) {

  return /^[A-Za-z0-9-]+$/.test(

    value

  );

}

// ==================================================

// SLUG DATE

// ==================================================

function getNewsSlugDate(

  publishedAtValue

) {

  let date;

  if (publishedAtValue) {

    date =

      new Date(

        publishedAtValue

      );

  } else {

    date =

      new Date();

  }

  if (

    Number.isNaN(

      date.getTime()

    )

  ) {

    date =

      new Date();

  }

  const year =

    String(

      date.getFullYear()

    );

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

    year +

    month +

    day

  );

}

// ==================================================

// SLUG CATEGORY

// ==================================================

function getNewsSlugCategory(

  category

) {

  const result =

    String(

      category || ""

    )

      .toLowerCase()

      .replace(

        /[^a-z0-9-]/g,

        "-"

      )

      .replace(

        /-+/g,

        "-"

      )

      .replace(

        /^-+|-+$/g,

        ""

      );

  return (

    result ||

    "news"

  );

}

// ==================================================

// CREATE UNIQUE SLUG

// ==================================================

async function createUniqueNewsSlug(

  category,

  publishedAtValue

) {

  const categoryPart =

    getNewsSlugCategory(

      category

    );

  const datePart =

    getNewsSlugDate(

      publishedAtValue

    );

  const baseSlug =

    `${categoryPart}-${datePart}`;

  const {

    data,

    error

  } =

    await supabaseClient

      .from(

        "news"

      )

      .select(

        "slug"

      )

      .like(

        "slug",

        `${baseSlug}%`

      );

  if (error) {

    throw error;

  }

  const existingSlugs =

    new Set(

      (data || [])

        .map(

          (item) =>

            item.slug

        )

        .filter(

          Boolean

        )

    );

  if (

    !existingSlugs.has(

      baseSlug

    )

  ) {

    return baseSlug;

  }

  let number = 2;

  while (

    existingSlugs.has(

      `${baseSlug}-${number}`

    )

  ) {

    number++;

  }

  return `${baseSlug}-${number}`;

}

// ==================================================

// NEWS BODY CURSOR

// ==================================================

function saveNewsBodySelection() {

  if (!newsBody) {

    return;

  }

  lastNewsBodySelectionStart =

    newsBody.selectionStart ??

    newsBody.value.length;

  lastNewsBodySelectionEnd =

    newsBody.selectionEnd ??

    lastNewsBodySelectionStart;

}

if (newsBody) {

  [

    "click",

    "keyup",

    "select",

    "input",

    "focus"

  ].forEach(

    (eventName) => {

      newsBody.addEventListener(

        eventName,

        saveNewsBodySelection

      );

    }

  );

}

// ==================================================

// IMAGE TAG

// ==================================================

function createNewsImageTag(

  url

) {

  return `[[image:${url}]]`;

}

// ==================================================

// GET IMAGE URLS FROM BODY

// ==================================================

function getNewsImageUrlsFromBody(

  body

) {

  if (!body) {

    return [];

  }

  const regex =

    /**\\[\\[**image:(https?:**\\/\\/**[^**\\]**]+)**\\]\\]**/g;

  const urls = [];

  let match;

  while (

    (

      match =

        regex.exec(body)

    ) !== null

  ) {

    urls.push(

      match[1]

    );

  }

  return [

    ...new Set(

      urls

    )

  ];

}

// ==================================================

// GET STORAGE PATH

// ==================================================

function getNewsImageStoragePath(

  url

) {

  if (!url) {

    return null;

  }

  const marker =

    `/storage/v1/object/public/${NEWS_IMAGE_BUCKET}/`;

  const index =

    url.indexOf(

      marker

    );

  if (

    index === -1

  ) {

    return null;

  }

  const path =

    url.substring(

      index +

      marker.length

    );

  try {

    return decodeURIComponent(

      path

    );

  } catch {

    return path;

  }

}

// ==================================================

// CREATE IMAGE FILE NAME

// ==================================================

function createNewsImageFileName(

  file

) {

  const extension =

    file.name.includes(".")

      ? file.name

          .split(".")

          .pop()

          .toLowerCase()

      : "jpg";

  const random =

    Math.random()

      .toString(36)

      .slice(

        2,

        10

      );

  const timestamp =

    Date.now();

  return (

    `news/${timestamp}-${random}.${extension}`

  );

}

// ==================================================

// VALIDATE IMAGE

// ==================================================

function validateNewsImage(

  file

) {

  if (

    !NEWS_IMAGE_ALLOWED_TYPES.includes(

      file.type

    )

  ) {

    return (

      `${file.name} は対応していない画像形式です。`

    );

  }

  if (

    file.size >

    NEWS_IMAGE_MAX_SIZE

  ) {

    return (

      `${file.name} は5MBを超えています。`

    );

  }

  return null;

}

// ==================================================

// RENDER IMAGE LIST

// ==================================================

function renderNewsImageList() {

  if (!newsImageList) {

    return;

  }

  if (

    !currentNewsImages.length

  ) {

    newsImageList.innerHTML = `

      <p class="news-image-empty">

        アップロードした画像はありません。

      </p>

    `;

    return;

  }

  newsImageList.innerHTML =

    currentNewsImages

      .map(

        (

          image,

          index

        ) => {

          return `

            <article class="news-image-item">

              <div class="news-image-preview">

                <img

                  src="${escapeHTML(

                    image.url

                  )}"

                  alt=""

                  decoding="async"

                >

              </div>

              <div class="news-image-info">

                <p class="news-image-name">

                  ${escapeHTML(

                    image.name ||

                    `画像 ${index + 1}`

                  )}

                </p>

                <div class="news-image-actions">

                  <button

                    type="button"

                    class="news-image-insert-button"

                    data-news-image-insert="${index}"

                  >

                    本文に挿入

                  </button>

                  <button

                    type="button"

                    class="news-image-delete-button"

                    data-news-image-delete="${index}"

                  >

                    削除

                  </button>

                </div>

              </div>

            </article>

          `;

        }

      )

      .join("");

}

// 画像一覧のボタンは再描画されるため、親要素でクリックを一括処理。
// 登録は1回だけ行い、画像の追加・削除後も再登録しない。
newsImageList?.addEventListener("click", async (event) => {
  const insertButton = event.target.closest("[data-news-image-insert]");
  const deleteButton = event.target.closest("[data-news-image-delete]");
  const button = insertButton || deleteButton;
  if (!button || !newsImageList.contains(button)) return;

  const index = Number(insertButton
    ? button.dataset.newsImageInsert
    : button.dataset.newsImageDelete);
  if (!Number.isInteger(index) || index < 0 || index >= currentNewsImages.length) return;

  if (insertButton) {
    const image = currentNewsImages[index];
    if (image) insertNewsImageIntoBody(image.url);
    return;
  }

  await deleteNewsImage(index);
});

// ==================================================

// INSERT IMAGE INTO BODY

// ==================================================

function insertNewsImageIntoBody(

  url

) {
  if (!requireNewsEdit()) return;

  if (!newsBody) {

    return;

  }

  const tag =

    createNewsImageTag(

      url

    );

  const currentValue =

    newsBody.value;

  let start =

    lastNewsBodySelectionStart;

  let end =

    lastNewsBodySelectionEnd;

  if (

    typeof start !==

    "number"

  ) {

    start =

      currentValue.length;

  }

  if (

    typeof end !==

    "number"

  ) {

    end =

      start;

  }

  start =

    Math.min(

      start,

      currentValue.length

    );

  end =

    Math.min(

      end,

      currentValue.length

    );

  const before =

    currentValue.slice(

      0,

      start

    );

  const after =

    currentValue.slice(

      end

    );

  let insertion =

    tag;

  if (

    before &&

    !before.endsWith(

      "\n"

    )

  ) {

    insertion =

      "\n" +

      insertion;

  }

  if (

    after &&

    !after.startsWith(

      "\n"

    )

  ) {

    insertion =

      insertion +

      "\n";

  }

  newsBody.value =

    before +

    insertion +

    after;

  const newPosition =

    (

      before +

      insertion

    ).length;

  newsBody.focus();

  newsBody.setSelectionRange(

    newPosition,

    newPosition

  );

  lastNewsBodySelectionStart =

    newPosition;

  lastNewsBodySelectionEnd =

    newPosition;

  setNewsImageMessage(

    "本文に画像を挿入しました。",

    "success"

  );

}

// ==================================================

// LOAD IMAGES FROM BODY

// ==================================================

function loadNewsImagesFromBody() {

  if (!newsBody) {

    return;

  }

  const urls =

    getNewsImageUrlsFromBody(

      newsBody.value

    );

  currentNewsImages =

    urls.map(

      (

        url,

        index

      ) => {

        const path =

          getNewsImageStoragePath(

            url

          );

        const name =

          path

            ? path

                .split("/")

                .pop()

            : `画像 ${index + 1}`;

        return {

          url,

          path,

          name

        };

      }

    );

  renderNewsImageList();

}

// ==================================================

// UPLOAD IMAGES

// ==================================================

async function uploadNewsImages(

  files

) {
  if (!requireNewsEdit()) return;

  const fileList =

    Array.from(

      files || []

    );

  if (

    fileList.length === 0

  ) {

    return;

  }

  setNewsImageMessage(

    "画像をアップロードしています..."

  );

  if (newsImageDropZone) {

    newsImageDropZone.classList.add(

      "uploading"

    );

  }

  let successCount = 0;

  const errors = [];

  try {

    for (

      let file of fileList

    ) {

      const validationError =

        validateNewsImage(

          file

        );

      if (

        validationError

      ) {

        errors.push(

          validationError

        );

        continue;

      }

      file = await window.ANRIELImageOptimizer.optimize(file, 'news');
      const filePath =

        createNewsImageFileName(

          file

        );

      const {

        error: uploadError

      } =

        await supabaseClient

          .storage

          .from(

            NEWS_IMAGE_BUCKET

          )

          .upload(

            filePath,

            file,

            {

              cacheControl:

                "3600",

              upsert:

                false,

              contentType:

                file.type

            }

          );

      if (

        uploadError

      ) {

        console.error(

          "画像アップロードエラー:",

          uploadError

        );

        errors.push(

          `${file.name} のアップロードに失敗しました。`

        );

        continue;

      }

      const {

        data: publicUrlData

      } =

        supabaseClient

          .storage

          .from(

            NEWS_IMAGE_BUCKET

          )

          .getPublicUrl(

            filePath

          );

      const publicUrl =

        publicUrlData

          ?.publicUrl;

      if (!publicUrl) {

        errors.push(

          `${file.name} のURL取得に失敗しました。`

        );

        continue;

      }

      currentNewsImages.push({

        url:

          publicUrl,

        path:

          filePath,

        name:

          file.name

      });

      successCount++;

    }

    renderNewsImageList();

    if (

      successCount > 0 &&

      errors.length === 0

    ) {

      setNewsImageMessage(

        `${successCount}枚の画像をアップロードしました。`,

        "success"

      );

    } else if (

      successCount > 0

    ) {

      setNewsImageMessage(

        `${successCount}枚をアップロードしました。${errors.join(" ")}`,

        "error"

      );

    } else {

      setNewsImageMessage(

        errors.join(" ") ||

        "画像のアップロードに失敗しました。",

        "error"

      );

    }

  } catch (error) {

    console.error(

      "画像アップロードエラー:",

      error

    );

    setNewsImageMessage(

      "画像のアップロード中にエラーが発生しました。",

      "error"

    );

  } finally {

    if (newsImageDropZone) {

      newsImageDropZone.classList.remove(

        "uploading"

      );

    }

    if (newsImageInput) {

      newsImageInput.value =

        "";

    }

  }

}

// ==================================================

// DELETE IMAGE

// ==================================================

async function deleteNewsImage(

  index

) {
  if (!requireNewsEdit()) return;

  const image =

    currentNewsImages[

      index

    ];

  if (!image) {

    return;

  }

  const confirmed =

    window.confirm(

      "この画像を削除しますか？\nStorageからも削除されます。"

    );

  if (!confirmed) {

    return;

  }

  setNewsImageMessage(

    "画像を削除しています..."

  );

  const path =

    image.path ||

    getNewsImageStoragePath(

      image.url

    );

  if (path) {

    const {

      error

    } =

      await supabaseClient

        .storage

        .from(

          NEWS_IMAGE_BUCKET

        )

        .remove([

          path

        ]);

    if (error) {

      console.error(

        "画像削除エラー:",

        error

      );

      setNewsImageMessage(

        "Storageから画像を削除できませんでした。",

        "error"

      );

      return;

    }

  }

  if (newsBody) {

    const tag =

      createNewsImageTag(

        image.url

      );

    newsBody.value =

      newsBody.value

        .split(

          tag

        )

        .join(

          ""

        );

  }

  currentNewsImages.splice(

    index,

    1

  );

  renderNewsImageList();

  setNewsImageMessage(

    "画像を削除しました。",

    "success"

  );

}

// ==================================================

// IMAGE DROP EVENTS

// ==================================================

if (

  newsImageDropZone &&

  newsImageInput

) {

  newsImageDropZone.addEventListener(

    "click",

    () => {

      newsImageInput.click();

    }

  );

  newsImageDropZone.addEventListener(

    "keydown",

    (event) => {

      if (

        event.key === "Enter" ||

        event.key === " "

      ) {

        event.preventDefault();

        newsImageInput.click();

      }

    }

  );

  newsImageInput.addEventListener(

    "change",

    async () => {

      await uploadNewsImages(

        newsImageInput.files

      );

    }

  );

  [

    "dragenter",

    "dragover"

  ].forEach(

    (eventName) => {

      newsImageDropZone.addEventListener(

        eventName,

        (event) => {

          event.preventDefault();

          event.stopPropagation();

          newsImageDropZone

            .classList.add(

              "dragover"

            );

        }

      );

    }

  );

  [

    "dragleave",

    "drop"

  ].forEach(

    (eventName) => {

      newsImageDropZone.addEventListener(

        eventName,

        (event) => {

          event.preventDefault();

          event.stopPropagation();

          newsImageDropZone

            .classList.remove(

              "dragover"

            );

        }

      );

    }

  );

  newsImageDropZone.addEventListener(

    "drop",

    async (event) => {

      const files =

        event.dataTransfer

          ?.files;

      if (

        !files ||

        files.length === 0

      ) {

        return;

      }

      await uploadNewsImages(

        files

      );

    }

  );

}

// ==================================================

// RESET IMAGE MANAGER

// ==================================================

function resetNewsImageManager() {

  currentNewsImages = [];

  lastNewsBodySelectionStart =

    0;

  lastNewsBodySelectionEnd =

    0;

  if (newsImageInput) {

    newsImageInput.value =

      "";

  }

  setNewsImageMessage(

    ""

  );

  renderNewsImageList();

}

// ==================================================

// OPEN NEW NEWS FORM

// ==================================================

function openNewNewsForm() {
  if (!requireNewsEdit()) return;

  if (

    !newsForm ||

    !newsFormArea

  ) {

    return;

  }

  newsForm.reset();

  currentEditingNewsSlug =

    "";

  if (newsIdInput) {

    newsIdInput.value =

      "";

  }

  if (newsSlugInput) {

    newsSlugInput.value =

      "";

  }

  if (

    typeof newsCategorySelect !==

    "undefined" &&

    newsCategorySelect

  ) {

    const newsDefault =

      newsCategories.find(

        (category) =>

          category.name ===

          "NEWS"

      );

    if (newsDefault) {

      newsCategorySelect.value =

        "NEWS";

    } else if (

      newsCategories.length > 0

    ) {

      newsCategorySelect.value =

        newsCategories[0]

          .name;

    } else {

      newsCategorySelect.value =

        "";

    }

  }

  if (newsPublishedInput) {

    newsPublishedInput.checked =

      false;

  }

  resetNewsImageManager();

  if (newsFormTitle) {

    newsFormTitle.textContent =

      "NEWSを追加";

  }

  setNewsFormMessage(

    ""

  );

  newsFormArea.classList.remove(

    "hidden"

  );

  newsFormArea.scrollIntoView({

    behavior:

      "smooth",

    block:

      "start"

  });

  setTimeout(

    () => {

      if (newsTitleInput) {

        newsTitleInput.focus();

      }

    },

    100

  );

}

// ==================================================

// CLOSE NEWS FORM

// ==================================================

function closeNewsForm() {

  if (newsForm) {

    newsForm.reset();

  }

  if (newsIdInput) {

    newsIdInput.value =

      "";

  }

  currentEditingNewsSlug =

    "";

  resetNewsImageManager();

  setNewsFormMessage(

    ""

  );

  if (newsFormTitle) {

    newsFormTitle.textContent =

      "NEWSを追加";

  }

  if (newsFormArea) {

    newsFormArea.classList.remove(

      "hidden"

    );

  }

  // NEWS一覧タブへ戻る

  if (

    typeof window.switchNewsView ===

    "function"

  ) {

    window.switchNewsView(

      "list"

    );

  }

}

// ==================================================

// NEWS FORM EVENTS

// ==================================================

if (newNewsButton) {

  newNewsButton.addEventListener(

    "click",

    openNewNewsForm

  );

}

if (newsCancelButton) {

  newsCancelButton.addEventListener(

    "click",

    closeNewsForm

  );

}

if (newsCancelButtonBottom) {

  newsCancelButtonBottom.addEventListener(

    "click",

    closeNewsForm

  );

}

if (reloadNewsButton) {

  reloadNewsButton.addEventListener(

    "click",

    async () => {

      // カテゴリーと記事一覧は互いに独立しているため並列で再取得。
      await Promise.all([
        typeof loadNewsCategories === "function"
          ? loadNewsCategories()
          : Promise.resolve(),
        loadNews(currentNewsPage)
      ]);

    }

  );

}

// ==================================================

// PAGINATION

// ==================================================

function renderNewsPagination() {

  if (!newsPagination) {

    return;

  }

  const totalPages =

    Math.ceil(

      totalNewsCount /

      NEWS_PER_PAGE

    );

  if (

    totalPages <= 1

  ) {

    newsPagination.innerHTML =

      "";

    newsPagination.classList.add(

      "hidden"

    );

    return;

  }

  newsPagination.classList.remove(

    "hidden"

  );

  let html = "";

  // ------------------------------------------

  // PREVIOUS

  // ------------------------------------------

  html += `

    <button

      type="button"

      class="news-page-button news-page-arrow"

      data-news-page="${currentNewsPage - 1}"

      ${currentNewsPage === 1 ? "disabled" : ""}

      aria-label="前のページ"

    >

      ＜

    </button>

  `;

  // ------------------------------------------

  // PAGE NUMBERS

  // ------------------------------------------

  const maxVisiblePages = 5;

  let startPage =

    Math.max(

      1,

      currentNewsPage - 2

    );

  let endPage =

    Math.min(

      totalPages,

      startPage +

      maxVisiblePages -

      1

    );

  if (

    endPage -

    startPage +

    1 <

    maxVisiblePages

  ) {

    startPage =

      Math.max(

        1,

        endPage -

        maxVisiblePages +

        1

      );

  }

  if (

    startPage > 1

  ) {

    html += `

      <button

        type="button"

        class="news-page-button"

        data-news-page="1"

      >

        1

      </button>

    `;

    if (

      startPage > 2

    ) {

      html += `

        <span class="news-page-dots">

          …

        </span>

      `;

    }

  }

  for (

    let page = startPage;

    page <= endPage;

    page++

  ) {

    html += `

      <button

        type="button"

        class="news-page-button ${

          page === currentNewsPage

            ? "active"

            : ""

        }"

        data-news-page="${page}"

        ${

          page === currentNewsPage

            ? 'aria-current="page"'

            : ""

        }

      >

        ${page}

      </button>

    `;

  }

  if (

    endPage <

    totalPages

  ) {

    if (

      endPage <

      totalPages - 1

    ) {

      html += `

        <span class="news-page-dots">

          …

        </span>

      `;

    }

    html += `

      <button

        type="button"

        class="news-page-button"

        data-news-page="${totalPages}"

      >

        ${totalPages}

      </button>

    `;

  }

  // ------------------------------------------

  // NEXT

  // ------------------------------------------

  html += `

    <button

      type="button"

      class="news-page-button news-page-arrow"

      data-news-page="${currentNewsPage + 1}"

      ${currentNewsPage === totalPages ? "disabled" : ""}

      aria-label="次のページ"

    >

      ＞

    </button>

  `;

  newsPagination.innerHTML =

    html;

}

// ページボタンのクリックも親要素で一括処理し、再描画ごとの登録を省略。
newsPagination?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-news-page]");
  if (!button || !newsPagination.contains(button) || button.disabled) return;

  const page = Number(button.dataset.newsPage);
  const totalPages = Math.max(1, Math.ceil(totalNewsCount / NEWS_PER_PAGE));
  if (!Number.isInteger(page) || page < 1 || page > totalPages || page === currentNewsPage) return;

  await loadNews(page);
  const listCard = adminNewsList?.closest(".admin-list-card");
  if (listCard) {
    listCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// ==================================================

// NEWS COUNT

// ==================================================

function renderNewsCount() {

  if (!newsListCount) {

    return;

  }

  if (

    totalNewsCount === 0

  ) {

    newsListCount.textContent =

      "0件";

    return;

  }

  const start =

    (

      currentNewsPage - 1

    ) *

    NEWS_PER_PAGE +

    1;

  const end =

    Math.min(

      currentNewsPage *

      NEWS_PER_PAGE,

      totalNewsCount

    );

  newsListCount.textContent =

    `${totalNewsCount}件中 ${start}〜${end}件を表示`;

}

// ==================================================

// LOAD NEWS

// ==================================================

async function loadNews(

  page = 1

) {
 if (!newsCanView()) return;

  if (!adminNewsList) {

    return;

  }

  adminNewsList.innerHTML = `

    <p class="loading-text">

      読み込み中...

    </p>

  `;

  if (newsListCount) {

    newsListCount.textContent =

      "読み込み中...";

  }

  if (newsPagination) {

    newsPagination.classList.add(

      "hidden"

    );

  }

  // ------------------------------------------

  // COUNT

  // ------------------------------------------

  const {

    count,

    error: countError

  } =

    await supabaseClient

      .from(

        "news"

      )

      .select(

        "id",

        {

          count:

            "exact",

          head:

            true

        }

      );

  if (countError) {

    console.error(

      "NEWS件数取得エラー:",

      countError

    );

    adminNewsList.innerHTML = `

      <p class="error-text">

        NEWSの読み込みに失敗しました。

      </p>

    `;

    if (newsListCount) {

      newsListCount.textContent =

        "取得失敗";

    }

    return;

  }

  totalNewsCount =

    count || 0;

  const totalPages =

    Math.max(

      1,

      Math.ceil(

        totalNewsCount /

        NEWS_PER_PAGE

      )

    );

  if (

    page >

    totalPages

  ) {

    page =

      totalPages;

  }

  if (

    page < 1

  ) {

    page = 1;

  }

  currentNewsPage =

    page;

  const from =

    (

      currentNewsPage - 1

    ) *

    NEWS_PER_PAGE;

  const to =

    from +

    NEWS_PER_PAGE -

    1;

  // ------------------------------------------

  // LOAD CURRENT PAGE

  // ------------------------------------------

  const {

    data,

    error

  } =

    await supabaseClient

      .from(

        "news"

      )

      .select(

        "*"

      )

      .order(

        "published_at",

        {

          ascending:

            false,

          nullsFirst:

            false

        }

      )

      .order(

        "created_at",

        {

          ascending:

            false

        }

      )

      .range(

        from,

        to

      );

  if (error) {

    console.error(

      "NEWS読み込みエラー:",

      error

    );

    adminNewsList.innerHTML = `

      <p class="error-text">

        NEWSの読み込みに失敗しました。

      </p>

    `;

    if (newsListCount) {

      newsListCount.textContent =

        "取得失敗";

    }

    return;

  }

  // ------------------------------------------

  // EMPTY

  // ------------------------------------------

  if (

    totalNewsCount === 0

  ) {

    adminNewsList.innerHTML = `

      <p class="empty-text">

        NEWSはまだ登録されていません。

      </p>

    `;

    renderNewsCount();

    renderNewsPagination();

    return;

  }

  // ------------------------------------------

  // LIST

  // ------------------------------------------

  adminNewsList.innerHTML =

    (data || [])

      .map(

        (item) => {

          const status =

            item.published

              ? "公開"

              : "非公開";

          const statusClass =

            item.published

              ? "published"

              : "draft";

          return `

            <article class="admin-list-item">

              <div class="admin-list-main">

                <div class="admin-list-meta">

                  <span

                    class="status-badge ${statusClass}"

                  >

                    ${status}

                  </span>

                  <span>

                    ${escapeHTML(

                      item.category

                    )}

                  </span>

                  <span>

                    ${formatDateTime(

                      item.published_at

                    )}

                  </span>

                </div>

                <h4>

                  ${escapeHTML(

                    item.title

                  )}

                </h4>

                <p class="admin-list-slug">

                  /${escapeHTML(

                    item.slug

                  )}

                </p>

              </div>

              <div class="admin-list-actions" style="${newsCanEdit() ? "" : "display:none"}">

                <button

                  type="button"

                  class="edit-button"

                  data-news-edit="${item.id}"

                >

                  編集

                </button>

                <button

                  type="button"

                  class="delete-button"

                  data-news-delete="${item.id}"

                >

                  削除

                </button>

              </div>

            </article>

          `;

        }

      )

      .join("");

  // 編集・削除ボタンのイベントは一覧コンテナで一括処理（下で一度だけ登録）。

  renderNewsCount();

  renderNewsPagination();

}

// NEWS一覧は再描画されるため、各ボタンではなく親要素でイベントを一度だけ登録。
// 動的に追加された編集・削除ボタンも同じ処理で対応。
adminNewsList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const editButton = target.closest("[data-news-edit]");
  if (editButton && adminNewsList.contains(editButton)) {
    editNews(editButton.dataset.newsEdit);
    return;
  }

  const deleteButton = target.closest("[data-news-delete]");
  if (deleteButton && adminNewsList.contains(deleteButton)) {
    deleteNews(deleteButton.dataset.newsDelete);
  }
});

// ==================================================

// EDIT NEWS

// ==================================================

async function editNews(

  id

) {
  if (!requireNewsEdit()) return;

  // NEWS一覧から編集フォームのタブへ移動

  if (typeof window.switchNewsView === "function") {

    await window.switchNewsView(

      "new",

      {

        resetForm: false,

        updateUrl: true

      }

    );

  }

  const {

    data,

    error

  } =

    await supabaseClient

      .from(

        "news"

      )

      .select(

        "*"

      )

      .eq(

        "id",

        id

      )

      .single();

  if (

    error ||

    !data

  ) {

    console.error(

      "NEWS取得エラー:",

      error

    );

    alert(

      "NEWSの取得に失敗しました。"

    );

    return;

  }

  if (newsIdInput) {

    newsIdInput.value =

      data.id;

  }

  if (newsTitleInput) {

    newsTitleInput.value =

      data.title || "";

  }

  if (newsSlugInput) {

    newsSlugInput.value =

      data.slug || "";

  }

  currentEditingNewsSlug =

    data.slug || "";

  if (

    typeof renderCategorySelect ===

    "function"

  ) {

    renderCategorySelect(

      data.category || ""

    );

  }

  if (

    typeof newsCategorySelect !==

    "undefined" &&

    newsCategorySelect

  ) {

    newsCategorySelect.value =

      data.category || "";

  }

  if (newsBody) {

    newsBody.value =

      data.body || "";

  }

  if (newsPublishedAtInput) {

    newsPublishedAtInput.value =

      toDateTimeLocal(

        data.published_at

      );

  }

  if (newsPublishedInput) {

    newsPublishedInput.checked =

      Boolean(

        data.published

      );

  }

  lastNewsBodySelectionStart =

    newsBody

      ? newsBody.value.length

      : 0;

  lastNewsBodySelectionEnd =

    lastNewsBodySelectionStart;

  loadNewsImagesFromBody();

  if (newsFormTitle) {

    newsFormTitle.textContent =

      "NEWSを編集";

  }

  setNewsFormMessage(

    ""

  );

  setNewsImageMessage(

    ""

  );

  if (newsFormArea) {

    newsFormArea.classList.remove(

      "hidden"

    );

    newsFormArea.scrollIntoView({

      behavior:

        "smooth",

      block:

        "start"

    });

  }

}

// ==================================================

// SAVE NEWS

// ==================================================

if (newsForm) {

  newsForm.addEventListener(

    "submit",

    async (event) => {

      event.preventDefault();
 if (!requireNewsEdit()) return;

      setNewsFormMessage(

        "保存しています..."

      );

      const id =

        newsIdInput

          ?.value ||

        "";

      const title =

        newsTitleInput

          ?.value

          .trim() ||

        "";

      const enteredSlug =

        newsSlugInput

          ?.value

          .trim() ||

        "";

      const category =

        (

          typeof newsCategorySelect !==

            "undefined" &&

          newsCategorySelect

        )

          ? newsCategorySelect

              .value

              .trim()

          : "";

      const body =

        newsBody

          ?.value ||

        "";

      const published =

        Boolean(

          newsPublishedInput

            ?.checked

        );

      const publishedAtValue =

        newsPublishedAtInput

          ?.value ||

        "";

      // ------------------------------------------

      // TITLE

      // ------------------------------------------

      if (!title) {

        setNewsFormMessage(

          "タイトルを入力してください。",

          "error"

        );

        newsTitleInput

          ?.focus();

        return;

      }

      // ------------------------------------------

      // CATEGORY

      // ------------------------------------------

      if (!category) {

        setNewsFormMessage(

          "カテゴリーを選択してください。",

          "error"

        );

        newsCategorySelect

          ?.focus();

        return;

      }

      // ------------------------------------------

      // SLUG MANUAL VALIDATION

      // ------------------------------------------

      if (

        enteredSlug &&

        !isValidNewsSlug(

          enteredSlug

        )

      ) {

        setNewsFormMessage(

          "slugは英数字とハイフンのみ入力できます。",

          "error"

        );

        newsSlugInput

          ?.focus();

        return;

      }

      // ------------------------------------------

      // CREATE / KEEP SLUG

      // ------------------------------------------

      let slug =

        enteredSlug;

      if (!slug) {

        // 編集中の記事でslug欄を誤って空にしても

        // 既存URLを勝手に変更しない

        if (

          id &&

          currentEditingNewsSlug

        ) {

          slug =

            currentEditingNewsSlug;

        } else {

          try {

            slug =

              await createUniqueNewsSlug(

                category,

                publishedAtValue

              );

            if (newsSlugInput) {

              newsSlugInput.value =

                slug;

            }

          } catch (error) {

            console.error(

              "slug自動生成エラー:",

              error

            );

            setNewsFormMessage(

              "記事URLの自動作成に失敗しました。",

              "error"

            );

            return;

          }

        }

      }

      // ------------------------------------------

      // PUBLISHED AT

      // ------------------------------------------

      let publishedAt =

        publishedAtValue

          ? new Date(

              publishedAtValue

            ).toISOString()

          : null;

      if (

        published &&

        !publishedAt

      ) {

        publishedAt =

          new Date()

            .toISOString();

      }

      // ------------------------------------------

      // PAYLOAD

      // ------------------------------------------

      const payload = {

        title:

          title,

        slug:

          slug,

        category:

          category,

        body:

          body,

        published:

          published,

        published_at:

          publishedAt

      };

      let result;

      // ------------------------------------------

      // UPDATE

      // ------------------------------------------

      if (id) {

        result =

          await supabaseClient

            .from(

              "news"

            )

            .update(

              payload

            )

            .eq(

              "id",

              id

            );

      }

      // ------------------------------------------

      // INSERT

      // ------------------------------------------

      else {

        result =

          await supabaseClient

            .from(

              "news"

            )

            .insert(

              payload

            );

      }

      // ------------------------------------------

      // ERROR

      // ------------------------------------------

      if (

        result.error

      ) {

        console.error(

          "NEWS保存エラー:",

          result.error

        );

        setNewsFormMessage(

          result.error.code ===

            "23505"

            ? "同じSLUGがすでに使用されています。"

            : "保存に失敗しました。",

          "error"

        );

        return;

      }

      // ------------------------------------------

// SUCCESS

// ------------------------------------------

currentEditingNewsSlug =

  slug;

setNewsFormMessage(

  "保存しました。",

  "success"

);

// 新規追加は1ページ目へ

if (!id) {

  currentNewsPage = 1;

}

await loadNews(

  currentNewsPage

);

// 保存完了後、NEWS一覧タブへ戻る

setTimeout(

  async () => {

    if (

      typeof window.switchNewsView ===

      "function"

    ) {

      await window.switchNewsView(

        "list"

      );

    } else {

      closeNewsForm();

    }

  },

  500

);

    }

  );

}

// ==================================================

// DELETE NEWS

// ==================================================

async function deleteNews(

  id

) {
  if (!requireNewsEdit()) return;

  const confirmed =

    window.confirm(

      "このNEWSを削除しますか？\n削除後は元に戻せません。\n\n※記事で使用している画像はStorageには残ります。"

    );

  if (!confirmed) {

    return;

  }

  const {

    error

  } =

    await supabaseClient

      .from(

        "news"

      )

      .delete()

      .eq(

        "id",

        id

      );

  if (error) {

    console.error(

      "NEWS削除エラー:",

      error

    );

    alert(

      "NEWSの削除に失敗しました。"

    );

    return;

  }

  await loadNews(

    currentNewsPage

  );

}
