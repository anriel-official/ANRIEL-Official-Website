// ==================================================

// AN:RIEL

// TALENT ADMIN

// ==================================================

const TALENT_BUCKET = "news-images";

const TALENT_IMAGE_FOLDER = "talents";

const TALENT_MAX_IMAGE_SIZE =

  5 * 1024 * 1024;

const TALENT_ALLOWED_IMAGE_TYPES = [

  "image/jpeg",

  "image/png",

  "image/webp"

];

// ==================================================

// STATE

// ==================================================

let talentListImageFile = null;

let talentProfileImageFile = null;

let talentLogoImageFile = null;

let currentTalentListImageUrl = null;

let currentTalentProfileImageUrl = null;

let currentTalentLogoImageUrl = null;

let talentGenerationsCache = [];

// ==================================================

// ELEMENTS

// ==================================================

const talentForm =

  document.getElementById("talentForm");

const talentId =

  document.getElementById("talentId");

const talentName =

  document.getElementById("talentName");

const talentNameEn =

  document.getElementById("talentNameEn");

const talentSlug =

  document.getElementById("talentSlug");

const talentGeneration =

  document.getElementById(

    "talentGeneration"

  );

const talentProfile =

  document.getElementById(

    "talentProfile"

  );

const talentBirthday =

  document.getElementById(

    "talentBirthday"

  );

const talentHeight =

  document.getElementById(

    "talentHeight"

  );

const talentDebutDate =

  document.getElementById(

    "talentDebutDate"

  );

const talentFanName =

  document.getElementById(

    "talentFanName"

  );

const talentIllustratorName =

  document.getElementById(

    "talentIllustratorName"

  );

const talentIllustratorUrl =

  document.getElementById(

    "talentIllustratorUrl"

  );

const talentMainColor =

  document.getElementById(

    "talentMainColor"

  );

const talentBackgroundColor =

  document.getElementById(

    "talentBackgroundColor"

  );

const talentTextColor =

  document.getElementById(

    "talentTextColor"

  );

const talentXUrl =

  document.getElementById(

    "talentXUrl"

  );

const talentYoutubeUrl =

  document.getElementById(

    "talentYoutubeUrl"

  );

const talentYoutubeChannelId =

  document.getElementById(

    "talentYoutubeChannelId"

  );

const talentYoutubeHandle =

  document.getElementById(

    "talentYoutubeHandle"

  );

const talentPickupVideoUrl =

  document.getElementById(

    "talentPickupVideoUrl"

  );

const talentPickupVideoTitle =

  document.getElementById(

    "talentPickupVideoTitle"

  );

const talentStatus =

  document.getElementById(

    "talentStatus"

  );

const talentPublished =

  document.getElementById(

    "talentPublished"

  );

const talentFormTitle =

  document.getElementById(

    "talentFormTitle"

  );

const talentFormMessage =

  document.getElementById(

    "talentFormMessage"

  );

const adminTalentList =

  document.getElementById(

    "adminTalentList"

  );

const talentListCount =

  document.getElementById(

    "talentListCount"

  );

const reloadTalentButton =

  document.getElementById(

    "reloadTalentButton"

  );

// ==================================================

// IMAGE ELEMENTS

// ==================================================

const talentListImageDropZone =

  document.getElementById(

    "talentListImageDropZone"

  );

const talentListImageInput =

  document.getElementById(

    "talentListImageInput"

  );

const talentListImagePreview =

  document.getElementById(

    "talentListImagePreview"

  );

const talentProfileImageDropZone =

  document.getElementById(

    "talentProfileImageDropZone"

  );

const talentProfileImageInput =

  document.getElementById(

    "talentProfileImageInput"

  );

const talentProfileImagePreview =

  document.getElementById(

    "talentProfileImagePreview"

  );

const talentLogoImageDropZone =

  document.getElementById(

    "talentLogoImageDropZone"

  );

const talentLogoImageInput =

  document.getElementById(

    "talentLogoImageInput"

  );

const talentLogoImagePreview =

  document.getElementById(

    "talentLogoImagePreview"

  );

// ==================================================

// GENERATION

// ==================================================

const generationFormArea =

  document.getElementById(

    "generationFormArea"

  );

const openGenerationFormButton =

  document.getElementById(

    "openGenerationFormButton"

  );

const cancelGenerationButton =

  document.getElementById(

    "cancelGenerationButton"

  );

const cancelGenerationButtonBottom =

  document.getElementById(

    "cancelGenerationButtonBottom"

  );

const newGenerationName =

  document.getElementById(

    "newGenerationName"

  );

const newGenerationColumnsCount = document.getElementById("newGenerationColumnsCount");
const generationEditId = document.getElementById("generationEditId");
const generationFormTitle = document.getElementById("generationFormTitle");

const newGenerationPublished =

  document.getElementById(

    "newGenerationPublished"

  );

const generationFormMessage =

  document.getElementById(

    "generationFormMessage"

  );

const addGenerationButton =

  document.getElementById(

    "addGenerationButton"

  );

const adminGenerationList =

  document.getElementById(

    "adminGenerationList"

  );

const generationListCount =

  document.getElementById(

    "generationListCount"

  );

const reloadGenerationButton =

  document.getElementById(

    "reloadGenerationButton"

  );

// ==================================================

// HELPERS

// ==================================================

function escapeTalentHtml(value) {

  return String(value ?? "")

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}

function normalizeTalentSlug(value) {

  return String(value ?? "")

    .trim()

    .toLowerCase()

    .replace(/\s+/g, "-")

    .replace(/[^a-z0-9-]/g, "")

    .replace(/-+/g, "-")

    .replace(/^-|-$/g, "");

}

function setTalentMessage(

  message,

  type = ""

) {

  if (!talentFormMessage) {

    return;

  }

  talentFormMessage.textContent =

    message || "";

  talentFormMessage.classList.remove(

    "success",

    "error"

  );

  if (type) {

    talentFormMessage

      .classList.add(type);

  }

}

function setGenerationMessage(

  message,

  type = ""

) {

  if (!generationFormMessage) {

    return;

  }

  generationFormMessage.textContent =

    message || "";

  generationFormMessage.classList.remove(

    "success",

    "error"

  );

  if (type) {

    generationFormMessage

      .classList.add(type);

  }

}

// ==================================================

// IMAGE VALIDATION

// ==================================================

function validateTalentImage(file) {

  if (!file) {

    return false;

  }

  if (

    !TALENT_ALLOWED_IMAGE_TYPES.includes(

      file.type

    )

  ) {

    alert(

      "JPEG / PNG / WebP の画像を選択してください。"

    );

    return false;

  }

  if (

    file.size >

    TALENT_MAX_IMAGE_SIZE

  ) {

    alert(

      "画像サイズは5MB以下にしてください。"

    );

    return false;

  }

  return true;

}

// ==================================================

// IMAGE PREVIEW

// ==================================================

function renderTalentImagePreview(

  container,

  source,

  label

) {

  if (!container) {

    return;

  }

  container.innerHTML = "";

  if (!source) {

    return;

  }

  const wrapper =

    document.createElement("div");

  wrapper.className =

    "news-image-item";

  const img =

    document.createElement("img");

  img.src = source;

  img.alt = label || "画像";

  img.style.maxWidth = "220px";

  img.style.height = "auto";

  img.style.display = "block";

  wrapper.appendChild(img);

  container.appendChild(wrapper);

}

// ==================================================

// IMAGE FILE SET

// ==================================================

function setTalentImageFile(

  type,

  file

) {

  if (!validateTalentImage(file)) {

    return;

  }

  const previewUrl =

    URL.createObjectURL(file);

  if (type === "list") {

    talentListImageFile = file;

    renderTalentImagePreview(

      talentListImagePreview,

      previewUrl,

      "一覧用画像"

    );

  }

  if (type === "profile") {

    talentProfileImageFile = file;

    renderTalentImagePreview(

      talentProfileImagePreview,

      previewUrl,

      "プロフィール画像"

    );

  }

  if (type === "logo") {

    talentLogoImageFile = file;

    renderTalentImagePreview(

      talentLogoImagePreview,

      previewUrl,

      "タレントロゴ"

    );

  }

}

// ==================================================

// IMAGE DROP ZONE

// ==================================================

