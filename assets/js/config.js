/* =========================================================
   إعدادات الموقع — عدّل البيانات هنا فقط
   Site configuration — edit values here only
   ========================================================= */
window.CLINIC_CONFIG = {
  // رقم واتساب بالصيغة الدولية بدون + أو مسافات، مثال: 2010XXXXXXXX
  whatsappNumber: "",

  // رقم الهاتف كما سيظهر للزوار، مثال: "+20 10 XXXX XXXX"
  phoneDisplay: "",
  // رقم الهاتف للاتصال المباشر، مثال: "+2010XXXXXXXX"
  phoneLink: "",

  // رابط مشاركة موقع العيادة من Google Maps (زر "احصل على الاتجاهات")
  mapsLink: "",
  // رابط التضمين (Embed) من Google Maps: Share → Embed a map → انسخ قيمة src
  mapEmbedUrl: "",

  // صورة الدكتور في قسم "عن الدكتور" — حط الصورة في assets/img واكتب مسارها هنا
  // مثال: "assets/img/dr-ayoub.jpg"
  doctorPhoto: "assets/img/dr-ayoub.webp",

  // روابط السوشيال ميديا — اتركها فارغة لإخفائها
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: ""
  },

  /* آراء المرضى
     - طول ما القائمة فاضية و showDemoTestimonials = true: بيظهر شكل تجريبي واضح إنه "تجريبي".
     - أول ما تضيف آراء حقيقية، التجريبي بيختفي تلقائيًا.
     - لإخفاء القسم كله قبل النشر: خلي showDemoTestimonials = false والقائمة فاضية.
     شكل كل رأي:
     {
       name: "اسم المريض",            // name_en اختياري للنسخة الإنجليزية
       text: "نص الرأي كما كتبه المريض", // text_en اختياري
       service: "نوع الكشف",          // اختياري — service_en اختياري
       photo: "assets/img/reviews/patient-1.jpg", // اختياري
       rating: 5                      // اختياري (1 إلى 5)
     }
  */
  showDemoTestimonials: true,
  testimonials: []
};
