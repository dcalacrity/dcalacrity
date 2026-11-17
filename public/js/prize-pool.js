/* Prize Pool VR hero: motion controls and a spoiler-free look at its leads. */
(function () {
  "use strict";

  var hero = document.querySelector("[data-pp-hero]");
  if (!hero) return;

  var motionButton = hero.querySelector("[data-pp-motion]");
  var motionLabel = hero.querySelector("[data-pp-motion-label]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(pointer: fine)");
  var connection = navigator.connection;
  var userPaused = false;
  var intersecting = true;
  var frame = 0;
  var nextX = 0;
  var nextY = 0;

  function prefersStill() {
    return reduced.matches || !!(connection && connection.saveData);
  }

  function isPaused() {
    return userPaused || prefersStill();
  }

  function isVisible() {
    return intersecting && document.visibilityState !== "hidden";
  }

  function canMove() {
    return !isPaused() && isVisible() && finePointer.matches;
  }

  function resetPointer() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    nextX = nextY = 0;
    hero.style.setProperty("--pp-x", "0px");
    hero.style.setProperty("--pp-y", "0px");
  }

  function syncMotion() {
    var paused = isPaused();
    hero.dataset.motion = paused ? "paused" : "running";
    hero.dataset.inView = isVisible() ? "true" : "false";
    if (motionButton) {
      motionButton.hidden = prefersStill();
      motionButton.setAttribute("aria-pressed", String(paused));
    }
    if (motionLabel) motionLabel.textContent = paused ? "Resume motion" : "Pause motion";
    if (!canMove()) resetPointer();
  }

  if (motionButton) {
    motionButton.addEventListener("click", function () {
      if (prefersStill()) return;
      userPaused = !userPaused;
      syncMotion();
    });
  }

  hero.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch" || !canMove()) return;
    var rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    nextX = Math.max(-10, Math.min(10, (event.clientX - rect.left) / rect.width * 20 - 10));
    nextY = Math.max(-6, Math.min(6, (event.clientY - rect.top) / rect.height * 12 - 6));
    if (frame) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      if (!canMove()) return resetPointer();
      hero.style.setProperty("--pp-x", nextX.toFixed(2) + "px");
      hero.style.setProperty("--pp-y", nextY.toFixed(2) + "px");
    });
  }, { passive: true });
  hero.addEventListener("pointerleave", resetPointer);

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      intersecting = entries[0].isIntersecting;
      syncMotion();
    });
    observer.observe(hero);
  }
  document.addEventListener("visibilitychange", syncMotion);

  function watchMedia(query) {
    if (query.addEventListener) query.addEventListener("change", syncMotion);
    else if (query.addListener) query.addListener(syncMotion);
  }
  watchMedia(reduced);
  watchMedia(finePointer);
  if (connection && connection.addEventListener) connection.addEventListener("change", syncMotion);
  syncMotion();

  var leadButtons = hero.querySelectorAll("[data-pp-lead]");
  var leadCopy = hero.querySelector("[data-pp-lead-copy]");
  var leadText = {
    hope: "Find your own way out of a crew that has already decided who you are.",
    chase: "A million dollars. A promise to your friends. How far will you go to win?"
  };

  function selectLead(lead) {
    if (!Object.prototype.hasOwnProperty.call(leadText, lead)) return;
    hero.dataset.lead = lead;
    leadButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.ppLead === lead));
    });
    if (leadCopy) leadCopy.textContent = leadText[lead];
  }

  leadButtons.forEach(function (button) {
    button.disabled = false;
    button.addEventListener("click", function () { selectLead(button.dataset.ppLead); });
  });
  selectLead(hero.dataset.lead || "hope");
})();
