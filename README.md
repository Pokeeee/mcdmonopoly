📨 Gmail + PlayAtMCD Full Auto-Verify

A Tampermonkey userscript that automates McDonald’s Monopoly AMOE email verification links and OTP entry.

✨ Overview

This userscript bridges Gmail and PlayAtMCD by automatically opening verification links and completing OTP verification for you.

When installed in Tampermonkey, the script:

Adds an “Auto-Verify Links” button in Gmail

Scans your opened emails for McDonald’s Monopoly verification URLs

Opens each verification link (with the code appended) in new tabs

Automatically pastes the 6-digit OTP and clicks Verify & Continue on the McDonald’s page

⚙️ Features

✅ Automatic link detection — Finds all https://amoe.playatmcd.com/verify_your_email links in your Gmail messages
✅ OTP extraction — Reads 6-digit codes directly from the email text
✅ Batch opening — Opens up to 20 verification pages at once
✅ One-click Gmail button — Persistent floating button for convenience
✅ Auto-fill + submit — Puts the OTP into the PlayAtMCD input field and triggers verification
✅ Manual fallback — “Paste OTP” button appears on the verification page in case auto-flow fails

🧩 Installation

Install Tampermonkey

Tampermonkey for Chrome

Tampermonkey for Firefox

Add the script

Open Tampermonkey’s dashboard → “Create a new script”

Paste the full contents of Gmail + PlayAtMCD Full Auto-Verify.user.js

Save ✅

Permissions
The script requires:

// @match https://mail.google.com/*
// @match https://amoe.playatmcd.com/verify_your_email*
// @grant  GM_openInTab


Use it

Open a Gmail message containing your PlayAtMCD verification links.

Click Auto-Verify Links (bottom-right corner).

The script will open all verification pages and auto-paste your OTP codes.

💻 How It Works
In Gmail

Detects email bodies (div.a3s) and finds all PlayAtMCD verification URLs.

Extracts nearby 6-digit codes via regex (/\b\d{6}\b/).

Opens each link in a background tab with the code appended as a URL hash.

On PlayAtMCD

Waits for the OTP input (#otp) to load.

Reads the code from the hash (e.g., #123456).

Fills in the OTP, triggers input events, and clicks the Verify & Continue button.

If automatic flow fails, you can manually click the Paste OTP button added to the page.

🧠 Code Snippet Example
const m = text.match(/\b\d{6}\b/);
if (m) {
    const url = `${a.href}#${m[0]}`;
    GM_openInTab(url, { active: false });
}


This logic extracts a 6-digit code and opens each link with the code appended.

⚠️ Notes & Disclaimers

⚠️ Use responsibly — Automating interactions on third-party sites may violate their terms.

🧪 This is provided for educational purposes only.

🔧 The PlayAtMCD site layout may change, requiring updates to selectors.

💥 “100 % vibecoded” — expect occasional breaks or race-conditions on slow networks.

🐛 Troubleshooting
Issue	Fix
No Gmail button visible	Refresh Gmail or open a specific email view.
OTP not pasting	Ensure the code is appended in the URL (#123456).
“Verify” not clicked	Verify the button selector hasn’t changed (#verifyemail_btn button[type="submit"]).
Multiple Gmail accounts	Only the active inbox tab is scanned.
🧾 License

This project is licensed under the MIT License — see LICENSE
 for details.

👨‍💻 Author

Pokeeee
GitHub: @Pokeeee
<img width="1509" height="774" alt="image" src="https://github.com/user-attachments/assets/6116f1fb-43c4-4bba-97df-25a8c5970bbb" />
