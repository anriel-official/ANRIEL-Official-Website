// ==================================================
// AN:RIEL
// ADMIN
// SCHEDULE MANAGEMENT
// ==================================================

// ==================================================
// SETTINGS
// ==================================================

const SCHEDULE_IMAGE_BUCKET =
  "news-images";

const SCHEDULE_IMAGE_MAX_SIZE =
  5 * 1024 * 1024;

const SCHEDULE_IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

// ==================================================
// STATE
// ==================================================

let currentScheduleThumbnailUrl = "";
let currentScheduleThumbnailPath = "";

let originalScheduleThumbnailUrl = "";
let originalScheduleThumbnailPath = "";

let pendingScheduleUploadedPaths = [];

let scheduleTalents = [];

// ==================================================
// DOM
// ==================================================

// --------------------------------------------------
// TABS
// --------------------------------------------------

const scheduleListTabButton =
  document.getElementById(
    "scheduleListTabButton"
  );

const scheduleNewTabButton =
  document.getElementById(
    "scheduleNewTabButton"
  );

const scheduleYoutubeTabButton =
  document.getElementById(
    "scheduleYoutubeTabButton"
  );

const scheduleTalentTabButton =
  document.getElementById(
    "scheduleTalentTabButton"
  );

const scheduleAutoDeleteTabButton =
  document.getElementById(
    "scheduleAutoDeleteTabButton"
  );

// --------------------------------------------------
// VIEWS
// --------------------------------------------------

const scheduleListView =
  document.getElementById(
    "scheduleListView"
  );

const scheduleNewView =
  document.getElementById(
    "scheduleNewView"
  );

const scheduleYoutubeView =
  document.getElementById(
    "scheduleYoutubeView"
  );

const scheduleTalentView =
  document.getElementById(
    "scheduleTalentView"
  );

const scheduleAutoDeleteView =
  document.getElementById(
    "scheduleAutoDeleteView"
  );

// --------------------------------------------------
// FORM
// --------------------------------------------------

const scheduleFormArea =
  document.getElementById(
    "scheduleFormArea"
  );

const scheduleForm =
  document.getElementById(
    "scheduleForm"
  );

const scheduleFormTitle =
  document.getElementById(
    "scheduleFormTitle"
  );

const scheduleFormMessage =
  document.getElementById(
    "scheduleFormMessage"
  );

const scheduleCancelButton =
  document.getElementById(
    "scheduleCancelButton"
  );

const scheduleCancelButtonBottom =
  document.getElementById(
    "scheduleCancelButtonBottom"
  );

// --------------------------------------------------
// LIST
// --------------------------------------------------

const reloadScheduleButton =
  document.getElementById(
    "reloadScheduleButton"
  );

const adminScheduleList =
  document.getElementById(
    "adminScheduleList"
  );

const scheduleListCount =
  document.getElementById(
    "scheduleListCount"
  );

// --------------------------------------------------
// FORM FIELDS
// --------------------------------------------------

const scheduleIdInput =
  document.getElementById(
    "scheduleId"
  );

const scheduleTalentInput =
  document.getElementById(
    "scheduleTalent"
  );

const scheduleDateInput =
  document.getElementById(
    "scheduleDate"
  );

const scheduleTimeInput =
  document.getElementById(
    "scheduleTime"
  );

const scheduleUrlInput =
  document.getElementById(
    "scheduleUrl"
  );

const scheduleThumbnailInput =
  document.getElementById(
    "scheduleThumbnail"
  );

const schedulePublishedInput =
  document.getElementById(
    "schedulePublished"
  );

// --------------------------------------------------
// AUTO DELETE SETTINGS
// --------------------------------------------------

const scheduleAutoDeleteEnabled =
  document.getElementById(
    "scheduleAutoDeleteEnabled"
  );

const scheduleAutoDeleteKeepDays =
  document.getElementById(
    "scheduleAutoDeleteKeepDays"
  );

const scheduleAutoDeleteLastRun =
  document.getElementById(
    "scheduleAutoDeleteLastRun"
  );

const saveScheduleAutoDeleteSettingsButton =
  document.getElementById(
    "saveScheduleAutoDeleteSettingsButton"
  );

const scheduleAutoDeleteMessage =
  document.getElementById(
    "scheduleAutoDeleteMessage"
  );

// --------------------------------------------------
// THUMBNAIL
// --------------------------------------------------

const scheduleYoutubeThumbnailButton =
  document.getElementById(
    "scheduleYoutubeThumbnailButton"
  );

const scheduleImageDropZone =
  document.getElementById(
    "scheduleImageDropZone"
  );

const scheduleImageInput =
  document.getElementById(
    "scheduleImageInput"
  );

const scheduleImageMessage =
  document.getElementById(
    "scheduleImageMessage"
  );

const scheduleThumbnailPreviewArea =
  document.getElementById(
    "scheduleThumbnailPreviewArea"
  );

const scheduleThumbnailPreview =
  document.getElementById(
    "scheduleThumbnailPreview"
  );

const scheduleThumbnailDeleteButton =
  document.getElementById(
    "scheduleThumbnailDeleteButton"
  );

// ==================================================
// ESCAPE HTML
// ==================================================

