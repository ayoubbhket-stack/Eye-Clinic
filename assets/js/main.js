/* Dr. Ayoub Eye Clinic — UI logic (nav, reveal, tilt, FAQ, testimonials, booking, config) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var cfg = window.CLINIC_CONFIG || {};
  var I18N = window.I18N || { lang: "ar", t: function (k) { return k; }, onChange: function () {} };
  var t = function (k, v) { return I18N.t(k, v); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var waNumber = String(cfg.whatsappNumber || "").replace(/\D/g, "");
  var isEn = function () { return I18N.lang === "en"; };

  /* ---------- Year ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Sticky nav ---------- */
  var nav = $("#nav");
  var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 20); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = $("#navToggle"), links = $("#navLinks");
  var setMenu = function (open) {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? t("menuClose") : t("menuOpen"));
  };
  toggle.addEventListener("click", function () { setMenu(!links.classList.contains("is-open")); });
  $$("a", links).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Active link on scroll ---------- */
  var navAnchors = $$('.nav__links a[href^="#"]:not(.btn)');
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navAnchors.forEach(function (a) { var s = $(a.getAttribute("href")); if (s) secObs.observe(s); });
  }

  /* ---------- Doctor photo ---------- */
  if (cfg.doctorPhoto) {
    var portrait = $("#portrait");
    var img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.loading = "lazy";
    img.className = "portrait__img";
    img.onload = function () {
      var ph = $(".portrait__placeholder", portrait); if (ph) ph.remove();
      portrait.classList.add("has-photo");
      updatePhotoAlt();
    };
    img.src = cfg.doctorPhoto;
    portrait.insertBefore(img, portrait.firstChild);
  }
  function updatePhotoAlt() {
    var im = $(".portrait__img"); if (im) im.alt = isEn() ? "Dr. Ayoub" : "دكتور أيوب";
  }

  /* ---------- Testimonials ---------- */
  var tSection = $("#testimonials"), tTrack = $("#testimonialsGrid");
  var realT = Array.isArray(cfg.testimonials) ? cfg.testimonials.filter(function (x) { return x && x.text; }) : [];
  var demoMode = !realT.length && cfg.showDemoTestimonials !== false;
  var DEMO_COUNT = 4;

  function starRow(n) {
    n = Math.max(0, Math.min(5, Math.round(+n || 0)));
    if (!n) return null;
    var w = document.createElement("div");
    w.className = "t-stars";
    w.setAttribute("role", "img");
    w.setAttribute("aria-label", t("ratingLabel", { n: n }));
    for (var i = 0; i < 5; i++) w.insertAdjacentHTML("beforeend", '<svg class="' + (i < n ? "on" : "") + '" aria-hidden="true"><use href="#i-star"/></svg>');
    return w;
  }

  function renderTestimonials() {
    if (!tSection) return;
    if (!realT.length && !demoMode) { tSection.hidden = true; return; }
    tSection.hidden = false;
    $("#demoBadge").hidden = !demoMode;
    tTrack.innerHTML = "";

    var items = demoMode
      ? Array.apply(null, Array(DEMO_COUNT)).map(function (_, i) {
          return { demo: true, name: t("demoName"), text: t("demoText"), service: t("demoService"), photo: "assets/img/demo/avatar-" + (i + 1) + ".svg", rating: 5 };
        })
      : realT.map(function (r) {
          return {
            name: (isEn() && r.name_en) || r.name || "",
            text: (isEn() && r.text_en) || r.text,
            service: (isEn() && r.service_en) || r.service || "",
            photo: r.photo || "", rating: r.rating
          };
        });

    items.forEach(function (it, i) {
      var card = document.createElement("figure");
      card.className = "t-card glass-card" + (it.demo ? " is-demo" : "");
      card.setAttribute("role", "group");
      card.setAttribute("aria-label", t("slide", { n: i + 1 }));

      var top = document.createElement("div"); top.className = "t-card__top";
      top.insertAdjacentHTML("beforeend", '<svg class="t-quote" aria-hidden="true"><use href="#i-quote"/></svg>');
      var stars = starRow(it.rating); if (stars) top.appendChild(stars);
      card.appendChild(top);

      var q = document.createElement("blockquote"); q.className = "t-text";
      var p = document.createElement("p"); p.textContent = it.text; q.appendChild(p);
      card.appendChild(q);

      var who = document.createElement("figcaption"); who.className = "t-who";
      var av = document.createElement("span"); av.className = "t-avatar";
      if (it.photo) {
        var im = document.createElement("img"); im.src = it.photo; im.alt = ""; im.loading = "lazy"; im.width = 56; im.height = 56;
        av.appendChild(im);
      } else {
        av.textContent = (it.name || "?").trim().charAt(0);
      }
      who.appendChild(av);
      var meta = document.createElement("span"); meta.className = "t-meta";
      var nm = document.createElement("strong"); nm.textContent = it.name; meta.appendChild(nm);
      if (it.service) { var sv = document.createElement("small"); sv.textContent = it.service; meta.appendChild(sv); }
      who.appendChild(meta);
      if (it.demo) { var tag = document.createElement("span"); tag.className = "t-tag"; tag.textContent = t("demoTag"); who.appendChild(tag); }
      card.appendChild(who);

      tTrack.appendChild(card);
    });
    buildDots();
  }

  // slider controls (track is a scroll-snap row)
  var tNav = $("#tNav"), tDots = $("#tDots");
  function cards() { return $$(".t-card", tTrack); }
  function perView() {
    var c = cards()[0]; if (!c) return 1;
    return Math.max(1, Math.round(tTrack.clientWidth / (c.getBoundingClientRect().width + 20)));
  }
  function buildDots() {
    var n = cards().length, pv = perView();
    var pages = Math.max(1, n - pv + 1);
    tNav.hidden = pages <= 1;
    tDots.innerHTML = "";
    for (var i = 0; i < pages; i++) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "t-dot"; b.setAttribute("aria-label", t("slide", { n: i + 1 }));
      (function (idx) { b.addEventListener("click", function () { goTo(idx); }); })(i);
      tDots.appendChild(b);
    }
    syncDots();
  }
  function currentIndex() {
    var cs = cards(); if (!cs.length) return 0;
    var trackRect = tTrack.getBoundingClientRect();
    var best = 0, bestD = Infinity;
    cs.forEach(function (c, i) {
      var r = c.getBoundingClientRect();
      // start edge depends on direction
      var d = isEn() ? Math.abs(r.left - trackRect.left) : Math.abs(r.right - trackRect.right);
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }
  function goTo(i) {
    var cs = cards(); if (!cs[i]) return;
    var c = cs[i];
    var delta = isEn()
      ? c.getBoundingClientRect().left - tTrack.getBoundingClientRect().left
      : c.getBoundingClientRect().right - tTrack.getBoundingClientRect().right;
    tTrack.scrollBy({ left: delta, behavior: reduceMotion ? "auto" : "smooth" });
  }
  function syncDots() {
    var i = currentIndex();
    $$(".t-dot", tDots).forEach(function (d, k) { d.classList.toggle("is-active", k === Math.min(i, $$(".t-dot", tDots).length - 1)); d.setAttribute("aria-current", k === i ? "true" : "false"); });
  }
  if (tTrack) {
    var st = 0;
    tTrack.addEventListener("scroll", function () { clearTimeout(st); st = setTimeout(syncDots, 80); }, { passive: true });
    $("#tPrev").addEventListener("click", function () { goTo(Math.max(0, currentIndex() - 1)); });
    $("#tNext").addEventListener("click", function () { goTo(Math.min(cards().length - 1, currentIndex() + 1)); });
    var rt = 0;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(buildDots, 150); });
  }

  /* ---------- Reveal on scroll (with stagger) ---------- */
  var revealEls = $$(".reveal, .reveal-3d");
  $$(".services__grid, .why__grid, .accordion, .hero__content, .about__content, .booking__intro, .location__info").forEach(function (group) {
    $$(".reveal, .reveal-3d", group).forEach(function (el, i) { el.style.setProperty("--d", (i * 0.08).toFixed(2) + "s"); });
  });
  if (!reduceMotion && "IntersectionObserver" in window) {
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); rObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { rObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 3D tilt + spotlight on cards ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt]").forEach(function (card) {
      var raf = 0;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.setProperty("--mx", (px * 100) + "%");
          card.style.setProperty("--my", (py * 100) + "%");
          card.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * 8).toFixed(2) + "deg) rotateY(" + ((px - 0.5) * 10).toFixed(2) + "deg) translateZ(0)";
        });
      });
      card.addEventListener("pointerleave", function () { cancelAnimationFrame(raf); card.style.transform = ""; });
    });
  }

  /* ---------- FAQ accordion ---------- */
  $$(".acc__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc");
      var open = !item.classList.contains("is-open");
      $$(".acc.is-open").forEach(function (o) {
        if (o !== item) { o.classList.remove("is-open"); $(".acc__btn", o).setAttribute("aria-expanded", "false"); }
      });
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Config-driven content ---------- */
  function updateWaLinks() {
    var waBase = waNumber ? "https://wa.me/" + waNumber : "";
    $$("[data-wa-link]").forEach(function (a) {
      if (waBase) {
        a.href = waBase + "?text=" + encodeURIComponent(t("waHello"));
        a.hidden = false;
        if (a.classList.contains("wa-float")) a.setAttribute("aria-label", t("waFloat"));
      } else if (a.classList.contains("wa-float")) {
        a.href = "#booking"; a.removeAttribute("target"); a.setAttribute("aria-label", t("waFloatBook")); a.hidden = false;
      }
    });
  }

  var phoneEl = $("#footerPhone");
  if (phoneEl && cfg.phoneDisplay) {
    var span = $("span", phoneEl);
    span.removeAttribute("data-i18n");
    var tel = String(cfg.phoneLink || cfg.phoneDisplay).replace(/[^\d+]/g, "");
    span.innerHTML = "";
    var link = document.createElement("a");
    link.href = "tel:" + tel; link.textContent = cfg.phoneDisplay;
    span.appendChild(link);
  }

  var dirBtn = $("#directionsBtn");
  if (dirBtn) {
    dirBtn.href = cfg.mapsLink || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("مدينة نصر، القاهرة، مصر");
  }

  var mapIframe = null;
  if (cfg.mapEmbedUrl) {
    var map = $("#map"), ph = $("#mapPlaceholder");
    mapIframe = document.createElement("iframe");
    mapIframe.src = cfg.mapEmbedUrl; mapIframe.loading = "lazy";
    mapIframe.referrerPolicy = "no-referrer-when-downgrade"; mapIframe.allowFullscreen = true;
    map.appendChild(mapIframe); if (ph) ph.remove();
  }

  var socialWrap = $("#social"), social = cfg.social || {};
  var socialDefs = [["facebook", "i-fb", "Facebook"], ["instagram", "i-ig", "Instagram"], ["tiktok", "i-tt", "TikTok"], ["youtube", "i-yt", "YouTube"]];
  socialDefs.forEach(function (d) {
    if (!social[d[0]]) return;
    var a = document.createElement("a");
    a.href = social[d[0]]; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", d[2]);
    a.innerHTML = '<svg aria-hidden="true"><use href="#' + d[1] + '"/></svg>';
    socialWrap.appendChild(a);
  });

  /* ---------- Booking form ---------- */
  var form = $("#bookingForm");
  var status = $("#formStatus");
  var dateInput = $("#f-date");
  var nameInput = $("#f-name");
  var lastStatus = null; // remember which message is shown so it can be re-translated

  var today = new Date();
  var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  dateInput.min = iso(today);

  var normalizePhone = function (v) {
    v = String(v).replace(/[٠-٩]/g, function (c) { return "٠١٢٣٤٥٦٧٨٩".indexOf(c); })
                 .replace(/[۰-۹]/g, function (c) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(c); });
    return v.replace(/[\s\-()]/g, "");
  };
  var validPhone = function (v) {
    var p = normalizePhone(v);
    return /^(\+?20|0020)?0?1[0125]\d{8}$/.test(p) || /^(\+?20|0)?2\d{7,8}$/.test(p);
  };

  var errors = {}; // field -> key (so errors re-translate on language change)
  var setError = function (fieldEl, errEl, key) {
    errors[errEl.id] = key || null;
    fieldEl.classList.toggle("is-invalid", !!key);
    errEl.textContent = key ? t(key) : "";
    $$("input, select, textarea", fieldEl).forEach(function (i) {
      if (key) { i.setAttribute("aria-invalid", "true"); i.setAttribute("aria-describedby", errEl.id); }
      else { i.removeAttribute("aria-invalid"); }
    });
  };

  var validate = function (focus) {
    var ok = true, first = null;
    var fName = nameInput.closest(".field");
    if (nameInput.value.trim().length < 3) { setError(fName, $("#e-name"), "errName"); ok = false; first = first || nameInput; }
    else setError(fName, $("#e-name"));

    var fPhone = form.phone.closest(".field");
    if (!form.phone.value.trim()) { setError(fPhone, $("#e-phone"), "errPhoneEmpty"); ok = false; first = first || form.phone; }
    else if (!validPhone(form.phone.value)) { setError(fPhone, $("#e-phone"), "errPhone"); ok = false; first = first || form.phone; }
    else setError(fPhone, $("#e-phone"));

    var fService = form.service.closest(".field");
    if (!form.service.value) { setError(fService, $("#e-service"), "errService"); ok = false; first = first || form.service; }
    else setError(fService, $("#e-service"));

    var fWhen = $(".field--group", form);
    var whenKey = null;
    if (!form.date.value) whenKey = "errDate";
    else if (form.date.value < dateInput.min) whenKey = "errPast";
    else if (!form.period.value) whenKey = "errPeriod";
    setError(fWhen, $("#e-when"), whenKey);
    if (whenKey) { ok = false; first = first || (whenKey === "errPeriod" ? form.period : form.date); }

    if (first && focus !== false) first.focus();
    return ok;
  };

  $$("input, select, textarea", form).forEach(function (el) {
    el.addEventListener(el.tagName === "SELECT" || el.type === "date" ? "change" : "input", function () {
      var f = el.closest(".field");
      if (f && f.classList.contains("is-invalid")) validate(false);
    });
  });

  var selectedText = function (sel) { var o = sel.options[sel.selectedIndex]; return o ? o.textContent.trim() : ""; };
  var formatDate = function (val) {
    try {
      var parts = val.split("-");
      var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      return d.toLocaleDateString(t("dateLocale"), { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return val; }
  };
  var showStatus = function (key, cls) {
    lastStatus = key ? { key: key, cls: cls } : null;
    status.className = "form__status" + (cls ? " " + cls : "");
    status.textContent = key ? t(key) : "";
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showStatus(null);
    if (!validate()) return;

    var lines = [
      t("msgHead"),
      "",
      t("msgName") + ": " + nameInput.value.trim(),
      t("msgPhone") + ": " + normalizePhone(form.phone.value),
      t("msgService") + ": " + selectedText(form.service),
      t("msgWhen") + ": " + formatDate(form.date.value) + " — " + selectedText(form.period)
    ];
    var notes = form.notes.value.trim();
    if (notes) lines.push(t("msgNotes") + ": " + notes);
    var msg = lines.join("\n");

    if (!waNumber) {
      showStatus("noWa", "is-warn");
      console.warn("[Booking] whatsappNumber is empty in assets/js/config.js — message preview:\n" + msg);
      return;
    }
    window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    showStatus("sent", "is-ok");
  });

  /* ---------- Language-dependent refresh ---------- */
  function onLang() {
    toggle.setAttribute("aria-label", links.classList.contains("is-open") ? t("menuClose") : t("menuOpen"));
    updateWaLinks();
    updatePhotoAlt();
    if (mapIframe) mapIframe.title = t("mapTitle");
    renderTestimonials();
    Object.keys(errors).forEach(function (id) { if (errors[id]) $("#" + id).textContent = t(errors[id]); });
    if (lastStatus) showStatus(lastStatus.key, lastStatus.cls);
  }
  I18N.onChange(onLang);
  onLang();
})();
