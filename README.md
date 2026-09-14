# Kora Full ⚽
تطبيق كرة قدم عربي PWA + Cloudflare Worker.

## ماذا يوجد؟
- مباريات اليوم
- مباشر
- تفاصيل المباراة
- أحداث المباراة
- الإحصائيات
- التشكيلات
- الترتيب
- الهدافون
- البحث
- المفضلة
- وضع ليلي
- PWA

## تشغيل الواجهة
ارفع الملفات إلى GitHub Pages.

## تشغيل البيانات الحية
ضع Worker على Cloudflare Workers وأضف Secret باسم `API_FOOTBALL_KEY`.
الـ Worker يستخدم API-Football ولا يضع المفتاح داخل GitHub.

## ملاحظة
API-Football يوفر fixtures/live/events/statistics/lineups/players/standings وغيرها. راجع توثيقهم قبل الإنتاج.