function escapeScheduleHTML(value) {

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
// MESSAGE
// ==================================================

function setScheduleFormMessage(
  message,
  type = ""
) {

  if (!scheduleFormMessage) {
    return;
  }

  scheduleFormMessage.textContent =
    message || "";

  scheduleFormMessage.classList.remove(
    "success",
    "error"
  );

  if (type) {
    scheduleFormMessage.classList.add(
      type
    );
  }
}

function setScheduleImageMessage(
  message,
  type = ""
) {

  if (!scheduleImageMessage) {
    return;
  }

  scheduleImageMessage.textContent =
    message || "";

  scheduleImageMessage.classList.remove(
    "success",
    "error"
  );

  if (type) {
    scheduleImageMessage.classList.add(
      type
    );
  }
}

// ==================================================
// VIEW
// ==================================================

function hideAllScheduleViews() {

  const views = [
    scheduleListView,
    scheduleNewView,
    scheduleYoutubeView,
    scheduleTalentView,
    scheduleAutoDeleteView,
    document.getElementById("scheduleWeeklyView")
  ];

  views.forEach(
    (view) => {

      view?.classList.remove(
        "active"
      );

    }
  );

  const buttons = [
    scheduleListTabButton,
    scheduleNewTabButton,
    scheduleYoutubeTabButton,
    scheduleTalentTabButton,
    scheduleAutoDeleteTabButton,
    document.getElementById("scheduleWeeklyTabButton")
  ];

  buttons.forEach(
    (button) => {

      button?.classList.remove(
        "active"
      );

    }
  );
}

// ==================================================
// SWITCH VIEW
// ==================================================

async function switchScheduleView(
  view,
  options = {}
) {

  const {
    resetForm = true,
    updateUrl = true
  } = options;

  hideAllScheduleViews();

  // --------------------------------------------------
  // SCHEDULE ADD
  // --------------------------------------------------

  if (view === "new") {

    scheduleNewView
      ?.classList.add(
        "active"
      );

    scheduleNewTabButton
      ?.classList.add(
        "active"
      );

    // openNewScheduleForm already fetches talents when resetting.
    if (resetForm) {

      await openNewScheduleForm(
        false
      );

    } else {

      await loadScheduleTalents();

    }

    if (updateUrl) {

      history.replaceState(
        null,
        "",
        "?view=new"
      );

    }

    return;
  }

  if (view === "weekly") {
    document.getElementById("scheduleWeeklyView")?.classList.add("active");
    document.getElementById("scheduleWeeklyTabButton")?.classList.add("active");
    if (typeof window.loadWeeklySchedule === "function") await window.loadWeeklySchedule();
    if (updateUrl) history.replaceState(null, "", "?view=weekly");
    return;
  }

  // --------------------------------------------------
  // YOUTUBE
  // --------------------------------------------------

  if (view === "youtube") {

    scheduleYoutubeView
      ?.classList.add(
        "active"
      );

    scheduleYoutubeTabButton
      ?.classList.add(
        "active"
      );

    if (
      typeof window.loadYoutubeSyncSettings ===
      "function"
    ) {

      await window
        .loadYoutubeSyncSettings();

    }

    if (updateUrl) {

      history.replaceState(
        null,
        "",
        "?view=youtube"
      );

    }

    return;
  }

  // --------------------------------------------------
  // TALENT
  // --------------------------------------------------

  if (view === "talent") {

    scheduleTalentView
      ?.classList.add(
        "active"
      );

    scheduleTalentTabButton
      ?.classList.add(
        "active"
      );

    if (
      typeof window.loadYoutubeTalents ===
      "function"
    ) {

      await window
        .loadYoutubeTalents();

    }

    if (updateUrl) {

      history.replaceState(
        null,
        "",
        "?view=talent"
      );

    }

    return;
  }

  // --------------------------------------------------
  // AUTO DELETE
  // --------------------------------------------------

  if (view === "auto-delete") {

    scheduleAutoDeleteView
      ?.classList.add(
        "active"
      );

    scheduleAutoDeleteTabButton
      ?.classList.add(
        "active"
      );

    await loadScheduleAutoDeleteSettings();

    if (updateUrl) {

      history.replaceState(
        null,
        "",
        "?view=auto-delete"
      );

    }

    return;
  }

  // --------------------------------------------------
  // LIST
  // --------------------------------------------------

  scheduleListView
    ?.classList.add(
      "active"
    );

  scheduleListTabButton
    ?.classList.add(
      "active"
    );

  await loadSchedules();

  if (updateUrl) {

    history.replaceState(
      null,
      "",
      "?view=list"
    );

  }
}

window.switchScheduleView =
  switchScheduleView;

// ==================================================
// TAB EVENTS
// ==================================================

scheduleListTabButton
  ?.addEventListener(
    "click",
    () => {

      switchScheduleView(
        "list"
      );

    }
  );

scheduleNewTabButton
  ?.addEventListener(
    "click",
    () => {

      switchScheduleView(
        "new"
      );

    }
  );

scheduleYoutubeTabButton
  ?.addEventListener(
    "click",
    () => {

      switchScheduleView(
        "youtube"
      );

    }
  );

scheduleTalentTabButton
  ?.addEventListener(
    "click",
    () => {

      switchScheduleView(
        "talent"
      );

    }
  );

scheduleAutoDeleteTabButton
  ?.addEventListener(
    "click",
    () => {

      switchScheduleView(
        "auto-delete"
      );

    }
  );

// ==================================================
// LOAD TALENTS
// ==================================================

async function loadScheduleTalents() {

  if (!scheduleTalentInput) {
    return;
  }

  const currentValue =
    scheduleTalentInput.value;

  const currentTalentId =
    scheduleTalentInput
      .selectedOptions?.[0]
      ?.dataset
      ?.talentId || "";

  scheduleTalentInput.innerHTML = `
    <option value="">
      読み込み中...
    </option>
  `;

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "talents"
        )
        .select(
          "id, name, published, sort_order"
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
      throw error;
    }

    scheduleTalents =
      Array.isArray(data)
        ? data
        : [];

    scheduleTalentInput.innerHTML = `
      <option value="">
        タレントを選択
      </option>

      ${scheduleTalents
        .map(
          (talent) => `
            <option
              value="${escapeScheduleHTML(
                talent.name
              )}"
              data-talent-id="${escapeScheduleHTML(
                talent.id
              )}"
            >
              ${escapeScheduleHTML(
                talent.name
              )}
            </option>
          `
        )
        .join("")}
    `;

    const talentOptions = [...scheduleTalentInput.options];

    if (currentTalentId) {

      const option =
        talentOptions
          .find(
            (item) =>
              String(
                item.dataset?.talentId || ""
              ) ===
              String(
                currentTalentId
              )
          );

      if (option) {
        scheduleTalentInput.value =
          option.value;

        return;
      }
    }

    if (currentValue) {

      const exists =
        talentOptions
          .some(
            (option) =>
              option.value ===
              currentValue
          );

      if (!exists) {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          currentValue;

        option.textContent =
          currentValue;

        scheduleTalentInput
          .appendChild(
            option
          );
      }

      scheduleTalentInput.value =
        currentValue;
    }

  } catch (error) {

    console.error(
      "Schedule talent load error:",
      error
    );

    scheduleTalentInput.innerHTML = `
      <option value="">
        タレントを読み込めませんでした
      </option>
    `;
  }
}

