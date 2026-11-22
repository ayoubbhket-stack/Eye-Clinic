# موقع عيادة دكتور أيوب للعيون — Dr. Ayoub Eye Clinic

موقع ثابت (HTML / CSS / JavaScript) — مش محتاج أي build أو سيرفر، ويشتغل مباشرة على GitHub Pages.

## الملفات
```
index.html              الصفحة كلها
assets/css/style.css    التصميم
assets/js/config.js     ← البيانات اللي هتعدلها (واتساب، تليفون، خريطة، سوشيال، آراء المرضى)
assets/js/main.js       القائمة، الأنيميشن، الأسئلة، آراء المرضى، فورم الحجز
assets/js/i18n.js       زرار اللغة + كل النصوص الإنجليزي (EN)
assets/img/             صورة الدكتور + assets/img/demo صور تجريبية لآراء المرضى
assets/js/eye.js        العين الـ 3D (Three.js)
assets/vendor/          مكتبة Three.js (محلية — مش معتمدة على CDN)
assets/favicon.svg, assets/og-image.jpg
.nojekyll, robots.txt
```

## الرفع على GitHub Pages
1. اعمل Repository جديد على GitHub (Public).
2. ارفع **محتوى** فولدر الموقع (index.html يكون في أول مستوى، مش جوه فولدر تاني).
3. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save.
4. بعد دقيقة أو اتنين الموقع هيبقى على: `https://USERNAME.github.io/REPO-NAME/`

> مهم: افتح الموقع من الرابط، مش بدبل كليك على index.html من الجهاز — العين الـ 3D محتاجة تتفتح من سيرفر.

## الإعدادات (assets/js/config.js)
| الخانة | الوظيفة |
|---|---|
| `whatsappNumber` | رقم واتساب بالصيغة الدولية أرقام بس، مثال `2010XXXXXXXX`. طول ما هو فاضي: فورم الحجز بيعمل validation لكن مش بيبعت، وزرار واتساب العائم بيودّي على الفورم. |
| `phoneDisplay` / `phoneLink` | رقم التليفون اللي يظهر في الفوتر |
| `mapsLink` | لينك موقع العيادة من Google Maps (زرار "احصل على الاتجاهات") |
| `mapEmbedUrl` | من Google Maps: Share → Embed a map → انسخ قيمة `src` بس |
| `social` | لينكات فيسبوك / إنستجرام / تيك توك / يوتيوب — الفاضي بيختفي |
| `doctorPhoto` | مسار صورة الدكتور (حاليًا `assets/img/dr-ayoub.webp`) |
| `showDemoTestimonials` | `true` = يظهر شكل تجريبي لآراء المرضى. خليه `false` قبل النشر لو لسه مفيش آراء حقيقية |
| `testimonials` | آراء المرضى الحقيقية (الاسم، النص، الصورة، التقييم) — أول ما تضيف رأي، التجريبي بيختفي |

## اللغة
- زرار ع / EN في النافبار بيقلب الموقع كله (النصوص + الاتجاه RTL/LTR) وبيفتكر اختيار الزائر.
- لينك مباشر بالإنجليزي: `?lang=en` في آخر الرابط.
- لتعديل أي نص إنجليزي: `assets/js/i18n.js` (الكود `EN`). النص العربي في `index.html`.

## صورة الدكتور
بدّل الملف `assets/img/dr-ayoub.webp` بصورة جديدة بنفس الاسم، أو غيّر المسار في `doctorPhoto`.
