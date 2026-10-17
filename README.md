# Live Stats & Multi-Model Monitor ⚡

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/hosamazzam/live-stats-monitor)
[![Models](https://img.shields.io/badge/Models-Argon%20%7C%20Flash%20%7C%20Pro-emerald.svg)](https://github.com/hosamazzam/live-stats-monitor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **لوحة تحكم ذكية لمراقبة استهلاك التوكنز لحظياً وفصل استهلاك النماذج المختلفة (Gemini 4 Argon / Flash) بدقة.**  
> Smart real-time token & multi-model breakdown sidecar monitor for Google Antigravity.

---

### 🚀 تشغيل لوحة الإحصائيات ومركز التحديثات
لوحة التحكم، إعدادات اللغة (عربي / English)، وزر التحديث المباشر المدمج موجودة داخل لوحة الـ Sidecar:

👉 **[فتح لوحة الإحصائيات الحية (Open Live Stats)](sidecar://live-stats-monitor/panel)**

---

### ✨ المميزات الرئيسية | Key Features
* 🔮 **فصل نماذج الذكاء الاصطناعي:** تمييز وفصل استهلاك **Gemini 4 Argon** و **Gemini 3.8 Flash** عند المزج بينهما في مهمة واحدة بدقة متناهية.
* 📊 **عداد مساحة السياق (Context Window):** متابعة لحظية لحجم السياق ونسبته المئوية من المليون توكن.
* 🤖 **تتبع الوكلاء الفرعيين (Subagents):** مراقبة شاملة لخطوات وتوكنز الوكلاء المتفرعين.
* ⚙️ **مركز تحديثات مدمج (1-Click Updater):** فحص وتثبيت التحديثات بنقرة واحدة من أيقونة الإعدادات `⚙️` أو من أسفل اللوحة.
* 🌐 **ثنائي اللغة (Bilingual):** التبديل الفوري بين العربية والإنجليزية.

---

### 🔄 التحديث اليدوي | Manual Update
إذا كنت تفضل التحديث عبر سطر الأوامر (PowerShell):
```bash
cd "$HOME\.gemini\config\plugins\live-stats-monitor"
git pull
```

---
**Repository:** [github.com/hosamazzam/live-stats-monitor](https://github.com/hosamazzam/live-stats-monitor)
