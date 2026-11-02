/* Sidequest page: the job terminal and the parking-lot choice. Decoration
   only; the page reads the same without it. */
(function () {
  "use strict";
  var term = document.querySelector("[data-sq-term]");
  if (term) {
    var out = term.querySelector("[data-sq-out]");
    var lines = {
      start: "> START GAME accepted. Welcome, New User. It is the last easy choice anyone in this family gets.",
      exit: "> EXIT unavailable. There is no exit from the game. Try START GAME."
    };
    [].forEach.call(term.querySelectorAll("[data-sq]"), function (b) {
      b.addEventListener("click", function () {
        [].forEach.call(term.querySelectorAll("[data-sq]"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        out.textContent = lines[b.getAttribute("data-sq")];
      });
    });
  }
  var hud = document.querySelector("[data-sq-hud]");
  if (hud) {
    var o = hud.querySelector("[data-sq-hud-out]");
    var res = {
      a: "Adam picks the lie anyway. It doesn’t work, and the date dies in the parking lot. New objective: GET $50,000 IN 3 WEEKS.",
      b: "That’s what Adam picks too. It doesn’t work, and the date dies in the parking lot. New objective: GET $50,000 IN 3 WEEKS."
    };
    [].forEach.call(hud.querySelectorAll("[data-pick]"), function (b) {
      b.addEventListener("click", function () {
        [].forEach.call(hud.querySelectorAll("[data-pick]"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        o.textContent = res[b.getAttribute("data-pick")];
      });
    });
  }
})();
