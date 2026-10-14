/**
 * @license magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-3.0-or-later
 *
 * Copyright (C) 2026 chatmail-delta contributors
 *
 * This file is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * @license-end
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var stored = null;
  try {
    stored = localStorage.getItem("dc-theme");
  } catch (e) {
    stored = null;
  }
  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  }
  root.classList.add("js");

  function isDark() {
    var choice = root.getAttribute("data-theme");
    if (choice === "dark") {
      return true;
    }
    if (choice === "light") {
      return false;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-btn");
    function paint() {
      if (!btn) {
        return;
      }
      var dark = isDark();
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", dark ? "تم روشن" : "تم تاریک");
    }
    paint();
    if (btn) {
      btn.addEventListener("click", function () {
        var next = isDark() ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem("dc-theme", next);
        } catch (e) {
          /* ذخیره تم اگر ممکن نباشد، همین صفحه عوض می‌شود */
        }
        paint();
      });
    }

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nodes = document.querySelectorAll(".reveal");

    if (!reduce && "IntersectionObserver" in window) {
      var seen = 0;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.style.animationDelay = Math.min(seen, 6) * 40 + "ms";
          entry.target.classList.add("is-in");
          seen += 1;
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

      nodes.forEach(function (node) {
        observer.observe(node);
      });
    }

    var items = document.querySelectorAll(".faq details");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) {
          return;
        }
        items.forEach(function (other) {
          if (other !== item) {
            other.open = false;
          }
        });
      });
    });
  });
})();