window.loadScheduleTalents =
  loadScheduleTalents;

// ==================================================
// RESET THUMBNAIL
// ==================================================

function resetScheduleThumbnailManager() {

  currentScheduleThumbnailUrl =
    "";

  currentScheduleThumbnailPath =
    "";

  originalScheduleThumbnailUrl =
    "";

  originalScheduleThumbnailPath =
    "";

  pendingScheduleUploadedPaths =
    [];

  if (scheduleThumbnailInput) {

    scheduleThumbnailInput.value =
      "";

  }

  if (scheduleImageInput) {

    scheduleImageInput.value =
      "";

  }

  if (scheduleThumbnailPreview) {

    scheduleThumbnailPreview.src =
      "";

  }

  scheduleThumbnailPreviewArea
    ?.classList.add(
      "hidden"
    );

  setScheduleImageMessage(
    ""
  );
}

// ==================================================
// SHOW THUMBNAIL
// ==================================================

function showScheduleThumbnail(
  url
) {

  if (!url) {

    scheduleThumbnailPreviewArea
      ?.classList.add(
        "hidden"
      );

    if (scheduleThumbnailPreview) {

      scheduleThumbnailPreview.src =
        "";

    }

    return;
  }

  if (scheduleThumbnailPreview) {

    scheduleThumbnailPreview.src =
      url;

  }

  scheduleThumbnailPreviewArea
    ?.classList.remove(
      "hidden"
    );
}

// ==================================================
// STORAGE PATH
// ==================================================

function getScheduleImageStoragePath(
  url
) {

  if (!url) {
    return "";
  }

  try {

    const marker =
      `/storage/v1/object/public/${SCHEDULE_IMAGE_BUCKET}/`;

    const markerIndex =
      url.indexOf(
        marker
      );

    if (markerIndex === -1) {

      return "";

    }

    const encodedPath =
      url.substring(
        markerIndex +
        marker.length
      );

    return decodeURIComponent(
      encodedPath
    );

  } catch (error) {

    console.error(
      "Storage path parse error:",
      error
    );

    return "";
  }
}

// ==================================================
// REMOVE STORAGE FILE
// ==================================================

async function removeScheduleStorageFile(
  path
) {

  if (!path) {
    return;
  }

  try {

    const {
      error
    } =
      await supabaseClient
        .storage
        .from(
          SCHEDULE_IMAGE_BUCKET
        )
        .remove(
          [path]
        );

    if (error) {

      console.error(
        "Schedule image delete error:",
        error
      );

    }

  } catch (error) {

    console.error(
      "Schedule image delete error:",
      error
    );

  }
}

// ==================================================
// CREATE FILE NAME
// ==================================================

function createScheduleImagePath(
  file
) {

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "jpg";

  const random =
    Math.random()
      .toString(36)
      .slice(
        2,
        10
      );

  return (
    [
      "schedule",
      Date.now(),
      random
    ].join("-") +
    "." +
    extension
  );
}

// ==================================================
// VALIDATE IMAGE
// ==================================================

function validateScheduleImage(
  file
) {

  if (!file) {

    return {
      valid: false,
      message:
        "画像を選択してください。"
    };

  }

  if (
    !SCHEDULE_IMAGE_ALLOWED_TYPES
      .includes(
        file.type
      )
  ) {

    return {
      valid: false,
      message:
        "JPEG / PNG / WEBP / GIF の画像を選択してください。"
    };

  }

  if (
    file.size >
    SCHEDULE_IMAGE_MAX_SIZE
  ) {

    return {
      valid: false,
      message:
        "画像サイズは5MB以下にしてください。"
    };

  }

  return {
    valid: true,
    message: ""
  };
}

// ==================================================
// UPLOAD IMAGE
// ==================================================

