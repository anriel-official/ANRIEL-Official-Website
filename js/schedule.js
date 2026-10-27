// ==================================================

// AN:RIEL

// PUBLIC SCHEDULE

// ==================================================





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



function isValidScheduleURL(value) {



  if (!value) {

    return false;

  }



  try {



    const url =

      new URL(value);



    return (

      url.protocol === "http:" ||

      url.protocol === "https:"

    );



  } catch {



    return false;



  }



}





// ==================================================

// DATE

// ==================================================



const scheduleWeekdays = [

  "SUN",

  "MON",

  "TUE",

  "WED",

  "THU",

  "FRI",

  "SAT"

];





function getScheduleDateInfo(

  dateString

) {



  const parts =

    dateString.split("-");



  if (parts.length !== 3) {



    return {

      year: "",

      date: dateString,

      week: ""

    };



  }



  const year =

    Number(parts[0]);



  const month =

    Number(parts[1]);



  const day =

    Number(parts[2]);



  const date =

    new Date(

      year,

      month - 1,

      day

    );



  return {



    year:

      String(year),



    date:

      `${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`,



    week:

      scheduleWeekdays[

        date.getDay()

      ]



  };



}





// ==================================================

// TODAY

// 日本時間の日付を YYYY-MM-DD で取得

// ==================================================



