/* =========================================================
   AN:RIEL ADMIN
   YOUTUBE SCHEDULE MANAGEMENT
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     DOM
  ========================================================= */

  // SYNC SETTINGS
  const youtubeSyncEnabled =
    document.getElementById("youtubeSyncEnabled");

  const youtubeSyncTimeList =
    document.getElementById("youtubeSyncTimeList");

  const addYoutubeSyncTimeButton =
    document.getElementById("addYoutubeSyncTimeButton");

  const saveYoutubeSyncSettingsButton =
    document.getElementById("saveYoutubeSyncSettingsButton");

  const youtubeSyncSettingsMessage =
    document.getElementById("youtubeSyncSettingsMessage");


  // MANUAL SYNC
  const youtubeSyncNowButton =
    document.getElementById("youtubeSyncNowButton");

  const youtubeSyncNowMessage =
    document.getElementById("youtubeSyncNowMessage");


  // TALENT
  const openYoutubeTalentFormButton =
    document.getElementById("openYoutubeTalentFormButton");

  const youtubeTalentFormArea =
    document.getElementById("youtubeTalentFormArea");

  const youtubeTalentFormTitle =
    document.getElementById("youtubeTalentFormTitle");

  const youtubeTalentId =
    document.getElementById("youtubeTalentId");

  const youtubeTalentName =
    document.getElementById("youtubeTalentName");

  const youtubeTalentHandle =
    document.getElementById("youtubeTalentHandle");

  const youtubeTalentChannelId =
    document.getElementById("youtubeTalentChannelId");

  const youtubeTalentEnabled =
    document.getElementById("youtubeTalentEnabled");

  const saveYoutubeTalentButton =
    document.getElementById("saveYoutubeTalentButton");

  const youtubeTalentCancelButton =
    document.getElementById("youtubeTalentCancelButton");

  const youtubeTalentCancelButtonBottom =
    document.getElementById("youtubeTalentCancelButtonBottom");

  const youtubeTalentFormMessage =
    document.getElementById("youtubeTalentFormMessage");

  const youtubeTalentList =
    document.getElementById("youtubeTalentList");


  /* =========================================================
     STATE
  ========================================================= */

  let syncSettingId = null;
  let syncTimes = [];
  let youtubeTalents = [];


  /* =========================================================
     MESSAGE
  ========================================================= */

  function setMessage(element, message, type = "") {
    if (!element) return;

    element.textContent = message || "";
    element.classList.remove("success", "error");

    if (type) {
      element.classList.add(type);
    }
  }


  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     NORMALIZE TIME
  ========================================================= */

  function normalizeTime(value) {
    if (!value) return "";
    return String(value).slice(0, 5);
  }


  /* =========================================================
     LOAD YOUTUBE ADMIN
  ========================================================= */

  async function loadYoutubeAdmin() {
    await Promise.all([
      loadYoutubeSyncSettings(),
      loadYoutubeTalents()
    ]);
  }


  /* =========================================================
     LOAD SYNC SETTINGS
  ========================================================= */

  async function loadYoutubeSyncSettings() {
    setMessage(youtubeSyncSettingsMessage, "");

    if (youtubeSyncTimeList) {
      youtubeSyncTimeList.innerHTML =
        '<p class="loading-text">読み込み中...</p>';
    }

    try {
      // 設定本体と取得時刻は独立したテーブルのため並列取得。
      const [settingsResult, timesResult] = await Promise.all([
        supabaseClient
          .from("youtube_sync_settings")
          .select("id, enabled, timezone")
          .order("id", { ascending: true })
          .limit(1),
        supabaseClient
          .from("youtube_sync_times")
          .select("id, sync_time, enabled")
          .order("sync_time", { ascending: true })
      ]);
      const { data: settings, error: settingsError } = settingsResult;
      const { data: times, error: timesError } = timesResult;

      if (settingsError) {
        throw settingsError;
      }

      const setting = settings?.[0] || null;

      if (setting) {
        syncSettingId = setting.id;

        if (youtubeSyncEnabled) {
          youtubeSyncEnabled.checked =
            Boolean(setting.enabled);
        }
      } else {
        syncSettingId = null;

        if (youtubeSyncEnabled) {
          youtubeSyncEnabled.checked = false;
        }
      }


      if (timesError) {
        throw timesError;
      }

      syncTimes =
        Array.isArray(times)
          ? times
          : [];

      renderYoutubeSyncTimes();

    } catch (error) {
      console.error(
        "YouTube sync settings load error:",
        error
      );

      if (youtubeSyncTimeList) {
        youtubeSyncTimeList.innerHTML =
          '<p class="error-text">取得時刻を読み込めませんでした。</p>';
      }

      setMessage(
        youtubeSyncSettingsMessage,
        "自動取得設定の読み込みに失敗しました。",
        "error"
      );
    }
  }


  /* =========================================================
     RENDER SYNC TIMES
  ========================================================= */

  function renderYoutubeSyncTimes() {
    if (!youtubeSyncTimeList) return;

    youtubeSyncTimeList.innerHTML = "";

    if (
      !Array.isArray(syncTimes) ||
      syncTimes.length === 0
    ) {
      youtubeSyncTimeList.innerHTML =
        '<p class="empty-text">取得時刻が登録されていません。</p>';

      return;
    }

    syncTimes.forEach((item) => {
      createYoutubeSyncTimeRow({
        id: item.id,
        time: normalizeTime(item.sync_time),
        enabled: item.enabled !== false
      });
    });
  }


  /* =========================================================
     CREATE SYNC TIME ROW

     06:00   □ 有効   削除
  ========================================================= */

  function createYoutubeSyncTimeRow({
    id = "",
    time = "",
    enabled = true
  } = {}) {
    if (!youtubeSyncTimeList) return;

    const row =
      document.createElement("div");

    row.className =
      "youtube-sync-time-row";


    // TIME
    const input =
      document.createElement("input");

    input.type = "time";
    input.className =
      "youtube-sync-time-input";

    input.value = time;

    input.dataset.id =
      id ? String(id) : "";


    // ENABLE
    const enabledLabel =
      document.createElement("label");

    enabledLabel.className =
      "checkbox-label youtube-sync-time-check";

    const enabledInput =
      document.createElement("input");

    enabledInput.type = "checkbox";
    enabledInput.checked =
      Boolean(enabled);

    enabledInput.className =
      "youtube-sync-time-enabled";

    const enabledText =
      document.createElement("span");

    enabledText.textContent = "有効";

    enabledLabel.appendChild(
      enabledInput
    );

    enabledLabel.appendChild(
      enabledText
    );


    // DELETE
    const deleteButton =
      document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className =
      "delete-button youtube-sync-time-delete";

    deleteButton.textContent = "削除";


    deleteButton.addEventListener(
      "click",
      async () => {
        const currentId =
          input.dataset.id;

        if (currentId) {
          await deleteYoutubeSyncTime(
            currentId
          );

          return;
        }

        row.remove();

        if (
          youtubeSyncTimeList.children.length === 0
        ) {
          youtubeSyncTimeList.innerHTML =
            '<p class="empty-text">取得時刻が登録されていません。</p>';
        }
      }
    );


    row.appendChild(input);
    row.appendChild(enabledLabel);
    row.appendChild(deleteButton);

    youtubeSyncTimeList.appendChild(row);
  }


  /* =========================================================
     ADD SYNC TIME
  ========================================================= */

  function addYoutubeSyncTimeRow() {
    if (!youtubeSyncTimeList) return;

    const emptyText =
      youtubeSyncTimeList.querySelector(
        ".empty-text, .loading-text"
      );

    if (emptyText) {
      emptyText.remove();
    }

    createYoutubeSyncTimeRow({
      enabled: true
    });

    const inputs =
      youtubeSyncTimeList.querySelectorAll(
        ".youtube-sync-time-input"
      );

    const lastInput =
      inputs[inputs.length - 1];

    lastInput?.focus();
  }


  addYoutubeSyncTimeButton
    ?.addEventListener(
      "click",
      addYoutubeSyncTimeRow
    );


  /* =========================================================
     SAVE SYNC SETTINGS
  ========================================================= */

  async function saveYoutubeSyncSettings() {
    setMessage(
      youtubeSyncSettingsMessage,
      ""
    );

    if (saveYoutubeSyncSettingsButton) {
      saveYoutubeSyncSettingsButton.disabled =
        true;

      saveYoutubeSyncSettingsButton.textContent =
        "保存中...";
    }

    try {

      /* -----------------------------
         MAIN SETTING
      ----------------------------- */

      if (syncSettingId) {
        const { error } =
          await supabaseClient
            .from("youtube_sync_settings")
            .update({
              enabled:
                Boolean(
                  youtubeSyncEnabled?.checked
                ),

              timezone:
                "Asia/Tokyo",

              updated_at:
                new Date().toISOString()
            })
            .eq(
              "id",
              syncSettingId
            );

        if (error) {
          throw error;
        }

      } else {
        const {
          data,
          error
        } =
          await supabaseClient
            .from("youtube_sync_settings")
            .insert({
              enabled:
                Boolean(
                  youtubeSyncEnabled?.checked
                ),

              timezone:
                "Asia/Tokyo",

              updated_at:
                new Date().toISOString()
            })
            .select("id")
            .single();

        if (error) {
          throw error;
        }

        syncSettingId =
          data.id;
      }


      /* -----------------------------
         TIME ROWS
      ----------------------------- */

      const rows =
        Array.from(
          youtubeSyncTimeList
            ?.querySelectorAll(
              ".youtube-sync-time-row"
            ) || []
        );

      const usedTimes =
        new Set();


      for (const row of rows) {
        const timeInput =
          row.querySelector(
            ".youtube-sync-time-input"
          );

        const enabledInput =
          row.querySelector(
            ".youtube-sync-time-enabled"
          );

        const time =
          timeInput?.value?.trim() || "";

        if (!time) {
          continue;
        }


        // DUPLICATE CHECK
        if (usedTimes.has(time)) {
          throw new Error(
            `${time} が重複しています。`
          );
        }

        usedTimes.add(time);


        const id =
          timeInput.dataset.id;


        // UPDATE
        if (id) {
          const { error } =
            await supabaseClient
              .from("youtube_sync_times")
              .update({
                sync_time:
                  time,

                enabled:
                  Boolean(
                    enabledInput?.checked
                  ),

                updated_at:
                  new Date().toISOString()
              })
              .eq(
                "id",
                id
              );

          if (error) {
            throw error;
          }

        } else {

          // INSERT
          const { error } =
            await supabaseClient
              .from("youtube_sync_times")
              .insert({
                sync_time:
                  time,

                enabled:
                  Boolean(
                    enabledInput?.checked
                  ),

                updated_at:
                  new Date().toISOString()
              });

          if (error) {
            throw error;
          }
        }
      }


      await loadYoutubeSyncSettings();

      setMessage(
        youtubeSyncSettingsMessage,
        "自動取得設定を保存しました。",
        "success"
      );

    } catch (error) {
      console.error(
        "YouTube sync settings save error:",
        error
      );

      let message =
        "自動取得設定の保存に失敗しました。";

      if (error?.message) {
        message +=
          ` ${error.message}`;
      }

      setMessage(
        youtubeSyncSettingsMessage,
        message,
        "error"
      );

    } finally {
      if (saveYoutubeSyncSettingsButton) {
        saveYoutubeSyncSettingsButton.disabled =
          false;

        saveYoutubeSyncSettingsButton.textContent =
          "設定を保存";
      }
    }
  }


  saveYoutubeSyncSettingsButton
    ?.addEventListener(
      "click",
      saveYoutubeSyncSettings
    );


  /* =========================================================
     DELETE SYNC TIME
  ========================================================= */

  async function deleteYoutubeSyncTime(id) {
    if (!id) return;

    const confirmed =
      window.confirm(
        "この取得時刻を削除しますか？"
      );

    if (!confirmed) {
      return;
    }

    setMessage(
      youtubeSyncSettingsMessage,
      ""
    );

    try {
      const { error } =
        await supabaseClient
          .from("youtube_sync_times")
          .delete()
          .eq(
            "id",
            id
          );

      if (error) {
        throw error;
      }

      await loadYoutubeSyncSettings();

      setMessage(
        youtubeSyncSettingsMessage,
        "取得時刻を削除しました。",
        "success"
      );

    } catch (error) {
      console.error(
        "YouTube sync time delete error:",
        error
      );

      setMessage(
        youtubeSyncSettingsMessage,
        "取得時刻の削除に失敗しました。",
        "error"
      );
    }
  }


  /* =========================================================
     MANUAL YOUTUBE SYNC
  ========================================================= */

  youtubeSyncNowButton
    ?.addEventListener(
      "click",
      async () => {
        setMessage(
          youtubeSyncNowMessage,
          ""
        );

        youtubeSyncNowButton.disabled =
          true;

        youtubeSyncNowButton.textContent =
          "取得中...";

        try {
          const {
            data: sessionData,
            error: sessionError
          } =
            await supabaseClient
              .auth
              .getSession();

          if (
            sessionError ||
            !sessionData?.session
          ) {
            throw new Error(
              "ログインセッションを確認できません。"
            );
          }


          const {
            data,
            error
          } =
            await supabaseClient
              .functions
              .invoke(
                "admin-youtube-sync",
                {
                  body: {
                    source: "admin"
                  }
                }
              );

          if (error) {
            throw error;
          }

          if (
            !data ||
            data.success !== true
          ) {
            throw new Error(
              data?.message ||
              "YouTube配信予定の取得に失敗しました。"
            );
          }


          const found =
            Number(
              data.schedules_found ?? 0
            );

          const saved =
            Number(
              data.schedules_saved ?? 0
            );


          setMessage(
            youtubeSyncNowMessage,
            `取得完了！ 配信予定 ${found}件を確認し、${saved}件をSCHEDULEへ反映しました。`,
            "success"
          );


          if (
            typeof window.loadSchedules ===
            "function"
          ) {
            await window.loadSchedules();
          }

        } catch (error) {
          console.error(
            "Manual YouTube sync error:",
            error
          );

          setMessage(
            youtubeSyncNowMessage,
            error?.message ||
              "YouTube配信予定の取得に失敗しました。",
            "error"
          );

        } finally {
          youtubeSyncNowButton.disabled =
            false;

          youtubeSyncNowButton.textContent =
            "YouTubeから今すぐ取得";
        }
      }
    );


   /* =========================================================
     LOAD TALENTS
  ========================================================= */

  async function loadYoutubeTalents() {
    if (youtubeTalentList) {
      youtubeTalentList.innerHTML =
        '<p class="loading-text">読み込み中...</p>';
    }

    try {
      const {
        data,
        error
      } =
        await supabaseClient
          .from("talents")
          .select(
            "id, name, youtube_channel_id, youtube_handle, youtube_sync_enabled, published, sort_order"
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

      youtubeTalents =
        Array.isArray(data)
          ? data
          : [];

      renderYoutubeTalents();


      // SCHEDULE追加側の
      // タレントプルダウンも更新
      if (
        typeof window.loadScheduleTalents ===
        "function"
      ) {
        await window
          .loadScheduleTalents();
      }

    } catch (error) {
      console.error(
        "YouTube talents load error:",
        error
      );

      if (youtubeTalentList) {
        youtubeTalentList.innerHTML =
          '<p class="error-text">連携タレントを読み込めませんでした。</p>';
      }
    }
  }


  /* =========================================================
     RENDER TALENTS
  ========================================================= */

  function renderYoutubeTalents() {
    if (!youtubeTalentList) {
      return;
    }

    youtubeTalentList.innerHTML = "";

    if (
      !Array.isArray(youtubeTalents) ||
      youtubeTalents.length === 0
    ) {
      youtubeTalentList.innerHTML =
        '<p class="empty-text">TALENT管理に登録されているタレントはいません。</p>';

      return;
    }


    youtubeTalents.forEach(
      (talent) => {
        const card =
          document.createElement(
            "div"
          );

        card.className =
          "admin-list-item youtube-talent-item";


        const syncEnabled =
          talent.youtube_sync_enabled ===
          true;

        const syncStatusText =
          syncEnabled
            ? "有効"
            : "無効";

        const syncStatusClass =
          syncEnabled
            ? "published"
            : "draft";


        const published =
          talent.published !==
          false;

        const publishedText =
          published
            ? "公開"
            : "非公開";

        const publishedClass =
          published
            ? "published"
            : "draft";


        const channelId =
          talent.youtube_channel_id
            ? escapeHtml(
                talent.youtube_channel_id
              )
            : "未登録";

        const handle =
          talent.youtube_handle
            ? escapeHtml(
                talent.youtube_handle
              )
            : "未登録";


        card.innerHTML = `
          <div class="admin-list-item-main">

            <div class="admin-list-item-info">

              <h4>
                ${escapeHtml(
                  talent.name
                )}
              </h4>

              <p>
                YouTubeハンドル：
                ${handle}
              </p>

              <p class="form-help">
                Channel ID：
                ${channelId}
              </p>

              <p class="form-help">
                自動取得：
                <span class="status-badge ${syncStatusClass}">
                  ${syncStatusText}
                </span>
              </p>

              <p class="form-help">
                公開状態：
                <span class="status-badge ${publishedClass}">
                  ${publishedText}
                </span>
              </p>

            </div>

          </div>

          <div class="admin-list-item-actions">

            <a
              href="../talent/index.html"
              class="edit-button"
            >
              TALENT管理
            </a>

          </div>
        `;


        youtubeTalentList
          .appendChild(
            card
          );
      }
    );
  }


  /* =========================================================
     EXPOSE
  ========================================================= */

  window.loadYoutubeAdmin =
    loadYoutubeAdmin;

  window.loadYoutubeSyncSettings =
    loadYoutubeSyncSettings;

  window.loadYoutubeTalents =
    loadYoutubeTalents;

})();