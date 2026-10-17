/* =========================================================
   AN:RIEL
   GOODS ADMIN
\========================================================= */
/* =========================================================
   SETTINGS
\========================================================= */
const GOODS_IMAGE_BUCKET = "news-images";
const GOODS_IMAGE_MAX_SIZE =
  5 * 1024 * 1024;
const GOODS_IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];
/* =========================================================
   STATE
\========================================================= */
let goodsItems = [];
let goodsEvents = [];
let goodsTalents = [];
let goodsProductCategories = [];
let selectedGoodsTalentIds = [];
let currentGoodsImageUrl = "";
let currentGoodsImagePath = "";
let originalGoodsImageUrl = "";
let originalGoodsImagePath = "";
let pendingGoodsImagePath = "";
let goodsAdminInitialized = false;
/* =========================================================
   ELEMENTS
\========================================================= */
const goodsPanel =
  document.getElementById("goodsPanel");
const goodsListTabButton =
  document.getElementById(
    "goodsListTabButton"
  );
const goodsCategoryTabButton =
  document.getElementById(
    "goodsCategoryTabButton"
  );
const goodsListView =
  document.getElementById(
    "goodsListView"
  );
const goodsCategoryView =
  document.getElementById(
    "goodsCategoryView"
  );
/* =========================================================
   CATEGORY TAB ELEMENTS
\========================================================= */
const goodsEventCategoryTabButton =
  document.getElementById(
    "goodsEventCategoryTabButton"
  );
const goodsProductCategoryTabButton =
  document.getElementById(
    "goodsProductCategoryTabButton"
  );
const goodsEventCategoryView =
  document.getElementById(
    "goodsEventCategoryView"
  );
const goodsProductCategoryView =
  document.getElementById(
    "goodsProductCategoryView"
  );
/* =========================================================
   GOODS FORM ELEMENTS
\========================================================= */
const newGoodsButton =
  document.getElementById(
    "newGoodsButton"
  );
const goodsFormArea =
  document.getElementById(
    "goodsFormArea"
  );
const goodsForm =
  document.getElementById(
    "goodsForm"
  );
const goodsFormTitle =
  document.getElementById(
    "goodsFormTitle"
  );
const goodsId =
  document.getElementById(
    "goodsId"
  );
const goodsName =
  document.getElementById(
    "goodsName"
  );
const goodsPrice =
  document.getElementById(
    "goodsPrice"
  );
const goodsSortOrder =
  document.getElementById(
    "goodsSortOrder"
  );
const goodsEvent =
  document.getElementById(
    "goodsEvent"
  );
const goodsCategory =
  document.getElementById(
    "goodsCategory"
  );
const goodsTalentSelect =
  document.getElementById(
    "goodsTalentSelect"
  );
const addGoodsTalentButton =
  document.getElementById(
    "addGoodsTalentButton"
  );
const selectedGoodsTalents =
  document.getElementById(
    "selectedGoodsTalents"
  );
const goodsDescription =
  document.getElementById(
    "goodsDescription"
  );
const goodsExternalUrl =
  document.getElementById(
    "goodsExternalUrl"
  );
const goodsPublished =
  document.getElementById(
    "goodsPublished"
  );
const goodsCancelButton =
  document.getElementById(
    "goodsCancelButton"
  );
const goodsCancelButtonBottom =
  document.getElementById(
    "goodsCancelButtonBottom"
  );
const goodsFormMessage =
  document.getElementById(
    "goodsFormMessage"
  );
/* =========================================================
   GOODS LIST ELEMENTS
\========================================================= */
const adminGoodsList =
  document.getElementById(
    "adminGoodsList"
  );
const goodsListCount =
  document.getElementById(
    "goodsListCount"
  );
const reloadGoodsButton =
  document.getElementById(
    "reloadGoodsButton"
  );
/* =========================================================
   IMAGE ELEMENTS
\========================================================= */
const goodsImageUrl =
  document.getElementById(
    "goodsImageUrl"
  );
const goodsImageDropZone =
  document.getElementById(
    "goodsImageDropZone"
  );
const goodsImageInput =
  document.getElementById(
    "goodsImageInput"
  );
const goodsImageMessage =
  document.getElementById(
    "goodsImageMessage"
  );
const goodsImagePreviewArea =
  document.getElementById(
    "goodsImagePreviewArea"
  );
const goodsImagePreview =
  document.getElementById(
    "goodsImagePreview"
  );
const goodsImageDeleteButton =
  document.getElementById(
    "goodsImageDeleteButton"
  );
/* =========================================================
   EVENT ELEMENTS
\========================================================= */
const openGoodsEventFormButton =
  document.getElementById(
    "openGoodsEventFormButton"
  );
const goodsEventFormArea =
  document.getElementById(
    "goodsEventFormArea"
  );
const newGoodsEventName =
  document.getElementById(
    "newGoodsEventName"
  );
const addGoodsEventButton =
  document.getElementById(
    "addGoodsEventButton"
  );
const cancelGoodsEventButton =
  document.getElementById(
    "cancelGoodsEventButton"
  );
const cancelGoodsEventButtonBottom =
  document.getElementById(
    "cancelGoodsEventButtonBottom"
  );
const goodsEventFormMessage =
  document.getElementById(
    "goodsEventFormMessage"
  );
const adminGoodsEventList =
  document.getElementById(
    "adminGoodsEventList"
  );
const reloadGoodsEventButton =
  document.getElementById(
    "reloadGoodsEventButton"
  );
/* =========================================================
   GOODS CATEGORY ELEMENTS
\========================================================= */
const openGoodsProductCategoryFormButton =
  document.getElementById(
    "openGoodsProductCategoryFormButton"
  );
const goodsProductCategoryFormArea =
  document.getElementById(
    "goodsProductCategoryFormArea"
  );
const newGoodsProductCategoryName =
  document.getElementById(
    "newGoodsProductCategoryName"
  );
const addGoodsProductCategoryButton =
  document.getElementById(
    "addGoodsProductCategoryButton"
  );
const cancelGoodsProductCategoryButton =
  document.getElementById(
    "cancelGoodsProductCategoryButton"
  );
const cancelGoodsProductCategoryButtonBottom =
  document.getElementById(
    "cancelGoodsProductCategoryButtonBottom"
  );
const goodsProductCategoryFormMessage =
  document.getElementById(
    "goodsProductCategoryFormMessage"
  );
const adminGoodsProductCategoryList =
  document.getElementById(
    "adminGoodsProductCategoryList"
  );
const reloadGoodsProductCategoryButton =
  document.getElementById(
    "reloadGoodsProductCategoryButton"
  );
