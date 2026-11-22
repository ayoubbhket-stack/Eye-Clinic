/* =========================================================
   Language switcher (Arabic ⇄ English)
   - Arabic text lives in index.html; it's captured on load.
   - English text lives in EN below (keys match data-i18n).
   ========================================================= */
(function () {
  "use strict";

  var EN = {
    brandAria: "Dr. Ayoub Eye Clinic — Home",
    brandName: "Dr. Ayoub",
    navAria: "Main navigation",
    navAbout: "About",
    navServices: "Services",
    navWhy: "Why us",
    navReviews: "Reviews",
    navLocation: "Location",
    navFaq: "FAQ",
    navCta: "Book now",

    heroEyebrow: "Ophthalmology &amp; Eye Surgery · Nasr City",
    heroTitle: 'Clearer vision..<br><span class="text-gradient">for a better life</span>',
    heroLead: "Complete care for your eye health, using the latest medical technology and specialised expertise in diagnosing and treating eye conditions.",
    ctaBook: "Book your appointment",
    ctaServices: "Explore our services",
    chipsAria: "Areas of care",
    chip1: "Comprehensive exam", chip2: "Retina", chip3: "Cataract &amp; glaucoma", chip4: "Children's eyes",
    scrollAria: "Scroll down",

    photoAria: "Photo of Dr. Ayoub",
    photoLabel: "Doctor's photo",
    drName: "Dr. Ayoub",
    drSpecialty: "Ophthalmology &amp; Eye Surgery",
    aboutEyebrow: "About the doctor",
    aboutTitle: 'Medical care.. <span class="text-gradient">with a different vision</span>',
    aboutLead: "Dr. Ayoub provides complete ophthalmology and eye surgery services, with a focus on accurate diagnosis and medical care tailored to each patient's needs.",
    pt1: "Accurate diagnosis", pt2: "Care for every case", pt3: "Continuous follow-up",
    aboutCta: "Book a consultation",

    svcEyebrow: "Our services",
    svcTitle: 'Everything your eyes need <span class="text-gradient">in one place</span>',
    s1t: "Comprehensive Eye Examinations", s1d: "A complete check of your vision and eye health.",
    s2t: "Vision Correction", s2d: "Diagnosis and treatment of vision problems.",
    s3t: "Cataract Care", s3d: "Diagnosis and follow-up of cataracts.",
    s4t: "Glaucoma Care", s4d: "Diagnosis and follow-up of glaucoma.",
    s5t: "Retina &amp; Macula Care", s5d: "Diagnosis and follow-up of retina and macula conditions.",
    s6t: "Cornea &amp; Dry Eye Care", s6d: "Diagnosis and treatment of corneal problems and dry eye.",
    s7t: "Pediatric Ophthalmology", s7d: "Eye examinations and follow-up for children.",
    s8t: "Eye Surgery Consultation", s8d: "Eye surgery consultations and choosing the right treatment.",

    whyEyebrow: "Our approach to care",
    whyTitle: 'Why choose <span class="text-gradient">Dr. Ayoub?</span>',
    w1: "A focus on accurate diagnosis.",
    w2: "Medical care tailored to each patient's needs.",
    w3: "Continuous follow-up of your condition and treatment plan.",
    w4: "Attention to patient comfort and clear medical information.",

    tEyebrow: "Patient reviews",
    tTitle: 'Trust <span class="text-gradient">we value</span>',
    tDemo: "Preview — sample reviews and photos until real patient reviews are added",
    tPrev: "Previous", tNext: "Next",

    bEyebrow: "Appointments",
    bTitle: 'Start your journey <span class="text-gradient">to better vision</span>',
    bLead: "Book your appointment with Dr. Ayoub and take care of your eye health.",
    step1: "Fill in your details in the form",
    step2: "A booking message is prepared on WhatsApp",
    step3: "The clinic contacts you to confirm the appointment",
    fName: "Full name", fNamePh: "Enter your full name",
    fPhone: "Phone number",
    fService: "Specialty or type of visit",
    optPick: "Choose the type of visit",
    opt1: "Comprehensive eye examination", opt2: "Vision correction", opt3: "Cataract", opt4: "Glaucoma",
    opt5: "Retina &amp; macula", opt6: "Cornea &amp; dry eye", opt7: "Children's eyes", opt8: "Eye surgery consultation",
    opt9: "Not sure / need a consultation",
    fWhen: "Preferred appointment", fDate: "Date", fPeriod: "Time of day",
    perPick: "Preferred time", per1: "Morning", per2: "Midday", per3: "Evening",
    fNotes: "Additional notes", optional: "(optional)", fNotesPh: "Anything you'd like the clinic to know",
    formNote: "Pressing the button opens WhatsApp with a message containing your booking details. Your appointment is confirmed once the clinic contacts you.",

    locEyebrow: "Location",
    locTitle: 'Visit our clinic <span class="text-gradient">in Nasr City</span>',
    address: "Nasr City, Cairo, Egypt",
    directions: "Get directions",
    askAddress: "Ask for the address",
    mapCity: "Nasr City, Cairo",
    mapSoon: "The exact clinic map will be added soon",

    faqEyebrow: "FAQ",
    faqTitle: 'Have a <span class="text-gradient">question?</span>',
    q1: "What are Dr. Ayoub's specialties?",
    a1: "Dr. Ayoub specialises in ophthalmology and eye surgery. Services include comprehensive eye examinations, diagnosis and treatment of vision problems, cataract and glaucoma follow-up, retina and macula conditions, corneal problems and dry eye, children's eye examinations, and eye surgery consultations.",
    q2: "How can I book an appointment?",
    a2: "Fill in the booking form on this page and a WhatsApp message will be prepared with your details, the type of visit and your preferred time. After you send it, the clinic will contact you to confirm the appointment.",
    q3: "Does the clinic see children?",
    a3: "Yes, children's eye examinations and follow-up are among our services. If you have a question about your child's case, write it in the notes field when booking.",
    q4: "Do I need to book before visiting?",
    a4: "We recommend booking in advance so we can arrange a suitable time. For any questions about your visit, you can contact the clinic on WhatsApp.",
    q5: "Where is the clinic in Nasr City?",
    a5: "The clinic is in Nasr City, Cairo. Use the \"Get directions\" button in the location section, or contact us on WhatsApp for the detailed address.",

    bandTitle: 'Your eyes deserve <span class="text-gradient">precise care</span>',
    footerTag: "Complete eye care in Nasr City.",
    quickLinks: "Quick links",
    footBook: "Book an appointment",
    contact: "Contact us",
    phoneSoon: "Phone number — coming soon",
    waContact: "Chat on WhatsApp",
    rights: "All rights reserved."
  };

  // Strings used from JavaScript (both languages)
  var JS = {
    ar: {
      title: "دكتور أيوب لطب وجراحة العيون | مدينة نصر، القاهرة",
      desc: "عيادة دكتور أيوب لطب وجراحة العيون في مدينة نصر، القاهرة. فحص شامل للعين، تصحيح الإبصار، المياه البيضاء والزرقاء، الشبكية، القرنية وجفاف العين، وعيون الأطفال. احجز موعدك الآن.",
      switchTo: "Switch to English", switchTitle: "English",
      menuOpen: "فتح القائمة", menuClose: "إغلاق القائمة",
      waFloat: "تواصل عبر واتساب", waFloatBook: "احجز موعدك",
      waHello: "مرحبًا، أود الاستفسار عن عيادة دكتور أيوب للعيون.",
      errName: "من فضلك اكتب الاسم بالكامل.",
      errPhoneEmpty: "من فضلك اكتب رقم الهاتف.",
      errPhone: "رقم الهاتف غير صحيح. مثال: 01012345678",
      errService: "من فضلك اختر نوع الكشف.",
      errDate: "من فضلك اختر التاريخ المناسب.",
      errPast: "من فضلك اختر تاريخًا من اليوم أو بعده.",
      errPeriod: "من فضلك اختر الفترة المناسبة.",
      noWa: "خدمة الحجز عبر واتساب لم يتم تفعيلها بعد. من فضلك حاول لاحقًا.",
      sent: "تم تجهيز رسالة الحجز في واتساب. من فضلك اضغط إرسال هناك، وسيتم تأكيد الموعد بعد تواصل العيادة معك.",
      msgHead: "طلب حجز موعد — عيادة دكتور أيوب للعيون",
      msgName: "الاسم", msgPhone: "رقم الهاتف", msgService: "نوع الكشف", msgWhen: "الموعد المناسب", msgNotes: "ملاحظات",
      dateLocale: "ar-EG",
      mapTitle: "موقع عيادة دكتور أيوب على الخريطة",
      demoName: "اسم المريض",
      demoService: "نوع الكشف",
      demoText: "هنا يظهر رأي المريض الحقيقي عن تجربته في العيادة. هذا نص تجريبي لمعاينة شكل القسم فقط، وسيتم استبداله بآراء حقيقية.",
      demoTag: "تجريبي",
      ratingLabel: "التقييم: {n} من 5",
      slide: "رأي {n}"
    },
    en: {
      title: "Dr. Ayoub — Ophthalmology & Eye Surgery | Nasr City, Cairo",
      desc: "Dr. Ayoub Eye Clinic in Nasr City, Cairo. Comprehensive eye exams, vision correction, cataract and glaucoma care, retina, cornea and dry eye, and children's eyes. Book your appointment.",
      switchTo: "التبديل إلى العربية", switchTitle: "العربية",
      menuOpen: "Open menu", menuClose: "Close menu",
      waFloat: "Chat on WhatsApp", waFloatBook: "Book an appointment",
      waHello: "Hello, I'd like to ask about Dr. Ayoub Eye Clinic.",
      errName: "Please enter your full name.",
      errPhoneEmpty: "Please enter your phone number.",
      errPhone: "Invalid phone number. Example: 01012345678",
      errService: "Please choose the type of visit.",
      errDate: "Please choose a date.",
      errPast: "Please choose today or a later date.",
      errPeriod: "Please choose a time of day.",
      noWa: "WhatsApp booking hasn't been activated yet. Please try again later.",
      sent: "Your booking message is ready in WhatsApp. Please press send there — the appointment is confirmed once the clinic contacts you.",
      msgHead: "Appointment request — Dr. Ayoub Eye Clinic",
      msgName: "Name", msgPhone: "Phone", msgService: "Type of visit", msgWhen: "Preferred time", msgNotes: "Notes",
      dateLocale: "en-GB",
      mapTitle: "Dr. Ayoub Eye Clinic on the map",
      demoName: "Patient name",
      demoService: "Type of visit",
      demoText: "This is where a real patient's review of their clinic experience will appear. This is sample text to preview the section only and will be replaced with genuine reviews.",
      demoTag: "Sample",
      ratingLabel: "Rating: {n} out of 5",
      slide: "Review {n}"
    }
  };

  var AR = {};      // captured from the DOM
  var ARattr = {};  // captured aria-labels / placeholders
  var listeners = [];
  var current = "ar";

  function capture() {
    each("[data-i18n]", function (el) { var k = el.getAttribute("data-i18n"); if (!(k in AR)) AR[k] = el.innerHTML; });
    each("[data-i18n-aria]", function (el) { var k = el.getAttribute("data-i18n-aria"); if (!(k in ARattr)) ARattr[k] = el.getAttribute("aria-label"); });
    each("[data-i18n-ph]", function (el) { var k = el.getAttribute("data-i18n-ph"); if (!(k in ARattr)) ARattr[k] = el.getAttribute("placeholder"); });
  }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function textOf(html) { var d = document.createElement("div"); d.innerHTML = html; return d.textContent; }

  function apply(lang) {
    current = lang === "en" ? "en" : "ar";
    var ar = current === "ar";
    var html = document.documentElement;
    html.lang = current;
    html.dir = ar ? "rtl" : "ltr";

    each("[data-i18n]", function (el) {
      var k = el.getAttribute("data-i18n");
      var v = ar ? AR[k] : EN[k];
      if (v != null) el.innerHTML = v;
    });
    each("[data-i18n-aria]", function (el) {
      var k = el.getAttribute("data-i18n-aria");
      var v = ar ? ARattr[k] : (EN[k] != null ? textOf(EN[k]) : null);
      if (v != null) el.setAttribute("aria-label", v);
    });
    each("[data-i18n-ph]", function (el) {
      var k = el.getAttribute("data-i18n-ph");
      var v = ar ? ARattr[k] : EN[k];
      if (v != null) el.setAttribute("placeholder", v);
    });

    var t = JS[current];
    document.title = t.title;
    var md = document.getElementById("metaDesc"); if (md) md.setAttribute("content", t.desc);

    var sw = document.getElementById("langSwitch");
    if (sw) { sw.setAttribute("aria-label", t.switchTo); sw.title = t.switchTitle; sw.setAttribute("data-current", current); }

    try { localStorage.setItem("clinic-lang", current); } catch (e) {}
    listeners.forEach(function (fn) { try { fn(current); } catch (e) { console.warn(e); } });
  }

  window.I18N = {
    get lang() { return current; },
    t: function (key, vars) {
      var s = (JS[current] && JS[current][key]) || JS.ar[key] || key;
      if (vars) Object.keys(vars).forEach(function (v) { s = s.replace("{" + v + "}", vars[v]); });
      return s;
    },
    set: apply,
    onChange: function (fn) { listeners.push(fn); }
  };

  function init() {
    capture();
    var saved = null;
    try { saved = localStorage.getItem("clinic-lang"); } catch (e) {}
    var fromUrl = (location.search.match(/[?&]lang=(ar|en)/) || [])[1];
    var start = fromUrl || saved || "ar";
    apply(start);
    var sw = document.getElementById("langSwitch");
    if (sw) sw.addEventListener("click", function () { apply(current === "ar" ? "en" : "ar"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
