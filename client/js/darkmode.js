const btn = document.querySelector(".dark-mode-toggle");
document.querySelector("html");
const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
//   document.body.classList.add("dark-theme");
document.querySelector("html").classList.add("dark-theme");

}
btn.addEventListener("click", function () {
//   document.body.classList.toggle("dark-theme");
document.querySelector("html").classList.toggle("dark-theme");


  let theme = "light";
//   if (document.body.classList.contains("dark-theme")) {
  if (document.querySelector("html").classList.contains("dark-theme")) {

    theme = "dark";
  }
  localStorage.setItem("theme", theme);
});