/* =========================================================
   UTILITIES
\========================================================= */
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
function setGoodsFormMessage(
  message = "",
  type = ""
) {
  if (!goodsFormMessage) {
    return;
  }
  goodsFormMessage.textContent =
    message;
  goodsFormMessage.className =
    "form-message";
  if (type) {
    goodsFormMessage.classList.add(
      type
    );
  }
}
function setGoodsImageMessage(
  message = "",
  type = ""
) {
  if (!goodsImageMessage) {
    return;
  }
  goodsImageMessage.textContent =
    message;
  goodsImageMessage.className =
    "news-image-message";
  if (type) {
    goodsImageMessage.classList.add(
      type
    );
  }
}
function setGoodsEventMessage(
  message = "",
  type = ""
) {
  if (!goodsEventFormMessage) {
    return;
  }
  goodsEventFormMessage.textContent =
    message;
  goodsEventFormMessage.className =
    "form-message";
  if (type) {
    goodsEventFormMessage.classList.add(
      type
    );
  }
}
function setGoodsCategoryMessage(
  message = "",
  type = ""
) {
  if (!goodsProductCategoryFormMessage) {
    return;
  }
  goodsProductCategoryFormMessage.textContent =
    message;
  goodsProductCategoryFormMessage.className =
    "form-message";
  if (type) {
    goodsProductCategoryFormMessage
      .classList
      .add(type);
  }
}
/* =========================================================
   STORAGE PATH
\========================================================= */
function getGoodsStoragePathFromUrl(url) {
  if (!url) {
    return "";
  }
  const marker =
    `/storage/v1/object/public/${GOODS_IMAGE_BUCKET}/`;
  const index =
    url.indexOf(marker);
  if (index === -1) {
    return "";
  }
  const path =
    url.substring(
      index + marker.length
    );
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}
/* =========================================================
   GOODS VIEW
\========================================================= */
function switchGoodsView(view) {
  if (
    !goodsListView ||
    !goodsCategoryView
  ) {
    return;
  }
  const isList =
    view === "list";
  goodsListView.classList.toggle(
    "active",
    isList
  );
  goodsCategoryView.classList.toggle(
    "active",
    !isList
  );
  goodsListTabButton?.classList.toggle(
    "active",
    isList
  );
  goodsCategoryTabButton?.classList.toggle(
    "active",
    !isList
  );
  if (isList) {
    loadGoods();
  } else {
    switchGoodsCategoryView(
      "event"
    );
  }
}
/* =========================================================
   CATEGORY VIEW
\========================================================= */
function switchGoodsCategoryView(view) {
  // 選択状態をスクリーンリーダーにも通知
  goodsEventCategoryTabButton?.setAttribute("aria-pressed", String(view === "event"));
  goodsProductCategoryTabButton?.setAttribute("aria-pressed", String(view !== "event"));

  const isEvent =
    view === "event";
  goodsEventCategoryView
    ?.classList
    .toggle(
      "active",
      isEvent
    );
  goodsProductCategoryView
    ?.classList
    .toggle(
      "active",
      !isEvent
    );
  goodsEventCategoryTabButton
    ?.classList
    .toggle(
      "active",
      isEvent
    );
  goodsProductCategoryTabButton
    ?.classList
    .toggle(
      "active",
      !isEvent
    );
  if (isEvent) {
    loadGoodsEvents();
  } else {
    loadGoodsProductCategories();
  }
}
/* =========================================================
   LOAD EVENTS
\========================================================= */
async function loadGoodsEvents() {
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
      "GOODS EVENT LOAD ERROR:",
      error
    );
    if (adminGoodsEventList) {
      adminGoodsEventList.innerHTML =
        `<p class="error-text">
          EVENTの読み込みに失敗しました。
        </p>`;
    }
    return;
  }
  goodsEvents =
    data || [];
  renderGoodsEventSelect();
  renderGoodsEventList();
}
/* =========================================================
   EVENT SELECT
\========================================================= */
function renderGoodsEventSelect() {
  if (!goodsEvent) {
    return;
  }
  const currentValue =
    goodsEvent.value;
  goodsEvent.innerHTML =
    `<option value="">
      EVENTを選択
    </option>`;
  const optionsFragment = document.createDocumentFragment();
  goodsEvents.forEach(
    (event) => {
      const option =
        document.createElement(
          "option"
        );
      option.value =
        String(event.id);
      option.textContent =
        event.name;
      optionsFragment.appendChild(
        option
      );
    }
  );
  goodsEvent.appendChild(optionsFragment);
  if (
    currentValue &&
    goodsEvents.some(
      (event) =>
        String(event.id) ===
        String(currentValue)
    )
  ) {
    goodsEvent.value =
      currentValue;
  }
}
/* =========================================================
   EVENT LIST
\========================================================= */
function renderGoodsEventList() {
  if (!adminGoodsEventList) return;
  if (!goodsEvents.length) {
    adminGoodsEventList.innerHTML = '<p class="empty-text">EVENTはまだ登録されていません。</p>';
    return;
  }
  adminGoodsEventList.innerHTML = goodsEvents.map((event, index) => `
    <div class="admin-category-item goods-category-editable-row" data-event-id="${event.id}">
      <div class="admin-category-name">${escapeGoodsHTML(event.name)}</div>
      <div class="admin-category-actions goods-category-edit-actions">
        <button type="button" class="admin-secondary-button" data-event-move="up" data-event-id="${event.id}" ${index === 0 ? 'disabled' : ''} aria-label="${escapeGoodsHTML(event.name)}を上に移動">↑</button>
        <button type="button" class="admin-secondary-button" data-event-move="down" data-event-id="${event.id}" ${index === goodsEvents.length - 1 ? 'disabled' : ''} aria-label="${escapeGoodsHTML(event.name)}を下に移動">↓</button>
        <button type="button" class="admin-secondary-button" data-event-edit="${event.id}">編集</button>
        <button type="button" class="delete-button" data-goods-event-delete="${event.id}">削除</button>
      </div>
    </div>
  `).join('');
}

let goodsEventBusy = false;
async function editGoodsEvent(id) {
  if (goodsEventBusy) return;
  const event = goodsEvents.find(item => String(item.id) === String(id));
  if (!event) return;
  const entered = window.prompt('EVENT名を編集', event.name);
  if (entered === null) return;
  const name = entered.trim();
  if (!name) { alert('EVENT名を入力してください。'); return; }
  if (name === event.name) return;
  goodsEventBusy = true;
  try {
    const { error } = await supabaseClient.from('goods_events').update({ name }).eq('id', event.id);
    if (error) throw error;
    await loadGoodsEvents();
  } catch (error) {
    console.error('GOODS EVENT EDIT ERROR:', error);
    alert(error.code === '23505' ? '同じEVENT名がすでに登録されています。' : 'EVENT名の変更に失敗しました。');
  } finally { goodsEventBusy = false; }
}

