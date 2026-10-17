/* =========================================================
   AN:RIEL
   ADMIN MAIN
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const logoutButton =
  document.getElementById("logoutButton");

const adminTabs =
  document.querySelectorAll(".admin-tab");

const adminPanels =
  document.querySelectorAll(".admin-panel");


/* =========================================================
   NEWS ELEMENTS
========================================================= */

const newsListTabButton =
  document.getElementById("newsListTabButton");

const newsCategoryTabButton =
  document.getElementById("newsCategoryTabButton");

const newsListView =
  document.getElementById("newsListView");

const newsCategoryView =
  document.getElementById("newsCategoryView");


/* =========================================================
   SESSION CHECK
========================================================= */

async function checkAdminSession() {

  try {

    const {
      data,
      error
    } = await supabaseClient.auth.getSession();


    if (error) {

      console.error(
        "SESSION ERROR:",
        error
      );

      window.location.href =
        "login.html";

      return false;
    }


    if (
      !data ||
      !data.session
    ) {

      window.location.href =
        "login.html";

      return false;
    }


    return true;

  } catch (error) {

    console.error(
      "SESSION CHECK ERROR:",
      error
    );

    window.location.href =
      "login.html";

    return false;
  }
}


/* =========================================================
   LOGOUT
========================================================= */

async function logoutAdmin() {

  if (!logoutButton) {
    return;
  }


  const originalText =
    logoutButton.textContent;


  logoutButton.disabled =
    true;

  logoutButton.textContent =
    "LOGOUT...";


  try {

    const {
      error
    } = await supabaseClient
      .auth
      .signOut();


    if (error) {

      console.error(
        "LOGOUT ERROR:",
        error
      );

      alert(
        "ログアウトに失敗しました。"
      );

      logoutButton.disabled =
        false;

      logoutButton.textContent =
        originalText;

      return;
    }


    window.location.href =
      "login.html";


  } catch (error) {

    console.error(
      "LOGOUT ERROR:",
      error
    );

    alert(
      "ログアウトに失敗しました。"
    );

    logoutButton.disabled =
      false;

    logoutButton.textContent =
      originalText;
  }
}


/* =========================================================
   MAIN TAB
========================================================= */

function switchAdminTab(tabName) {

  /*
   * TAB BUTTON
   */

  adminTabs.forEach(
    (tab) => {

      const isActive =
        tab.dataset.tab ===
        tabName;

      tab.classList.toggle(
        "active",
        isActive
      );

    }
  );


  /*
   * PANEL
   */

  adminPanels.forEach(
    (panel) => {

      const targetId =
        `${tabName}Panel`;

      const isActive =
        panel.id ===
        targetId;

      panel.classList.toggle(
        "active",
        isActive
      );

    }
  );


  /*
   * NEWS
   */

  if (
    tabName === "news"
  ) {

    initializeNewsPanel();

  }


  /*
   * SCHEDULE
   */

  if (
    tabName === "schedule"
  ) {

    initializeSchedulePanel();

  }


  /*
   * GOODS
   */

  if (
    tabName === "goods"
  ) {

    initializeGoodsPanel();

  }

}


/* =========================================================
   NEWS INNER VIEW
========================================================= */

function switchNewsView(view) {

  if (
    !newsListView ||
    !newsCategoryView
  ) {
    return;
  }


  const isList =
    view === "list";


  /*
   * VIEW
   */

  newsListView.classList.toggle(
    "active",
    isList
  );

  newsCategoryView.classList.toggle(
    "active",
    !isList
  );


  /*
   * BUTTON
   */

  newsListTabButton
    ?.classList
    .toggle(
      "active",
      isList
    );


  newsCategoryTabButton
    ?.classList
    .toggle(
      "active",
      !isList
    );


  /*
   * DATA LOAD
   */

  if (isList) {

    if (
      typeof loadNews ===
      "function"
    ) {

      loadNews(1);

    }

  } else {

    if (
      typeof loadNewsCategories ===
      "function"
    ) {

      loadNewsCategories();

    }

  }

}


