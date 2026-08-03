# Bankily

مستودع نموذج Bankily ويحتوي الآن على نسختين:

- `mobile/`: تطبيق حقيقي مبني بـ React Native + Expo + TypeScript ويعمل على Android وiOS والويب.
- `app.html`: النموذج القديم المبني بـ HTML للتجربة السريعة.
- `android/`: غلاف Android القديم للنموذج الأولي.

## تشغيل تطبيق React Native

```bash
cd mobile
npm install
npm start
```

## بناء APK

يوجد GitHub Actions workflow باسم `Build React Native APK` يقوم بتوليد مشروع Android وبناء APK ورفعه كملف Artifact.

> التطبيق الحالي تجريبي ولا يستخدم بيانات مالية أو أموالًا حقيقية.