async function moveGoodsEvent(id, direction) {
  if (goodsEventBusy) return;
  const index = goodsEvents.findIndex(item => String(item.id) === String(id));
  const otherIndex = index + (direction === 'up' ? -1 : 1);
  if (index < 0 || otherIndex < 0 || otherIndex >= goodsEvents.length) return;
  goodsEventBusy = true;
  const original = [...goodsEvents];
  const reordered = [...original];
  [reordered[index], reordered[otherIndex]] = [reordered[otherIndex], reordered[index]];
  const updates = reordered.map((item, position) => ({ id: item.id, sort_order: (position + 1) * 10 }));
  try {
    for (const item of updates) {
      const { error } = await supabaseClient.from('goods_events').update({ sort_order: item.sort_order }).eq('id', item.id);
      if (error) throw error;
    }
    await loadGoodsEvents();
  } catch (error) {
    console.error('GOODS EVENT SORT ERROR:', error);
    for (const item of original) {
      const { error: rollbackError } = await supabaseClient.from('goods_events').update({ sort_order: item.sort_order }).eq('id', item.id);
      if (rollbackError) console.error('GOODS EVENT ROLLBACK ERROR:', rollbackError);
    }
    await loadGoodsEvents();
    alert('EVENTの並び替え保存に失敗しました。再読み込みして確認してください。');
  } finally { goodsEventBusy = false; }
}
/* =========================================================
   ADD EVENT
\========================================================= */
async function addGoodsEvent() {
  if (!newGoodsEventName) {
    return;
  }
  const name =
    newGoodsEventName
      .value
      .trim();
  if (!name) {
    setGoodsEventMessage(
      "EVENT名を入力してください。",
      "error"
    );
    return;
  }
  setGoodsEventMessage(
    "追加しています..."
  );
  let nextSortOrder = 10;
  if (goodsEvents.length) {
    const max =
      Math.max(
        ...goodsEvents.map(
          (item) =>
            Number(item.sort_order) || 0
        )
      );
    nextSortOrder =
      max + 10;
  }
  const {
    error
  } = await supabaseClient
    .from("goods_events")
    .insert({
      name,
      sort_order: nextSortOrder
    });
  if (error) {
    console.error(
      "ADD GOODS EVENT ERROR:",
      error
    );
    if (error.code === "23505") {
      setGoodsEventMessage(
        "同じEVENT名がすでに登録されています。",
        "error"
      );
    } else {
      setGoodsEventMessage(
        "EVENTの追加に失敗しました。",
        "error"
      );
    }
    return;
  }
  newGoodsEventName.value = "";
  setGoodsEventMessage(
    "EVENTを追加しました。",
    "success"
  );
  await loadGoodsEvents();
}
/* =========================================================
   DELETE EVENT
\========================================================= */
async function deleteGoodsEvent(id) {
  const target =
    goodsEvents.find(
      (item) =>
        String(item.id) ===
        String(id)
    );
  if (!target) {
    return;
  }
  const {
    count,
    error: countError
  } = await supabaseClient
    .from("goods_event_links")
    .select(
      "*",
      {
        count: "exact",
        head: true
      }
    )
    .eq(
      "event_id",
      id
    );
  if (countError) {
    console.error(
      "GOODS EVENT COUNT ERROR:",
      countError
    );
    alert(
      "EVENTの使用状況を確認できませんでした。"
    );
    return;
  }
  if (
    count &&
    count > 0
  ) {
    alert(
      `「${target.name}」は商品で使用されているため削除できません。`
    );
    return;
  }
  const confirmed =
    confirm(
      `「${target.name}」を削除しますか？`
    );
  if (!confirmed) {
    return;
  }
  const {
    error
  } = await supabaseClient
    .from("goods_events")
    .delete()
    .eq(
      "id",
      id
    );
  if (error) {
    console.error(
      "DELETE GOODS EVENT ERROR:",
      error
    );
    alert(
      "EVENTの削除に失敗しました。"
    );
    return;
  }
  await loadGoodsEvents();
}
/* =========================================================
   LOAD TALENTS
   talents が正式なマスターテーブル
\========================================================= */
async function loadGoodsTalents() {
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
      "GOODS TALENT LOAD ERROR:",
      error
    );
    goodsTalents = [];
    renderGoodsTalentSelect();
    renderSelectedGoodsTalents();
    return;
  }
  goodsTalents =
    data || [];
  renderGoodsTalentSelect();
  renderSelectedGoodsTalents();
}
/* =========================================================
   TALENT SELECT
\========================================================= */
function renderGoodsTalentSelect() {
  if (!goodsTalentSelect) {
    return;
  }
  const currentValue =
    goodsTalentSelect.value;
  goodsTalentSelect.innerHTML =
    `<option value="">
      TALENTを選択
    </option>`;
  const optionsFragment = document.createDocumentFragment();
  goodsTalents.forEach(
    (talent) => {
      if (
        selectedGoodsTalentIds.includes(
          Number(talent.id)
        )
      ) {
        return;
      }
      const option =
        document.createElement(
          "option"
        );
      option.value =
        String(talent.id);
      option.textContent =
        talent.name;
      optionsFragment.appendChild(
        option
      );
    }
  );
  goodsTalentSelect.appendChild(optionsFragment);
  if (
    currentValue &&
    goodsTalents.some(
      (talent) =>
        String(talent.id) ===
        String(currentValue)
    ) &&
    !selectedGoodsTalentIds.includes(
      Number(currentValue)
    )
  ) {
    goodsTalentSelect.value =
      currentValue;
  }
}
/* =========================================================
   SELECTED TALENTS
\========================================================= */
function renderSelectedGoodsTalents() {
  if (!selectedGoodsTalents) {
    return;
  }
  if (!selectedGoodsTalentIds.length) {
    selectedGoodsTalents.innerHTML =
      `<p class="goods-talent-empty">
        タレントは選択されていません。
      </p>`;
    renderGoodsTalentSelect();
    return;
  }
  const selected =
    selectedGoodsTalentIds
      .map(
        (id) =>
          goodsTalents.find(
            (talent) =>
              Number(talent.id) ===
              Number(id)
          )
      )
      .filter(Boolean);
  selectedGoodsTalents.innerHTML =
    selected
      .map(
        (talent) => `
          <div class="selected-goods-talent">
            <span>
              ${escapeGoodsHTML(talent.name)}
            </span>
            <button
              type="button"
              data-remove-goods-talent="${talent.id}"
              aria-label="${escapeGoodsHTML(talent.name)}を解除"
            >
              ×
            </button>
          </div>
        `
      )
      .join("");
  renderGoodsTalentSelect();
}
/* =========================================================
   ADD SELECTED TALENT
\========================================================= */
function addSelectedGoodsTalent() {
  if (!goodsTalentSelect) {
    return;
  }
  const id =
    Number(
      goodsTalentSelect.value
    );
  if (!id) {
    return;
  }
  if (
    !selectedGoodsTalentIds.includes(
      id
    )
  ) {
    selectedGoodsTalentIds.push(
      id
    );
  }
  goodsTalentSelect.value = "";
  renderSelectedGoodsTalents();
}
/* =========================================================
   REMOVE SELECTED TALENT
\========================================================= */
function removeSelectedGoodsTalent(id) {
  selectedGoodsTalentIds =
    selectedGoodsTalentIds.filter(
      (talentId) =>
        Number(talentId) !==
        Number(id)
    );
  renderSelectedGoodsTalents();
}
/* =========================================================
   LOAD GOODS PRODUCT CATEGORIES
\========================================================= */
async function loadGoodsProductCategories() {
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
      "GOODS CATEGORY LOAD ERROR:",
      error
    );
    if (
      adminGoodsProductCategoryList
    ) {
      adminGoodsProductCategoryList.innerHTML =
        `<p class="error-text">
          GOODSカテゴリーの読み込みに失敗しました。
        </p>`;
    }
    return;
  }
  goodsProductCategories =
    data || [];
  renderGoodsCategorySelect();
  renderGoodsProductCategoryList();
}
/* =========================================================
   GOODS CATEGORY SELECT
\========================================================= */
function renderGoodsCategorySelect() {
  if (!goodsCategory) {
    return;
  }
  const currentValue =
    goodsCategory.value;
  goodsCategory.innerHTML =
    `<option value="">
      カテゴリーを選択
    </option>`;
  const optionsFragment = document.createDocumentFragment();
  goodsProductCategories.forEach(
    (category) => {
      const option =
        document.createElement(
          "option"
        );
      option.value =
        String(category.id);
      option.textContent =
        category.name;
      optionsFragment.appendChild(
        option
      );
    }
  );
  goodsCategory.appendChild(optionsFragment);
  if (
    currentValue &&
    goodsProductCategories.some(
      (category) =>
        String(category.id) ===
        String(currentValue)
    )
  ) {
    goodsCategory.value =
      currentValue;
  }
}
/* =========================================================
   GOODS CATEGORY LIST
\========================================================= */
function renderGoodsProductCategoryList() {
  if (!adminGoodsProductCategoryList) return;
  if (!goodsProductCategories.length) {
    adminGoodsProductCategoryList.innerHTML = '<p class="empty-text">GOODSカテゴリーはまだ登録されていません。</p>';
    return;
  }
  adminGoodsProductCategoryList.innerHTML = goodsProductCategories.map((category, index) => `
    <div class="admin-category-item goods-category-editable-row" data-category-id="${category.id}">
      <div class="admin-category-name">${escapeGoodsHTML(category.name)}</div>
      <div class="admin-category-actions goods-category-edit-actions">
        <button type="button" class="admin-secondary-button" data-category-move="up" data-category-id="${category.id}" ${index === 0 ? 'disabled' : ''} aria-label="${escapeGoodsHTML(category.name)}を上に移動">↑</button>
        <button type="button" class="admin-secondary-button" data-category-move="down" data-category-id="${category.id}" ${index === goodsProductCategories.length - 1 ? 'disabled' : ''} aria-label="${escapeGoodsHTML(category.name)}を下に移動">↓</button>
        <button type="button" class="admin-secondary-button" data-category-edit="${category.id}">編集</button>
        <button type="button" class="delete-button" data-goods-product-category-delete="${category.id}">削除</button>
      </div>
    </div>
  `).join('');
}