function setupTalentDropZone(

  dropZone,

  input,

  type

) {

  if (

    !dropZone ||

    !input

  ) {

    return;

  }

  dropZone.addEventListener(

    "click",

    () => {

      input.click();

    }

  );

  dropZone.addEventListener(

    "keydown",

    event => {

      if (

        event.key === "Enter" ||

        event.key === " "

      ) {

        event.preventDefault();

        input.click();

      }

    }

  );

  input.addEventListener(

    "change",

    () => {

      const file =

        input.files?.[0];

      if (file) {

        setTalentImageFile(

          type,

          file

        );

      }

    }

  );

  [

    "dragenter",

    "dragover"

  ].forEach(

    eventName => {

      dropZone.addEventListener(

        eventName,

        event => {

          event.preventDefault();

          dropZone

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

    eventName => {

      dropZone.addEventListener(

        eventName,

        event => {

          event.preventDefault();

          dropZone

            .classList.remove(

              "dragover"

            );

        }

      );

    }

  );

  dropZone.addEventListener(

    "drop",

    event => {

      const file =

        event.dataTransfer

          ?.files?.[0];

      if (file) {

        setTalentImageFile(

          type,

          file

        );

      }

    }

  );

}

// ==================================================

// UPLOAD IMAGE

// ==================================================

async function uploadTalentImage(

  file,

  type,

  slug

) {

  if (!file) {

    return null;

  }

  file = await window.ANRIELImageOptimizer.optimize(file, 'talent');
  const extension =

    file.name

      .split(".")

      .pop()

      ?.toLowerCase() ||

    "png";

  const safeSlug =

    normalizeTalentSlug(slug) ||

    "talent";

  const fileName =

    `${TALENT_IMAGE_FOLDER}/${safeSlug}/${type}-${Date.now()}.${extension}`;

  const {

    error

  } =

    await supabaseClient

      .storage

      .from(TALENT_BUCKET)

      .upload(

        fileName,

        file,

        {

          cacheControl: "3600",

          upsert: false

        }

      );

  if (error) {

    console.error(

      "TALENT画像アップロードエラー:",

      error

    );

    throw new Error(

      "画像のアップロードに失敗しました。"

    );

  }

  const {

    data

  } =

    supabaseClient

      .storage

      .from(TALENT_BUCKET)

      .getPublicUrl(fileName);

  return data.publicUrl;

}

// ==================================================

// LOAD GENERATIONS

// ==================================================

async function loadTalentGenerations() {

  try {

    const {

      data,

      error

    } =

      await supabaseClient

        .from("talent_generations")

        .select(

          "id,name,sort_order,published,columns_count,created_at"

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

      throw error;

    }

    talentGenerationsCache =

      data || [];

    renderTalentGenerationSelect();

    renderTalentGenerationList();

  } catch (error) {

    console.error(

      "期生取得エラー:",

      error

    );

    if (adminGenerationList) {

      adminGenerationList.innerHTML =

        `<p class="loading-text">期生の取得に失敗しました。</p>`;

    }

  }

}

window.loadTalentGenerations =

  loadTalentGenerations;

// ==================================================

// GENERATION SELECT

// ==================================================

function renderTalentGenerationSelect() {

  if (!talentGeneration) {

    return;

  }

  const currentValue =

    talentGeneration.value;

  talentGeneration.innerHTML =

    `<option value="">選択してください</option>`;

  talentGenerationsCache

    .filter(

      generation =>

        generation.published !== false

    )

    .forEach(

      generation => {

        const option =

          document.createElement(

            "option"

          );

        option.value =

          String(generation.id);

        option.textContent =

          generation.name;

        talentGeneration

          .appendChild(option);

      }

    );

  if (currentValue) {

    talentGeneration.value =

      currentValue;

  }

}

// ==================================================

// GENERATION LIST

// ==================================================

function renderTalentGenerationList() {
  if (!adminGenerationList) return;
  if (generationListCount) generationListCount.textContent = `${talentGenerationsCache.length}件`;
  if (!talentGenerationsCache.length) {
    adminGenerationList.innerHTML = '<p class="loading-text">登録されている期生はありません。</p>';
    return;
  }
  adminGenerationList.innerHTML = talentGenerationsCache.map((generation, index) => `
    <div class="admin-category-item">
      <div class="admin-category-info">
        <strong>${escapeTalentHtml(generation.name)}</strong>
        <span>1行：${Number(generation.columns_count || 3)}人 ／ ${generation.published ? '公開' : '非公開'}</span>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button type="button" class="admin-secondary-button" data-generation-up="${generation.id}" ${index === 0 ? 'disabled' : ''} aria-label="上へ移動">↑</button>
        <button type="button" class="admin-secondary-button" data-generation-down="${generation.id}" ${index === talentGenerationsCache.length - 1 ? 'disabled' : ''} aria-label="下へ移動">↓</button>
        <button type="button" class="edit-button" data-edit-generation-id="${generation.id}">編集</button>
        <button type="button" class="delete-button" data-delete-generation-id="${generation.id}">削除</button>
      </div>
    </div>
  `).join('');
}

function openEditGenerationForm(generation) {
  if (!generation) return;
  if (generationEditId) generationEditId.value = generation.id;
  if (newGenerationName) newGenerationName.value = generation.name || '';
  if (newGenerationColumnsCount) newGenerationColumnsCount.value = String(generation.columns_count || 3);
  if (newGenerationPublished) newGenerationPublished.checked = Boolean(generation.published);
  if (generationFormTitle) generationFormTitle.textContent = '期生編集';
  if (addGenerationButton) addGenerationButton.textContent = '保存';
  generationFormArea?.classList.remove('hidden');
  setGenerationMessage('');
  generationFormArea?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function saveTalentGeneration() {
  const name = newGenerationName?.value.trim();
  const columnsCount = Number(newGenerationColumnsCount?.value || 3);
  const editingId = generationEditId?.value.trim();
  if (!name) return setGenerationMessage('期生名を入力してください。', 'error');
  if (!Number.isInteger(columnsCount) || columnsCount < 1 || columnsCount > 5) {
    return setGenerationMessage('表示人数は1〜5人から選択', 'error');
  }
  setGenerationMessage('保存中...');
  try {
    const payload = {
      name,
      columns_count: columnsCount,
      published: Boolean(newGenerationPublished?.checked),
      updated_at: new Date().toISOString()
    };
    let query;
    if (editingId) {
      query = supabaseClient.from('talent_generations').update(payload).eq('id', editingId);
    } else {
      const maxSort = talentGenerationsCache.reduce((max, item) => Math.max(max, Number(item.sort_order || 0)), 0);
      query = supabaseClient.from('talent_generations').insert({ ...payload, sort_order: maxSort + 1 });
    }
    const { error } = await query;
    if (error) throw error;
    await loadTalentGenerations();
    closeGenerationForm();
  } catch (error) {
    console.error('期生保存エラー:', error);
    setGenerationMessage(error?.code === '23505' ? '同じ期生名がすでに登録されています。' : (error?.message || '保存失敗'), 'error');
  }
}

let generationMoving = false;
async function moveTalentGeneration(id, direction) {
  if (generationMoving) return;
  const index = talentGenerationsCache.findIndex(item => String(item.id) === String(id));
  const next = index + direction;
  if (index < 0 || next < 0 || next >= talentGenerationsCache.length) return;
  generationMoving = true;
  try {
    // すべての順序を振り直し、重複sort_orderがあっても安定した並びにする。
    const ordered = [...talentGenerationsCache];
    [ordered[index], ordered[next]] = [ordered[next], ordered[index]];
    const now = new Date().toISOString();
    const maxSort = Math.max(0, ...ordered.map(item => Number(item.sort_order || 0)));
    // 一時的に既存値と重ならない値へ移動（sort_orderの一意制約がある場合にも対応）
    for (let i = 0; i < ordered.length; i++) {
      const { error } = await supabaseClient.from('talent_generations')
        .update({ sort_order: maxSort + i + 1000, updated_at: now }).eq('id', ordered[i].id);
      if (error) throw error;
    }
    for (let i = 0; i < ordered.length; i++) {
      const { error } = await supabaseClient.from('talent_generations')
        .update({ sort_order: i + 1, updated_at: now }).eq('id', ordered[i].id);
      if (error) throw error;
    }
  } catch (error) {
    console.error('期生並び替えエラー:', error);
    alert(error?.message || '並び替え失敗。再読み込み後に確認');
  } finally {
    await loadTalentGenerations();
    generationMoving = false;
  }
}

// ==================================================

// DELETE GENERATION

// ==================================================

async function deleteTalentGeneration(

  generationId

) {

  const generation =

    talentGenerationsCache.find(

      item =>

        String(item.id) ===

        String(generationId)

    );

  const name =

    generation?.name ||

    "この期生";

  const confirmed =

    confirm(

      `${name}を削除しますか？\n\n所属タレントから期生情報は外れますが、タレント自体は削除されません。`

    );

  if (!confirmed) {

    return;

  }

  try {

    const {

      error

    } =

      await supabaseClient

        .from("talent_generations")

        .delete()

        .eq(

          "id",

          generationId

        );

    if (error) {

      throw error;

    }

    await loadTalentGenerations();

  } catch (error) {

    console.error(

      "期生削除エラー:",

      error

    );

    alert(

      "期生の削除に失敗しました。"

    );

  }

}

// ==================================================

// RESET TALENT FORM

// ==================================================

function resetTalentForm() {
  resetExtraTalent();

  talentForm?.reset();

  if (talentId) {

    talentId.value = "";

  }

  if (talentFormTitle) {

    talentFormTitle.textContent =

      "TALENTを追加";

  }

  if (talentMainColor) {

    if (talentMainColor) talentMainColor.value =

      "#ffffff";

  }

  if (talentBackgroundColor) {

    if (talentBackgroundColor) talentBackgroundColor.value =

      "#ffffff";

  }

  if (talentTextColor) {

    if (talentTextColor) talentTextColor.value =

      "#222222";

  }

  if (talentStatus) {

    talentStatus.value =

      "active";

  }

  if (talentPublished) {

    talentPublished.checked =

      true;

  }

  talentListImageFile = null;

  talentProfileImageFile = null;

  talentLogoImageFile = null;

  currentTalentListImageUrl = null;

  currentTalentProfileImageUrl = null;

  currentTalentLogoImageUrl = null;

  if (talentListImageInput) {

    talentListImageInput.value = "";

  }

  if (talentProfileImageInput) {

    talentProfileImageInput.value = "";

  }

  if (talentLogoImageInput) {

    talentLogoImageInput.value = "";

  }

  if (talentListImagePreview) {

    talentListImagePreview.innerHTML =

      "";

  }

  if (talentProfileImagePreview) {

    talentProfileImagePreview.innerHTML =

      "";

  }

  if (talentLogoImagePreview) {

    talentLogoImagePreview.innerHTML =

      "";

  }


  setTalentMessage("");

}

// ==================================================

// OPEN NEW FORM

// ==================================================

async function openNewTalentForm() {

  resetTalentForm();
  await Promise.all([loadTalentProfileInputs(), loadTalentHashtagInputs()]);

}

window.openNewTalentForm =

  openNewTalentForm;

// ==================================================

// LOAD TALENTS

// ==================================================

let registeredTalentsCache = [];
let talentOrderSaving = false;

async function loadTalents() {

  if (!adminTalentList) {

    return;

  }

  adminTalentList.innerHTML =

    `<p class="loading-text">読み込み中...</p>`;

  if (talentListCount) {

    talentListCount.textContent =

      "読み込み中...";

  }

  try {

    const {

      data,

      error

    } =

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

          published,

          created_at,

          talent_generations (

            id,

            name

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

            ascending: true

          }

        );

    if (error) {

      throw error;

    }

    const talents =

      data || [];

    registeredTalentsCache = talents;

    if (talentListCount) {

      talentListCount.textContent =

        `${talents.length}件`;

    }

    if (

      talents.length === 0

    ) {

      adminTalentList.innerHTML =

        `<p class="loading-text">登録されているタレントはありません。</p>`;

      return;

    }

    adminTalentList.innerHTML =

      talents

        .map(

          (talent) => {

            const sameGeneration = talents.filter(item =>
              String(item.generation_id ?? "") === String(talent.generation_id ?? "")
            );
            const position = sameGeneration.findIndex(item => String(item.id) === String(talent.id));

            const image =

              talent.list_image_url

                ? `

                  <img

                    src="${escapeTalentHtml(

                      talent.list_image_url

                    )}"

                    loading="lazy"

                    decoding="async"

                    alt=""

                    style="

                      width:72px;

                      height:72px;

                      object-fit:cover;

                      border-radius:8px;

                    "

                  >

                `

                : "";

            const generationName =

              talent

                .talent_generations

                ?.name ||

              "未設定";

            const status =

              talent.status ===

              "graduated"

                ? "卒業"

                : "在籍";

            const publishStatus =

              talent.published

                ? "公開"

                : "非公開";

            return `

              <div class="admin-list-item">

                <div

                  style="

                    display:flex;

                    align-items:center;

                    gap:16px;

                    flex:1;

                  "

                >

                  ${image}

                  <div>

                    <strong>

                      ${escapeTalentHtml(

                        talent.name

                      )}

                    </strong>

                    <p>

                      ${escapeTalentHtml(

                        generationName

                      )}

                      ／

                      ${status}

                      ／

                      ${publishStatus}

                    </p>

                  </div>

                </div>

                <div

                  style="

                    display:flex;

                    gap:8px;

                    align-items:center;

                  "

                >

                  <button type="button" class="admin-secondary-button"
                    data-talent-up="${talent.id}" aria-label="${escapeTalentHtml(talent.name)}を上へ"
                    ${position === 0 ? "disabled" : ""}>↑</button>
                  <button type="button" class="admin-secondary-button"
                    data-talent-down="${talent.id}" aria-label="${escapeTalentHtml(talent.name)}を下へ"
                    ${position === sameGeneration.length - 1 ? "disabled" : ""}>↓</button>
                  <button

                    type="button"

                    class="edit-button"

                    data-edit-talent-id="${talent.id}"

                  >

                    編集

                  </button>

                  <button

                    type="button"

                    class="delete-button"

                    data-delete-talent-id="${talent.id}"

                  >

                    削除

                  </button>

                </div>

              </div>

            `;

          }

        )

        .join("");

  } catch (error) {

    console.error(

      "TALENT一覧取得エラー:",

      error

    );

    adminTalentList.innerHTML =

      `<p class="loading-text">TALENTの取得に失敗しました。</p>`;

    if (talentListCount) {

      talentListCount.textContent =

        "取得失敗";

    }

  }

}

window.loadTalents =

  loadTalents;

// ==================================================

// LOAD TALENT FOR EDIT

// ==================================================

async function editTalent(

  selectedTalentId

) {

  try {

    // 期生一覧と編集対象の取得は独立しているため並列実行
    const [, { data, error }] = await Promise.all([
      loadTalentGenerations(),
      supabaseClient
        .from("talents")
        .select("*")
        .eq("id", selectedTalentId)
        .single()
    ]);

    if (error) {

      throw error;

    }

    resetTalentForm();

    if (talentId) {

      talentId.value = data.id;

    }

    if (talentFormTitle) {

      talentFormTitle.textContent =

        "TALENTを編集";

    }

    talentName.value =

      data.name || "";

    talentNameEn.value =

      data.name_en || "";

    talentSlug.value =

      data.slug || "";

    talentGeneration.value =

      data.generation_id

        ? String(

            data.generation_id

          )

        : "";

    talentProfile.value =

      data.profile || "";

    if (talentBirthday) talentBirthday.value =

      data.birthday || "";

    if (talentHeight) talentHeight.value =

      data.height || "";

    if (talentDebutDate) talentDebutDate.value =

      data.debut_date || "";

    if (talentFanName) talentFanName.value =

      data.fan_name || "";

    if (talentIllustratorName) talentIllustratorName.value =

      data.illustrator_name || "";

    if (talentIllustratorUrl) talentIllustratorUrl.value =

      data.illustrator_url || "";

    if (talentMainColor) talentMainColor.value =

      data.main_color ||

      "#ffffff";

    if (talentBackgroundColor) talentBackgroundColor.value =

      data.background_color ||

      "#ffffff";

    if (talentTextColor) talentTextColor.value =

      data.text_color ||

      "#222222";

    if (talentXUrl) talentXUrl.value =

      data.x_url || "";

    if (talentYoutubeUrl) talentYoutubeUrl.value =

      data.youtube_url || "";

    if (talentYoutubeChannelId) talentYoutubeChannelId.value =

      data.youtube_channel_id || "";

    if (talentYoutubeHandle) talentYoutubeHandle.value =

      data.youtube_handle || "";

    if (talentPickupVideoUrl) talentPickupVideoUrl.value =

      data.pickup_video_url || "";

    if (talentPickupVideoTitle) talentPickupVideoTitle.value =

      data.pickup_video_title || "";

    talentStatus.value =

      data.status ||

      "active";

    talentPublished.checked =

      Boolean(

        data.published

      );

    currentTalentListImageUrl =

      data.list_image_url || null;

    currentTalentProfileImageUrl =

      data.profile_image_url || null;

    currentTalentLogoImageUrl =

      data.logo_image_url || null;

    renderTalentImagePreview(

      talentListImagePreview,

      currentTalentListImageUrl,

      "一覧用画像"

    );

    renderTalentImagePreview(

      talentProfileImagePreview,

      currentTalentProfileImageUrl,

      "プロフィール画像"

    );

    renderTalentImagePreview(

      talentLogoImagePreview,

      currentTalentLogoImageUrl,

      "タレントロゴ"

    );

    if (

      typeof window.switchTalentView ===

      "function"

    ) {

      await window.switchTalentView(

        "new",

        {

          resetForm: false

        }

      );

    }

    // 表示切替後に入力欄へ値を反映（切替処理による初期化を回避）
    await Promise.all([
      loadTalentProfileInputs(data.id),
      loadTalentHashtagInputs(data.id),
      loadExtraTalent(data.id, data)
    ]);

  } catch (error) {

    console.error(

      "TALENT編集データ取得エラー:",

      error

    );

    alert(

      "タレント情報の取得に失敗しました。"

    );

  }

}

// ==================================================

// SAVE TALENT

// ==================================================

// ===== ADDITIONAL SNS / SAMPLE VOICES =====
const extraById = id => document.getElementById(id);
let voiceRemoveIds = [];
let platformRemoveIds = [];
function makeExtraRow(kind, data = {}) {
  const row = document.createElement('div');
  row.className = 'talent-extra-row' + (kind === 'voice' ? ' voice' : '');
  row.dataset.id = data.id || '';
  const label = document.createElement('div');
  const label2 = document.createElement('div');
  const input1 = document.createElement('input');
  const input2 = document.createElement('input');
  input1.type = 'text'; input1.required = false;
  const l1 = document.createElement('label');
  const l2 = document.createElement('label');
  if (kind === 'voice') {
    l1.textContent = 'タイトル'; l2.textContent = '音声ファイル';
    input1.value = data.title || '';
    input2.type = 'file';
    input2.accept = 'audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/webm,.mp3,.wav,.ogg,.m4a,.webm';
    if (data.file_url) {
      row.dataset.fileUrl = data.file_url;
      const player = document.createElement('audio');
      player.controls = true; player.src = data.file_url;
      label2.append(l2, input2, player);
    } else { label2.append(l2, input2); }
  } else {
    l1.textContent = 'SNS名'; l2.textContent = 'URL';
    input1.value = data.platform_name || '';
    input2.type = 'url'; input2.placeholder = 'https://...';
    input2.value = data.platform_url || '';
    label2.append(l2, input2);
  }
  label.append(l1,input1);
  const del = document.createElement('button');
  del.type = 'button'; del.className = 'admin-secondary-button'; del.textContent = '削除';
  del.classList.add('talent-extra-remove-button');
  row.append(label,label2,del);
  extraById(kind === 'voice' ? 'talentVoiceRows' : 'talentPlatformRows')?.append(row);
}
function resetExtraTalent() {
  voiceRemoveIds = []; platformRemoveIds = [];
  if (extraById('talentVoiceRows')) extraById('talentVoiceRows').replaceChildren();
  if (extraById('talentPlatformRows')) extraById('talentPlatformRows').replaceChildren();
  if (extraById('talentModelerName')) extraById('talentModelerName').value = '';
  if (extraById('talentModelerUrl')) extraById('talentModelerUrl').value = '';
}
async function loadExtraTalent(id, data) {
  resetExtraTalent();
  if (extraById('talentModelerUrl')) extraById('talentModelerUrl').value = data.live2d_modeler_url || '';
  const [platforms, voices] = await Promise.all([
    supabaseClient.from('talent_platforms').select('*').eq('talent_id',id).order('sort_order'),
    supabaseClient.from('talent_sample_voices').select('*').eq('talent_id',id).order('sort_order')
  ]);
  if (platforms.error) throw platforms.error;
  if (voices.error) throw voices.error;
  (platforms.data || []).forEach(x=>makeExtraRow('platform',x));
  (voices.data || []).forEach(x=>makeExtraRow('voice',x));
  const modelerInput = extraById('talentModelerName');
  if (!modelerInput) throw new Error('Live2Dモデラー名の入力欄が見つかりません。');
  modelerInput.value = data.live2d_modeler_name || '';
}
async function saveExtraTalent(id) {
  const modelerInput = extraById('talentModelerName');
  const modelerUrlInput = extraById('talentModelerUrl');
  if (!modelerInput || !modelerUrlInput) {
    throw new Error('Live2Dモデラーの入力欄が見つかりません。管理画面HTMLを確認してください。');
  }
  const {error: modelerError} = await supabaseClient.from('talents').update({
    live2d_modeler_name: modelerInput.value.trim() || null,
    live2d_modeler_url: modelerUrlInput.value.trim() || null
  }).eq('id',id);
  if (modelerError) throw modelerError;
  for (const [kind,table,removeIds] of [['platform','talent_platforms',platformRemoveIds],['voice','talent_sample_voices',voiceRemoveIds]]) {
    if (removeIds.length) { const {error}=await supabaseClient.from(table).delete().in('id',removeIds).eq('talent_id',id); if(error) throw error; }
    const rows = [...extraById(kind==='voice'?'talentVoiceRows':'talentPlatformRows').children];
    for (const [index,row] of rows.entries()) {
      const [a,b] = row.querySelectorAll('input');
      let payload;
      if (kind==='platform') {
        if (!a.value.trim() && !b.value.trim()) continue;
        if (!a.value.trim() || !b.value.trim()) throw new Error('追加SNSの名前とURLを入力');
        payload={platform_name:a.value.trim(),platform_url:b.value.trim(),sort_order:index};
      } else {
        let url=row.dataset.fileUrl || '';
        if (b.files?.[0]) {
          const file=b.files[0];
          const types=['audio/mpeg','audio/wav','audio/ogg','audio/mp4','audio/webm'];
          if(file.size>20*1024*1024) throw new Error('音声ファイルは20MB以内');
          if(!types.includes(file.type) && !/\.(mp3|wav|ogg|m4a|webm)$/i.test(file.name)) throw new Error('対応していない音声形式');
          const ext=(file.name.split('.').pop()||'mp3').toLowerCase();
          const path=`talents/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const uploaded=await supabaseClient.storage.from('talent-voices').upload(path,file,{contentType:file.type||'audio/mpeg'});
          if(uploaded.error) throw uploaded.error;
          url=supabaseClient.storage.from('talent-voices').getPublicUrl(path).data.publicUrl;
        }
        if (!a.value.trim() && !url) continue;
        if (!a.value.trim() || !url) throw new Error('ボイスのタイトルとファイルを指定');
        payload={title:a.value.trim(),file_url:url,sort_order:index};
      }
      const query=row.dataset.id ? supabaseClient.from(table).update(payload).eq('id',row.dataset.id).eq('talent_id',id) : supabaseClient.from(table).insert({...payload,talent_id:id});
      const {error}=await query; if(error) throw error;
    }
  }
}
// 動的なSNS・ボイス行は親要素でクリックを一括処理（再描画時の個別登録を回避）
for (const containerId of ['talentPlatformRows', 'talentVoiceRows']) {
  extraById(containerId)?.addEventListener('click', event => {
    const button = event.target.closest('.talent-extra-remove-button');
    if (!button) return;
    const row = button.closest('.talent-extra-row');
    if (!row || row.parentElement?.id !== containerId) return;
    if (row.dataset.id) (containerId === 'talentVoiceRows' ? voiceRemoveIds : platformRemoveIds).push(row.dataset.id);
    row.remove();
  });
}
extraById('addTalentPlatform')?.addEventListener('click',()=>makeExtraRow('platform'));
extraById('addTalentVoice')?.addEventListener('click',()=>makeExtraRow('voice'));

async function saveTalent(event) {

  event.preventDefault();

  const editingId =

    talentId

      ?.value

      .trim();

  const name =

    talentName

      ?.value

      .trim();

  const slug =

    normalizeTalentSlug(

      talentSlug

        ?.value

    );

  const generationId =

    talentGeneration

      ?.value;

  if (!name) {

    setTalentMessage(

      "タレント名を入力してください。",

      "error"

    );

    return;

  }

  if (!slug) {

    setTalentMessage(

      "slugを入力してください。",

      "error"

    );

    return;

  }

  if (!generationId) {

    setTalentMessage(

      "所属期を選択してください。",

      "error"

    );

    return;

  }

  setTalentMessage(

    "保存中..."

  );

  try {

    let listImageUrl =

      currentTalentListImageUrl;

    let profileImageUrl =

      currentTalentProfileImageUrl;

    let logoImageUrl =

      currentTalentLogoImageUrl;

    // IMAGE UPLOAD

    if (talentListImageFile) {

      listImageUrl =

        await uploadTalentImage(

          talentListImageFile,

          "list",

          slug

        );

    }

    if (talentProfileImageFile) {

      profileImageUrl =

        await uploadTalentImage(

          talentProfileImageFile,

          "profile",

          slug

        );

    }

    if (talentLogoImageFile) {

      logoImageUrl =

        await uploadTalentImage(

          talentLogoImageFile,

          "logo",

          slug

        );

    }

    // PAYLOAD

    const payload = {

      name,

      name_en:

        talentNameEn

          ?.value

          .trim() ||

        null,

      slug,

      generation_id:

        Number(

          generationId

        ),

      profile:

        talentProfile

          ?.value

          .trim() ||

        null,

      birthday:

        talentBirthday

          ?.value

          .trim() ||

        null,

      height:

        talentHeight

          ?.value

          .trim() ||

        null,

      debut_date:

        talentDebutDate

          ?.value ||

        null,

      fan_name:

        talentFanName

          ?.value

          .trim() ||

        null,

      illustrator_name:

        talentIllustratorName

          ?.value

          .trim() ||

        null,

      illustrator_url:

        talentIllustratorUrl

          ?.value

          .trim() ||

        null,

      list_image_url:

        listImageUrl,

      profile_image_url:

        profileImageUrl,

      logo_image_url:

        logoImageUrl,

      main_color:

        talentMainColor

          ?.value ||

        "#ffffff",

      background_color:

        talentBackgroundColor

          ?.value ||

        "#ffffff",

      text_color:

        talentTextColor

          ?.value ||

        "#222222",

      x_url:

        talentXUrl

          ?.value

          .trim() ||

        null,

      youtube_url:

        talentYoutubeUrl

          ?.value

          .trim() ||

        null,

      youtube_channel_id:

        talentYoutubeChannelId

          ?.value

          .trim() ||

        null,

      youtube_handle:

        talentYoutubeHandle

          ?.value

          .trim() ||

        null,

      pickup_video_url:

        talentPickupVideoUrl

          ?.value

          .trim() ||

        null,

      pickup_video_title:

        talentPickupVideoTitle

          ?.value

          .trim() ||

        null,

      status:

        talentStatus

          ?.value ||

        "active",

      published:

        Boolean(

          talentPublished

            ?.checked

        ),

      updated_at:

        new Date()

          .toISOString()

    };

    // 並び順は一覧の↑↓で管理。編集時は既存のsort_orderを変更しない。
    if (!editingId) {
      const { data: latestOrder, error: orderError } = await supabaseClient
        .from("talents")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
      if (orderError) throw orderError;
      payload.sort_order = Math.max(0, Number(latestOrder?.[0]?.sort_order || 0)) + 1;
    }

    let savedTalentId;

    // UPDATE

    if (editingId) {

      const {

        data,

        error

      } =

        await supabaseClient

          .from("talents")

          .update(payload)

          .eq(

            "id",

            editingId

          )

          .select("id")

          .single();

      if (error) {

        throw error;

      }

      savedTalentId =

        data.id;

    }

    // INSERT

    else {

      const {

        data,

        error

      } =

        await supabaseClient

          .from("talents")

          .insert(payload)

          .select("id")

          .single();

      if (error) {

        throw error;

      }

      savedTalentId =

        data.id;

    }

    // 現行の動的プロフィール・ハッシュタグテーブルへ保存
    await saveTalentProfileValues(savedTalentId);
    await saveTalentHashtagValues(savedTalentId);
    await saveExtraTalent(savedTalentId);

    // 保存結果の検証に必要な列を一度に取得（同じ行への重複リクエストを削減）
    const { data: verifiedTalent, error: verifyError } = await supabaseClient
      .from("talents")
      .select("id,name,slug,profile,live2d_modeler_name,live2d_modeler_url")
      .eq("id", savedTalentId)
      .single();
    if (verifyError) throw verifyError;
    if (!verifiedTalent || verifiedTalent.name !== name || verifiedTalent.slug !== slug ||
        (verifiedTalent.profile || "") !== (payload.profile || "")) {
      throw new Error("保存結果を確認できませんでした。ページを更新する前に管理者へ確認してください。");
    }

    if ((verifiedTalent.live2d_modeler_name || '') !== (extraById('talentModelerName')?.value.trim() || '') ||
        (verifiedTalent.live2d_modeler_url || '') !== (extraById('talentModelerUrl')?.value.trim() || '')) {
      throw new Error('Live2Dモデラー情報が保存されていません。');
    }

    setTalentMessage(

      editingId

        ? "タレント情報を更新しました。"

        : "タレントを追加しました。",

      "success"

    );

    await loadTalents();

    // 保存後も編集画面を保持。画面の切替・リセットは明示操作のみ。
    if (talentId) talentId.value = String(savedTalentId);

  } catch (error) {

    console.error(

      "TALENT保存エラー:",

      error

    );

    if (

      error?.code === "23505"

    ) {

      setTalentMessage(

        "同じslugがすでに使用されています。",

        "error"

      );

      return;

    }

    setTalentMessage(

      error?.message ||

      "TALENTの保存に失敗しました。",

      "error"

    );

  }

}

// ==================================================

// DELETE TALENT

// ==================================================

async function deleteTalent(

  selectedTalentId

) {

  const confirmed =

    confirm(

      "このタレントを削除しますか？\n\nハッシュタグなど、このタレントに紐づく情報も削除されます。"

    );

  if (!confirmed) {

    return;

  }

  try {

    const {

      error

    } =

      await supabaseClient

        .from("talents")

        .delete()

        .eq(

          "id",

          selectedTalentId

        );

    if (error) {

      throw error;

    }

    await loadTalents();

  } catch (error) {

    console.error(

      "TALENT削除エラー:",

      error

    );

    alert(

      "TALENTの削除に失敗しました。"

    );

  }

}

// ==================================================
// DYNAMIC PROFILE / HASHTAG FIELD MANAGEMENT
// ==================================================

let talentProfileFieldsCache = [];
let talentHashtagFieldsCache = [];

const talentDynamicProfileFields =
  document.getElementById("talentDynamicProfileFields");

const talentHashtagFields =
  document.getElementById("talentHashtagFields");

const profileFieldList =
  document.getElementById("profileFieldList");

const profileFieldListCount =
  document.getElementById("profileFieldListCount");

const hashtagFieldList =
  document.getElementById("hashtagFieldList");

const hashtagFieldListCount =
  document.getElementById("hashtagFieldListCount");

const profileFieldFormArea =
  document.getElementById("profileFieldFormArea");

const profileFieldId =
  document.getElementById("profileFieldId");

const profileFieldLabel =
  document.getElementById("profileFieldLabel");

const profileFieldFormTitle =
  document.getElementById("profileFieldFormTitle");

const profileFieldFormMessage =
  document.getElementById("profileFieldFormMessage");

const hashtagFieldFormArea =
  document.getElementById("hashtagFieldFormArea");

const hashtagFieldId =
  document.getElementById("hashtagFieldId");

const hashtagFieldLabel =
  document.getElementById("hashtagFieldLabel");

const hashtagFieldFormTitle =
  document.getElementById("hashtagFieldFormTitle");

const hashtagFieldFormMessage =
  document.getElementById("hashtagFieldFormMessage");

function makeFieldKey(prefix = "field") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function setFieldMessage(element, message, type = "") {
  if (!element) return;
  element.textContent = message || "";
  element.classList.remove("success", "error");
  if (type) element.classList.add(type);
}

async function fetchTalentProfileFields() {
  const { data, error } = await supabaseClient
    .from("talent_profile_fields")
    .select("id,field_key,label,sort_order,is_system,created_at")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;
  talentProfileFieldsCache = (data || []).filter(field => !['illustrator','live2d_modeler'].includes(field.field_key));
  return talentProfileFieldsCache;
}

async function fetchTalentHashtagFields() {
  const { data, error } = await supabaseClient
    .from("talent_hashtag_fields")
    .select("id,field_key,label,sort_order,created_at")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;
  talentHashtagFieldsCache = data || [];
  return talentHashtagFieldsCache;
}

function renderProfileFieldManagementList() {
  if (!profileFieldList) return;
  if (profileFieldListCount) {
    profileFieldListCount.textContent = `${talentProfileFieldsCache.length}件`;
  }

  if (!talentProfileFieldsCache.length) {
    profileFieldList.innerHTML = '<p class="loading-text">登録項目なし</p>';
    return;
  }

  profileFieldList.innerHTML = talentProfileFieldsCache.map((field, index) => `
    <div class="admin-category-item">
      <div class="admin-category-info">
        <strong>${escapeTalentHtml(field.label)}</strong>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button type="button" class="admin-secondary-button" data-profile-up="${field.id}" ${index === 0 ? "disabled" : ""}>↑</button>
        <button type="button" class="admin-secondary-button" data-profile-down="${field.id}" ${index === talentProfileFieldsCache.length - 1 ? "disabled" : ""}>↓</button>
        <button type="button" class="edit-button" data-edit-profile-field="${field.id}">編集</button>
        <button type="button" class="delete-button" data-delete-profile-field="${field.id}">削除</button>
      </div>
    </div>
  `).join("");
}

function renderHashtagFieldManagementList() {
  if (!hashtagFieldList) return;
  if (hashtagFieldListCount) {
    hashtagFieldListCount.textContent = `${talentHashtagFieldsCache.length}件`;
  }

  if (!talentHashtagFieldsCache.length) {
    hashtagFieldList.innerHTML = '<p class="loading-text">登録項目なし</p>';
    return;
  }

  hashtagFieldList.innerHTML = talentHashtagFieldsCache.map((field, index) => `
    <div class="admin-category-item">
      <div class="admin-category-info">
        <strong>${escapeTalentHtml(field.label)}</strong>
      </div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
        <button type="button" class="admin-secondary-button" data-hashtag-up="${field.id}" ${index === 0 ? "disabled" : ""}>↑</button>
        <button type="button" class="admin-secondary-button" data-hashtag-down="${field.id}" ${index === talentHashtagFieldsCache.length - 1 ? "disabled" : ""}>↓</button>
        <button type="button" class="edit-button" data-edit-hashtag-field="${field.id}">編集</button>
        <button type="button" class="delete-button" data-delete-hashtag-field="${field.id}">削除</button>
      </div>
    </div>
  `).join("");
}

async function loadTalentProfileFields() {
  try {
    if (profileFieldList) profileFieldList.innerHTML = '<p class="loading-text">読み込み中...</p>';
    await fetchTalentProfileFields();
    renderProfileFieldManagementList();
  } catch (error) {
    console.error("プロフィール項目取得エラー:", error);
    if (profileFieldList) profileFieldList.innerHTML = '<p class="loading-text">取得失敗</p>';
  }
}
window.loadTalentProfileFields = loadTalentProfileFields;

async function loadTalentHashtagFields() {
  try {
    if (hashtagFieldList) hashtagFieldList.innerHTML = '<p class="loading-text">読み込み中...</p>';
    await fetchTalentHashtagFields();
    renderHashtagFieldManagementList();
  } catch (error) {
    console.error("ハッシュタグ項目取得エラー:", error);
    if (hashtagFieldList) hashtagFieldList.innerHTML = '<p class="loading-text">取得失敗</p>';
  }
}
window.loadTalentHashtagFields = loadTalentHashtagFields;

async function initializeTalentFieldManagement() {
  await Promise.all([
    loadTalentProfileFields(),
    loadTalentHashtagFields()
  ]);
}
window.initializeTalentFieldManagement = initializeTalentFieldManagement;

function openProfileFieldForm(field = null) {
  profileFieldFormArea?.classList.remove("hidden");
  if (profileFieldId) profileFieldId.value = field?.id || "";
  if (profileFieldLabel) profileFieldLabel.value = field?.label || "";
  if (profileFieldFormTitle) profileFieldFormTitle.textContent = field ? "プロフィール項目編集" : "プロフィール項目追加";
  setFieldMessage(profileFieldFormMessage, "");
  profileFieldLabel?.focus();
}

function closeProfileFieldForm() {
  profileFieldFormArea?.classList.add("hidden");
  if (profileFieldId) profileFieldId.value = "";
  if (profileFieldLabel) profileFieldLabel.value = "";
  setFieldMessage(profileFieldFormMessage, "");
}

function openHashtagFieldForm(field = null) {
  hashtagFieldFormArea?.classList.remove("hidden");
  if (hashtagFieldId) hashtagFieldId.value = field?.id || "";
  if (hashtagFieldLabel) hashtagFieldLabel.value = field?.label || "";
  if (hashtagFieldFormTitle) hashtagFieldFormTitle.textContent = field ? "ハッシュタグ項目編集" : "ハッシュタグ項目追加";
  setFieldMessage(hashtagFieldFormMessage, "");
  hashtagFieldLabel?.focus();
}

function closeHashtagFieldForm() {
  hashtagFieldFormArea?.classList.add("hidden");
  if (hashtagFieldId) hashtagFieldId.value = "";
  if (hashtagFieldLabel) hashtagFieldLabel.value = "";
  setFieldMessage(hashtagFieldFormMessage, "");
}

async function saveProfileField() {
  const id = profileFieldId?.value?.trim();
  const label = profileFieldLabel?.value?.trim();
  if (!label) {
    setFieldMessage(profileFieldFormMessage, "項目名を入力してください。", "error");
    return;
  }

  try {
    setFieldMessage(profileFieldFormMessage, "保存中...");
    if (id) {
      const { error } = await supabaseClient
        .from("talent_profile_fields")
        .update({ label, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    } else {
      const maxSort = talentProfileFieldsCache.reduce((max, item) => Math.max(max, Number(item.sort_order || 0)), 0);
      const { error } = await supabaseClient
        .from("talent_profile_fields")
        .insert({
          field_key: makeFieldKey("profile"),
          label,
          sort_order: maxSort + 1,
          is_system: false,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
    }

    setFieldMessage(profileFieldFormMessage, "保存しました。", "success");
    await loadTalentProfileFields();
    setTimeout(closeProfileFieldForm, 300);
  } catch (error) {
    console.error("プロフィール項目保存エラー:", error);
    setFieldMessage(profileFieldFormMessage, error?.message || "保存に失敗しました。", "error");
  }
}

async function saveHashtagField() {
  const id = hashtagFieldId?.value?.trim();
  const label = hashtagFieldLabel?.value?.trim();
  if (!label) {
    setFieldMessage(hashtagFieldFormMessage, "項目名を入力してください。", "error");
    return;
  }

  try {
    setFieldMessage(hashtagFieldFormMessage, "保存中...");
    if (id) {
      const { error } = await supabaseClient
        .from("talent_hashtag_fields")
        .update({ label, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    } else {
      const maxSort = talentHashtagFieldsCache.reduce((max, item) => Math.max(max, Number(item.sort_order || 0)), 0);
      const { error } = await supabaseClient
        .from("talent_hashtag_fields")
        .insert({
          field_key: makeFieldKey("hashtag"),
          label,
          sort_order: maxSort + 1,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
    }

    setFieldMessage(hashtagFieldFormMessage, "保存しました。", "success");
    await loadTalentHashtagFields();
    setTimeout(closeHashtagFieldForm, 300);
  } catch (error) {
    console.error("ハッシュタグ項目保存エラー:", error);
    setFieldMessage(hashtagFieldFormMessage, error?.message || "保存に失敗しました。", "error");
  }
}

async function deleteProfileField(fieldId) {
  const field = talentProfileFieldsCache.find(item => String(item.id) === String(fieldId));
  if (!field) return;
  if (!confirm(`${field.label}を削除しますか？\n\nこの項目に保存されているTALENTの値も削除されます。`)) return;

  try {
    const { error } = await supabaseClient
      .from("talent_profile_fields")
      .delete()
      .eq("id", fieldId);
    if (error) throw error;
    await loadTalentProfileFields();
  } catch (error) {
    console.error("プロフィール項目削除エラー:", error);
    alert(error?.message || "削除に失敗しました。");
  }
}

async function deleteHashtagField(fieldId) {
  const field = talentHashtagFieldsCache.find(item => String(item.id) === String(fieldId));
  if (!field) return;
  if (!confirm(`${field.label}を削除しますか？\n\nこの項目に保存されているTALENTのハッシュタグも削除されます。`)) return;

  try {
    const { error } = await supabaseClient
      .from("talent_hashtag_fields")
      .delete()
      .eq("id", fieldId);
    if (error) throw error;
    await loadTalentHashtagFields();
  } catch (error) {
    console.error("ハッシュタグ項目削除エラー:", error);
    alert(error?.message || "削除に失敗しました。");
  }
}

async function moveField(table, cache, fieldId, direction, reloadFunction) {
  const index = cache.findIndex(item => String(item.id) === String(fieldId));
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= cache.length) return;

  const current = cache[index];
  const target = cache[targetIndex];
  const currentSort = Number(current.sort_order || index * 10);
  const targetSort = Number(target.sort_order || targetIndex * 10);

  try {
    const { error: firstError } = await supabaseClient
      .from(table)
      .update({ sort_order: targetSort, updated_at: new Date().toISOString() })
      .eq("id", current.id);
    if (firstError) throw firstError;

    const { error: secondError } = await supabaseClient
      .from(table)
      .update({ sort_order: currentSort, updated_at: new Date().toISOString() })
      .eq("id", target.id);
    if (secondError) throw secondError;

    await reloadFunction();
  } catch (error) {
    console.error("並び替えエラー:", error);
    alert(error?.message || "並び替えに失敗しました。");
  }
}

function getLegacySystemInput(fieldKey) {
  const map = {
    height: talentHeight,
    birthday: talentBirthday,
    illustrator: talentIllustratorName
  };
  return map[fieldKey] || null;
}

async function loadTalentProfileInputs(selectedTalentId = null) {
  if (!talentDynamicProfileFields) return;
  selectedTalentId = selectedTalentId || talentId?.value?.trim() || null;

  try {
    // 項目定義と既存の入力値は互いに独立しているため同時取得。
    // 新規追加時は入力値の問い合わせを行わない。
    const [fields, valuesResult] = await Promise.all([
      fetchTalentProfileFields(),
      selectedTalentId
        ? supabaseClient
            .from("talent_profile_values")
            .select("field_id,value")
            .eq("talent_id", selectedTalentId)
        : Promise.resolve(null)
    ]);
    if (valuesResult?.error) throw valuesResult.error;
    const valueMap = new Map(
      (valuesResult?.data || []).map(item => [String(item.field_id), item.value || ""])
    );

    talentDynamicProfileFields.innerHTML = fields
      .filter(field => !["illustrator", "live2d_modeler"].includes(field.field_key))
      .map(field => `
        <div class="form-group">
          <label for="talent-profile-field-${field.id}">${escapeTalentHtml(field.label)}</label>
          <input
            type="text"
            id="talent-profile-field-${field.id}"
            class="talent-dynamic-profile-value"
            data-field-id="${field.id}"
            data-field-key="${escapeTalentHtml(field.field_key)}"
            value="${escapeTalentHtml(valueMap.get(String(field.id)) || getLegacySystemInput(field.field_key)?.value || "")}"
          >
        </div>
      `).join("");
  } catch (error) {
    console.error("プロフィール入力欄取得エラー:", error);
    talentDynamicProfileFields.innerHTML = '<p class="loading-text">プロフィール項目の取得に失敗しました。</p>';
    throw error;
  }
}
window.loadTalentProfileInputs = loadTalentProfileInputs;

async function loadTalentHashtagInputs(selectedTalentId = null) {
  if (!talentHashtagFields) return;
  selectedTalentId = selectedTalentId || talentId?.value?.trim() || null;

  try {
    // 項目定義と既存の入力値は互いに独立しているため同時取得。
    // 新規追加時は入力値の問い合わせを行わない。
    const [fields, valuesResult] = await Promise.all([
      fetchTalentHashtagFields(),
      selectedTalentId
        ? supabaseClient
            .from("talent_hashtag_values")
            .select("field_id,value")
            .eq("talent_id", selectedTalentId)
        : Promise.resolve(null)
    ]);
    if (valuesResult?.error) throw valuesResult.error;
    const valueMap = new Map(
      (valuesResult?.data || []).map(item => [String(item.field_id), item.value || ""])
    );

    talentHashtagFields.innerHTML = fields.map(field => `
      <div class="form-group">
        <label for="talent-hashtag-field-${field.id}">${escapeTalentHtml(field.label)}</label>
        <input
          type="text"
          id="talent-hashtag-field-${field.id}"
          class="talent-dynamic-hashtag-value"
          data-field-id="${field.id}"
          placeholder="#ハッシュタグ"
          value="${escapeTalentHtml(valueMap.get(String(field.id)) || "")}"
        >
      </div>
    `).join("");
  } catch (error) {
    console.error("ハッシュタグ入力欄取得エラー:", error);
    talentHashtagFields.innerHTML = '<p class="loading-text">ハッシュタグ項目の取得に失敗しました。</p>';
    throw error;
  }
}
window.loadTalentHashtagInputs = loadTalentHashtagInputs;

async function saveTalentProfileValues(savedTalentId) {
  const fields = await fetchTalentProfileFields();
  const inputs = talentDynamicProfileFields
    ? [...talentDynamicProfileFields.querySelectorAll('.talent-dynamic-profile-value')]
    : [];
  if (!inputs.length) {
    throw new Error('プロフィール項目の読み込み未完了。再読み込み後に保存してください。');
  }
  const values = new Map(inputs.map(input => [String(input.dataset.fieldId), input.value.trim()]));
  // Creator names are managed separately. Never erase them while saving dynamic fields.
  const rows = fields.filter(field => !['illustrator','live2d_modeler'].includes(field.field_key))
    .filter(field => values.has(String(field.id)))
    .map(field => ({talent_id:savedTalentId, field_id:field.id, value:values.get(String(field.id)) || null}));
  if (rows.length) {
    const {error} = await supabaseClient.from('talent_profile_values')
      .upsert(rows, {onConflict:'talent_id,field_id'});
    if (error) throw error;
  }
}
async function saveTalentHashtagValues(savedTalentId) {
  const hashtagInputs = talentHashtagFields
    ? [...talentHashtagFields.querySelectorAll('.talent-dynamic-hashtag-value')]
    : [];
  if (!hashtagInputs.length) {
    throw new Error('ハッシュタグ項目の読み込み未完了。再読み込み後に保存してください。');
  }
  const rows = hashtagInputs.map(input => {
    let value = input.value.trim();
    if (value && !value.startsWith('#')) value = '#' + value;
    return {talent_id:savedTalentId,field_id:input.dataset.fieldId,value:value || null};
  });
  if (rows.length) {
    const {error} = await supabaseClient.from('talent_hashtag_values')
      .upsert(rows,{onConflict:'talent_id,field_id'});
    if (error) throw error;
  }
}
// FIELD MANAGEMENT EVENTS

document.getElementById("openProfileFieldFormButton")
  ?.addEventListener("click", () => openProfileFieldForm());

document.getElementById("cancelProfileFieldButton")
  ?.addEventListener("click", closeProfileFieldForm);

document.getElementById("cancelProfileFieldButtonBottom")
  ?.addEventListener("click", closeProfileFieldForm);

document.getElementById("saveProfileFieldButton")
  ?.addEventListener("click", saveProfileField);

document.getElementById("reloadProfileFieldsButton")
  ?.addEventListener("click", loadTalentProfileFields);

document.getElementById("openHashtagFieldFormButton")
  ?.addEventListener("click", () => openHashtagFieldForm());

document.getElementById("cancelHashtagFieldButton")
  ?.addEventListener("click", closeHashtagFieldForm);

document.getElementById("cancelHashtagFieldButtonBottom")
  ?.addEventListener("click", closeHashtagFieldForm);

document.getElementById("saveHashtagFieldButton")
  ?.addEventListener("click", saveHashtagField);

document.getElementById("reloadHashtagFieldsButton")
  ?.addEventListener("click", loadTalentHashtagFields);

profileFieldList?.addEventListener("click", async event => {
  const edit = event.target.closest("[data-edit-profile-field]");
  if (edit) {
    const field = talentProfileFieldsCache.find(item => String(item.id) === String(edit.dataset.editProfileField));
    if (field) openProfileFieldForm(field);
    return;
  }

  const del = event.target.closest("[data-delete-profile-field]");
  if (del) {
    await deleteProfileField(del.dataset.deleteProfileField);
    return;
  }

  const up = event.target.closest("[data-profile-up]");
  if (up) {
    await moveField("talent_profile_fields", talentProfileFieldsCache, up.dataset.profileUp, -1, loadTalentProfileFields);
    return;
  }

  const down = event.target.closest("[data-profile-down]");
  if (down) {
    await moveField("talent_profile_fields", talentProfileFieldsCache, down.dataset.profileDown, 1, loadTalentProfileFields);
  }
});

hashtagFieldList?.addEventListener("click", async event => {
  const edit = event.target.closest("[data-edit-hashtag-field]");
  if (edit) {
    const field = talentHashtagFieldsCache.find(item => String(item.id) === String(edit.dataset.editHashtagField));
    if (field) openHashtagFieldForm(field);
    return;
  }

  const del = event.target.closest("[data-delete-hashtag-field]");
  if (del) {
    await deleteHashtagField(del.dataset.deleteHashtagField);
    return;
  }

  const up = event.target.closest("[data-hashtag-up]");
  if (up) {
    await moveField("talent_hashtag_fields", talentHashtagFieldsCache, up.dataset.hashtagUp, -1, loadTalentHashtagFields);
    return;
  }

  const down = event.target.closest("[data-hashtag-down]");
  if (down) {
    await moveField("talent_hashtag_fields", talentHashtagFieldsCache, down.dataset.hashtagDown, 1, loadTalentHashtagFields);
  }
});

// TALENT一覧の並び替え（同じ所属期内のみ）
async function moveRegisteredTalent(selectedId, direction) {
  if (talentOrderSaving) return;
  const ordered = [...registeredTalentsCache];
  const currentIndex = ordered.findIndex(item => String(item.id) === String(selectedId));
  if (currentIndex < 0) return;
  const current = ordered[currentIndex];
  const group = ordered.filter(item => String(item.generation_id ?? "") === String(current.generation_id ?? ""));
  const groupIndex = group.findIndex(item => String(item.id) === String(selectedId));
  const neighbor = group[groupIndex + direction];
  if (!neighbor) return;
  const neighborIndex = ordered.findIndex(item => String(item.id) === String(neighbor.id));
  [ordered[currentIndex], ordered[neighborIndex]] = [ordered[neighborIndex], ordered[currentIndex]];

  talentOrderSaving = true;
  adminTalentList?.querySelectorAll("[data-talent-up], [data-talent-down]")
    .forEach(button => { button.disabled = true; });
  try {
    // 既存のsort_orderが重複していても順番が確定するよう全件を連番化。
    // 一時番号を経由し、sort_orderの一意制約にも配慮。
    const now = new Date().toISOString();
    const maxSort = Math.max(0, ...ordered.map(item => Number(item.sort_order || 0)));
    for (let i = 0; i < ordered.length; i++) {
      const { error } = await supabaseClient.from("talents")
        .update({ sort_order: maxSort + 1000 + i, updated_at: now })
        .eq("id", ordered[i].id);
      if (error) throw error;
    }
    for (let i = 0; i < ordered.length; i++) {
      const { error } = await supabaseClient.from("talents")
        .update({ sort_order: i + 1, updated_at: now })
        .eq("id", ordered[i].id);
      if (error) throw error;
    }
    await loadTalents();
  } catch (error) {
    console.error("TALENT表示順変更エラー:", error);
    alert(error?.message || "表示順の変更に失敗しました。");
    await loadTalents();
  } finally {
    talentOrderSaving = false;
  }
}

// ==================================================

// TALENT LIST EVENTS

// ==================================================

adminTalentList

  ?.addEventListener(

    "click",

    async event => {

      const up = event.target.closest("[data-talent-up]");
      if (up) return moveRegisteredTalent(up.dataset.talentUp, -1);
      const down = event.target.closest("[data-talent-down]");
      if (down) return moveRegisteredTalent(down.dataset.talentDown, 1);

      const editButton =

        event.target.closest(

          "[data-edit-talent-id]"

        );

      if (editButton) {

        await editTalent(

          editButton.dataset

            .editTalentId

        );

        return;

      }

      const deleteButton =

        event.target.closest(

          "[data-delete-talent-id]"

        );

      if (deleteButton) {

        await deleteTalent(

          deleteButton.dataset

            .deleteTalentId

        );

      }

    }

  );

// ==================================================

// GENERATION LIST EVENTS
// ==================================================

adminGenerationList?.addEventListener('click', async event => {
  const edit = event.target.closest('[data-edit-generation-id]');
  if (edit) {
    openEditGenerationForm(talentGenerationsCache.find(item => String(item.id) === String(edit.dataset.editGenerationId)));
    return;
  }
  const up = event.target.closest('[data-generation-up]');
  if (up) return moveTalentGeneration(up.dataset.generationUp, -1);
  const down = event.target.closest('[data-generation-down]');
  if (down) return moveTalentGeneration(down.dataset.generationDown, 1);
  const del = event.target.closest('[data-delete-generation-id]');
  if (del) await deleteTalentGeneration(del.dataset.deleteGenerationId);
});

// ==================================================

// ==================================================

// FORM EVENTS

// ==================================================

talentForm

  ?.addEventListener(

    "submit",

    saveTalent

  );

reloadTalentButton

  ?.addEventListener(

    "click",

    loadTalents

  );

reloadGenerationButton

  ?.addEventListener(

    "click",

    loadTalentGenerations

  );

addGenerationButton

  ?.addEventListener(

    "click",

    saveTalentGeneration

  );

// ==================================================

// GENERATION FORM OPEN / CLOSE

// ==================================================

function openGenerationForm() {
  if (generationEditId) generationEditId.value = '';
  if (newGenerationName) newGenerationName.value = '';
  if (newGenerationColumnsCount) newGenerationColumnsCount.value = '3';
  if (newGenerationPublished) newGenerationPublished.checked = true;
  if (generationFormTitle) generationFormTitle.textContent = '期生追加';
  if (addGenerationButton) addGenerationButton.textContent = '追加';
  generationFormArea?.classList.remove('hidden');
  setGenerationMessage('');
}

function closeGenerationForm() {
  generationFormArea?.classList.add('hidden');
  if (generationEditId) generationEditId.value = '';
  setGenerationMessage('');
}

openGenerationFormButton

  ?.addEventListener(

    "click",

    openGenerationForm

  );

cancelGenerationButton

  ?.addEventListener(

    "click",

    closeGenerationForm

  );

cancelGenerationButtonBottom

  ?.addEventListener(

    "click",

    closeGenerationForm

  );

// ==================================================

// CANCEL TALENT

// ==================================================

async function cancelTalentForm() {

  resetTalentForm();

  if (

    typeof window.switchTalentView ===

    "function"

  ) {

    await window.switchTalentView(

      "list"

    );

  }

}

document

  .getElementById(

    "talentCancelButton"

  )

  ?.addEventListener(

    "click",

    cancelTalentForm

  );

document

  .getElementById(

    "talentCancelButtonBottom"

  )

  ?.addEventListener(

    "click",

    cancelTalentForm

  );

// ==================================================

// SLUG CLEANUP

// ==================================================

talentSlug

  ?.addEventListener(

    "input",

    () => {

      const position =

        talentSlug

          .selectionStart;

      talentSlug.value =

        normalizeTalentSlug(

          talentSlug.value

        );

      try {

        talentSlug

          .setSelectionRange(

            position,

            position

          );

      } catch (_) {

        // ignore

      }

    }

  );

// ==================================================

// DROP ZONES

// ==================================================

setupTalentDropZone(

  talentListImageDropZone,

  talentListImageInput,

  "list"

);

setupTalentDropZone(

  talentProfileImageDropZone,

  talentProfileImageInput,

  "profile"

);

setupTalentDropZone(

  talentLogoImageDropZone,

  talentLogoImageInput,

  "logo"

);