async function uploadScheduleImage(
  file
) {

  const validation =
    validateScheduleImage(
      file
    );

  if (!validation.valid) {

    setScheduleImageMessage(
      validation.message,
      "error"
    );

    return;
  }

  setScheduleImageMessage(
    "アップロードしています..."
  );

  try {

    const path =
      createScheduleImagePath(
        file
      );

    const {
      error: uploadError
    } =
      await supabaseClient
        .storage
        .from(
          SCHEDULE_IMAGE_BUCKET
        )
        .upload(
          path,
          file,
          {
            cacheControl:
              "3600",
            upsert:
              false
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data
    } =
      supabaseClient
        .storage
        .from(
          SCHEDULE_IMAGE_BUCKET
        )
        .getPublicUrl(
          path
        );

    const publicUrl =
      data?.publicUrl || "";

    if (!publicUrl) {

      throw new Error(
        "画像URLを取得できませんでした。"
      );

    }

    if (
      currentScheduleThumbnailPath &&
      pendingScheduleUploadedPaths
        .includes(
          currentScheduleThumbnailPath
        )
    ) {

      await removeScheduleStorageFile(
        currentScheduleThumbnailPath
      );

      pendingScheduleUploadedPaths =
        pendingScheduleUploadedPaths
          .filter(
            (item) =>
              item !==
              currentScheduleThumbnailPath
          );

    }

    currentScheduleThumbnailUrl =
      publicUrl;

    currentScheduleThumbnailPath =
      path;

    pendingScheduleUploadedPaths.push(
      path
    );

    if (scheduleThumbnailInput) {

      scheduleThumbnailInput.value =
        publicUrl;

    }

    showScheduleThumbnail(
      publicUrl
    );

    setScheduleImageMessage(
      "画像をアップロードしました。",
      "success"
    );

  } catch (error) {

    console.error(
      "Schedule image upload error:",
      error
    );

    setScheduleImageMessage(
      "画像のアップロードに失敗しました。",
      "error"
    );

  }
}

// ==================================================
// IMAGE INPUT
// ==================================================

scheduleImageInput
  ?.addEventListener(
    "change",
    async () => {

      const file =
        scheduleImageInput
          .files?.[0];

      if (!file) {
        return;
      }

      await uploadScheduleImage(
        file
      );

    }
  );

// ==================================================
// DROP ZONE CLICK
// ==================================================

scheduleImageDropZone
  ?.addEventListener(
    "click",
    () => {

      scheduleImageInput
        ?.click();

    }
  );

// ==================================================
// DROP ZONE KEYBOARD
// ==================================================

scheduleImageDropZone
  ?.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        scheduleImageInput
          ?.click();

      }

    }
  );

// ==================================================
// DRAG
// ==================================================