let goodsCategoryBusy = false;
async function editGoodsProductCategory(id) {
  if (goodsCategoryBusy) return;
  const category = goodsProductCategories.find(item => String(item.id) === String(id));
  if (!category) return;
  const entered = window.prompt('カテゴリー名を編集', category.name);
  if (entered === null) return;
  const name = entered.trim();
  if (!name) { alert('カテゴリー名を入力してください。'); return; }
  if (name === category.name) return;
  goodsCategoryBusy = true;
  try {
    const { error } = await supabaseClient.from('goods_categories').update({ name }).eq('id', category.id);
    if (error) throw error;
    await loadGoodsProductCategories();
  } catch (error) {
    console.error('GOODS CATEGORY EDIT ERROR:', error);
    alert(error.code === '23505' ? '同じカテゴリー名がすでに登録されています。' : 'カテゴリー名の変更に失敗しました。');
  } finally { goodsCategoryBusy = false; }
}

async function moveGoodsProductCategory(id, direction) {
  if (goodsCategoryBusy) return;
  const index = goodsProductCategories.findIndex(item => String(item.id) === String(id));
  const otherIndex = index + (direction === 'up' ? -1 : 1);
  if (index < 0 || otherIndex < 0 || otherIndex >= goodsProductCategories.length) return;
  goodsCategoryBusy = true;
  const original = [...goodsProductCategories];
  const reordered = [...original];
  [reordered[index], reordered[otherIndex]] = [reordered[otherIndex], reordered[index]];
  // Re-number all entries to avoid ties in sort_order and preserve the visible order.
  const updates = reordered.map((item, position) => ({ id: item.id, sort_order: (position + 1) * 10 }));
  try {
    // Update one row at a time, then refresh. If a write fails, attempt to restore previous values.
    for (const item of updates) {
      const { error } = await supabaseClient.from('goods_categories').update({ sort_order: item.sort_order }).eq('id', item.id);
      if (error) throw error;
    }
    await loadGoodsProductCategories();
  } catch (error) {
    console.error('GOODS CATEGORY SORT ERROR:', error);
    for (const item of original) {
      const { error: rollbackError } = await supabaseClient.from('goods_categories').update({ sort_order: item.sort_order }).eq('id', item.id);
      if (rollbackError) console.error('GOODS CATEGORY ROLLBACK ERROR:', rollbackError);
    }
    await loadGoodsProductCategories();
    alert('並び替えの保存に失敗しました。再読み込みして確認してください。');
  } finally { goodsCategoryBusy = false; }
}
/* =========================================================
   ADD GOODS CATEGORY
\========================================================= */
async function addGoodsProductCategory() {
  if (!newGoodsProductCategoryName) {
    return;
  }
  const name =
    newGoodsProductCategoryName
      .value
      .trim();
  if (!name) {
    setGoodsCategoryMessage(
      "GOODSカテゴリー名を入力してください。",
      "error"
    );
    return;
  }
  setGoodsCategoryMessage(
    "追加しています..."
  );
  let nextSortOrder = 10;
  if (
    goodsProductCategories.length
  ) {
    const max =
      Math.max(
        ...goodsProductCategories.map(
          (item) =>
            Number(item.sort_order) || 0
        )
      );
    nextSortOrder =
      max + 10;
  }
  const {
    error
  } = await supabaseClient
    .from("goods_categories")
    .insert({
      name,
      sort_order: nextSortOrder
    });
  if (error) {
    console.error(
      "ADD GOODS CATEGORY ERROR:",
      error
    );
    if (error.code === "23505") {
      setGoodsCategoryMessage(
        "同じGOODSカテゴリーがすでに登録されています。",
        "error"
      );
    } else {
      setGoodsCategoryMessage(
        "GOODSカテゴリーの追加に失敗しました。",
        "error"
      );
    }
    return;
  }
  newGoodsProductCategoryName.value =
    "";
  setGoodsCategoryMessage(
    "GOODSカテゴリーを追加しました。",
    "success"
  );
  await loadGoodsProductCategories();
}
/* =========================================================
   DELETE GOODS CATEGORY
\========================================================= */
async function deleteGoodsProductCategory(
  id
) {
  const target =
    goodsProductCategories.find(
      (item) =>
        String(item.id) ===
        String(id)
    );
  if (!target) {
    return;
  }
  const {
    count,
    error: countError
  } = await supabaseClient
    .from("goods_category_links")
    .select(
      "*",
      {
        count: "exact",
        head: true
      }
    )
    .eq(
      "category_id",
      id
    );
  if (countError) {
    console.error(
      "GOODS CATEGORY COUNT ERROR:",
      countError
    );
    alert(
      "カテゴリーの使用状況を確認できませんでした。"
    );
    return;
  }
  if (
    count &&
    count > 0
  ) {
    alert(
      `「${target.name}」は商品で使用されているため削除できません。`
    );
    return;
  }
  const confirmed =
    confirm(
      `「${target.name}」を削除しますか？`
    );
  if (!confirmed) {
    return;
  }
  const {
    error
  } = await supabaseClient
    .from("goods_categories")
    .delete()
    .eq(
      "id",
      id
    );
  if (error) {
    console.error(
      "DELETE GOODS CATEGORY ERROR:",
      error
    );
    alert(
      "GOODSカテゴリーの削除に失敗しました。"
    );
    return;
  }
  await loadGoodsProductCategories();
}
/* =========================================================
   LOAD ALL CATEGORY DATA
\========================================================= */
async function loadAllGoodsCategories() {
  await Promise.all([
    loadGoodsEvents(),
    loadGoodsTalents(),
    loadGoodsProductCategories()
  ]);
}
/* =========================================================
   EVENT FORM
\========================================================= */
function openGoodsEventForm() {
  goodsEventFormArea
    ?.classList
    .remove("hidden");
  setGoodsEventMessage("");
  if (newGoodsEventName) {
    newGoodsEventName.value = "";
    newGoodsEventName.focus();
  }
}
function closeGoodsEventForm() {
  goodsEventFormArea
    ?.classList
    .add("hidden");
  if (newGoodsEventName) {
    newGoodsEventName.value = "";
  }
  setGoodsEventMessage("");
}
/* =========================================================
   GOODS CATEGORY FORM
\========================================================= */
function openGoodsProductCategoryForm() {
  goodsProductCategoryFormArea
    ?.classList
    .remove("hidden");
  setGoodsCategoryMessage("");
  if (
    newGoodsProductCategoryName
  ) {
    newGoodsProductCategoryName.value =
      "";
    newGoodsProductCategoryName.focus();
  }
}
function closeGoodsProductCategoryForm() {
  goodsProductCategoryFormArea
    ?.classList
    .add("hidden");
  if (
    newGoodsProductCategoryName
  ) {
    newGoodsProductCategoryName.value =
      "";
  }
  setGoodsCategoryMessage("");
}
/* =========================================================
   IMAGE PREVIEW
\========================================================= */
function renderGoodsImagePreview() {
  if (
    !goodsImagePreviewArea ||
    !goodsImagePreview
  ) {
    return;
  }
  if (!currentGoodsImageUrl) {
    goodsImagePreviewArea
      .classList
      .add("hidden");
    goodsImagePreview
      .removeAttribute("src");
    if (goodsImageUrl) {
      goodsImageUrl.value = "";
    }
    return;
  }
  goodsImagePreview.src =
    currentGoodsImageUrl;
  goodsImagePreviewArea
    .classList
    .remove("hidden");
  if (goodsImageUrl) {
    goodsImageUrl.value =
      currentGoodsImageUrl;
  }
}
/* =========================================================
   DELETE STORAGE IMAGE
\========================================================= */
async function deleteGoodsStorageImage(
  path
) {
  if (!path) {
    return true;
  }
  const {
    error
  } = await supabaseClient
    .storage
    .from(GOODS_IMAGE_BUCKET)
    .remove([path]);
  if (error) {
    console.error(
      "GOODS STORAGE DELETE ERROR:",
      error
    );
    return false;
  }
  return true;
}
/* =========================================================
   CLEAN PENDING IMAGE
\========================================================= */
async function cleanupPendingGoodsImage() {
  if (!pendingGoodsImagePath) {
    return;
  }
  await deleteGoodsStorageImage(
    pendingGoodsImagePath
  );
  pendingGoodsImagePath = "";
}
/* =========================================================
   IMAGE VALIDATION
\========================================================= */
function validateGoodsImageFile(file) {
  if (!file) {
    return {
      valid: false,
      message:
        "画像が選択されていません。"
    };
  }
  if (
    !GOODS_IMAGE_ALLOWED_TYPES.includes(
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
    GOODS_IMAGE_MAX_SIZE
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
/* =========================================================
   FILE NAME
\========================================================= */
function createGoodsImageFileName(
  file
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "jpg";
  const timestamp =
    Date.now();
  const random =
    Math.random()
      .toString(36)
      .slice(2, 10);
  return (
    `goods/${timestamp}-${random}.${extension}`
  );
}
/* =========================================================
   UPLOAD GOODS IMAGE
\========================================================= */
async function uploadGoodsImage(
  file
) {
  const validation =
    validateGoodsImageFile(file);
  if (!validation.valid) {
    setGoodsImageMessage(
      validation.message,
      "error"
    );
    return;
  }
  setGoodsImageMessage(
    "画像をアップロードしています..."
  );
  if (pendingGoodsImagePath) {
    await deleteGoodsStorageImage(
      pendingGoodsImagePath
    );
    pendingGoodsImagePath = "";
  }
  file = await window.ANRIELImageOptimizer.optimize(file, 'goods');
  const path =
    createGoodsImageFileName(
      file
    );
  const {
    error: uploadError
  } = await supabaseClient
    .storage
    .from(GOODS_IMAGE_BUCKET)
    .upload(
      path,
      file,
      {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type
      }
    );
  if (uploadError) {
    console.error(
      "GOODS IMAGE UPLOAD ERROR:",
      uploadError
    );
    setGoodsImageMessage(
      "画像のアップロードに失敗しました。",
      "error"
    );
    return;
  }
  const {
    data
  } = supabaseClient
    .storage
    .from(GOODS_IMAGE_BUCKET)
    .getPublicUrl(path);
  if (
    !data ||
    !data.publicUrl
  ) {
    await deleteGoodsStorageImage(
      path
    );
    setGoodsImageMessage(
      "画像URLの取得に失敗しました。",
      "error"
    );
    return;
  }
  currentGoodsImageUrl =
    data.publicUrl;
  currentGoodsImagePath =
    path;
  pendingGoodsImagePath =
    path;
  renderGoodsImagePreview();
  setGoodsImageMessage(
    "画像をアップロードしました。商品を保存すると反映されます。",
    "success"
  );
}
/* =========================================================
   REMOVE CURRENT IMAGE
\========================================================= */
async function removeCurrentGoodsImage() {
  if (
    pendingGoodsImagePath &&
    currentGoodsImagePath ===
      pendingGoodsImagePath
  ) {
    await deleteGoodsStorageImage(
      pendingGoodsImagePath
    );
    pendingGoodsImagePath = "";
  }
  currentGoodsImageUrl = "";
  currentGoodsImagePath = "";
  renderGoodsImagePreview();
  setGoodsImageMessage(
    "商品画像を削除しました。保存すると反映されます。"
  );
}
/* =========================================================
   RESET GOODS FORM
\========================================================= */
function resetGoodsForm() {
  goodsForm?.reset();
  if (goodsId) {
    goodsId.value = "";
  }
  if (goodsSortOrder) {
    goodsSortOrder.value = "0";
  }
  selectedGoodsTalentIds = [];
  currentGoodsImageUrl = "";
  currentGoodsImagePath = "";
  originalGoodsImageUrl = "";
  originalGoodsImagePath = "";
  pendingGoodsImagePath = "";
  renderSelectedGoodsTalents();
  renderGoodsImagePreview();
  setGoodsFormMessage("");
  setGoodsImageMessage("");
}
/* =========================================================
   OPEN NEW GOODS
\========================================================= */
async function openNewGoodsForm() {
  await cleanupPendingGoodsImage();
  resetGoodsForm();
  await loadAllGoodsCategories();
  if (goodsFormTitle) {
    goodsFormTitle.textContent =
      "GOODSを追加";
  }
  goodsFormArea
    ?.classList
    .remove("hidden");
  goodsName?.focus();
  goodsFormArea
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}
/* =========================================================
   CLOSE GOODS FORM
\========================================================= */
async function closeGoodsForm() {
  await cleanupPendingGoodsImage();
  goodsFormArea
    ?.classList
    .add("hidden");
  resetGoodsForm();
}
/* =========================================================
   LOAD GOODS
\========================================================= */
async function loadGoods() {
  if (!adminGoodsList) {
    return;
  }
  adminGoodsList.innerHTML =
    `<p class="loading-text">
      読み込み中...
    </p>`;
  if (goodsListCount) {
    goodsListCount.textContent =
      "読み込み中...";
  }
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
      updated_at,
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
      "GOODS LOAD ERROR:",
      error
    );
    adminGoodsList.innerHTML =
      `<p class="error-text">
        GOODSの読み込みに失敗しました。
      </p>`;
    if (goodsListCount) {
      goodsListCount.textContent =
        "読み込み失敗";
    }
    return;
  }
  goodsItems =
    data || [];
  if (goodsListCount) {
    goodsListCount.textContent =
      `${goodsItems.length}件`;
  }
  renderGoodsList();
}
/* =========================================================
   RENDER GOODS LIST
\========================================================= */
function renderGoodsList() {
  if (!adminGoodsList) {
    return;
  }
  if (!goodsItems.length) {
    adminGoodsList.innerHTML =
      `<p class="empty-text">
        GOODSはまだ登録されていません。
      </p>`;
    return;
  }
  adminGoodsList.innerHTML =
    goodsItems
      .map(
        (item) => {
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
          const statusClass =
            item.published
              ? "published"
              : "draft";
          const statusText =
            item.published
              ? "公開"
              : "非公開";
          const imageHTML =
            item.image_url
              ? `
                <div class="schedule-admin-thumbnail">
                  <img
                    src="${escapeGoodsHTML(item.image_url)}"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  >
                </div>
              `
              : "";
          return `
            <div class="admin-list-item">
              ${imageHTML}
              <div class="admin-list-main">
                <div class="admin-list-meta">
                  <span class="status-badge ${statusClass}">
                    ${statusText}
                  </span>
                  ${
                    categoryNames.length
                      ? `
                        <span>
                          ${escapeGoodsHTML(
                            categoryNames.join(" / ")
                          )}
                        </span>
                      `
                      : ""
                  }
                  ${
                    eventNames.length
                      ? `
                        <span>
                          ${escapeGoodsHTML(
                            eventNames.join(" / ")
                          )}
                        </span>
                      `
                      : ""
                  }
                </div>
                <h4>
                  ${escapeGoodsHTML(item.name)}
                </h4>
                ${
                  item.price !== null
                    ? `
                      <p class="admin-list-sub">
                        ${escapeGoodsHTML(
                          formatGoodsPrice(
                            item.price
                          )
                        )}
                      </p>
                    `
                    : ""
                }
                ${
                  talentNames.length
                    ? `
                      <p class="admin-list-sub">
                        TALENT：
                        ${escapeGoodsHTML(
                          talentNames.join(" / ")
                        )}
                      </p>
                    `
                    : ""
                }
              </div>
              <div class="admin-list-actions">
                <button
                  type="button"
                  class="edit-button"
                  data-goods-edit="${item.id}"
                >
                  編集
                </button>
                <button
                  type="button"
                  class="delete-button"
                  data-goods-delete="${item.id}"
                >
                  削除
                </button>
              </div>
            </div>
          `;
        }
      )
      .join("");
}
/* =========================================================
   EDIT GOODS
\========================================================= */
async function editGoods(id) {
  const item =
    goodsItems.find(
      (goods) =>
        String(goods.id) ===
        String(id)
    );
  if (!item) {
    alert(
      "商品データが見つかりません。"
    );
    return;
  }
  await cleanupPendingGoodsImage();
  resetGoodsForm();
  await loadAllGoodsCategories();
  if (goodsFormTitle) {
    goodsFormTitle.textContent =
      "GOODSを編集";
  }
  if (goodsId) {
    goodsId.value = item.id;
  }
  if (goodsName) {
    goodsName.value =
      item.name || "";
  }
  if (goodsPrice) {
    goodsPrice.value =
      item.price ?? "";
  }
  if (goodsSortOrder) {
    goodsSortOrder.value =
      item.sort_order ?? 0;
  }
  if (goodsDescription) {
    goodsDescription.value =
      item.description || "";
  }
  if (goodsExternalUrl) {
    goodsExternalUrl.value =
      item.external_url || "";
  }
  if (goodsPublished) {
    goodsPublished.checked =
      Boolean(
        item.published
      );
  }
  const eventLink =
    (
      item.goods_event_links ||
      []
    )[0];
  if (
    goodsEvent &&
    eventLink
  ) {
    goodsEvent.value =
      String(
        eventLink.event_id
      );
  }
  const categoryLink =
    (
      item.goods_category_links ||
      []
    )[0];
  if (
    goodsCategory &&
    categoryLink
  ) {
    goodsCategory.value =
      String(
        categoryLink.category_id
      );
  }
  selectedGoodsTalentIds =
    (
      item.goods_talent_links ||
      []
    )
      .map(
        (link) =>
          Number(link.talent_id)
      )
      .filter(Boolean);
  currentGoodsImageUrl =
    item.image_url || "";
  currentGoodsImagePath =
    getGoodsStoragePathFromUrl(
      currentGoodsImageUrl
    );
  originalGoodsImageUrl =
    currentGoodsImageUrl;
  originalGoodsImagePath =
    currentGoodsImagePath;
  pendingGoodsImagePath = "";
  renderSelectedGoodsTalents();
  renderGoodsImagePreview();
  goodsFormArea
    ?.classList
    .remove("hidden");
  goodsFormArea
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}
/* =========================================================
   SAVE GOODS LINKS
\========================================================= */
async function saveGoodsLinks(
  goodsRecordId
) {
  /* EVENT */
  const {
    error: deleteEventError
  } = await supabaseClient
    .from("goods_event_links")
    .delete()
    .eq(
      "goods_id",
      goodsRecordId
    );
  if (deleteEventError) {
    throw deleteEventError;
  }
  const selectedEventId =
    Number(
      goodsEvent?.value
    );
  if (selectedEventId) {
    const {
      error
    } = await supabaseClient
      .from("goods_event_links")
      .insert({
        goods_id:
          goodsRecordId,
        event_id:
          selectedEventId
      });
    if (error) {
      throw error;
    }
  }
  /* GOODS CATEGORY */
  const {
    error: deleteCategoryError
  } = await supabaseClient
    .from("goods_category_links")
    .delete()
    .eq(
      "goods_id",
      goodsRecordId
    );
  if (deleteCategoryError) {
    throw deleteCategoryError;
  }
  const selectedCategoryId =
    Number(
      goodsCategory?.value
    );
  if (selectedCategoryId) {
    const {
      error
    } = await supabaseClient
      .from("goods_category_links")
      .insert({
        goods_id:
          goodsRecordId,
        category_id:
          selectedCategoryId
      });
    if (error) {
      throw error;
    }
  }
  /* TALENT */
  const {
    error: deleteTalentError
  } = await supabaseClient
    .from("goods_talent_links")
    .delete()
    .eq(
      "goods_id",
      goodsRecordId
    );
  if (deleteTalentError) {
    throw deleteTalentError;
  }
  if (
    selectedGoodsTalentIds.length
  ) {
    const talentRows =
      selectedGoodsTalentIds.map(
        (talentId) => ({
          goods_id:
            goodsRecordId,
          talent_id:
            talentId
        })
      );
    const {
      error
    } = await supabaseClient
      .from("goods_talent_links")
      .insert(
        talentRows
      );
    if (error) {
      throw error;
    }
  }
}
/* =========================================================
   SAVE GOODS
\========================================================= */
async function saveGoods(event) {
  event.preventDefault();
  const name =
    goodsName?.value.trim() ||
    "";
  const externalUrl =
    goodsExternalUrl?.value.trim() ||
    "";
  const selectedCategoryId =
    Number(
      goodsCategory?.value
    );
  if (!name) {
    setGoodsFormMessage(
      "商品名を入力してください。",
      "error"
    );
    return;
  }
  if (!selectedCategoryId) {
    setGoodsFormMessage(
      "GOODS CATEGORYを選択してください。",
      "error"
    );
    return;
  }
  if (!externalUrl) {
    setGoodsFormMessage(
      "販売ページURLを入力してください。",
      "error"
    );
    return;
  }
  try {
    const parsedUrl =
      new URL(externalUrl);
    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      throw new Error(
        "Invalid protocol"
      );
    }
  } catch {
    setGoodsFormMessage(
      "販売ページURLを正しく入力してください。",
      "error"
    );
    return;
  }
  setGoodsFormMessage(
    "保存しています..."
  );
  const editingId =
    goodsId?.value
      ? Number(goodsId.value)
      : null;
  const priceValue =
    goodsPrice?.value !== ""
      ? Number(goodsPrice.value)
      : null;
  const sortOrderValue =
    goodsSortOrder?.value !== ""
      ? Number(goodsSortOrder.value)
      : 0;
  const payload = {
    name,
    price:
      Number.isFinite(priceValue)
        ? priceValue
        : null,
    description:
      goodsDescription
        ?.value
        .trim() ||
      null,
    image_url:
      currentGoodsImageUrl ||
      null,
    external_url:
      externalUrl,
    published:
      Boolean(
        goodsPublished?.checked
      ),
    sort_order:
      Number.isFinite(
        sortOrderValue
      )
        ? sortOrderValue
        : 0,
    updated_at:
      new Date().toISOString()
  };
  let savedGoodsId =
    editingId;
  if (editingId) {
    const {
      error
    } = await supabaseClient
      .from("goods")
      .update(payload)
      .eq(
        "id",
        editingId
      );
    if (error) {
      console.error(
        "GOODS UPDATE ERROR:",
        error
      );
      setGoodsFormMessage(
        "GOODSの保存に失敗しました。",
        "error"
      );
      return;
    }
  } else {
    const {
      data,
      error
    } = await supabaseClient
      .from("goods")
      .insert(payload)
      .select("id")
      .single();
    if (error) {
      console.error(
        "GOODS INSERT ERROR:",
        error
      );
      setGoodsFormMessage(
        "GOODSの保存に失敗しました。",
        "error"
      );
      return;
    }
    savedGoodsId =
      data.id;
  }
  try {
    await saveGoodsLinks(
      savedGoodsId
    );
  } catch (error) {
    console.error(
      "GOODS LINK SAVE ERROR:",
      error
    );
    setGoodsFormMessage(
      "商品本体は保存されましたが、カテゴリー・タレント情報の保存に失敗しました。",
      "error"
    );
    return;
  }
  if (
    originalGoodsImagePath &&
    originalGoodsImagePath !==
      currentGoodsImagePath
  ) {
    await deleteGoodsStorageImage(
      originalGoodsImagePath
    );
  }
  pendingGoodsImagePath = "";
  originalGoodsImageUrl =
    currentGoodsImageUrl;
  originalGoodsImagePath =
    currentGoodsImagePath;
  setGoodsFormMessage(
    "保存しました。",
    "success"
  );
  await loadGoods();
  setTimeout(
    () => {
      goodsFormArea
        ?.classList
        .add("hidden");
      resetGoodsForm();
    },
    500
  );
}
/* =========================================================
   DELETE GOODS
\========================================================= */
async function deleteGoods(id) {
  const item =
    goodsItems.find(
      (goods) =>
        String(goods.id) ===
        String(id)
    );
  if (!item) {
    return;
  }
  const confirmed =
    confirm(
      `「${item.name}」を削除しますか？`
    );
  if (!confirmed) {
    return;
  }
  const imagePath =
    getGoodsStoragePathFromUrl(
      item.image_url
    );
  const {
    error
  } = await supabaseClient
    .from("goods")
    .delete()
    .eq(
      "id",
      id
    );
  if (error) {
    console.error(
      "DELETE GOODS ERROR:",
      error
    );
    alert(
      "GOODSの削除に失敗しました。"
    );
    return;
  }
  if (imagePath) {
    await deleteGoodsStorageImage(
      imagePath
    );
  }
  await loadGoods();
}
/* =========================================================
   EVENT LIST CLICK
\========================================================= */
adminGoodsEventList
  ?.addEventListener("click", async (event) => {
    const editButton = event.target.closest('[data-event-edit]');
    if (editButton) { await editGoodsEvent(editButton.dataset.eventEdit); return; }
    const moveButton = event.target.closest('[data-event-move]');
    if (moveButton) { await moveGoodsEvent(moveButton.dataset.eventId, moveButton.dataset.eventMove); return; }
    const deleteButton = event.target.closest('[data-goods-event-delete]');
    if (deleteButton) await deleteGoodsEvent(deleteButton.dataset.goodsEventDelete);
  });
