# Live Stats & Context Monitor ⚡

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/HosAzz/live-stats-monitor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Antigravity](https://img.shields.io/badge/Google%20Antigravity-Plugin-purple.svg)](https://github.com/HosAzz/live-stats-monitor)
[![Models](https://img.shields.io/badge/Supported-Argon%204%20%7C%20Flash%203.8%20%7C%20Pro-emerald.svg)](https://github.com/HosAzz/live-stats-monitor)

> **لوحة تحكم تفاعلية ذكية (Sidecar) لبرنامج Google Antigravity لمتابعة استهلاك التوكنز لحظياً، فصل استهلاك النماذج المختلفة (Gemini 4 Argon / Gemini 3.8 Flash / Claude)، ومراقبة مساحة السياق وفريق الوكلاء الفرعيين (Subagents).**
> 
> A sleek, real-time interactive sidecar dashboard for **Google Antigravity** providing live token consumption metrics, dynamic multi-model breakdown (Gemini 4 Argon, Gemini 3.8 Flash, Pro, Claude), context window utilization, and subagent swarm tracking.

---

## 🌟 المميزات الرئيسية | Key Features

* 🔮 **فصل وتحليل استهلاك النماذج (Dynamic Multi-Model Breakdown):**
  * يتعرف تلقائياً على النموذج النشط (**Gemini 4 Argon**, **Gemini 3.8 Flash**, **Gemini 3.1 Pro**, إلخ).
  * يفصل استهلاك كل نموذج بدقة متناهية (التوكنز الإجمالية، المدخلات، المخرجات، والنسبة المئوية).
  * شريط نسبي ملون (Proportional Distribution Bar) لعرض حصة كل نموذج في الجلسة.
* ⚡ **دعم المهام المشتركة (Mixed-Model Tasks):**
  * إذا استخدمت نموذجاً للتفكير والتخطيط (مثل أرجون) وفوّضت وكلاء فرعيين بنموذج آخر (مثل فلاش لكتابة الكود)، يوضح البلاجن توزيع التوكنز بينهما بدقة داخل كارت المهمة الحالية.
* 📊 **عداد مساحة السياق اللحظي (Context Window Meter):**
  * مراقبة مباشرة لنسبة وحجم السياق الحالي من الحد الأقصى (1,000,000 توكن) مع شريط تقدم تفاعلي.
* 🤖 **مراقبة فريق الوكلاء الفرعيين (Subagents Swarm Tracking):**
  * تتبع تلقائي وعميق لكافة الوكلاء الفرعيين الأساسيين والمتفرعين (Nested Subagents) وإحصاء خطواتهم وتوكنز كل منهم.
* 🌐 **واجهة ثنائية اللغة بضغطة زر (Bilingual AR / EN):**
  * تبديل فوري وسلس بين **العربية** و **الإنجليزية** عبر زر `🌐 [ AR | EN ]` مع حفظ التفضيل تلقائياً.
* 🔄 **محدّث تلقائي مدمج داخل الأداة (In-App 1-Click Updater):**
  * فحص وتثبيت التحديثات مباشرة من جيت هب بنقرة واحدة من داخل اللوحة دون الحاجة لفتح سطر الأوامر.
* 📡 **حساب استهلاك الإنترنت الفعلي (Realistic Network Traffic):**
  * احتساب التدفق التراكمي لبيانات السياق والملفات المنقولة عبر الشبكة بالميجابايت (MB).

---

## 📥 طريقة التثبيت | Installation

### الطريقة الأولى: عبر Git Clone (موصى بها للتحديث التلقائي)

افتح سطر الأوامر (PowerShell أو Terminal) ونفّذ الأمر التالي:

```bash
git clone https://github.com/HosAzz/live-stats-monitor.git "$HOME\.gemini\config\plugins\live-stats-monitor"
```

### الطريقة الثانية: التحميل اليدوي (ZIP Download)

1. حمّل ملف المستودع كملف مضغوط `ZIP` من زر **Code -> Download ZIP** في صفحة المشروع على GitHub.
2. فك الضغط وانقل المجلد إلى المسار التالي:
   * **Windows:** `C:\Users\<YourUsername>\.gemini\config\plugins\live-stats-monitor`
   * **Mac / Linux:** `~/.gemini/config/plugins/live-stats-monitor`

### تفعيل الإضافة في Antigravity:

تأكد من وجود الإضافة مفعّلة في ملف `C:\Users\<YourUsername>\.gemini\config\config.json`:

```json
{
  "plugins": {
    "live-stats-monitor": {
      "enabled": true
    }
  }
}
```

---

## 🔄 كيفية التحديث | How to Update

### 1. من داخل الأداة نفسها (الأسهل والأسرع):
* ستجد في أسفل لوحة التحكم (Footer) شارة الإصدار: `↻ v1.1.0`.
* عند توفر أي تحديث جديد على GitHub، ستتحول الشارة تلقائياً إلى اللون البرتقالي التنبيهي: `تحديث متاح! اضغط للتثبيت`.
* اضغط عليها وستقوم الإضافة بتحميل وتطبيق التحديث فوراً وبشكل تلقائي!

### 2. عبر سطر الأوامر (Git Pull):
إذا قمت بتثبيت الإضافة عبر `git clone`، يمكنك التحديث في أي وقت عبر تشغيل:

```bash
cd "$HOME\.gemini\config\plugins\live-stats-monitor"
git pull
```

---

## ⚙️ الإعدادات وملف التكوين | Configuration

تحتوي الإضافة على ملف تكوين تلقائي في مسارها الرئيسي `config.json`:

```json
{
  "language": "ar",
  "theme": "dark",
  "autoUpdateCheck": true,
  "repoUrl": "https://github.com/HosAzz/live-stats-monitor"
}
```

* **`language`:** لغة الواجهة الافتراضية (`"ar"` للعربية أو `"en"` للإنجليزية). (يمكنك أيضاً تغييرها مباشرة وبشكل دائم عبر زر `🌐` في واجهة الأداة).
* **`autoUpdateCheck`:** فحص التحديثات الجديدة تلقائياً في الخلفية.

---

## 🖥️ كيفية فتح لوحة الإحصائيات | Opening the Monitor

بمجرد تشغيل أي جلسة في Google Antigravity، يمكنك فتح اللوحة الجانبية بالنقر على الرابط التالي داخل المحادثة:

```text
[فتح شاشة الإحصائيات الحية](sidecar://live-stats-monitor/panel)
```

أو عبر الضغط على أيقونة الإضافة في الشريط الجانبي للـ Sidecars.

---

## 📂 بنية المشروع | Project Structure

```text
live-stats-monitor/
├── assets/
│   └── logo.svg                 # أيقونة الإضافة
├── sidecars/
│   └── panel/
│       ├── index.html           # واجهة لوحة التحكم
│       ├── app.js               # العميل، القاموس ثنائي اللغة، ومحرك التحديث
│       ├── styles.css           # تصميم CSS العصري الداكن ودعم RTL/LTR
│       ├── main.mjs             # الخادم ومحلل الترانزكريبتات ونقاط الـ API
│       ├── sidecar.json         # تعريف الـ Sidecar لبيئة Antigravity
│       └── package.json         # تعريف وحدة Node.js
├── config.json                  # ملف الإعدادات واللغة
├── plugin.json                  # بيانات وصف الإضافة والإصدار
├── .gitignore                   # ملف استثناءات Git
├── LICENSE                      # رخصة الاستخدام MIT
└── README.md                    # دليل التثبيت والتشغيل
```

---

## 📄 الترخيص | License

هذا المشروع مفتوح المصدر ومرخص تحت رخصة **[MIT License](LICENSE)**. يُسمح للجميع باستخدامه وتعديله وتوزيعه بحرية.

---

**Developed with ❤️ by [HosAzz](https://github.com/HosAzz) for the Google Antigravity Community.**
