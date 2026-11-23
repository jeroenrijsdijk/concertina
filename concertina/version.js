// The version of the concertina tools, shown on every page (elements with class "app-version").
// Raise it with every change that goes to the website: 2.12 -> 2.13 -> 2.14 ...
const APP_VERSION = "2.12";
document.querySelectorAll(".app-version").forEach(el => { el.textContent = "v" + APP_VERSION; });