/* =========================================================
   GOODS CATEGORY LIST CLICK
\========================================================= */
adminGoodsProductCategoryList
  ?.addEventListener(
    "click",
    async (event) => {
      const editButton = event.target.closest('[data-category-edit]');
      if (editButton) { await editGoodsProductCategory(editButton.dataset.categoryEdit); return; }
      const moveButton = event.target.closest('[data-category-move]');
      if (moveButton) { await moveGoodsProductCategory(moveButton.dataset.categoryId, moveButton.dataset.categoryMove); return; }
      const button =
        event.target.closest(
          "[data-goods-product-category-delete]"
        );
      if (!button) {
        return;
      }
      await deleteGoodsProductCategory(
        button.dataset
          .goodsProductCategoryDelete
      );
    }
  );
/* =========================================================
   SELECTED TALENT CLICK
\========================================================= */
selectedGoodsTalents
  ?.addEventListener(
    "click",
    (event) => {
      const button =
        event.target.closest(
          "[data-remove-goods-talent]"
        );
      if (!button) {
        return;
      }
      removeSelectedGoodsTalent(
        button.dataset
          .removeGoodsTalent
      );
    }
  );
/* =========================================================
   GOODS LIST CLICK
\========================================================= */
adminGoodsList
  ?.addEventListener(
    "click",
    async (event) => {
      const editButton =
        event.target.closest(
          "[data-goods-edit]"
        );
      if (editButton) {
        await editGoods(
          editButton.dataset
            .goodsEdit
        );
        return;
      }
      const deleteButton =
        event.target.closest(
          "[data-goods-delete]"
        );
      if (deleteButton) {
        await deleteGoods(
          deleteButton.dataset
            .goodsDelete
        );
      }
    }
  );
