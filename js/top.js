// ==================================================
// AN:RIEL
// PUBLIC TOP
// ==================================================


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeTopHTML(value) {

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
// URL CHECK
// ==================================================

function isValidTopURL(value) {

  if (!value) {
    return false;
  }


  try {

    const url =
      new URL(
        value,
        window.location.href
      );


    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );


  } catch {

    return false;

  }

}



// ==================================================
// TODAY
// 日本時間 YYYY-MM-DD
// ==================================================

function getTopTodayString() {

  const parts =

    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Asia/Tokyo",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit"
      }
    )

      .formatToParts(
        new Date()
      );


  const values = {};


  parts.forEach(
    (part) => {

      if (
        part.type !==
        "literal"
      ) {

        values[
          part.type
        ] =
          part.value;

      }

    }
  );


  return (
    `${values.year}-${values.month}-${values.day}`
  );

}



// ==================================================
// TIME
// ==================================================

function formatTopScheduleTime(
  value
) {

  if (!value) {
    return "--:--";
  }


  return String(value)
    .slice(
      0,
      5
    );

}



// ==================================================
// TOP SLIDER
// ==================================================

async function loadTopSlider() {

  const slider =
    document.getElementById(
      "homeSlider"
    );


  const slidesContainer =
    document.getElementById(
      "homeSlides"
    );


  const dotsContainer =
    document.getElementById(
      "homeSliderDots"
    );


  if (
    !slider ||
    !slidesContainer ||
    !dotsContainer
  ) {
    return;
  }


  try {

    const {
      data,
      error
    } =

      await supabaseClient

        .from(
          "top_slides"
        )

        .select(
          "id,image_url,link_url,sort_order"
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


    // ==================================================
    // EMPTY
    // ==================================================

    if (
      slides.length === 0
    ) {

      slider.hidden =
        true;

      return;

    }


    slider.hidden =
      false;


    // ==================================================
    // SLIDES
    // ==================================================

    slidesContainer.innerHTML =

      slides

        .map(
          (
            slide,
            index
          ) => {

            const imageHTML = `

              <img
                src="${escapeTopHTML(slide.image_url)}"
                alt=""
              >

            `;


            let content =
              imageHTML;


            if (
              isValidTopURL(
                slide.link_url
              )
            ) {

              content = `

                <a
                  href="${escapeTopHTML(slide.link_url)}"
                  class="home-slide-link"
                >

                  ${imageHTML}

                </a>

              `;

            }


            return `

              <div
                class="home-slide${index === 0 ? " active" : ""}"
              >

                ${content}

              </div>

            `;

          }
        )

        .join("");


    // ==================================================
    // DOTS
    // ==================================================

    if (
      slides.length > 1
    ) {

      dotsContainer.innerHTML =

        slides

          .map(
            (
              _,
              index
            ) => `

              <button
                type="button"
                class="home-slider-dot${index === 0 ? " active" : ""}"
                data-slide="${index}"
                aria-label="${index + 1}枚目を表示"
              ></button>

            `
          )

          .join("");

    } else {

      dotsContainer.innerHTML =
        "";

    }


    // ==================================================
    // CONTROL
    // ==================================================

    const slideElements =
      slider.querySelectorAll(
        ".home-slide"
      );


    const dotElements =
      slider.querySelectorAll(
        ".home-slider-dot"
      );


    let currentIndex =
      0;


    let timer =
      null;



    function showSlide(
      index
    ) {

      if (
        index < 0 ||
        index >=
          slideElements.length
      ) {
        return;
      }


      slideElements.forEach(
        (element) => {

          element.classList.remove(
            "active"
          );

        }
      );


      dotElements.forEach(
        (element) => {

          element.classList.remove(
            "active"
          );

        }
      );


      currentIndex =
        index;


      slideElements[
        currentIndex
      ]?.classList.add(
        "active"
      );


      dotElements[
        currentIndex
      ]?.classList.add(
        "active"
      );

    }



    function stopSlider() {

      if (!timer) {
        return;
      }


      clearInterval(
        timer
      );


      timer =
        null;

    }



    function startSlider() {

      stopSlider();


      if (
        slideElements.length <= 1
      ) {
        return;
      }


      timer =
        window.setInterval(
          () => {

            const nextIndex =

              (
                currentIndex + 1
              ) %
              slideElements.length;


            showSlide(
              nextIndex
            );

          },
          5000
        );

    }



    dotElements.forEach(
      (dot) => {

        dot.addEventListener(
          "click",
          () => {

            const index =
              Number(
                dot.dataset.slide
              );


            if (
              !Number.isInteger(
                index
              )
            ) {
              return;
            }


            showSlide(
              index
            );


            startSlider();

          }
        );

      }
    );


    startSlider();


  } catch (error) {

    console.error(
      "TOP SLIDER ERROR:",
      error
    );


    slider.hidden =
      true;

  }

}



// ==================================================
// TODAY SCHEDULE CARD
// ==================================================

function createTopScheduleCard(
  item
) {

  const time =
    formatTopScheduleTime(
      item.start_time
    );


  const talent =
    escapeTopHTML(
      item.talent
    );


  const title =
    escapeTopHTML(
      item.title ||
      "配信予定"
    );


  const thumbnail =
    isValidTopURL(
      item.thumbnail
    );


  const hasURL =
    isValidTopURL(
      item.url
    );


  const thumbnailHTML =

    thumbnail

      ? `

        <img
          src="${escapeTopHTML(item.thumbnail)}"
          alt="${title}"
          loading="lazy"
        >

      `

      : `

        <div
          class="home-schedule-thumbnail-empty"
        >
          AN:RIEL
        </div>

      `;



  const content = `

    <div
      class="home-schedule-thumbnail"
    >

      ${thumbnailHTML}

    </div>


    <div
      class="home-schedule-card-content"
    >

      <div
        class="home-schedule-card-top"
      >

        <span
          class="home-schedule-time"
        >
          ${escapeTopHTML(time)}
        </span>

        <span
          class="home-schedule-today"
        >
          TODAY
        </span>

      </div>


      <p
        class="home-schedule-talent"
      >
        ${talent}
      </p>


      <h3
        class="home-schedule-title"
      >
        ${title}
      </h3>


      ${
        hasURL

          ? `

            <span
              class="home-schedule-watch"
            >
              WATCH →
            </span>

          `

          : ""
      }

    </div>

  `;



  if (hasURL) {

    return `

      <a
        href="${escapeTopHTML(item.url)}"
        class="home-schedule-card"
        target="_blank"
        rel="noopener noreferrer"
      >

        ${content}

      </a>

    `;

  }


  return `

    <article
      class="home-schedule-card"
    >

      ${content}

    </article>

  `;

}



// ==================================================
// LOAD TODAY SCHEDULE
// ==================================================

async function loadTopTodaySchedule() {

  const list =
    document.getElementById(
      "topScheduleList"
    );


  if (!list) {
    return;
  }


  const today =
    getTopTodayString();


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
          "published",
          true
        )

        .eq(
          "stream_date",
          today
        )

        .order(
          "start_time",
          {
            ascending: true
          }
        );


    if (error) {
      throw error;
    }


    const schedules =
      data || [];


    // ==================================================
    // EMPTY
    // ==================================================

    if (
      schedules.length === 0
    ) {

      list.innerHTML = `

        <div
          class="home-schedule-empty"
        >
          本日の配信予定はありません。
        </div>

      `;


      return;

    }


    // ==================================================
    // RENDER
    // ==================================================

    list.innerHTML =

      schedules

        .map(
          createTopScheduleCard
        )

        .join("");


  } catch (error) {

    console.error(
      "TOP SCHEDULE ERROR:",
      error
    );


    list.innerHTML = `

      <div
        class="home-schedule-empty"
      >
        SCHEDULEの読み込みに失敗しました。
      </div>

    `;

  }

}



// ==================================================
// INITIALIZE
// ==================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadTopSlider();

    loadTopTodaySchedule();

  }
);