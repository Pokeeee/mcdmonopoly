# PlayAtMCD + Gmail Auto-Verify Userscript

This userscript automates email verification and landing page interactions for AMOE McDonalds Monopoly and adds Gmail integration for auto-verifying OTP codes.
Script made with vibes <3

---

## Features

### Gmail
- Automatically expands trimmed email content.
- Adds a persistent **Auto-Verify Links** button to Gmail.
- Opens PlayAtMCD verify links with OTP codes appended directly.

### PlayAtMCD Landing Page
- Autofills your email once typed (stored locally in `localStorage`).
- Checks all checkboxes automatically.
- Attempts to click reCAPTCHA checkbox, or focuses it for manual solving.

### PlayAtMCD Verification Page
- Automatically pastes OTP codes from the URL hash.
- Clicks the **Verify & Continue** button.
- Adds a manual **Paste OTP** button as a fallback.

---

## Notes

- The script does **not bypass or solve CAPTCHA** — it only focuses the CAPTCHA and attempts a safe click.
- Email is stored **locally in your browser** (localStorage), not sent anywhere.
- Works with Gmail web interface and PlayAtMCD pages.

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Click the **`+`** button in Tampermonkey to create a new script.
3. Copy the full userscript code into the editor.
4. Save the script and ensure it is enabled.

---

## Usage

1. **Gmail:**
   - Open an email containing a PlayAtMCD verification link.
   - Click the **Auto-Verify Links** button added by the script.
   - Links will open in new tabs with OTP codes appended.

2. **PlayAtMCD Landing Page:**
   - Enter your email when prompted (saved locally for future visits).
   - Both checkboxes will be checked automatically.
   - reCAPTCHA will be focused (auto-click attempted if possible).

3. **PlayAtMCD Verification Page:**
   - The OTP code will be pasted automatically from the URL hash.
   - **Verify & Continue** will be clicked automatically.
   - Manual **Paste OTP** button is available as fallback.

---

## License

MIT License. Free to use, modify, and share.

---

## Authors

**Pokeeee** and **Jade**