[
  "dragenter",
  "dragover"
].forEach(
  (eventName) => {

    scheduleImageDropZone
      ?.addEventListener(
        eventName,
        (event) => {

          event.preventDefault();

          scheduleImageDropZone
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

    scheduleImageDropZone
      ?.addEventListener(
        eventName,
        (event) => {

          event.preventDefault();

          scheduleImageDropZone
            .classList.remove(
              "dragover"
            );

        }
      );

  }
);

// ==================================================
// DROP
// ==================================================

scheduleImageDropZone
  ?.addEventListener(
    "drop",
    async (event) => {

      const file =
        event
          .dataTransfer
          ?.files?.[0];

      if (!file) {
        return;
      }

      await uploadScheduleImage(
        file
      );

    }
  );

// ==================================================
// DELETE THUMBNAIL
// ==================================================

scheduleThumbnailDeleteButton
  ?.addEventListener(
    "click",
    async () => {

      if (
        currentScheduleThumbnailPath &&
        pendingScheduleUploadedPaths
          .includes(
            currentScheduleThumbnailPath
          )
      ) {

        await removeScheduleStorageFile(
          currentScheduleThumbnailPath
        );

        pendingScheduleUploadedPaths =
          pendingScheduleUploadedPaths
            .filter(
              (path) =>
                path !==
                currentScheduleThumbnailPath
            );

      }

      currentScheduleThumbnailUrl =
        "";

      currentScheduleThumbnailPath =
        "";

      if (scheduleThumbnailInput) {

        scheduleThumbnailInput.value =
          "";

      }

      showScheduleThumbnail(
        ""
      );

      setScheduleImageMessage(
        "サムネイルを削除しました。",
        "success"
      );

    }
  );

// ==================================================
// YOUTUBE VIDEO ID
// ==================================================

function getYoutubeVideoId(
  url
) {

  if (!url) {
    return "";
  }

  try {

    const parsed =
      new URL(
        url
      );

    if (
      parsed.hostname ===
      "youtu.be"
    ) {

      return parsed.pathname
        .replace(
          "/",
          ""
        )
        .trim();

    }

    if (
      parsed.hostname.includes(
        "youtube.com"
      )
    ) {

      if (
        parsed.pathname.startsWith(
          "/shorts/"
        )
      ) {

        return (
          parsed.pathname
            .split("/")[2] ||
          ""
        );

      }

      if (
        parsed.pathname.startsWith(
          "/live/"
        )
      ) {

        return (
          parsed.pathname
            .split("/")[2] ||
          ""
        );

      }

      return (
        parsed.searchParams.get(
          "v"
        ) || ""
      );

    }

  } catch (error) {

    console.error(
      "YouTube URL parse error:",
      error
    );

  }

  return "";
}

// ==================================================
// GET YOUTUBE THUMBNAIL
// ==================================================

scheduleYoutubeThumbnailButton
  ?.addEventListener(
    "click",
    () => {

      const url =
        scheduleUrlInput
          ?.value
          .trim() || "";

      if (!url) {

        setScheduleImageMessage(
          "先に配信URLを入力してください。",
          "error"
        );

        return;
      }

      const videoId =
        getYoutubeVideoId(
          url
        );

      if (!videoId) {

        setScheduleImageMessage(
          "YouTubeのURLを確認してください。",
          "error"
        );

        return;
      }

      const thumbnailUrl =
        `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

      currentScheduleThumbnailUrl =
        thumbnailUrl;

      currentScheduleThumbnailPath =
        "";

      if (scheduleThumbnailInput) {

        scheduleThumbnailInput.value =
          thumbnailUrl;

      }

      showScheduleThumbnail(
        thumbnailUrl
      );

      setScheduleImageMessage(
        "YouTubeサムネイルを設定しました。",
        "success"
      );

    }
  );

// ==================================================
// RESET FORM
// ==================================================

function resetScheduleForm() {

  scheduleForm?.reset();

  if (scheduleIdInput) {

    scheduleIdInput.value =
      "";

  }

  if (scheduleFormTitle) {

    scheduleFormTitle.textContent =
      "SCHEDULEを追加";

  }

  if (schedulePublishedInput) {

    schedulePublishedInput.checked =
      true;

  }

  resetScheduleThumbnailManager();

  setScheduleFormMessage(
    ""
  );
}

// ==================================================
// OPEN NEW FORM
// ==================================================

async function openNewScheduleForm(
  changeView = true
) {

  resetScheduleForm();

  await loadScheduleTalents();

  if (changeView) {

    await switchScheduleView(
      "new",
      {
        resetForm: false
      }
    );

  }

  scheduleTalentInput
    ?.focus();
}

// ==================================================
// CLOSE FORM
// ==================================================

async function closeScheduleForm() {

  for (
    const path of
    pendingScheduleUploadedPaths
  ) {

    await removeScheduleStorageFile(
      path
    );

  }

  pendingScheduleUploadedPaths =
    [];

  resetScheduleForm();

  await switchScheduleView(
    "list"
  );
}

// ==================================================
// FORM EVENTS
// ==================================================

scheduleCancelButton
  ?.addEventListener(
    "click",
    () => {

      closeScheduleForm();

    }
  );

scheduleCancelButtonBottom
  ?.addEventListener(
    "click",
    () => {

      closeScheduleForm();

    }
  );

reloadScheduleButton
  ?.addEventListener(
    "click",
    () => {

      loadSchedules();

    }
  );

// ==================================================
// FORMAT DATE
// ==================================================

function formatScheduleDate(
  value
) {

  if (!value) {
    return "";
  }

  const parts =
    String(value)
      .split("-");

  if (
    parts.length !== 3
  ) {

    return value;

  }

  return (
    `${parts[0]}/${parts[1]}/${parts[2]}`
  );
}

// ==================================================
// LOAD SCHEDULES
// ==================================================

async function loadSchedules() {

  if (!adminScheduleList) {
    return;
  }

  adminScheduleList.innerHTML = `
    <p class="loading-text">
      読み込み中...
    </p>
  `;

  if (scheduleListCount) {

    scheduleListCount.textContent =
      "";

  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "schedules"
        )
        .select(
          "*"
        )
        .order(
          "stream_date",
          {
            ascending: false
          }
        )
        .order(
          "start_time",
          {
            ascending: false
          }
        );

    if (error) {
      throw error;
    }

    const schedules =
      Array.isArray(data)
        ? data
        : [];

    if (scheduleListCount) {

      scheduleListCount.textContent =
        `${schedules.length}件`;

    }

    if (
      schedules.length === 0
    ) {

      adminScheduleList.innerHTML = `
        <p class="empty-text">
          登録済みSCHEDULEはありません。
        </p>
      `;

      return;
    }

    adminScheduleList.innerHTML =
      schedules
        .map(
          (schedule) => {

            const date =
              formatScheduleDate(
                schedule.stream_date
              );

            const time =
              schedule.start_time
                ? String(
                    schedule.start_time
                  ).slice(
                    0,
                    5
                  )
                : "";

            const statusText =
              schedule.published
                ? "公開"
                : "非公開";

            const statusClass =
              schedule.published
                ? "published"
                : "draft";

            const thumbnail =
              schedule.thumbnail
                ? `
                    <div class="schedule-admin-thumbnail">

                      <img
                        src="${escapeScheduleHTML(
                          schedule.thumbnail
                        )}"
                        alt=""
                        loading="lazy"
                        decoding="async"
                      >

                    </div>
                  `
                : `
                    <div class="schedule-admin-thumbnail">

                      <div class="schedule-thumbnail-empty">
                        NO IMAGE
                      </div>

                    </div>
                  `;

            return `
              <article class="admin-list-item schedule-admin-item">

                ${thumbnail}

                <div class="admin-list-item-main">

                  <div class="admin-list-item-title">

                    ${escapeScheduleHTML(
                      schedule.talent ||
                      "タレント未設定"
                    )}

                  </div>

                  <div class="admin-list-item-meta">

                    ${escapeScheduleHTML(
                      date
                    )}

                    ${
                      time
                        ? ` ${escapeScheduleHTML(
                            time
                          )}`
                        : ""
                    }

                  </div>

                  <div class="admin-list-item-meta">

                    <span
                      class="status-badge ${statusClass}"
                    >
                      ${statusText}
                    </span>

                  </div>

                </div>

                <div class="admin-list-item-actions">

                  <button
                    type="button"
                    class="edit-button"
                    data-schedule-edit="${escapeScheduleHTML(
                      schedule.id
                    )}"
                  >
                    編集
                  </button>

                  <button
                    type="button"
                    class="delete-button"
                    data-schedule-delete="${escapeScheduleHTML(
                      schedule.id
                    )}"
                  >
                    削除
                  </button>

                </div>

              </article>
            `;

          }
        )
        .join("");

    bindScheduleListEvents();

  } catch (error) {

    console.error(
      "Schedule load error:",
      error
    );

    adminScheduleList.innerHTML = `
      <p class="error-text">
        SCHEDULEの取得に失敗しました。
      </p>
    `;

  }
}

window.loadSchedules =
  loadSchedules;

// ==================================================
// LIST EVENTS
// ==================================================

// 一覧の再描画ごとに各ボタンへイベントを付けず、親要素に一度だけ登録。
let scheduleListEventsBound = false;
function bindScheduleListEvents() {
  if (!adminScheduleList || scheduleListEventsBound) return;
  adminScheduleList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-schedule-edit], [data-schedule-delete]");
    if (!button || !adminScheduleList.contains(button)) return;
    const editId = button.dataset.scheduleEdit;
    const deleteId = button.dataset.scheduleDelete;
    if (editId) {
      editSchedule(editId);
    } else if (deleteId) {
      deleteSchedule(deleteId);
    }
  });
  scheduleListEventsBound = true;
}

// ==================================================
// EDIT SCHEDULE
// ==================================================

async function editSchedule(
  id
) {

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "schedules"
        )
        .select(
          "*"
        )
        .eq(
          "id",
          id
        )
        .single();

    if (error) {
      throw error;
    }

    await switchScheduleView(
      "new",
      {
        resetForm: false
      }
    );

    resetScheduleForm();

    await loadScheduleTalents();

    if (scheduleIdInput) {

      scheduleIdInput.value =
        data.id || "";

    }

    if (scheduleTalentInput) {

      const talentId =
        data.talent_id
          ? String(
              data.talent_id
            )
          : "";

      const talentName =
        data.talent || "";

      let selectedOption =
        null;

      // ----------------------------------------------
      // talent_id を優先して探す
      // ----------------------------------------------

      if (talentId) {

        selectedOption =
          Array.from(
            scheduleTalentInput.options
          )
            .find(
              (option) =>
                String(
                  option.dataset?.talentId || ""
                ) ===
                talentId
            );

      }

      // ----------------------------------------------
      // 古いデータはタレント名で探す
      // ----------------------------------------------

      if (
        !selectedOption &&
        talentName
      ) {

        selectedOption =
          Array.from(
            scheduleTalentInput.options
          )
            .find(
              (option) =>
                option.value ===
                talentName
            );

      }

      // ----------------------------------------------
      // 登録済みタレントが見つかった場合
      // ----------------------------------------------

      if (selectedOption) {

        scheduleTalentInput.value =
          selectedOption.value;

      }

      // ----------------------------------------------
      // talents に存在しない古いデータ
      // ----------------------------------------------

      else if (talentName) {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          talentName;

        option.textContent =
          talentName;

        if (talentId) {

          option.dataset.talentId =
            talentId;

        }

        scheduleTalentInput
          .appendChild(
            option
          );

        scheduleTalentInput.value =
          talentName;

      }

    }

    if (scheduleDateInput) {

      scheduleDateInput.value =
        data.stream_date || "";

    }

    if (scheduleTimeInput) {

      scheduleTimeInput.value =
        data.start_time
          ? String(
              data.start_time
            ).slice(
              0,
              5
            )
          : "";

    }

    if (scheduleUrlInput) {

      scheduleUrlInput.value =
        data.url || "";

    }

    if (schedulePublishedInput) {

      schedulePublishedInput.checked =
        Boolean(
          data.published
        );

    }

    currentScheduleThumbnailUrl =
      data.thumbnail || "";

    currentScheduleThumbnailPath =
      getScheduleImageStoragePath(
        data.thumbnail || ""
      );

    originalScheduleThumbnailUrl =
      currentScheduleThumbnailUrl;

    originalScheduleThumbnailPath =
      currentScheduleThumbnailPath;

    pendingScheduleUploadedPaths =
      [];

    if (scheduleThumbnailInput) {

      scheduleThumbnailInput.value =
        currentScheduleThumbnailUrl;

    }

    showScheduleThumbnail(
      currentScheduleThumbnailUrl
    );

    if (scheduleFormTitle) {

      scheduleFormTitle.textContent =
        "SCHEDULEを編集";

    }

    setScheduleFormMessage(
      ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  } catch (error) {

    console.error(
      "Schedule edit load error:",
      error
    );

    alert(
      "SCHEDULEの取得に失敗しました。"
    );

  }

}

// ==================================================
// SAVE SCHEDULE
// ==================================================

scheduleForm
  ?.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      setScheduleFormMessage(
        "保存しています..."
      );

      const id =
        scheduleIdInput
          ?.value
          .trim() || "";

      const talent =
        scheduleTalentInput
          ?.value
          .trim() || "";

      const selectedTalentOption =
        scheduleTalentInput
          ?.selectedOptions?.[0];

      const talentId =
        selectedTalentOption
          ?.dataset
          ?.talentId ||
        null;

      const streamDate =
        scheduleDateInput
          ?.value || "";

      const startTime =
        scheduleTimeInput
          ?.value || "";

      const url =
        scheduleUrlInput
          ?.value
          .trim() || "";

      const thumbnail =
        currentScheduleThumbnailUrl ||
        "";

      const published =
        Boolean(
          schedulePublishedInput
            ?.checked
        );

      // --------------------------------------------------
      // VALIDATION
      // --------------------------------------------------

      if (!talent) {

        setScheduleFormMessage(
          "タレントを選択してください。",
          "error"
        );

        scheduleTalentInput
          ?.focus();

        return;
      }

      if (!streamDate) {

        setScheduleFormMessage(
          "配信日を入力してください。",
          "error"
        );

        scheduleDateInput
          ?.focus();

        return;
      }

      if (!startTime) {

        setScheduleFormMessage(
          "開始時刻を入力してください。",
          "error"
        );

        scheduleTimeInput
          ?.focus();

        return;
      }

      // --------------------------------------------------
      // PAYLOAD
      //
      // title / category は既存DB互換用。
      // 管理画面には表示しません。
      // --------------------------------------------------

      const payload = {

        talent:
          talent,

        talent_id:
          talentId,

        stream_date:
          streamDate,

        start_time:
          startTime,

        title:
          "配信予定",

        category:
          "配信",

        url:
          url || null,

        thumbnail:
          thumbnail || null,

        published:
          published,

        updated_at:
          new Date()
            .toISOString()

      };

      try {

        let result;

        if (id) {

          result =
            await supabaseClient
              .from(
                "schedules"
              )
              .update(
                payload
              )
              .eq(
                "id",
                id
              );

        } else {

          result =
            await supabaseClient
              .from(
                "schedules"
              )
              .insert(
                payload
              );

        }

        if (result.error) {

          throw result.error;

        }

        // --------------------------------------------------
        // REMOVE OLD THUMBNAIL
        // --------------------------------------------------

        if (
          originalScheduleThumbnailPath &&
          originalScheduleThumbnailUrl !==
            thumbnail
        ) {

          await removeScheduleStorageFile(
            originalScheduleThumbnailPath
          );

        }

        // --------------------------------------------------
        // KEEP SAVED IMAGE
        // --------------------------------------------------

        const finalThumbnailPath =
          getScheduleImageStoragePath(
            thumbnail
          );

        pendingScheduleUploadedPaths =
          pendingScheduleUploadedPaths
            .filter(
              (path) =>
                path !==
                finalThumbnailPath
            );

        // --------------------------------------------------
        // REMOVE UNUSED UPLOADS
        // --------------------------------------------------

        for (
          const path of
          pendingScheduleUploadedPaths
        ) {

          await removeScheduleStorageFile(
            path
          );

        }

        pendingScheduleUploadedPaths =
          [];

        setScheduleFormMessage(
          "保存しました。",
          "success"
        );

        await loadSchedules();

        setTimeout(
          async () => {

            resetScheduleForm();

            await switchScheduleView(
              "list"
            );

          },
          400
        );

      } catch (error) {

        console.error(
          "Schedule save error:",
          error
        );

        setScheduleFormMessage(
          error?.message ||
          "SCHEDULEの保存に失敗しました。",
          "error"
        );

      }

    }
  );

// ==================================================
// DELETE SCHEDULE
// ==================================================

async function deleteSchedule(
  id
) {

  const confirmed =
    window.confirm(
      "このSCHEDULEを削除しますか？"
    );

  if (!confirmed) {
    return;
  }

  try {

    // --------------------------------------------------
    // FETCH THUMBNAIL
    // --------------------------------------------------

    const {
      data,
      error: fetchError
    } =
      await supabaseClient
        .from(
          "schedules"
        )
        .select(
          "thumbnail"
        )
        .eq(
          "id",
          id
        )
        .single();

    if (fetchError) {
      throw fetchError;
    }

    // --------------------------------------------------
    // DELETE DB
    // --------------------------------------------------

    const {
      error
    } =
      await supabaseClient
        .from(
          "schedules"
        )
        .delete()
        .eq(
          "id",
          id
        );

    if (error) {
      throw error;
    }

    // --------------------------------------------------
    // DELETE STORAGE IMAGE
    // --------------------------------------------------

    const thumbnailPath =
      getScheduleImageStoragePath(
        data?.thumbnail || ""
      );

    if (thumbnailPath) {

      await removeScheduleStorageFile(
        thumbnailPath
      );

    }

    await loadSchedules();

  } catch (error) {

    console.error(
      "Schedule delete error:",
      error
    );

    alert(
      "SCHEDULEの削除に失敗しました。"
    );

  }
}

// ==================================================
// AUTO DELETE SETTINGS
// ==================================================

function setScheduleAutoDeleteMessage(
  message,
  type = ""
) {

  if (!scheduleAutoDeleteMessage) {
    return;
  }

  scheduleAutoDeleteMessage.textContent =
    message || "";

  scheduleAutoDeleteMessage
    .classList.remove(
      "success",
      "error"
    );

  if (type) {

    scheduleAutoDeleteMessage
      .classList.add(
        type
      );

  }
}

// ==================================================
// FORMAT AUTO DELETE LAST RUN
// ==================================================

function formatScheduleAutoDeleteLastRun(
  value
) {

  if (!value) {

    return "まだ実行されていません";

  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return String(
      value
    );

  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone:
        "Asia/Tokyo",

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",

      hour:
        "2-digit",

      minute:
        "2-digit",

      second:
        "2-digit"
    }
  ).format(
    date
  );
}

// ==================================================
// LOAD AUTO DELETE SETTINGS
// ==================================================

async function loadScheduleAutoDeleteSettings() {

  setScheduleAutoDeleteMessage(
    ""
  );

  if (scheduleAutoDeleteLastRun) {

    scheduleAutoDeleteLastRun.textContent =
      "読み込み中...";

  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "schedule_cleanup_settings"
        )
        .select(
          "id, enabled, keep_days, last_run_at, updated_at"
        )
        .eq(
          "id",
          1
        )
        .maybeSingle();

    if (error) {

      throw error;

    }

    if (!data) {

      throw new Error(
        "自動削除設定が見つかりません。"
      );

    }

    if (scheduleAutoDeleteEnabled) {

      scheduleAutoDeleteEnabled.checked =
        Boolean(
          data.enabled
        );

    }

    if (scheduleAutoDeleteKeepDays) {

      scheduleAutoDeleteKeepDays.value =
        String(
          data.keep_days ?? 1
        );

    }

    if (scheduleAutoDeleteLastRun) {

      scheduleAutoDeleteLastRun.textContent =
        formatScheduleAutoDeleteLastRun(
          data.last_run_at
        );

    }

  } catch (error) {

    console.error(
      "Schedule auto delete settings load error:",
      error
    );

    if (scheduleAutoDeleteLastRun) {

      scheduleAutoDeleteLastRun.textContent =
        "取得できませんでした";

    }

    setScheduleAutoDeleteMessage(
      error?.message ||
      "自動削除設定の読み込みに失敗しました。",
      "error"
    );

  }
}

// ==================================================
// SAVE AUTO DELETE SETTINGS
// ==================================================

async function saveScheduleAutoDeleteSettings() {

  setScheduleAutoDeleteMessage(
    ""
  );

  const enabled =
    Boolean(
      scheduleAutoDeleteEnabled
        ?.checked
    );

  const rawKeepDays =
    scheduleAutoDeleteKeepDays
      ?.value ?? "";

  const keepDays =
    Number(
      rawKeepDays
    );

  if (
    rawKeepDays === "" ||
    !Number.isInteger(
      keepDays
    ) ||
    keepDays < 0 ||
    keepDays > 365
  ) {

    setScheduleAutoDeleteMessage(
      "残す日数は0〜365の整数で入力してください。",
      "error"
    );

    scheduleAutoDeleteKeepDays
      ?.focus();

    return;
  }

  if (
    saveScheduleAutoDeleteSettingsButton
  ) {

    saveScheduleAutoDeleteSettingsButton.disabled =
      true;

    saveScheduleAutoDeleteSettingsButton.textContent =
      "保存中...";

  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from(
          "schedule_cleanup_settings"
        )
        .update({
          enabled:
            enabled,

          keep_days:
            keepDays,

          updated_at:
            new Date()
              .toISOString()
        })
        .eq(
          "id",
          1
        )
        .select(
          "id, enabled, keep_days, last_run_at, updated_at"
        )
        .single();

    if (error) {

      throw error;

    }

    if (scheduleAutoDeleteEnabled) {

      scheduleAutoDeleteEnabled.checked =
        Boolean(
          data.enabled
        );

    }

    if (scheduleAutoDeleteKeepDays) {

      scheduleAutoDeleteKeepDays.value =
        String(
          data.keep_days
        );

    }

    if (scheduleAutoDeleteLastRun) {

      scheduleAutoDeleteLastRun.textContent =
        formatScheduleAutoDeleteLastRun(
          data.last_run_at
        );

    }

    setScheduleAutoDeleteMessage(
      "自動削除設定を保存しました。",
      "success"
    );

  } catch (error) {

    console.error(
      "Schedule auto delete settings save error:",
      error
    );

    setScheduleAutoDeleteMessage(
      error?.message ||
      "自動削除設定の保存に失敗しました。",
      "error"
    );

  } finally {

    if (
      saveScheduleAutoDeleteSettingsButton
    ) {

      saveScheduleAutoDeleteSettingsButton.disabled =
        false;

      saveScheduleAutoDeleteSettingsButton.textContent =
        "設定を保存";

    }

  }
}

saveScheduleAutoDeleteSettingsButton
  ?.addEventListener(
    "click",
    saveScheduleAutoDeleteSettings
  );

window.loadScheduleAutoDeleteSettings =
  loadScheduleAutoDeleteSettings;

// ==================================================
// URL PARAMETER
// ==================================================

async function initializeScheduleAdmin() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  let initialView =
    params.get(
      "view"
    );

  const action =
    params.get(
      "action"
    );

  // 旧管理TOPの
  // ?view=list&action=new にも対応

  if (
    action === "new"
  ) {

    initialView =
      "new";

  }

  const allowedViews = [
    "list",
    "new",
    "youtube",
    "talent",
    "auto-delete",
    "weekly"
  ];

  if (
    !allowedViews.includes(
      initialView
    )
  ) {

    initialView =
      "list";

  }

  await switchScheduleView(
    initialView,
    {
      resetForm: true,
      updateUrl: false
    }
  );
}

// ==================================================
// INITIAL LOAD
// ==================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeScheduleAdmin();

  }
);

// Weekly image tab
document.getElementById("scheduleWeeklyTabButton")?.addEventListener("click", () => switchScheduleView("weekly"));
