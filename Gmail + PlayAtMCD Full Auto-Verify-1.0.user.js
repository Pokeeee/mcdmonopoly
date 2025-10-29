// ==UserScript==
// @name         Gmail + PlayAtMCD Full Auto-Verify
// @namespace    https://example.local/
// @version      1.0
// @description  Gmail button opens verify links with codes; verify page pastes OTP and clicks Verify & Continue
// @match        https://mail.google.com/*
// @match        https://amoe.playatmcd.com/verify_your_email*
// @grant        GM_openInTab
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const sleep = ms => new Promise(res => setTimeout(res, ms));

    // ---------- Gmail Part ----------
    if (location.hostname === 'mail.google.com') {
        const BUTTON_ID = 'autoVerifyPersistentBtn';
        const OPEN_IN_BACKGROUND = true;
        const MAX_OPEN = 20;

        function findSixDigitCode(container) {
            if (!container) return null;
            const text = container.innerText || '';
            const m = text.match(/\b\d{6}\b/);
            return m ? m[0] : null;
        }

        function openVerificationLinks() {
            const anchors = [...document.querySelectorAll('div.a3s a')];
            const verifyLinks = anchors.filter(a => a.href && a.href.startsWith('https://amoe.playatmcd.com/verify_your_email'));
            if (!verifyLinks.length) {
                alert('No verification links found in this email.');
                return;
            }

            let opened = 0;
            for (const a of verifyLinks) {
                if (opened >= MAX_OPEN) break;
                const container = a.closest('div.a3s') || document.body;
                const code = findSixDigitCode(container);
                const url = code ? `${a.href}#${code}` : a.href;
                try { GM_openInTab(url, { active: !OPEN_IN_BACKGROUND }); }
                catch { window.open(url, '_blank'); }
                opened++;
            }
            alert(`Opened ${opened} link(s) with codes appended.`);
        }

        function injectGmailButton() {
            if (document.getElementById(BUTTON_ID)) return;
            const btn = document.createElement('button');
            btn.id = BUTTON_ID;
            btn.innerText = 'Auto‑Verify Links';
            btn.style.position = 'fixed';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            btn.style.zIndex = '2147483647';
            btn.style.padding = '10px 15px';
            btn.style.fontSize = '14px';
            btn.style.borderRadius = '6px';
            btn.style.border = '1px solid rgba(0,0,0,0.2)';
            btn.style.backgroundColor = '#fff';
            btn.style.cursor = 'pointer';
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            btn.addEventListener('click', openVerificationLinks);
            document.body.appendChild(btn);
        }

        const gmailObserver = new MutationObserver(() => {
            if (document.querySelector('div.a3s')) injectGmailButton();
        });
        gmailObserver.observe(document.body, { childList: true, subtree: true });
        injectGmailButton();
        return;
    }

    // ---------- Verification Page Part ----------
    if (location.hostname === 'amoe.playatmcd.com') {

        function pasteOTP() {
            const code = (location.hash || '').replace('#','').trim();
            if (!/^\d{6}$/.test(code)) return false;

            const input = document.getElementById('otp');
            if (!input) return false;

            input.focus();
            const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
            nativeSetter.call(input, code);
            input.dispatchEvent(new Event('input',{bubbles:true}));
            input.dispatchEvent(new Event('change',{bubbles:true}));
            input.dispatchEvent(new Event('blur',{bubbles:true}));
            console.log('OTP pasted:', code);
            return true;
        }

        function clickVerify() {
            const btn = document.querySelector('#verifyemail_btn button[type="submit"]');
            if (btn) {
                setTimeout(() => btn.click(), 150);
                console.log('Verify & Continue clicked');
                return true;
            }
            return false;
        }

        function handleAutoFlow() {
            if (pasteOTP()) clickVerify();
        }

        // visible fallback button
        const btnManual = document.createElement('button');
        btnManual.innerText = 'Paste OTP';
        btnManual.style.position = 'fixed';
        btnManual.style.top = '20px';
        btnManual.style.right = '20px';
        btnManual.style.zIndex = '99999';
        btnManual.style.padding = '10px 15px';
        btnManual.style.fontSize = '14px';
        btnManual.style.borderRadius = '6px';
        btnManual.style.border = '1px solid rgba(0,0,0,0.2)';
        btnManual.style.backgroundColor = '#4CAF50';
        btnManual.style.color = '#fff';
        btnManual.style.cursor = 'pointer';
        btnManual.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btnManual.addEventListener('click', handleAutoFlow);
        document.body.appendChild(btnManual);

        // MutationObserver to detect Verify button appearing dynamically
        const observer = new MutationObserver(() => {
            const verifyBtn = document.querySelector('#verifyemail_btn button[type="submit"]');
            if (verifyBtn) {
                handleAutoFlow();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList:true, subtree:true });

        window.addEventListener('load', ()=> setTimeout(handleAutoFlow, 300));
    }

})();
