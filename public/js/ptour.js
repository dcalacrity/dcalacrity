/* Pure Alacrity tour: tabs swap the screenshot. Keyboard: arrow keys move between tabs. */
(function () {
  "use strict";
  [].forEach.call(document.querySelectorAll(".ptour"), function (box) {
    var tabs = [].slice.call(box.querySelectorAll("[data-shot]"));
    var img = box.querySelector("[data-shot-img]");
    var alts = {
      today: "Pure Alacrity Today: the one thing that needs you and a readiness score of 82",
      schedule: "Pure Alacrity schedule: three shoot days on one board with a suggestion that saves a company move",
      live: "Pure Alacrity live room: setups, takes and calls logged from the set",
      script: "Pure Alacrity script: one revision every department sees the moment it is saved",
      messages: "Pure Alacrity messages: the camera department channel",
      creators: "Pure Alacrity Channel Studio: planning the next YouTube video"
    };
    var pick = function (t, focus) {
      tabs.forEach(function (x) { var on = x === t; x.setAttribute("aria-selected", on ? "true" : "false"); x.tabIndex = on ? 0 : -1; });
      var k = t.getAttribute("data-shot");
      img.src = "/assets/screens/pure-" + k + ".jpg"; img.alt = alts[k] || "";
      if (focus) t.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { pick(t); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); pick(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
    tabs.forEach(function (t) { var im = new Image(); im.src = "/assets/screens/pure-" + t.getAttribute("data-shot") + ".jpg"; });
  });
})();