/* =========================================================
   IMAGE DROP
\========================================================= */
goodsImageDropZone
  ?.addEventListener(
    "click",
    () => {
      goodsImageInput?.click();
    }
  );
goodsImageDropZone
  ?.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        goodsImageInput?.click();
      }
    }
  );
goodsImageDropZone
  ?.addEventListener(
    "dragover",
    (event) => {
      event.preventDefault();
      goodsImageDropZone
        .classList
        .add("dragover");
    }
  );
goodsImageDropZone
  ?.addEventListener(
    "dragleave",
    () => {
      goodsImageDropZone
        .classList
        .remove("dragover");
    }
  );
goodsImageDropZone
  ?.addEventListener(
    "drop",
    async (event) => {
      event.preventDefault();
      goodsImageDropZone
        .classList
        .remove("dragover");
      const file =
        event.dataTransfer
          ?.files?.[0];
      if (file) {
        await uploadGoodsImage(
          file
        );
      }
    }
  );
goodsImageInput
  ?.addEventListener(
    "change",
    async () => {
      const file =
        goodsImageInput
          .files?.[0];
      if (file) {
        await uploadGoodsImage(
          file
        );
      }
      goodsImageInput.value = "";
    }
  );
/* =========================================================
   GOODS FORM EVENTS
\========================================================= */
newGoodsButton
  ?.addEventListener(
    "click",
    openNewGoodsForm
  );
