function categoryCanEdit() { return window.ANRIEL_NEWS_ACCESS?.edit === true; }
// ==================================================

// AN:RIEL

// ADMIN

// NEWS CATEGORY MANAGEMENT

// ==================================================





// ==================================================

// SETTINGS

// ==================================================



const DEFAULT_NEWS_CATEGORIES = [



  {

    name: "NEWS",

    sort_order: 10

  },



  {

    name: "TALENT",

    sort_order: 20

  },



  {

    name: "AUDITION",

    sort_order: 30

  },



  {

    name: "EVENT",

    sort_order: 40

  }



];







// ==================================================

// STATE

// ==================================================



let newsCategories = [];
let categoryOrderSaving = false;







// ==================================================

// ELEMENTS

// ==================================================



const openCategoryFormButton =

  document.getElementById(

    "openCategoryFormButton"

  );





const categoryFormArea =

  document.getElementById(

    "categoryFormArea"

  );





const newCategoryName =

  document.getElementById(

    "newCategoryName"

  );





const addCategoryButton =

  document.getElementById(

    "addCategoryButton"

  );





const cancelCategoryButton =

  document.getElementById(

    "cancelCategoryButton"

  );





const cancelCategoryButtonBottom =

  document.getElementById(

    "cancelCategoryButtonBottom"

  );





const categoryFormMessage =

  document.getElementById(

    "categoryFormMessage"

  );





const adminCategoryList =

  document.getElementById(

    "adminCategoryList"

  );





const reloadCategoryButton =

  document.getElementById(

    "reloadCategoryButton"

  );





const newsCategorySelect =

  document.getElementById(

    "newsCategory"

  );







// ==================================================

// ESCAPE HTML

// ==================================================



function escapeCategoryHTML(

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

// CATEGORY MESSAGE

// ==================================================



function setCategoryMessage(

  message,

  type = ""

) {



  if (!categoryFormMessage) {



    return;



  }





  categoryFormMessage.textContent =

    message;





  categoryFormMessage.className =

    "form-message";





  if (type) {



    categoryFormMessage.classList.add(

      type

    );



  }



}







// ==================================================

// OPEN CATEGORY FORM

// ==================================================



function openCategoryForm() {
 if (!categoryCanEdit()) { alert("NEWS編集権限なし"); return; }



  if (!categoryFormArea) {



    return;



  }





  categoryFormArea.classList.remove(

    "hidden"

  );





  if (newCategoryName) {



    newCategoryName.value =

      "";



  }





  setCategoryMessage(

    ""

  );





  setTimeout(

    () => {



      if (newCategoryName) {



        newCategoryName.focus();



      }



    },

    50

  );



}







// ==================================================

// CLOSE CATEGORY FORM

// ==================================================



function closeCategoryForm() {



  if (!categoryFormArea) {



    return;



  }





  categoryFormArea.classList.add(

    "hidden"

  );





  if (newCategoryName) {



    newCategoryName.value =

      "";



  }





  setCategoryMessage(

    ""

  );



}







// ==================================================

// CREATE DEFAULT CATEGORIES

// ==================================================



async function createDefaultNewsCategories() {
 if (!categoryCanEdit()) { alert("NEWS編集権限なし"); return; }



  const {

    error

  } =

    await supabaseClient

      .from(

        "news_categories"

      )

      .upsert(

        DEFAULT_NEWS_CATEGORIES,

        {

          onConflict:

            "name",



          ignoreDuplicates:

            true

        }

      );





  if (error) {



    console.error(

      "初期カテゴリー作成エラー:",

      error

    );





    return false;



  }





  return true;



}







// ==================================================

// LOAD NEWS CATEGORIES

// ==================================================



async function loadNewsCategories(

  selectedValue = null,

  allowCreateDefaults = false

) {



  if (adminCategoryList) {



    adminCategoryList.innerHTML = `

      <p class="loading-text">

        カテゴリーを読み込み中...

      </p>

    `;



  }





  const {

    data,

    error

  } =

    await supabaseClient

      .from(

        "news_categories"

      )

      .select(

        "*"

      )

      .order(

        "sort_order",

        {

          ascending:

            true

        }

      )

      .order(

        "created_at",

        {

          ascending:

            true

        }

      );





  if (error) {



    console.error(

      "カテゴリー読み込みエラー:",

      error

    );





    if (adminCategoryList) {



      adminCategoryList.innerHTML = `

        <p class="error-text">

          カテゴリーの読み込みに失敗しました。

        </p>

      `;



    }





    if (newsCategorySelect) {



      newsCategorySelect.innerHTML = `

        <option value="">

          カテゴリーを取得できませんでした

        </option>

      `;



    }





    return;



  }





  newsCategories =

    data || [];





  // ------------------------------------------

  // カテゴリーが1件もない場合

  // 初期カテゴリーを自動作成

  // ------------------------------------------



  if (

    newsCategories.length === 0 &&

    allowCreateDefaults

  ) {



    const created =

      await createDefaultNewsCategories();





    if (created) {



      await loadNewsCategories(

        selectedValue,

        false

      );





      return;



    }



  }





  renderCategorySelect(

    selectedValue

  );





  renderCategoryList();



}







// ==================================================

// RENDER CATEGORY SELECT

// ==================================================



function renderCategorySelect(

  selectedValue = null

) {



  if (!newsCategorySelect) {



    return;



  }





  const currentValue =

    selectedValue ??

    newsCategorySelect.value;





  newsCategorySelect.innerHTML = `

    <option value="">

      カテゴリーを選択

    </option>

  `;





  const optionsFragment = document.createDocumentFragment();
  newsCategories.forEach(

    (category) => {



      const option =

        document.createElement(

          "option"

        );





      option.value =

        category.name;





      option.textContent =

        category.name;





      optionsFragment.appendChild(

        option

      );



    }

  );
  newsCategorySelect.appendChild(optionsFragment);





  // ------------------------------------------

  // 過去の記事にだけ存在するカテゴリー

  //

  // カテゴリー一覧から削除済みでも、

  // 過去NEWSを編集するときに

  // 元カテゴリーが消えないようにする

  // ------------------------------------------



  if (currentValue) {



    const exists =

      newsCategories.some(

        (category) =>

          category.name ===

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





      newsCategorySelect.appendChild(

        option

      );



    }





    newsCategorySelect.value =

      currentValue;



  }



}







// カテゴリーの表示順を上下ボタンで変更
async function moveNewsCategory(id, direction) {
  if (categoryOrderSaving || !categoryCanEdit()) return;
  const index = newsCategories.findIndex(item => String(item.id) === String(id));
  const target = index + direction;
  if (index < 0 || target < 0 || target >= newsCategories.length) return;
  const reordered = [...newsCategories];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  categoryOrderSaving = true;
  adminCategoryList?.querySelectorAll("[data-category-move]").forEach(button => button.disabled = true);
  try {
    const max = Math.max(0, ...newsCategories.map(item => Number(item.sort_order) || 0));
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabaseClient.from("news_categories").update({ sort_order: max + (i + 1) * 10 + 1000 }).eq("id", reordered[i].id);
      if (error) throw error;
    }
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabaseClient.from("news_categories").update({ sort_order: (i + 1) * 10 }).eq("id", reordered[i].id);
      if (error) throw error;
    }
    await loadNewsCategories();
    setCategoryMessage("カテゴリーの表示順を更新しました。", "success");
  } catch (error) {
    console.error("NEWSカテゴリー並び替えエラー:", error);
    setCategoryMessage("表示順の保存に失敗しました。", "error");
    await loadNewsCategories();
  } finally {
    categoryOrderSaving = false;
  }
}

