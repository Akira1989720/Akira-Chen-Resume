/* ============================================================
   main.js
   每一段功能各自獨立封裝並攔截例外，
   任何一段失效都不會連帶讓其他段停止執行。
   （改版前為單一 IIFE，開頭一行出錯就會讓最後的 reveal 永不執行，
     導致 .reveal 的專案內容停在 opacity:0 而永久隱形。）
   ============================================================ */
"use strict";

function runSafely(name, fn) {
  try {
    fn();
  } catch (err) {
    if (window.console && console.warn) {
      console.warn("[main.js] " + name + " 未能執行：", err);
    }
  }
}

/* ------------------------------------------------------------
   1. Reveal on scroll
   最優先執行。這段若失效，帶 .reveal 的專案內容會永久看不見。
   四層防護：
     a. CSS 只在 <html class="js"> 時才隱藏（JS 被完全擋掉就不隱藏）
     b. reduced-motion 或不支援 IntersectionObserver → 直接全部顯示
     c. 列印前強制顯示
     d. 保險計時器：3 秒後若「完全沒有任何元素被顯示」，判定 observer
        失效（例如全頁截圖工具、無頭瀏覽器），強制顯示。
        正常瀏覽時已有元素顯示，不會觸發，捲動動畫維持原樣。
   ------------------------------------------------------------ */
runSafely("reveal", function () {
  var revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  function showAll() {
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add("in");
    });
  }

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  var ro = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          ro.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  Array.prototype.forEach.call(revealEls, function (el) {
    ro.observe(el);
  });

  window.addEventListener("beforeprint", showAll);

  window.setTimeout(function () {
    if (!document.querySelector(".reveal.in")) showAll();
  }, 3000);
});

/* ------------------------------------------------------------
   2. 手機導覽開合
   ------------------------------------------------------------ */
runSafely("nav-toggle", function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  var LABEL_OPEN = "關閉 ×";
  var LABEL_SHUT = "選單 ＋";

  function close() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = LABEL_SHUT;
  }

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? LABEL_OPEN : LABEL_SHUT;
  });

  links.addEventListener("click", function (e) {
    if (e.target.closest(".navlink") && links.classList.contains("open")) close();
  });

  /* 開啟時按 Esc 收合，焦點回到按鈕 */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && links.classList.contains("open")) {
      close();
      toggle.focus();
    }
  });
});

/* ------------------------------------------------------------
   3. 履歷檔案尚未上傳時的提示
   （CMS 的 contact.resume 有值時，#resumeBtn 不會被渲染，此段自然不啟用）
   ------------------------------------------------------------ */
runSafely("resume-notice", function () {
  function notice(e) {
    e.preventDefault();
    alert("履歷 PDF 尚未上傳。請至 CMS 後台「聯絡」頁面上傳檔案後，此按鈕會自動接上下載連結。");
  }
  ["resumeBtn", "resumeBtn2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", notice);
  });
});

/* ------------------------------------------------------------
   4. Scrollspy：導覽 active 狀態
   ------------------------------------------------------------ */
runSafely("scrollspy", function () {
  if (!("IntersectionObserver" in window)) return;

  var navMap = {};
  document.querySelectorAll(".navlink").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;
    navMap[href.slice(1)] = a;
  });
  if (!Object.keys(navMap).length) return;

  /* more 併入 projects、education 併入 skills，與版面色帶分組一致 */
  var GROUP = { more: "projects", education: "skills" };

  function setCurrent(id) {
    Object.keys(navMap).forEach(function (k) {
      navMap[k].setAttribute("aria-current", k === id ? "true" : "false");
    });
  }

  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = GROUP[en.target.id] || en.target.id;
        if (navMap[id]) setCurrent(id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  ["about", "capabilities", "projects", "more", "experience", "skills", "education", "contact"]
    .forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
});

/* ------------------------------------------------------------
   5. YouTube 封面圖：點擊後才載入播放器
   （降低首次載入負擔，避免預先載入追蹤）
   ------------------------------------------------------------ */
runSafely("youtube-facade", function () {
  var facades = document.querySelectorAll(".yt-facade");
  Array.prototype.forEach.call(facades, function (box) {
    function play() {
      var id = box.getAttribute("data-yt");
      if (!id || box.dataset.loaded) return;
      box.dataset.loaded = "1";

      var iframe = document.createElement("iframe");
      iframe.src =
        "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      iframe.title = box.getAttribute("data-title") || "影片";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.setAttribute("loading", "lazy");

      box.innerHTML = "";
      box.appendChild(iframe);
      box.style.cursor = "default";
    }

    box.addEventListener("click", play);
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        play();
      }
    });
  });
});

/* ------------------------------------------------------------
   6. 導覽列滾動後略為收合
   ------------------------------------------------------------ */
runSafely("nav-compact", function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;

  var ticking = false;
  function update() {
    nav.classList.toggle("is-compact", window.scrollY > 64);
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
});
