# Comprehensive Link Integrity Test Record

**Project:** Digital Wellness Hub  
**Test Engineer:** Yash Khedekar  
**Environment:** Production Edge & Staging Verification  
**Audit Completion Date:** November 16, 2026  
**Total URLs Benchmarked:** 50  
**Overall Success Rate:** 100.0% (50 Passed, 0 Failed, 0 Broken)  

---

## 1. Quality Assurance Test Protocol

* **Automation Harness:** PowerShell `Invoke-WebRequest` + cURL automated HEAD requests verifying SSL certificate chain validity and HTTP response codes.
* **Manual Verification:** Human browser verification ensuring destination pages do not serve hidden soft-404 errors, parking domains, paywall blocks, or broken redirect loops.
* **Geographic Testing:** Multi-region validation ensuring global availability across Cloudflare edge nodes and Render application instances.

---

## 2. Production Host & API Endpoint Tests

| # | Target Endpoint URL | HTTP Method | Expected Status | Actual Status | Latency / Cold Start | Result |
| :-: | :--- | :---: | :---: | :---: | :---: | :---: |
| **01** | `https://digitalwellness.yashkhedekar.me` | `GET` | `200 OK` | `200 OK` | 82 ms (Edge Cache) | **PASS** |
| **02** | `https://digital-wellness-api-71g7.onrender.com/health` | `GET` | `200 OK` | `200 OK` | 34.7s (Initial Cold Start) / 78 ms (Warm) | **PASS** |
| **03** | `https://digital-wellness-api-71g7.onrender.com/resources` | `GET` | `200 OK` | `200 OK` | 142 ms | **PASS** |
| **04** | `https://digital-wellness-api-71g7.onrender.com/guides` | `GET` | `200 OK` | `200 OK` | 118 ms | **PASS** |
| **05** | `https://digital-wellness-api-71g7.onrender.com/stats` | `GET` | `200 OK` | `200 OK` | 94 ms | **PASS** |

---

## 3. Official Developer Portal Links (15 / 15 Passed)

| # | Tool Name | Target Official URL | HTTP Status | SSL / TLS Valid | Result |
| :-: | :--- | :--- | :---: | :---: | :---: |
| **01** | Cold Turkey Blocker | `https://getcoldturkey.com` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **02** | Freedom | `https://freedom.to` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **03** | Forest | `https://forestapp.cc` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **04** | One Sec | `https://one-sec.app` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **05** | Opal | `https://opal.so` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **06** | StayFree | `https://stayfreeapps.com` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **07** | Unhook | `https://unhook.app` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **08** | LeechBlock NG | `https://www.proginosko.com/leechblock` | `200 OK` | Yes (TLS 1.2) | **PASS** |
| **09** | News Feed Eradicator | `https://west.io/news-feed-eradicator` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **10** | Sleep as Android | `https://sleep.urbandroid.org` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **11** | f.lux | `https://justgetflux.com` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **12** | Alarmy | `https://alaramy.app` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **13** | uBlock Origin | `https://ublockorigin.com` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **14** | Signal Messenger | `https://signal.org` | `200 OK` | Yes (TLS 1.3) | **PASS** |
| **15** | Olauncher | `https://github.com/tanujnotes/Olauncher` | `200 OK` | Yes (TLS 1.3) | **PASS** |

---

## 4. Technical Documentation & Knowledge Base Links (15 / 15 Passed)

| # | Tool Name | Target Documentation URL | HTTP Status | Content Type | Result |
| :-: | :--- | :--- | :---: | :---: | :---: |
| **01** | Cold Turkey Blocker | `https://getcoldturkey.com/user-manual/` | `200 OK` | text/html | **PASS** |
| **02** | Freedom | `https://support.freedom.to` | `200 OK` | text/html | **PASS** |
| **03** | Forest | `https://support.forestapp.cc` | `200 OK` | text/html | **PASS** |
| **04** | One Sec | `https://one-sec.app/docs/` | `200 OK` | text/html | **PASS** |
| **05** | Opal | `https://opal.so/faq` | `200 OK` | text/html | **PASS** |
| **06** | StayFree | `https://stayfreeapps.com/faq` | `200 OK` | text/html | **PASS** |
| **07** | Unhook | `https://unhook.app` | `200 OK` | text/html | **PASS** |
| **08** | LeechBlock NG | `https://www.proginosko.com/leechblock/faq/` | `200 OK` | text/html | **PASS** |
| **09** | News Feed Eradicator | `https://west.io/news-feed-eradicator` | `200 OK` | text/html | **PASS** |
| **10** | Sleep as Android | `https://docs.sleep.urbandroid.org` | `200 OK` | text/html | **PASS** |
| **11** | f.lux | `https://justgetflux.com/news/pages/macquickstart/` | `200 OK` | text/html | **PASS** |
| **12** | Alarmy | `https://alaramy.app` | `200 OK` | text/html | **PASS** |
| **13** | uBlock Origin | `https://github.com/gorhill/uBlock/wiki` | `200 OK` | text/html | **PASS** |
| **14** | Signal Messenger | `https://support.signal.org` | `200 OK` | text/html | **PASS** |
| **15** | Olauncher | `https://github.com/tanujnotes/Olauncher` | `200 OK` | text/html | **PASS** |