goodsCancelButton
  ?.addEventListener(
    "click",
    closeGoodsForm
  );
goodsCancelButtonBottom
  ?.addEventListener(
    "click",
    closeGoodsForm
  );
goodsForm
  ?.addEventListener(
    "submit",
    saveGoods
  );
addGoodsTalentButton
  ?.addEventListener(
    "click",
    addSelectedGoodsTalent
  );
goodsImageDeleteButton
  ?.addEventListener(
    "click",
    removeCurrentGoodsImage
  );
reloadGoodsButton
  ?.addEventListener(
    "click",
    loadGoods
  );
/* =========================================================
   MAIN TAB EVENTS
\========================================================= */
goodsListTabButton
  ?.addEventListener(
    "click",
    () => {
      switchGoodsView(
        "list"
      );
    }
  );
goodsCategoryTabButton
  ?.addEventListener(
    "click",
    () => {
      switchGoodsView(
        "category"
      );
    }
  );
/* =========================================================
   CATEGORY TAB EVENTS
\========================================================= */
goodsEventCategoryTabButton
  ?.addEventListener(
    "click",
    () => {
      switchGoodsCategoryView(
        "event"
      );
    }
  );
goodsProductCategoryTabButton
  ?.addEventListener(
    "click",
    () => {
      switchGoodsCategoryView(
        "product"
      );
    }
  );
