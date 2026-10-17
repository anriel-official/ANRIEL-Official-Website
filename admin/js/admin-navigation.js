/* AN:RIEL 管理メニュー + オンラインスタッフ表示 */
(() => {
  "use strict";

  const features = [
    ["top", "TOP画像管理"],
    ["news", "NEWS管理"],
    ["schedule", "SCHEDULE管理"],
    ["goods", "GOODS管理"],
    ["talent", "TALENT管理"],
  ];

  const current = document.currentScript;
  const base = new URL("../", current.src);
  const target = document.body.dataset.adminFeature || "home";
  const page = (feature) =>
    new URL(feature === "home" ? "index.html" : `${feature}/index.html`, base).href;
  const nav = document.querySelector("nav.admin-tabs");
  if (!nav) return;
  nav.style.visibility = "hidden";

  function createLink(feature, label) {
    const a = document.createElement("a");
    a.className = "admin-tab" + (feature === target ? " active" : "");
    if (feature === target) a.setAttribute("aria-current", "page");
    a.href = page(feature);
    a.textContent = label;
    return a;
  }

  function showMessage(message) {
    nav.replaceChildren();
    const p = document.createElement("p");
    p.textContent = message;
    p.style.cssText = "padding:12px 18px;color:#b12727;font-size:13px;";
    nav.append(p);
    nav.style.visibility = "visible";
  }

  async function checkContactPermission() {
    const { data, error } = await supabaseClient.rpc(
      "has_admin_feature_permission",
      { requested_feature: "contact", requested_action: "view" }
    );
    if (error) {
      console.error("CONTACT権限確認エラー:", error);
      return false;
    }
    return data === true;
  }

  function initializePresence(userId) {
    const headerRight = document.querySelector(".admin-header-right");
    if (!headerRight || !userId) return;
    if (document.getElementById("anrielOnlineButton")) return;


    const root = document.createElement("div");
    root.className = "anriel-presence";
    const button = document.createElement("button");
    button.type = "button";
    button.id = "anrielOnlineButton";
    button.className = "anriel-presence-button";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "オンラインスタッフ一覧");
    const dot = document.createElement("span");
    dot.className = "anriel-presence-dot";
    dot.setAttribute("aria-hidden", "true");
    const count = document.createElement("span");
    count.textContent = "ONLINE --";
    const arrow = document.createElement("span");
    arrow.textContent = "⌄";
    arrow.className = "anriel-presence-arrow";
    arrow.setAttribute("aria-hidden", "true");
    button.append(dot, count, arrow);

    const panel = document.createElement("div");
    panel.className = "anriel-presence-panel";
    panel.id = "anrielOnlinePanel";
    panel.hidden = true;
    const heading = document.createElement("p");
    heading.className = "anriel-presence-heading";
    heading.textContent = "オンラインスタッフ";
    const total = document.createElement("span");
    total.className = "anriel-presence-total";
    total.textContent = "--人";
    const panelHeader = document.createElement("div");
    panelHeader.className = "anriel-presence-panel-header";
    panelHeader.append(heading, total);
    const list = document.createElement("ul");
    list.className = "anriel-presence-list";
    panel.append(panelHeader, list);
    root.append(button, panel);
    const adminLabel = headerRight.querySelector(".admin-header-label");
    if (adminLabel) headerRight.insertBefore(root, adminLabel);
    else headerRight.prepend(root);

    let lastActivity = Date.now();
    let heartbeatRunning = false;
    let refreshRunning = false;

    const markActivity = () => { lastActivity = Date.now(); };
    ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
      document.addEventListener(eventName, markActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        markActivity();
        void heartbeat().then(refresh);
      }
    });

    async function heartbeat() {
      if (heartbeatRunning || document.hidden || Date.now() - lastActivity >= 5 * 60 * 1000) return;
      heartbeatRunning = true;
      try {
        const { error } = await supabaseClient.from("admin_presence").upsert(
          { user_id: userId, last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { onConflict: "user_id" }
        );
        if (error) console.error("オンライン状態更新エラー:", error);
      } catch (error) {
        console.error("オンライン状態更新エラー:", error);
      } finally {
        heartbeatRunning = false;
      }
    }

    async function refresh() {
      if (refreshRunning || document.hidden) return;
      refreshRunning = true;
      try {
        const { data, error } = await supabaseClient.rpc("get_online_admin_staff");
        if (error) throw error;
        const people = Array.isArray(data) ? data : [];
        count.textContent = `ONLINE ${people.length}`;
        total.textContent = `${people.length}人`;
        list.replaceChildren();
        if (!people.length) {
          const empty = document.createElement("li");
          empty.className = "anriel-presence-status";
          empty.textContent = "オンラインスタッフなし";
          list.append(empty);
          return;
        }
        const peopleFragment = document.createDocumentFragment();
        for (const person of people) {
          const item = document.createElement("li");
          item.className = "anriel-presence-item";
          const indicator = document.createElement("span");
          indicator.className = "anriel-presence-dot";
          const name = document.createElement("span");
          name.className = "anriel-presence-name";
          name.textContent = (person.role === "engineer" || person.display_name === "エンジニア") ? "白瀬はまや" : (person.display_name || "名前未設定");
          item.append(indicator, name);
          peopleFragment.append(item);
        }
        list.append(peopleFragment);
      } catch (error) {
        console.error("オンラインスタッフ取得エラー:", error);
        count.textContent = "ONLINE --";
        total.textContent = "--人";
        list.replaceChildren();
        const errorItem = document.createElement("li");
        errorItem.className = "anriel-presence-status";
        errorItem.textContent = "オンライン状況を取得できません";
        list.append(errorItem);
      } finally {
        refreshRunning = false;
      }
    }

    button.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      button.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) void refresh();
    });
    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) {
        panel.hidden = true;
        button.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        panel.hidden = true;
        button.setAttribute("aria-expanded", "false");
      }
    });

    void heartbeat().then(refresh);
    window.setInterval(() => { void heartbeat().then(refresh); }, 30000);
  }

  async function initializeNavigation() {
    try {
      if (typeof supabaseClient === "undefined" || !supabaseClient?.auth) {
        throw new Error("Supabaseクライアント未設定");
      }
      const { data: auth, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !auth?.user) {
        location.replace(new URL("login.html", base).href);
        return;
      }
      const { data: result, error } = await supabaseClient.functions.invoke("admin-account", { method: "GET" });
      if (error || !result?.user) {
        showMessage("管理アカウントを確認できません。");
        return;
      }
      const user = result.user;
      if (!user.is_active) {
        showMessage("このアカウントは利用停止中");
        return;
      }
      if (user.must_change_password) {
        location.replace(page("account"));
        return;
      }
      const role = user.role;
      if (!["owner", "engineer", "staff"].includes(role)) {
        throw new Error("未対応の権限");
      }
      const full = role === "owner" || role === "engineer";
      const allowed = new Set(features.map(([feature]) => feature));
      const canViewContact = full || (await checkContactPermission());
      if (canViewContact) allowed.add("contact");
      if (full) allowed.add("permissions");
      if (target !== "home" && target !== "account" && !allowed.has(target)) {
        location.replace(page("home"));
        return;
      }
      const navFragment = document.createDocumentFragment();
      navFragment.append(createLink("home", "管理TOP"));
      for (const [feature, label] of features) navFragment.append(createLink(feature, label));
      if (canViewContact) navFragment.append(createLink("contact", "CONTACT管理"));
      if (full) navFragment.append(createLink("permissions", "権限管理"));
      nav.replaceChildren(navFragment);
      nav.style.visibility = "visible";
      window.ANRIEL_ADMIN_ACCESS = Object.freeze({ role, canView: (feature) => allowed.has(feature) });
      initializePresence(auth.user.id);
    } catch (error) {
      console.error("管理メニュー認証エラー:", error);
      showMessage("管理メニューの読み込みに失敗しました。");
    }
  }
  initializeNavigation();
})();