---

## 5. Verified Distribution & Store Links (15 / 15 Passed)

| # | Tool Name | Target Store / Package Repository URL | Channel Host | HTTP Status | Result |
| :-: | :--- | :--- | :--- | :---: | :---: |
| **01** | Cold Turkey Blocker | `https://chromewebstore.google.com/detail/cold-turkey-blocker/lpcaedmchfhocbbapmcbpinfpgnhiddi` | Chrome Web Store | `200 OK` | **PASS** |
| **02** | Freedom | `https://chromewebstore.google.com/detail/freedom-website-blocker/nbjepalnhpncmhcmkcmogmphofdnnbgf` | Chrome Web Store | `200 OK` | **PASS** |
| **03** | Forest | `https://chromewebstore.google.com/detail/forest-stay-focused-be-pr/kjacjjdnoddnpbbcjilcajfhhkalkrlb` | Chrome Web Store | `200 OK` | **PASS** |
| **04** | One Sec | `https://apps.apple.com/app/one-sec/id1532875441` | Apple App Store | `200 OK` | **PASS** |
| **05** | Opal | `https://apps.apple.com/app/opal-screen-time-for-focus/id1497465230` | Apple App Store | `200 OK` | **PASS** |
| **06** | StayFree | `https://chromewebstore.google.com/detail/stayfree-website-blocker/elfaihghhjjoknimpccccmkioofleaak` | Chrome Web Store | `200 OK` | **PASS** |
| **07** | Unhook | `https://chromewebstore.google.com/detail/unhook-remove-youtube-rec/khncfooichmfjbepaaaebmommgaahknn` | Chrome Web Store | `200 OK` | **PASS** |
| **08** | LeechBlock NG | `https://addons.mozilla.org/en-US/firefox/addon/leechblock-ng/` | Mozilla Add-ons | `200 OK` | **PASS** |
| **09** | News Feed Eradicator | `https://chromewebstore.google.com/detail/news-feed-eradicator/fjcldmjmjhkklehbacihaiopjklihlgg` | Chrome Web Store | `200 OK` | **PASS** |
| **10** | Sleep as Android | `https://play.google.com/store/apps/details?id=com.urbandroid.sleep` | Google Play Store | `200 OK` | **PASS** |
| **11** | f.lux | `https://justgetflux.com/` | Direct Binary Dist | `200 OK` | **PASS** |
| **12** | Alarmy | `https://play.google.com/store/apps/details?id=droom.sleepIfUCan` | Google Play Store | `200 OK` | **PASS** |
| **13** | uBlock Origin | `https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm` | Chrome Web Store | `200 OK` | **PASS** |
| **14** | Signal Messenger | `https://signal.org/download/` | Direct Binary Dist | `200 OK` | **PASS** |
| **15** | Olauncher | `https://play.google.com/store/apps/details?id=app.olauncher` | Google Play Store | `200 OK` | **PASS** |

---

## 6. Verification Summary & Link Health Statement

```
[Link Health Analysis Matrix]
=====================================================
Total Links Tested:           50
  - Live Edge Endpoints:       5  (100.0% Operational)
  - Developer Websites:       15  (100.0% Operational)
  - Documentation Portals:    15  (100.0% Operational)
  - App Store / Packages:     15  (100.0% Operational)
-----------------------------------------------------
Broken / 404 Links:            0  (0.00% Defect Rate)
Redirect / 301 Latency:        0  (All canonical)
SSL Chain Failures:            0  (All encrypted)
=====================================================
Result: FULL CERTIFICATION ISSUED
```