/* =========================================================
   EVENT FORM EVENTS
\========================================================= */
openGoodsEventFormButton
  ?.addEventListener(
    "click",
    openGoodsEventForm
  );
cancelGoodsEventButton
  ?.addEventListener(
    "click",
    closeGoodsEventForm
  );
cancelGoodsEventButtonBottom
  ?.addEventListener(
    "click",
    closeGoodsEventForm
  );
addGoodsEventButton
  ?.addEventListener(
    "click",
    addGoodsEvent
  );
reloadGoodsEventButton
  ?.addEventListener(
    "click",
    loadGoodsEvents
  );
newGoodsEventName
  ?.addEventListener(
    "keydown",
    async (event) => {
      if (
        event.key === "Enter"
      ) {
        event.preventDefault();
        await addGoodsEvent();
      }
    }
  );
/* =========================================================
   GOODS CATEGORY FORM EVENTS
\========================================================= */
openGoodsProductCategoryFormButton
  ?.addEventListener(
    "click",
    openGoodsProductCategoryForm
  );
cancelGoodsProductCategoryButton
  ?.addEventListener(
    "click",
    closeGoodsProductCategoryForm
  );
cancelGoodsProductCategoryButtonBottom
  ?.addEventListener(
    "click",
    closeGoodsProductCategoryForm
  );
addGoodsProductCategoryButton
  ?.addEventListener(
    "click",
    addGoodsProductCategory
  );
reloadGoodsProductCategoryButton
  ?.addEventListener(
    "click",
    loadGoodsProductCategories
  );
newGoodsProductCategoryName
  ?.addEventListener(
    "keydown",
    async (event) => {
      if (
        event.key === "Enter"
      ) {
        event.preventDefault();
        await addGoodsProductCategory();
      }
    }
  );
/* =========================================================
   INITIALIZE
\========================================================= */
async function initializeGoodsAdmin() {
  if (!goodsPanel) {
    return;
  }
  if (goodsAdminInitialized) {
    return;
  }
  goodsAdminInitialized = true;
  // カテゴリーと商品一覧は独立した取得処理のため並列実行。
  await Promise.all([
    loadAllGoodsCategories(),
    loadGoods()
  ]);
  switchGoodsView(
    "list"
  );
}
/* =========================================================
   EXPORT
\========================================================= */
window.initializeGoodsAdmin =
  initializeGoodsAdmin;
window.loadGoods =
  loadGoods;
window.loadGoodsTalents =
  loadGoodsTalents;
window.loadAllGoodsCategories =
  loadAllGoodsCategories;