/* =========================================================
   INITIALIZE NEWS PANEL
========================================================= */

async function initializeNewsPanel() {

  try {

    /*
     * CATEGORY
     */

    if (
      typeof loadNewsCategories ===
      "function"
    ) {

      await loadNewsCategories();

    }


    /*
     * NEWS LIST
     */

    if (
      typeof loadNews ===
      "function"
    ) {

      await loadNews(1);

    }


  } catch (error) {

    console.error(
      "NEWS INITIALIZE ERROR:",
      error
    );

  }

}


/* =========================================================
   INITIALIZE SCHEDULE PANEL
========================================================= */

async function initializeSchedulePanel() {

  try {

    /*
     * schedule-admin.js 側で
     * loadScheduleCategories が存在する場合
     */

    if (
      typeof loadScheduleCategories ===
      "function"
    ) {

      await loadScheduleCategories();

    }


    /*
     * SCHEDULE LIST
     */

    if (
      typeof loadSchedules ===
      "function"
    ) {

      await loadSchedules();

    }


  } catch (error) {

    console.error(
      "SCHEDULE INITIALIZE ERROR:",
      error
    );

  }

}


/* =========================================================
   INITIALIZE GOODS PANEL
========================================================= */

async function initializeGoodsPanel() {

  try {

    /*
     * goods-admin.js にある
     * 初期化関数を使用
     */

    if (
      typeof window.initializeGoodsAdmin ===
      "function"
    ) {

      await window
        .initializeGoodsAdmin();

      return;
    }


    /*
     * 万が一 initializeGoodsAdmin が
     * 見つからない場合のフォールバック
     */

    if (
      typeof window.loadAllGoodsCategories ===
      "function"
    ) {

      await window
        .loadAllGoodsCategories();

    }


    if (
      typeof window.loadGoods ===
      "function"
    ) {

      await window
        .loadGoods();

    }


  } catch (error) {

    console.error(
      "GOODS INITIALIZE ERROR:",
      error
    );

  }

}


/* =========================================================
   MAIN TAB EVENTS
========================================================= */

adminTabs.forEach(
  (tab) => {

    tab.addEventListener(
      "click",
      () => {

        const tabName =
          tab.dataset.tab;


        if (!tabName) {
          return;
        }


        switchAdminTab(
          tabName
        );

      }
    );

  }
);


/* =========================================================
   NEWS INNER TAB EVENTS
========================================================= */

newsListTabButton
  ?.addEventListener(
    "click",
    () => {

      switchNewsView(
        "list"
      );

    }
  );


newsCategoryTabButton
  ?.addEventListener(
    "click",
    () => {

      switchNewsView(
        "category"
      );

    }
  );


/* =========================================================
   LOGOUT EVENT
========================================================= */

logoutButton
  ?.addEventListener(
    "click",
    logoutAdmin
  );


/* =========================================================
   AUTH STATE CHANGE
========================================================= */

supabaseClient
  .auth
  .onAuthStateChange(
    (
      event,
      session
    ) => {

      /*
       * ログアウトされた場合
       */

      if (
        event === "SIGNED_OUT" ||
        !session
      ) {

        window.location.href =
          "login.html";

      }

    }
  );


/* =========================================================
   INITIALIZE ADMIN
========================================================= */

async function initializeAdmin() {

  /*
   * LOGIN CHECK
   */

  const authenticated =
    await checkAdminSession();


  if (!authenticated) {
    return;
  }


  /*
   * 初期表示はNEWS
   */

  switchAdminTab(
    "news"
  );


  /*
   * NEWS INNER VIEWも
   * 一覧を初期表示
   */

  switchNewsView(
    "list"
  );


  /*
   * GOODS/SCHEDULEについては
   * タブを開いた時にデータ取得するため
   * 初期ロードでは呼び出さない
   */

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeAdmin
);