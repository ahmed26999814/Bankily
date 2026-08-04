# Bankily

مستودع تطبيق Bankily ويحتوي على:

- `mobile/`: تطبيق React Native + Expo + TypeScript يعمل على Android وiOS والويب.
- `index.html`: موقع تحميل التطبيق.
- `app.html`: المعاينة القديمة السريعة داخل الموقع.
- `Bankily.apk`: أحدث نسخة Android منشورة للمستخدمين.

## تشغيل تطبيق React Native

```bash
cd mobile
npm install
npm start
```

## بناء ونشر APK

يقوم GitHub Actions بما يلي تلقائيًا:

1. تصدير نسخة الويب للتحقق من الكود.
2. توليد مشروع Android وبناء APK Release.
3. حفظ APK كملف Artifact.
4. عند الدمج في `main`، استبدال `Bankily.apk` في جذر المستودع بأحدث نسخة ليعمل زر التحميل في الموقع دائمًا.

## قاعدة ثابتة للمشروع

عند إنشاء أي إصدار جديد من التطبيق يجب:

- تحديث رقم الإصدار في `mobile/app.json`.
- نشر أحدث APK في الموقع باسم `Bankily.apk`.
- تحديث رقم النسخة وتاريخها في `index.html`.

> التطبيق الحالي تجريبي ولا يستخدم بيانات مالية أو أموالًا حقيقية.
