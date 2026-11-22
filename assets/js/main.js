/* Dr. Ayoub Eye Clinic — UI logic (nav, reveal, tilt, FAQ, booking, config) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var cfg = window.CLINIC_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var waNumber = String(cfg.whatsappNumber || "").replace(/\D/g, "");

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
    toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
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

  /* ---------- Reveal on scroll (with stagger) ---------- */
  var revealEls = $$(".reveal, .reveal-3d");
  // stagger siblings
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
  var waBase = waNumber ? "https://wa.me/" + waNumber : "";
  $$("[data-wa-link]").forEach(function (a) {
    if (waBase) {
      a.href = waBase + "?text=" + encodeURIComponent("مرحبًا، أود الاستفسار عن عيادة دكتور أيوب للعيون.");
      a.hidden = false;
    } else if (a.classList.contains("wa-float")) {
      // no number yet: the floating button scrolls to the booking form instead
      a.href = "#booking"; a.removeAttribute("target"); a.setAttribute("aria-label", "احجز موعدك"); a.hidden = false;
    }
  });

  var phoneEl = $("#footerPhone");
  if (phoneEl && cfg.phoneDisplay) {
    var span = $("span", phoneEl);
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

  if (cfg.mapEmbedUrl) {
    var map = $("#map"), ph = $("#mapPlaceholder");
    var ifr = document.createElement("iframe");
    ifr.src = cfg.mapEmbedUrl; ifr.loading = "lazy"; ifr.title = "موقع عيادة دكتور أيوب على الخريطة";
    ifr.referrerPolicy = "no-referrer-when-downgrade"; ifr.allowFullscreen = true;
    map.appendChild(ifr); if (ph) ph.remove();
  }

  var socialWrap = $("#social"), social = cfg.social || {};
  var socialDefs = [["facebook", "i-fb", "فيسبوك"], ["instagram", "i-ig", "إنستجرام"], ["tiktok", "i-tt", "تيك توك"], ["youtube", "i-yt", "يوتيوب"]];
  socialDefs.forEach(function (d) {
    if (!social[d[0]]) return;
    var a = document.createElement("a");
    a.href = social[d[0]]; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", d[2]);
    a.innerHTML = '<svg aria-hidden="true"><use href="#' + d[1] + '"/></svg>';
    socialWrap.appendChild(a);
  });

  // Testimonials: shown only when real reviews exist in config
  var tList = Array.isArray(cfg.testimonials) ? cfg.testimonials.filter(function (t) { return t && t.text; }) : [];
  if (tList.length) {
    var grid = $("#testimonialsGrid");
    tList.forEach(function (t) {
      var card = document.createElement("figure");
      card.className = "glass-card testimonial";
      var q = document.createElement("p"); q.textContent = "“" + t.text + "”";
      card.appendChild(q);
      if (t.name) { var n = document.createElement("strong"); n.textContent = t.name; card.appendChild(n); }
      grid.appendChild(card);
    });
    $("#testimonials").hidden = false;
  }

  /* ---------- Booking form ---------- */
  var form = $("#bookingForm");
  var status = $("#formStatus");
  var dateInput = $("#f-date");
  var nameInput = $("#f-name");

  // min date = today (local)
  var today = new Date();
  var iso = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  dateInput.min = iso(today);

  var normalizePhone = function (v) {
    // convert Arabic-Indic digits to Latin
    v = String(v).replace(/[٠-٩]/g, function (c) { return "٠١٢٣٤٥٦٧٨٩".indexOf(c); })
                 .replace(/[۰-۹]/g, function (c) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(c); });
    return v.replace(/[\s\-()]/g, "");
  };
  var validPhone = function (v) {
    var p = normalizePhone(v);
    return /^(\+?20|0020)?0?1[0125]\d{8}$/.test(p) || /^(\+?20|0)?2\d{7,8}$/.test(p);
  };

  var setError = function (fieldEl, errEl, msg) {
    fieldEl.classList.toggle("is-invalid", !!msg);
    errEl.textContent = msg || "";
    $$("input, select, textarea", fieldEl).forEach(function (i) {
      if (msg) { i.setAttribute("aria-invalid", "true"); i.setAttribute("aria-describedby", errEl.id); }
      else { i.removeAttribute("aria-invalid"); }
    });
  };

  var validate = function () {
    var ok = true, first = null;
    var name = nameInput.value.trim();
    var fName = nameInput.closest(".field");
    if (name.length < 3) { setError(fName, $("#e-name"), "من فضلك اكتب الاسم بالكامل."); ok = false; first = first || nameInput; }
    else setError(fName, $("#e-name"), "");

    var fPhone = form.phone.closest(".field");
    if (!form.phone.value.trim()) { setError(fPhone, $("#e-phone"), "من فضلك اكتب رقم الهاتف."); ok = false; first = first || form.phone; }
    else if (!validPhone(form.phone.value)) { setError(fPhone, $("#e-phone"), "رقم الهاتف غير صحيح. مثال: 01012345678"); ok = false; first = first || form.phone; }
    else setError(fPhone, $("#e-phone"), "");

    var fService = form.service.closest(".field");
    if (!form.service.value) { setError(fService, $("#e-service"), "من فضلك اختر نوع الكشف."); ok = false; first = first || form.service; }
    else setError(fService, $("#e-service"), "");

    var fWhen = $(".field--group", form);
    var whenMsg = "";
    if (!form.date.value) whenMsg = "من فضلك اختر التاريخ المناسب.";
    else if (form.date.value < dateInput.min) whenMsg = "من فضلك اختر تاريخًا من اليوم أو بعده.";
    else if (!form.period.value) whenMsg = "من فضلك اختر الفترة المناسبة.";
    setError(fWhen, $("#e-when"), whenMsg);
    if (whenMsg) { ok = false; first = first || (!form.date.value || form.date.value < dateInput.min ? form.date : form.period); }

    if (first) first.focus();
    return ok;
  };

  // clear error as user fixes the field
  $$("input, select, textarea", form).forEach(function (el) {
    el.addEventListener(el.tagName === "SELECT" || el.type === "date" ? "change" : "input", function () {
      var f = el.closest(".field");
      if (f && f.classList.contains("is-invalid")) validate();
    });
  });

  var formatDate = function (val) {
    try {
      var parts = val.split("-");
      var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      return d.toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    } catch (e) { return val; }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form__status"; status.textContent = "";
    if (!validate()) return;

    var lines = [
      "طلب حجز موعد — عيادة دكتور أيوب للعيون",
      "",
      "الاسم: " + nameInput.value.trim(),
      "رقم الهاتف: " + normalizePhone(form.phone.value),
      "نوع الكشف: " + form.service.value,
      "الموعد المناسب: " + formatDate(form.date.value) + " — " + form.period.value
    ];
    var notes = form.notes.value.trim();
    if (notes) lines.push("ملاحظات: " + notes);
    var msg = lines.join("\n");

    if (!waNumber) {
      status.classList.add("is-warn");
      status.textContent = "خدمة الحجز عبر واتساب لم يتم تفعيلها بعد. من فضلك حاول لاحقًا.";
      console.warn("[Booking] whatsappNumber is empty in assets/js/config.js — message preview:\n" + msg);
      return;
    }

    window.open("https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    status.classList.add("is-ok");
    status.textContent = "تم تجهيز رسالة الحجز في واتساب. من فضلك اضغط إرسال هناك، وسيتم تأكيد الموعد بعد تواصل العيادة معك.";
  });
})();