function getScheduleTodayString() {



  const parts =

    new Intl.DateTimeFormat(

      "en-CA",

      {

        timeZone: "Asia/Tokyo",

        year: "numeric",

        month: "2-digit",

        day: "2-digit"

      }

    )

      .formatToParts(

        new Date()

      );



  const values = {};



  parts.forEach(

    (part) => {



      if (

        part.type !== "literal"

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





// 日本時間で「昨日」の日付を取得（端末のタイムゾーンに依存しない）
function getScheduleYesterdayString() {
  const today = getScheduleTodayString();
  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}


// ==================================================

// SORT

//

// 並び順

//

// 今日

// ↓

// 明日

// ↓

// 未来

// ↓

// 昨日など過去

//

// 同じ日は開始時刻が早い順

// ==================================================



function sortPublicSchedules(

  schedules

) {



  const today =

    getScheduleTodayString();



  const live = schedules.filter(schedule => schedule.status === "live");

  const futureAndToday =

    schedules

      .filter(

        (schedule) =>

          schedule.status !== "live" && schedule.stream_date >=

          today

      )

      .sort(

        (a, b) => {



          const dateCompare =

            String(

              a.stream_date

            ).localeCompare(

              String(

                b.stream_date

              )

            );



          if (

            dateCompare !== 0

          ) {



            return dateCompare;



          }



          return String(

            a.start_time || ""

          ).localeCompare(

            String(

              b.start_time || ""

            )

          );



        }

      );





  const past =

    schedules

      .filter(

        (schedule) =>

          schedule.status !== "live" && schedule.stream_date <

          today

      )

      .sort(

        (a, b) => {



          const dateCompare =

            String(

              b.stream_date

            ).localeCompare(

              String(

                a.stream_date

              )

            );



          if (

            dateCompare !== 0

          ) {



            return dateCompare;



          }



          return String(

            a.start_time || ""

          ).localeCompare(

            String(

              b.start_time || ""

            )

          );



        }

      );





  return [

    ...live,
    ...futureAndToday,

    ...past

  ];



}





// ==================================================

// GROUP

// ==================================================



function groupSchedulesByDate(

  schedules

) {



  const groups = {};



  schedules.forEach(

    (schedule) => {



      const date =

        schedule.stream_date;



      if (!groups[date]) {



        groups[date] = [];



      }



      groups[date].push(

        schedule

      );



    }

  );



  return groups;



}





// ==================================================

// CARD

// ==================================================



function createScheduleCard(

  item

) {



  const time =

    item.start_time

      ? item.start_time.slice(

          0,

          5

        )

      : "--:--";





  const title =

    escapeScheduleHTML(

      item.title

    );





  const talent =

    escapeScheduleHTML(

      item.talent

    );





  const category =

    escapeScheduleHTML(

      item.category ||

      "STREAM"

    );





  const hasURL =

    isValidScheduleURL(

      item.url

    );





  const hasThumbnail =

    isValidScheduleURL(

      item.thumbnail

    );





  const thumbnailHTML =

    hasThumbnail



      ? `

        <img

          src="${escapeScheduleHTML(item.thumbnail)}"

          alt="${title}"

          loading="lazy"

        >

      `



      : `

        <div

          class="schedule-thumbnail-empty"

        >

          AN:RIEL

        </div>

      `;





  const content = `
    <div class="schedule-thumbnail">
      ${thumbnailHTML}
    </div>

    <div class="schedule-card-content">
      <div class="schedule-card-summary">
        <span class="schedule-talent">${talent}</span>
        <span class="schedule-stream-time${item.status === "live" ? " is-live" : ""}">${item.status === "live" ? '<span class="schedule-live-dot" aria-hidden="true"></span>LIVE 配信中' : item.status === "completed" ? `${escapeScheduleHTML(time)}～配信終了` : `${escapeScheduleHTML(time)}～配信予定`}</span>
      </div>
      ${hasURL ? `<span class="schedule-link-text">WATCH →</span>` : ""}
    </div>
  `;


  if (hasURL) {



    return `



      <a

        href="${escapeScheduleHTML(item.url)}"

        class="schedule-card"

        target="_blank"

        rel="noopener noreferrer"

      >



        ${content}



      </a>



    `;



  }





  return `



    <article class="schedule-card">



      ${content}



    </article>



  `;



}





// ==================================================

// RENDER

// ==================================================



function renderSchedule(

  schedules

) {



  const scheduleList =

    document.getElementById(

      "scheduleList"

    );





  if (

    !schedules ||

    schedules.length === 0

  ) {



    scheduleList.innerHTML = `



      <div class="schedule-empty">



        現在公開されている

        配信予定はありません。



      </div>



    `;



    return;



  }





  // 昨日より古い配信は非表示。LIVE中は日付に関係なく表示。
  const yesterday = getScheduleYesterdayString();
  const visibleSchedules = schedules.filter((item) =>
    item.status === "live" ||
    (typeof item.stream_date === "string" && item.stream_date >= yesterday)
  );

  if (visibleSchedules.length === 0) {
    scheduleList.innerHTML = `<div class="schedule-empty">現在公開されている配信予定はありません。</div>`;
    return;
  }

  // ==================================================

  // 今日 → 未来 → 過去 の順に並び替え

  // ==================================================



  const sortedSchedules =

    sortPublicSchedules(

      visibleSchedules

    );





  const groups =

    groupSchedulesByDate(

      sortedSchedules

    );





  const html =

    Object.entries(groups)



      .map(

        ([date, items]) => {



          const dateInfo =

            getScheduleDateInfo(

              date

            );





          const cards =

            items

              .map(

                createScheduleCard

              )

              .join("");





          return `



            <section

              class="schedule-date-group"

            >



              <div

                class="schedule-date-heading"

              >



                <span

                  class="schedule-date-main"

                >

                  ${dateInfo.date}

                </span>



                <span

                  class="schedule-date-week"

                >

                  ${dateInfo.week}

                </span>



                <span

                  class="schedule-date-year"

                >

                  ${dateInfo.year}

                </span>



              </div>





              <div

                class="schedule-items"

              >



                ${cards}



              </div>



            </section>



          `;



        }

      )



      .join("");





  scheduleList.innerHTML =

    html;



}





// ==================================================

// LOAD

// ==================================================



async function loadPublicSchedule() {



  const scheduleList =

    document.getElementById(

      "scheduleList"

    );





  try {



    const {

      data,

      error

    } =

      await supabaseClient



        .from("schedules")



        .select("*")



        .eq(

          "published",

          true

        )



        .order(

          "stream_date",

          {

            ascending: true

          }

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





    renderSchedule(

      data

    );





  } catch (error) {



    console.error(

      "SCHEDULE ERROR:",

      error

    );





    scheduleList.innerHTML = `



      <div class="schedule-error">



        SCHEDULEの読み込みに

        失敗しました。<br>



        時間をおいて

        再度お試しください。



      </div>



    `;



  }



}





// ==================================================

// INITIALIZE

// ==================================================



document.addEventListener(

  "DOMContentLoaded",

  loadPublicSchedule

);