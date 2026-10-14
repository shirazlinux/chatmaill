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
    root.setAttribute("data-theme", "light");
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

    var header = document.querySelector(".site-header");
    function syncHeader() {
      if (!header) {
        return;
      }
      root.style.setProperty("--header", header.offsetHeight + "px");
    }
    syncHeader();
    window.addEventListener("resize", syncHeader);

    var toggle = document.getElementById("nav-toggle");
    var navBtn = document.querySelector(".nav-btn");
    if (toggle && navBtn) {
      function syncNav() {
        navBtn.setAttribute("aria-expanded", toggle.checked ? "true" : "false");
      }
      syncNav();
      toggle.addEventListener("change", syncNav);
    }

    if (document.querySelector(".faq") && !document.querySelector(".toc")) {
      var toc = document.createElement("ul");
      toc.className = "toc";
      document.querySelectorAll("main section[id] > h2").forEach(function (heading) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + heading.parentElement.id;
        link.textContent = heading.textContent;
        li.appendChild(link);
        toc.appendChild(li);
      });
      var head = document.querySelector(".page-head");
      if (head && toc.childElementCount) {
        head.insertAdjacentElement("afterend", toc);
      }
    }

    var tocLinks = document.querySelectorAll(".toc a[href^='#']");
    if (tocLinks.length && "IntersectionObserver" in window) {
      var byId = {};
      tocLinks.forEach(function (link) {
        byId[link.getAttribute("href").slice(1)] = link;
      });
      var current = null;
      var tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          var link = byId[entry.target.id];
          if (!link || link === current) {
            return;
          }
          if (current) {
            current.classList.remove("is-current");
            current.removeAttribute("aria-current");
          }
          link.classList.add("is-current");
          link.setAttribute("aria-current", "location");
          current = link;
        });
      }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });
      Object.keys(byId).forEach(function (id) {
        var target = document.getElementById(id);
        if (target) {
          tocObserver.observe(target);
        }
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
      btn.setAttribute("aria-label", "رونوشت");
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
