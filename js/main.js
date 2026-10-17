const menuButton =
  document.getElementById("menuButton");

const globalNav =
  document.getElementById("globalNav");


if (menuButton && globalNav) {

  menuButton.addEventListener(
    "click",
    () => {

      globalNav.classList.toggle("open");

      menuButton.classList.toggle("active");

    }
  );


  globalNav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          globalNav.classList.remove("open");

          menuButton.classList.remove("active");

        }
      );

    });

}