// ==================================================

// RENDER CATEGORY LIST

// ==================================================



function renderCategoryList() {



  if (!adminCategoryList) {



    return;



  }





  if (

    !newsCategories ||

    newsCategories.length === 0

  ) {



    adminCategoryList.innerHTML = `

      <p class="empty-text">

        カテゴリーはまだ登録されていません。

      </p>

    `;





    return;



  }





  adminCategoryList.innerHTML =

    newsCategories

      .map(

        (category) => {



          const safeName =

            escapeCategoryHTML(

              category.name

            );





          return `

            <div class="admin-category-item">



              <div class="admin-category-main">



                <span class="admin-category-name">

                  ${safeName}

                </span>



              </div>





              <div class="category-order-controls" style="display:inline-flex;gap:8px;margin-left:auto;margin-right:12px;">
                <button type="button" class="admin-secondary-button" data-category-move="up" data-category-id="${category.id}" ${newsCategories.indexOf(category) === 0 ? "disabled" : ""} aria-label="上へ移動">↑</button>
                <button type="button" class="admin-secondary-button" data-category-move="down" data-category-id="${category.id}" ${newsCategories.indexOf(category) === newsCategories.length - 1 ? "disabled" : ""} aria-label="下へ移動">↓</button>
              </div>

              <button

                type="button"

                class="category-delete-button"

                data-category-delete="${category.id}"

                data-category-name="${safeName}"

              >

                削除

              </button>



            </div>

          `;



        }

      )

      .join("");





  adminCategoryList.querySelectorAll("[data-category-move]").forEach(button => {
    button.addEventListener("click", async () => {
      await moveNewsCategory(button.dataset.categoryId, button.dataset.categoryMove === "up" ? -1 : 1);
    });
  });

  // ------------------------------------------

  // DELETE BUTTON EVENTS

  // ------------------------------------------



  document

    .querySelectorAll(

      "[data-category-delete]"

    )

    .forEach(

      (button) => {



        button.addEventListener(

          "click",

          async () => {



            const id =

              button.dataset

                .categoryDelete;





            const name =

              button.dataset

                .categoryName;





            await deleteNewsCategory(

              id,

              name

            );



          }

        );



      }

    );



}







// ==================================================

// ADD CATEGORY

// ==================================================



