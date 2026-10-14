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
  } else if (!root.getAttribute("data-theme")) {
    root.setAttribute("data-theme", "dark");
  }
  root.classList.add("js");

  function isDark() {
    return root.getAttribute("data-theme") !== "light";
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

    document.querySelectorAll("pre").forEach(function (pre) {
      if (pre.querySelector(".copy-btn")) {
        return;
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "رونوشت";
      btn.addEventListener("click", function () {
        var code = pre.querySelector("code");
        var text = (code ? code.textContent : pre.textContent) || "";
        function done() {
          btn.textContent = "کپی شد";
          window.setTimeout(function () {
            btn.textContent = "رونوشت";
          }, 1600);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {
            btn.textContent = "نشد";
          });
          return;
        }
        btn.textContent = "نشد";
      });
      pre.appendChild(btn);
    });

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
