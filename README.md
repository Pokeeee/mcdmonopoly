# 📨 Gmail + PlayAtMCD Full Auto-Verify  

_A Tampermonkey userscript that automates McDonald’s Monopoly (“PlayAtMCD”) email verification links and OTP entry._

![License](https://img.shields.io/badge/license-MIT-green)
![Tampermonkey](https://img.shields.io/badge/Userscript-Tampermonkey-blue)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)
![Status](https://img.shields.io/badge/status-Active-success)

---

## 📸 Preview

| Gmail Button | Auto Verify in Action |
|---------------|----------------------|
| ![Gmail Button Screenshot](https://via.placeholder.com/400x220?text=Auto-Verify+Button+in+Gmail) | ![Verification Screenshot](https://via.placeholder.com/400x220?text=OTP+Auto-Filled+and+Submitted) |

---

## ✨ Overview

This userscript bridges **Gmail** and **PlayAtMCD** by automatically opening verification links and completing OTP verification for you.

When installed in **Tampermonkey**, the script:

- Adds an **“Auto-Verify Links”** button in Gmail  
- Scans your opened emails for McDonald’s Monopoly verification URLs  
- Opens each verification link (with the OTP code appended) in new tabs  
- Automatically pastes the 6-digit OTP and clicks **Verify & Continue** on the McDonald’s page  

> “Opens the links and pastes the codes and moves you onto the information page.”  

---

## ⚙️ Features

✅ **Automatic link detection** — Finds all `https://amoe.playatmcd.com/verify_your_email` links in Gmail  
✅ **OTP extraction** — Reads 6-digit codes directly from the email body  
✅ **Batch opening** — Opens up to 20 verification pages at once  
✅ **One-click Gmail button** — Floating persistent “Auto-Verify Links” button  
✅ **Auto-fill + submit** — Pastes OTP into the PlayAtMCD page and clicks “Verify & Continue”  
✅ **Manual fallback** — Adds “Paste OTP” button if the auto-flow doesn’t trigger  

---

## ⚠️ Disclaimer

⚠️ Use responsibly — automating interactions may violate third-party terms of service.
🧪 For educational or research purposes only.
💥 “100% vibecoded” — quick-and-dirty automation; expect minor quirks.

---

## 👨‍💻 Author

Pokeeee
GitHub: @Pokeeee
