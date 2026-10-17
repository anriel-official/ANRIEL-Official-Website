(() => {

  "use strict";


  // ==================================================
  // SETTINGS
  // ==================================================

  const TABLE_NAME =
    "top_slides";


  const STORAGE_BUCKET =
    "news-images";


  const STORAGE_FOLDER =
    "top-slides";


  const MAX_FILE_SIZE =
    5 * 1024 * 1024;


  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ];



  // ==================================================
  // STATE
  // ==================================================

  let selectedTopImageFile =
    null;


  let selectedTopImageObjectUrl =
    null;


  let currentEditingSlide =
    null;

  let displayedSlides = [];
  let slideOrderSaving = false;



  // ==================================================
  // ELEMENTS
  // ==================================================

  const getElement =
    (id) =>
      document.getElementById(id);



  // ==================================================
  // ESCAPE
  // ==================================================

  function escapeHtml(value) {

    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }



  // ==================================================
  // MESSAGE
  // ==================================================

  function setFormMessage(
    message = "",
    type = ""
  ) {

    const element =
      getElement(
        "topSlideFormMessage"
      );


    if (!element) {
      return;
    }


    element.textContent =
      message;


    element.classList.remove(
      "success",
      "error"
    );


    if (type) {

      element.classList.add(
        type
      );

    }

  }



  function setImageMessage(
    message = "",
    type = ""
  ) {

    const element =
      getElement(
        "topImageMessage"
      );


    if (!element) {
      return;
    }


    element.textContent =
      message;


    element.classList.remove(
      "success",
      "error"
    );


    if (type) {

      element.classList.add(
        type
      );

    }

  }



  // ==================================================
  // STORAGE PATH
  // ==================================================

  function createStorageFilePath(
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
        .slice(2, 10);


    return (
      `${STORAGE_FOLDER}/` +
      `${Date.now()}-` +
      `${random}.` +
      `${extension}`
    );

  }



  // ==================================================
  // GET STORAGE PATH FROM PUBLIC URL
  // ==================================================

  function getStoragePathFromUrl(
    url
  ) {

    if (!url) {
      return null;
    }


    const marker =
      `/storage/v1/object/public/${STORAGE_BUCKET}/`;


    const markerIndex =
      url.indexOf(marker);


    if (markerIndex === -1) {
      return null;
    }


    const path =
      url.slice(
        markerIndex +
        marker.length
      );


    if (
      !path.startsWith(
        `${STORAGE_FOLDER}/`
      )
    ) {

      return null;

    }


    try {

      return decodeURIComponent(
        path
      );

    } catch {

      return path;

    }

  }



  // ==================================================
  // DELETE STORAGE IMAGE
  // ==================================================

  async function deleteStorageImage(
    imageUrl
  ) {

    const storagePath =
      getStoragePathFromUrl(
        imageUrl
      );


    if (!storagePath) {
      return;
    }


    try {

      const {
        error
      } =
        await supabaseClient
          .storage
          .from(
            STORAGE_BUCKET
          )
          .remove([
            storagePath
          ]);


      if (error) {

        console.error(
          "TOP画像削除エラー:",
          error
        );

      }

    } catch (error) {

      console.error(
        "TOP画像削除エラー:",
        error
      );

    }

  }



  // ==================================================
  // FILE VALIDATION
  // ==================================================

  function validateImageFile(
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
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {

      return {
        valid: false,
        message:
          "JPEG / PNG / WebP / GIF の画像を選択してください。"
      };

    }


    if (
      file.size >
      MAX_FILE_SIZE
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
  // PREVIEW
  // ==================================================

  function clearObjectUrl() {

    if (
      selectedTopImageObjectUrl
    ) {

      URL.revokeObjectURL(
        selectedTopImageObjectUrl
      );


      selectedTopImageObjectUrl =
        null;

    }

  }



  function showImagePreview(
    src
  ) {

    const preview =
      getElement(
        "topImagePreview"
      );


    const image =
      getElement(
        "topImagePreviewImage"
      );


    if (
      !preview ||
      !image
    ) {
      return;
    }


    if (!src) {

      image.removeAttribute(
        "src"
      );


      preview.classList.remove(
        "active"
      );


      return;

    }


    image.src =
      src;


    preview.classList.add(
      "active"
    );

  }



  function selectTopImageFile(
    file
  ) {

    const validation =
      validateImageFile(
        file
      );


    if (
      !validation.valid
    ) {

      setImageMessage(
        validation.message,
        "error"
      );

      return;

    }


    clearObjectUrl();


    selectedTopImageFile =
      file;


    selectedTopImageObjectUrl =
      URL.createObjectURL(
        file
      );


    showImagePreview(
      selectedTopImageObjectUrl
    );


    setImageMessage(
      file.name,
      "success"
    );

  }



  // ==================================================
  // UPLOAD IMAGE
  // ==================================================

  async function uploadTopImage(
    file
  ) {

    const storagePath =
      createStorageFilePath(
        file
      );


    const {
      error: uploadError
    } =
      await supabaseClient
        .storage
        .from(
          STORAGE_BUCKET
        )
        .upload(
          storagePath,
          file,
          {
            cacheControl: "3600",
            upsert: false
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
          STORAGE_BUCKET
        )
        .getPublicUrl(
          storagePath
        );


    if (
      !data ||
      !data.publicUrl
    ) {

      throw new Error(
        "画像URLの取得に失敗しました。"
      );

    }


    return data.publicUrl;

  }



  // ==================================================
  // RESET FORM
  // ==================================================

  function resetTopSlideForm() {

    const form =
      getElement(
        "topSlideForm"
      );


    form?.reset();


    const id =
      getElement(
        "topSlideId"
      );


    const currentImage =
      getElement(
        "currentTopSlideImageUrl"
      );


    const sortOrder =
      getElement(
        "topSlideSortOrder"
      );


    const published =
      getElement(
        "topSlidePublished"
      );


    const formTitle =
      getElement(
        "topSlideFormTitle"
      );


    const imageInput =
      getElement(
        "topSlideImage"
      );


    if (id) {

      id.value =
        "";

    }


    if (currentImage) {

      currentImage.value =
        "";

    }


    if (sortOrder) {

      sortOrder.value =
        "0";

    }


    if (published) {

      published.checked =
        true;

    }


    if (formTitle) {

      formTitle.textContent =
        "TOP画像を追加";

    }


    if (imageInput) {

      imageInput.value =
        "";

    }


    selectedTopImageFile =
      null;


    currentEditingSlide =
      null;


    clearObjectUrl();


    showImagePreview(
      ""
    );


    setImageMessage(
      ""
    );


    setFormMessage(
      ""
    );

  }


  window.resetTopSlideForm =
    resetTopSlideForm;



  // ==================================================
  // FORMAT LINK
  // ==================================================

  function formatSlideLink(
    link
  ) {

    if (!link) {

      return `
        <span>
          リンクなし
        </span>
      `;

    }


    return `
      <span>
        ${escapeHtml(link)}
      </span>
    `;

  }



  // ==================================================
  // CREATE LIST ITEM
  // ==================================================

  function createSlideCard(
    slide
  ) {

    const card =
      document.createElement(
        "div"
      );


    card.className =
      "top-slide-card";


    card.innerHTML = `

      <div class="top-slide-thumbnail">

        <img
          src="${escapeHtml(slide.image_url)}"
          alt=""
          loading="lazy"
          decoding="async"
        >

      </div>


      <div class="top-slide-info">


        <p class="top-slide-link">
          ${formatSlideLink(slide.link_url)}
        </p>


        <span
          class="
            top-slide-status
            ${slide.published ? "published" : ""}
          "
        >
          ${
            slide.published
              ? "公開中"
              : "非公開"
          }
        </span>

      </div>


      <div class="top-slide-actions">
        <button type="button" class="edit-button" data-action="move-up" data-id="${escapeHtml(slide.id)}" aria-label="上へ移動" ${displayedSlides.findIndex(item => String(item.id) === String(slide.id)) === 0 ? "disabled" : ""}>↑</button>
        <button type="button" class="edit-button" data-action="move-down" data-id="${escapeHtml(slide.id)}" aria-label="下へ移動" ${displayedSlides.findIndex(item => String(item.id) === String(slide.id)) === displayedSlides.length - 1 ? "disabled" : ""}>↓</button>

        <button
          type="button"
          class="edit-button"
          data-action="edit"
          data-id="${escapeHtml(slide.id)}"
        >
          編集
        </button>


        <button
          type="button"
          class="delete-button"
          data-action="delete"
          data-id="${escapeHtml(slide.id)}"
        >
          削除
        </button>

      </div>

    `;


    return card;

  }



  // ==================================================
  // LOAD LIST
  // ==================================================

  async function loadTopSlides() {

    const list =
      getElement(
        "topSlideList"
      );


    const count =
      getElement(
        "topSlideListCount"
      );


    if (!list) {
      return;
    }


    list.innerHTML = `
      <p class="loading-text">
        読み込み中...
      </p>
    `;


    if (count) {

      count.textContent =
        "読み込み中...";

    }


    try {

      const {
        data,
        error
      } =
        await supabaseClient
          .from(
            TABLE_NAME
          )
          .select("*")
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

        throw error;

      }


      const slides =
        data || [];

      displayedSlides = slides;


      if (count) {

        count.textContent =
          `${slides.length}件`;

      }


      list.innerHTML =
        "";


      if (
        slides.length === 0
      ) {

        list.innerHTML = `
          <p class="loading-text">
            登録されているTOP画像はありません。
          </p>
        `;

        return;

      }


      // 複数カードをまとめてDOMへ追加し、再描画負荷を抑える。
      const fragment = document.createDocumentFragment();
      slides.forEach((slide) => {
        fragment.appendChild(createSlideCard(slide));
      });
      list.appendChild(fragment);


    } catch (error) {

      console.error(
        "TOP画像一覧取得エラー:",
        error
      );


      list.innerHTML = `
        <p class="loading-text">
          TOP画像の読み込みに失敗しました。
        </p>
      `;


      if (count) {

        count.textContent =
          "読み込み失敗";

      }

    }

  }


  window.loadTopSlides =
    loadTopSlides;



  // ==================================================
  // OPEN EDIT
  // ==================================================

  async function openEditTopSlide(
    id
  ) {

    try {

      const {
        data,
        error
      } =
        await supabaseClient
          .from(
            TABLE_NAME
          )
          .select("*")
          .eq(
            "id",
            id
          )
          .single();


      if (error) {

        throw error;

      }


      if (!data) {

        throw new Error(
          "TOP画像が見つかりません。"
        );

      }


      resetTopSlideForm();


      currentEditingSlide =
        data;


      const slideId =
        getElement(
          "topSlideId"
        );


      const currentImage =
        getElement(
          "currentTopSlideImageUrl"
        );


      const link =
        getElement(
          "topSlideLinkUrl"
        );


      const sortOrder =
        getElement(
          "topSlideSortOrder"
        );


      const published =
        getElement(
          "topSlidePublished"
        );


      const formTitle =
        getElement(
          "topSlideFormTitle"
        );


      if (slideId) {

        slideId.value =
          data.id;

      }


      if (currentImage) {

        currentImage.value =
          data.image_url || "";

      }


      if (link) {

        link.value =
          data.link_url || "";

      }


      if (sortOrder) {

        sortOrder.value =
          String(
            data.sort_order ?? 0
          );

      }


      if (published) {

        published.checked =
          Boolean(
            data.published
          );

      }


      if (formTitle) {

        formTitle.textContent =
          "TOP画像を編集";

      }


      showImagePreview(
        data.image_url
      );


      setImageMessage(
        "現在登録されている画像",
        ""
      );


      if (
        typeof window.switchTopView ===
          "function"
      ) {

        await window.switchTopView(
          "form",
          {
            resetForm: false
          }
        );

      }


    } catch (error) {

      console.error(
        "TOP画像取得エラー:",
        error
      );


      alert(
        "TOP画像の読み込みに失敗しました。"
      );

    }

  }



  // ==================================================
  // DELETE SLIDE
  // ==================================================

  async function deleteTopSlide(
    id
  ) {

    const confirmed =
      window.confirm(
        "このTOP画像を削除しますか？"
      );


    if (!confirmed) {
      return;
    }


    try {

      const {
        data,
        error: loadError
      } =
        await supabaseClient
          .from(
            TABLE_NAME
          )
          .select(
            "id,image_url"
          )
          .eq(
            "id",
            id
          )
          .single();


      if (loadError) {

        throw loadError;

      }


      const {
        error: deleteError
      } =
        await supabaseClient
          .from(
            TABLE_NAME
          )
          .delete()
          .eq(
            "id",
            id
          );


      if (deleteError) {

        throw deleteError;

      }


      if (
        data?.image_url
      ) {

        await deleteStorageImage(
          data.image_url
        );

      }


      await loadTopSlides();


    } catch (error) {

      console.error(
        "TOP画像削除エラー:",
        error
      );


      alert(
        "TOP画像の削除に失敗しました。"
      );

    }

  }



  // ==================================================
  // SAVE
  // ==================================================

  async function saveTopSlide(
    event
  ) {

    event.preventDefault();


    const slideId =
      getElement(
        "topSlideId"
      )?.value.trim();


    const currentImageUrl =
      getElement(
        "currentTopSlideImageUrl"
      )?.value.trim() || "";


    const linkUrl =
      getElement(
        "topSlideLinkUrl"
      )?.value.trim() || "";


    const sortOrderValue =
      getElement(
        "topSlideSortOrder"
      )?.value.trim();


    const published =
      Boolean(
        getElement(
          "topSlidePublished"
        )?.checked
      );


    const sortOrder =
      Number(
        sortOrderValue
      );



    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (
      !Number.isInteger(
        sortOrder
      ) ||
      sortOrder < 0
    ) {

      setFormMessage(
        "表示順は0以上の整数で入力してください。",
        "error"
      );

      return;

    }


    if (
      !slideId &&
      !selectedTopImageFile
    ) {

      setFormMessage(
        "TOP画像を選択してください。",
        "error"
      );

      return;

    }



    // ------------------------------------------
    // LINK VALIDATION
    // ------------------------------------------

    if (linkUrl) {

      try {

        const parsedUrl =
          new URL(
            linkUrl
          );


        if (
          ![
            "http:",
            "https:"
          ].includes(
            parsedUrl.protocol
          )
        ) {

          throw new Error();

        }

      } catch {

        setFormMessage(
          "リンクURLを正しく入力してください。",
          "error"
        );

        return;

      }

    }



    setFormMessage(
      "保存中..."
    );


    let newImageUrl =
      currentImageUrl;


    let uploadedImageUrl =
      null;


    try {


      // ------------------------------------------
      // IMAGE UPLOAD
      // ------------------------------------------

      if (
        selectedTopImageFile
      ) {

        newImageUrl =
          await uploadTopImage(
            selectedTopImageFile
          );


        uploadedImageUrl =
          newImageUrl;

      }



      // ------------------------------------------
      // PAYLOAD
      // ------------------------------------------

      const payload = {

        image_url:
          newImageUrl,

        link_url:
          linkUrl || null,

        sort_order:
          sortOrder,

        published,

        updated_at:
          new Date().toISOString()

      };



      // ------------------------------------------
      // UPDATE
      // ------------------------------------------

      if (slideId) {

        const {
          error
        } =
          await supabaseClient
            .from(
              TABLE_NAME
            )
            .update(
              payload
            )
            .eq(
              "id",
              slideId
            );


        if (error) {

          throw error;

        }



        // 古い画像を差し替えた場合のみ削除

        if (
          selectedTopImageFile &&
          currentImageUrl &&
          currentImageUrl !==
            newImageUrl
        ) {

          await deleteStorageImage(
            currentImageUrl
          );

        }

      }


      // ------------------------------------------
      // INSERT
      // ------------------------------------------

      else {

        const {
          error
        } =
          await supabaseClient
            .from(
              TABLE_NAME
            )
            .insert(
              payload
            );


        if (error) {

          throw error;

        }

      }



      setFormMessage(
        "保存しました。",
        "success"
      );


      resetTopSlideForm();


      if (
        typeof window.switchTopView ===
          "function"
      ) {

        await window.switchTopView(
          "list"
        );

      } else {

        await loadTopSlides();

      }


    } catch (error) {

      console.error(
        "TOP画像保存エラー:",
        error
      );



      /*
        新しい画像をStorageへアップロードした後に
        DB保存が失敗した場合は、
        アップロードした画像だけ削除する
      */

      if (
        uploadedImageUrl
      ) {

        await deleteStorageImage(
          uploadedImageUrl
        );

      }


      setFormMessage(
        "保存に失敗しました。",
        "error"
      );

    }

  }



  // ==================================================
  // DROP AREA
  // ==================================================

  function setupImageDropArea() {

    const dropArea =
      getElement(
        "topImageDropArea"
      );


    const input =
      getElement(
        "topSlideImage"
      );


    if (
      !dropArea ||
      !input
    ) {
      return;
    }



    // CLICK

    dropArea.addEventListener(
      "click",
      () => {

        input.click();

      }
    );



    // KEYBOARD

    dropArea.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          input.click();

        }

      }
    );



    // FILE INPUT

    input.addEventListener(
      "change",
      () => {

        const file =
          input.files?.[0];


        if (file) {

          selectTopImageFile(
            file
          );

        }

      }
    );



    // DRAG ENTER

    [
      "dragenter",
      "dragover"
    ].forEach(
      (eventName) => {

        dropArea.addEventListener(
          eventName,
          (event) => {

            event.preventDefault();
            event.stopPropagation();


            dropArea.classList.add(
              "dragover"
            );

          }
        );

      }
    );



    // DRAG LEAVE

    [
      "dragleave",
      "drop"
    ].forEach(
      (eventName) => {

        dropArea.addEventListener(
          eventName,
          (event) => {

            event.preventDefault();
            event.stopPropagation();


            dropArea.classList.remove(
              "dragover"
            );

          }
        );

      }
    );



    // DROP

    dropArea.addEventListener(
      "drop",
      (event) => {

        const file =
          event.dataTransfer
            ?.files?.[0];


        if (file) {

          selectTopImageFile(
            file
          );

        }

      }
    );

  }



  // 表示順を隣の画像と交換し、DBに保存
  async function moveSlide(id, direction) {
    if (slideOrderSaving) return;
    const index = displayedSlides.findIndex(item => String(item.id) === String(id));
    const otherIndex = index + direction;
    if (index < 0 || otherIndex < 0 || otherIndex >= displayedSlides.length) return;
    const first = displayedSlides[index];
    const second = displayedSlides[otherIndex];
    const originalA = Number(first.sort_order) || 0;
    const originalB = Number(second.sort_order) || 0;
    // 同順位のデータも確実に並び替えられるよう、全件を採番し直す
    const reordered = [...displayedSlides];
    [reordered[index], reordered[otherIndex]] = [reordered[otherIndex], reordered[index]];
    slideOrderSaving = true;
    const list = getElement("topSlideList");
    list?.querySelectorAll('button[data-action^="move-"]').forEach(button => button.disabled = true);
    try {
      // 既存のsort_orderとの衝突を避け、いったん大きな番号へ移動
      const max = Math.max(0, ...displayedSlides.map(item => Number(item.sort_order) || 0));
      for (let i = 0; i < reordered.length; i++) {
        const { error } = await supabaseClient.from(TABLE_NAME).update({ sort_order: max + (i + 1) * 10 + 1000 }).eq("id", reordered[i].id);
        if (error) throw error;
      }
      for (let i = 0; i < reordered.length; i++) {
        const { error } = await supabaseClient.from(TABLE_NAME).update({ sort_order: (i + 1) * 10 }).eq("id", reordered[i].id);
        if (error) throw error;
      }
      await loadTopSlides();
    } catch (error) {
      console.error("TOP画像並び替えエラー:", error);
      alert("表示順の保存に失敗しました。再読み込みして確認してください。");
      await loadTopSlides();
    } finally {
      slideOrderSaving = false;
    }
  }

  // ==================================================
  // LIST EVENTS
  // ==================================================

  function setupListEvents() {

    const list =
      getElement(
        "topSlideList"
      );


    if (!list) {
      return;
    }


    list.addEventListener(
      "click",
      async (event) => {

        const button =
          event.target.closest(
            "button[data-action]"
          );


        if (!button) {
          return;
        }


        const action =
          button.dataset.action;


        const id =
          button.dataset.id;


        if (!id) {
          return;
        }



        if (action === "move-up" || action === "move-down") {
          await moveSlide(id, action === "move-up" ? -1 : 1);
          return;
        }

        // EDIT

        if (
          action === "edit"
        ) {

          await openEditTopSlide(
            id
          );

          return;

        }



        // DELETE

        if (
          action === "delete"
        ) {

          await deleteTopSlide(
            id
          );

        }

      }
    );

  }



  // ==================================================
  // BUTTON EVENTS
  // ==================================================

  function setupButtonEvents() {

    const form =
      getElement(
        "topSlideForm"
      );


    const reload =
      getElement(
        "reloadTopSlidesButton"
      );


    const cancelTop =
      getElement(
        "topSlideCancelButton"
      );


    const cancelBottom =
      getElement(
        "topSlideCancelButtonBottom"
      );



    // SAVE

    form?.addEventListener(
      "submit",
      saveTopSlide
    );



    // RELOAD

    reload?.addEventListener(
      "click",
      async () => {

        await loadTopSlides();

      }
    );



    // CANCEL

    const cancel =
      async () => {

        resetTopSlideForm();


        if (
          typeof window.switchTopView ===
            "function"
        ) {

          await window.switchTopView(
            "list"
          );

        }

      };


    cancelTop?.addEventListener(
      "click",
      cancel
    );


    cancelBottom?.addEventListener(
      "click",
      cancel
    );

  }



  // ==================================================
  // INITIALIZE
  // ==================================================

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      setupImageDropArea();

      setupListEvents();

      setupButtonEvents();

    }
  );


})();