async function addNewsCategory() {
 if (!categoryCanEdit()) { alert("NEWS編集権限なし"); return; }



  if (

    !newCategoryName ||

    !addCategoryButton

  ) {



    return;



  }





  const name =

    newCategoryName.value

      .trim();





  // ------------------------------------------

  // EMPTY CHECK

  // ------------------------------------------



  if (!name) {



    setCategoryMessage(

      "カテゴリー名を入力してください。",

      "error"

    );





    newCategoryName.focus();





    return;



  }





  // ------------------------------------------

  // LENGTH CHECK

  // ------------------------------------------



  if (

    name.length > 50

  ) {



    setCategoryMessage(

      "カテゴリー名は50文字以内で入力してください。",

      "error"

    );





    return;



  }





  // ------------------------------------------

  // DUPLICATE CHECK

  // ------------------------------------------



  const duplicate =

    newsCategories.some(

      (category) =>

        category.name

          .toLowerCase() ===

        name.toLowerCase()

    );





  if (duplicate) {



    setCategoryMessage(

      "同じカテゴリーがすでに登録されています。",

      "error"

    );





    return;



  }





  setCategoryMessage(

    "カテゴリーを追加しています..."

  );





  addCategoryButton.disabled =

    true;





  // ------------------------------------------

  // SORT ORDER

  // ------------------------------------------



  const maxSortOrder =

    newsCategories.reduce(

      (

        max,

        category

      ) => {



        const value =

          Number(

            category.sort_order

          ) || 0;





        return Math.max(

          max,

          value

        );



      },

      0

    );





  // ------------------------------------------

  // INSERT

  // ------------------------------------------



  const {

    error

  } =

    await supabaseClient

      .from(

        "news_categories"

      )

      .insert({



        name:

          name,



        sort_order:

          maxSortOrder + 10



      });





  addCategoryButton.disabled =

    false;





  // ------------------------------------------

  // ERROR

  // ------------------------------------------



  if (error) {



    console.error(

      "カテゴリー追加エラー:",

      error

    );





    if (

      error.code ===

      "23505"

    ) {



      setCategoryMessage(

        "同じカテゴリーがすでに登録されています。",

        "error"

      );



    } else {



      setCategoryMessage(

        "カテゴリーの追加に失敗しました。",

        "error"

      );



    }





    return;



  }





  // ------------------------------------------

  // SUCCESS

  // ------------------------------------------



  setCategoryMessage(

    "カテゴリーを追加しました。",

    "success"

  );





  newCategoryName.value =

    "";





  await loadNewsCategories(

    name

  );





  setTimeout(

    () => {



      closeCategoryForm();



    },

    700

  );



}







// ==================================================

// DELETE CATEGORY

// ==================================================



async function deleteNewsCategory(

  id,

  name

) {
 if (!categoryCanEdit()) { alert("NEWS編集権限なし"); return; }



  if (

    !id ||

    !name

  ) {



    return;



  }





  // ------------------------------------------

  // NEWSで使用されているか確認

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

      )

      .eq(

        "category",

        name

      );





  if (countError) {



    console.error(

      "カテゴリー使用状況確認エラー:",

      countError

    );





    alert(

      "カテゴリーの使用状況を確認できませんでした。"

    );





    return;



  }





  // ------------------------------------------

  // CONFIRM MESSAGE

  // ------------------------------------------



  let message =

    `カテゴリー「${name}」を削除しますか？`;





  if (

    count &&

    count > 0

  ) {



    message +=

      `\n\nこのカテゴリーは現在 ${count} 件のNEWSで使用されています。`;





    message +=

      "\nカテゴリー一覧から削除しても、既存NEWSの記事データは変更されません。";





    message +=

      "\n\n本当に削除しますか？";



  }





  const confirmed =

    window.confirm(

      message

    );





  if (!confirmed) {



    return;



  }





  // ------------------------------------------

  // DELETE

  // ------------------------------------------



  const {

    error

  } =

    await supabaseClient

      .from(

        "news_categories"

      )

      .delete()

      .eq(

        "id",

        id

      );





  if (error) {



    console.error(

      "カテゴリー削除エラー:",

      error

    );





    alert(

      "カテゴリーの削除に失敗しました。"

    );





    return;



  }





  // ------------------------------------------

  // RELOAD

  // ------------------------------------------



  await loadNewsCategories(

    null,

    false

  );



}







// ==================================================

// CATEGORY EVENTS

// ==================================================



if (openCategoryFormButton) {



  openCategoryFormButton.addEventListener(

    "click",

    openCategoryForm

  );



}





if (cancelCategoryButton) {



  cancelCategoryButton.addEventListener(

    "click",

    closeCategoryForm

  );



}





if (cancelCategoryButtonBottom) {



  cancelCategoryButtonBottom.addEventListener(

    "click",

    closeCategoryForm

  );



}





if (addCategoryButton) {



  addCategoryButton.addEventListener(

    "click",

    addNewsCategory

  );



}





if (reloadCategoryButton) {



  reloadCategoryButton.addEventListener(

    "click",

    async () => {



      await loadNewsCategories();



    }

  );



}





if (newCategoryName) {



  newCategoryName.addEventListener(

    "keydown",

    async (event) => {



      if (

        event.key ===

        "Enter"

      ) {



        event.preventDefault();





        await addNewsCategory();



      }



    }

  );



}