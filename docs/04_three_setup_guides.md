# Practical Student Setup Guides & Implementation Protocols

**Project:** Digital Wellness Hub  
**Author:** Yash Khedekar  
**Standard:** Actionable Cognitive Engineering & Behavioural Design  
**Date of Release:** November 16, 2026  

---

## Guide 1: Privacy-First Digital Detox Setup

* **Category:** Privacy & Digital Hygiene  
* **Target Platforms:** Windows, macOS, Android, iOS, Chrome, Firefox  
* **Estimated Execution Time:** 10 Minutes  
* **Difficulty Level:** Intermediate  
* **Tutorial Video Reference:** [Signal Protocol & Hardened Browser Walkthrough](https://www.youtube-nocookie.com/embed/6Zox48-P69A)  

### Architectural Objective
Surveillance capitalism operates on micro-nudges: telemetry pipelines continuously log student behavioral patterns to serve algorithmic ads that derail academic focus. This protocol strips telemetry, silences ad banners, and establishes an airtight private communications channel.

```
[Student Device] ───(Zero-Telemetry)───> [Signal E2EE]
       │
       ├───> [Olauncher / Minimal Homescreen] (Kill Visual Dopamine Triggers)
       ├───> [uBlock Origin Cosmetic Filtering] (Zap Retargeting Banners)
       └───> [Cold Turkey Kernel Sandbox] (Hard Stop Procrastination Sprints)
```

### Action Steps

#### Step 1: Deploy Signal Messenger for Academic Collaboration
* **Execution:** Navigate to [signal.org/download](https://signal.org/download/) and install the mobile client alongside the native desktop application. On Android devices, configure Signal as the primary default messaging handler.
* **Security Hardening:** Open `Settings > Privacy`. Set **Default Timer for New Chats** to `1 Week`. Turn on **Registration Lock** and PIN protection. Create a private chat with **"Note to Self"** to bookmark lecture voice memos, syllabus notes, and exam schedules without syncing to cloud databases.
* > **Pro Tip:** Disappearing messages ensure that shared mock exams, peer reviews, and private study queries are permanently expunged from all client endpoints, eliminating digital clutter and privacy liability.

#### Step 2: Transition to a Minimal Text Launcher (Android)
* **Execution:** Download **Olauncher** from Google Play Store or F-Droid. Open `Settings > Apps > Default Apps > Home App` and choose **Olauncher**.
* **Configuration:** Long-press the home screen, access settings, and disable all app icon graphics. Select 4 essential non-distracting utilities for the text launcher (e.g., *Canvas LMS*, *Calendar*, *Camera*, *Notes*). Remove all social media icons from the active desktop.
* > **Pro Tip:** Brain scanning studies confirm that vibrant saturated app icons (e.g., Instagram pink or TikTok cyan) activate subconscious dopamine anticipations. Converting home screen elements to plain white text reduces impulsive device unlocks by upwards of 40%.

#### Step 3: Configure uBlock Origin with Aggressive Cosmetic Filtering
* **Execution:** Install **uBlock Origin** from the official browser web store. Open the dashboard by clicking the extension shield and selecting the gear icon.
* **Filter Configuration:** Enable the following filter subscriptions:
  * `uBlock filters – Annoyances`
  * `EasyList/Cookie Notices`
  * `Fanboy's Social Blocking List`
* **Custom Element Zapping:** Open your university student portal and any heavy research sites (e.g., news outlets, academic blogs). Click the uBlock icon, select the **Element Picker (dropper icon)**, click directly on distracting recommended articles or footer banners, and click **Create** to purge them forever.
* > **Pro Tip:** uBlock Origin runs directly in WebAssembly/native browser memory; unlike commercial adblockers, it consumes near-zero CPU cycles and prevents browser tab bloat.

#### Step 4: Configure Cold Turkey Blocker with Locked Pomodoros
* **Execution:** Download Cold Turkey from [getcoldturkey.com](https://getcoldturkey.com). Define a new Block List titled **"Academic Sprint"**. Add your top distraction portals (`reddit.com`, `x.com`, `discord.com`, `twitch.tv`, `netflix.com`).
* **Lock Engagement:** Select a 90-minute block timer. Toggle **Lock Mode** on.
* > **Pro Tip:** Cold Turkey injects network filter drivers at the OS kernel level. Once locked, task managers cannot terminate the process, nor will restarting your PC lift the block until the clock expires.

#### Step 5: Configure OS Focus Filters
* **Execution (Windows):** `Settings > System > Focus > Start Focus Session`. Set duration to 90 minutes; suppress all desktop notifications; activate background ambient sound.
* **Execution (macOS):** `System Settings > Focus > Work`. Configure allowed exceptions: whitelist immediate family and professors; mute all group chats.

### Expected Outcome
A clean, hardened study station devoid of tracker telemetry, devoid of visually captivating app icons, and fortified against internet distraction loopholes.

---

## Guide 2: Deep Work Focus Station Setup

* **Category:** Focus Blockers & Browser Extensions  
* **Target Platforms:** Windows, macOS, Chrome, Firefox, Edge, Brave  
* **Estimated Execution Time:** 7 Minutes  
* **Difficulty Level:** Beginner  
* **Tutorial Video Reference:** [Unhook & Distraction Elimination Demo](https://www.youtube-nocookie.com/embed/9Tp9wot_Hy4)  

### Architectural Objective
Students frequently depend on YouTube for recorded lectures and coding tutorials, but the platform's recommendation algorithms actively trap viewers in entertainment spirals. This setup transforms YouTube and web browsers into distraction-free reference libraries.

### Action Steps

#### Step 1: Install Unhook to Clean YouTube
* **Execution:** Add **Unhook – Remove YouTube Recommendations** from the Chrome Web Store or Firefox Add-ons.
* **Filter Setup:** Open YouTube in a new tab. Click the Unhook extension icon in the toolbar. Check the following switches:
  * `Hide Home Feed` (Eliminates the infinite home screen grid)
  * `Hide Recommended Sidebar` (Eliminates algorithmic rabbit holes during video playback)
  * `Hide Comments` (Prevents flame wars and debate reading)
  * `Hide Shorts Tab` (Stops short-form dopamine doomscrolling)
  * `Hide Trending & Subscriptions Bar`
* > **Pro Tip:** When you open YouTube with Unhook fully engaged, you are greeted with a serene, blank white screen containing *only* the search bar. You search for what you need, watch the lecture, and exit without peripheral distraction.

#### Step 2: Deploy LeechBlock NG for Time-Banking
* **Execution:** Install **LeechBlock NG** on your primary browser.
* **Configuration:** Create **Block Set 1** titled "Passive Browsing". Enter sites: `news.ycombinator.com, instagram.com, facebook.com`.
* **Allowance Setting:** Configure the block rule to: **"Allow 10 minutes every 2 hours between 08:00 and 18:00"**.
* > **Pro Tip:** Absolute bans can trigger psychological rebound cravings. Time-banking provides a rigid 10-minute micro-break allowance that automatically shuts down once consumed, teaching self-regulation.

#### Step 3: Implement News Feed Eradicator
* **Execution:** Add **News Feed Eradicator** to desktop Chrome or Firefox.
* **Configuration:** Toggle on blockers for LinkedIn, Reddit, Twitter, and YouTube.
* > **Pro Tip:** Instead of an endless feed, the extension renders an inspiring philosophical quote (Marcus Aurelius, Seneca, Epictetus) to re-center attention on what truly matters.

#### Step 4: Enforce Physical Ergonomics and Focus Assist
* **Execution:** Pin active browser tabs to split-screen (e.g., lecture video left 50%, digital notebook right 50%). Enable full-screen mode (`F11` on Windows / `Ctrl+Cmd+F` on macOS) to hide OS taskbars and clock distractions.

### Key Takeaways
* YouTube is converted from an entertainment pitfall into an academic reference library.
* Accidental browsing triggers are neutralized before cognitive stamina is depleted.
* Screen real estate is reserved solely for primary study materials.

---

## Guide 3: Circadian Bedtime Wind-Down & Phone Detox

* **Category:** Bedtime & Sleep Hygiene  
* **Target Platforms:** Android, iOS  
* **Estimated Execution Time:** 8 Minutes  
* **Difficulty Level:** Beginner  
* **Tutorial Video Reference:** [Circadian Sleep & Alarmy Protocol](https://www.youtube-nocookie.com/embed/HyUTqNtuQpI)  

### Architectural Objective
Pre-bedtime blue-light exposure delays natural melatonin secretion by 90 minutes or more, fragmenting REM cycles and crippling memory consolidation. This protocol enforces biological sleep alignment through hardware color temperature shifts and captive spatial barriers.

```
[18:00 - Sunset] ───> [f.lux / Night Shift: 2700K Warm Shift]
       │
[22:30 - T-45m]  ───> [Automated Bedtime Mode: Greyscale + Mute]
       │
[23:15 - Bed]    ───> [3-Meter Physical Phone Exclusion Zone]
       │
[07:00 - Wake]   ───> [Alarmy Captive QR Scan: Bathroom Sink]
```

### Action Steps

#### Step 1: Schedule Automated Sunset Display Filtration
* **Execution (iOS):** `Settings > Display & Brightness > Night Shift`. Enable **Scheduled** and select **Sunset to Sunrise**. Drag the color slider to **"More Warm" (amber/orange spectrum)**.
* **Execution (Android):** `Settings > Display > Eye Comfort Shield / Night Light`. Enable **Turn on automatically at sunset**. Increase warmth to 80%+.
* **Desktop Pair:** Install **f.lux** on your laptop. Input your local geographical coordinates. Allow f.lux to calculate solar angles and automatically tint the display to 2700K (candlelight spectrum) as night falls.
* > **Pro Tip:** Short-wavelength blue light (450–480 nm) directly stimulates intrinsically photosensitive retinal ganglion cells (ipRGCs), tricking your suprachiasmatic nucleus into believing it is noon. Warm amber hues preserve melatonin synthesis.

#### Step 2: Configure Bedtime Sleep Automations
* **Execution:** Open **Focus / Digital Wellbeing**. Schedule **Bedtime Mode / Sleep Focus** to activate 45 minutes prior to your target lights-out (e.g., 22:30).
* **Display Hardening:** Enable **Greyscale (monochrome mode)** and **Dim Wallpaper**. Greyscale converts vibrant video feeds into drab grey boxes, rendering TikTok and Instagram visually unappealing.
* **Safety Whitelisting:** Under allowed notifications, toggle **"Allow Repeated Calls"** on. If an immediate relative calls twice in 3 minutes for an emergency, the phone will bypass Do Not Disturb.

#### Step 3: Establish the 3-Meter Physical Exclusion Zone
* **Execution:** Relocate your phone charger away from your bedside table. Anchor it to a desk, shelf, or dresser at least 3 meters away from your pillow.
* > **Pro Tip:** Human behavioral inertia means that if a device is within arm's reach, any midnight awakening or insomnia spike will result in immediate screen checking. Forcing your body to physically stand up to touch the device stops nocturnal doomscrolling in its tracks.

#### Step 4: Configure Captive QR-Code Wake-Up Missions
* **Execution:** Install **Alarmy** (iOS/Android) or **Sleep as Android**. Create your standard morning alarm. Under dismissal methods, select **"QR / Barcode Mission"**.
* **Deployment:** Print a standard barcode or use the UPC barcode on your toothpaste tube located by the bathroom sink. Scan this barcode to register it as the dismissal key.
* > **Pro Tip:** When the alarm sounds in the morning, neither snoozing nor lowering the volume is permitted. You must physically stand up, walk out of the bedroom, turn on the bathroom light, and scan the barcode. By the time you do this, sleep inertia has lifted and you are ready to begin your day.

### Expected Outcome
Accelerated sleep onset latency, deeper slow-wave restorative sleep, and the total eradication of morning snooze cycles before morning exams.
