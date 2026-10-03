const textInput = document.getElementById('textInput');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const statusDiv = document.getElementById('status');
const audioContainer = document.getElementById('audioContainer');
const audioPlayer = document.getElementById('audioPlayer');
const downloadLink = document.getElementById('downloadLink');
// المنت‌های آپلود
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
// آدرس بک‌اند (آفلاین)
const API_URL = 'http://localhost:5000/convert';
// ==========================================
// 📤 آپلود فایل PDF
// ==========================================
uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
        uploadStatus.textContent = '❌ لطفاً یک فایل انتخاب کنید';
        uploadStatus.className = 'status error';
        return;
    }

    uploadBtn.disabled = true;
    uploadStatus.textContent = '⏳ در حال آپلود و پردازش...';
    uploadStatus.className = 'status loading';

    const formData = new FormData();
    formData.append('pdf', file);

    try {
        const response = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'خطا در آپلود');
        }

        uploadStatus.textContent = `✅ فایل "${result.fileName}" با موفقیت پردازش شد. ${result.textLength} کاراکتر استخراج شد.`;
        uploadStatus.className = 'status success';

        // قرار دادن متن استخراج شده در textarea
        textInput.value = result.textPreview;

    } catch (error) {
        uploadStatus.textContent = '❌ خطا: ' + error.message;
        uploadStatus.className = 'status error';
        console.error(error);
    } finally {
        uploadBtn.disabled = false;
    }
});
// ==========================================
// 📡 تابع تبدیل متن به صدا
// ==========================================
async function convertTextToSpeech() {
    const text = textInput.value.trim();

    if (!text) {
        setStatus('لطفاً متن را وارد کنید.', 'error');
        return;
    }

    // غیرفعال کردن دکمه
    convertBtn.disabled = true;
    convertBtn.textContent = '⏳ در حال تبدیل...';
    setStatus('در حال پردازش، لطفاً صبر کنید...', 'loading');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'خطا در تبدیل');
        }

        // دریافت فایل صوتی
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        // نمایش پلیر
        audioPlayer.src = audioUrl;
        audioPlayer.load();

        // تنظیم لینک دانلود
        downloadLink.href = audioUrl;

        audioContainer.style.display = 'block';

        setStatus('✅ تبدیل با موفقیت انجام شد!', 'success');

    } catch (error) {
        console.error('❌ خطا:', error);
        setStatus(`❌ خطا: ${error.message}`, 'error');
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = '🔊 تبدیل به صدا';
    }
}

// ==========================================
// 🧹 پاک کردن فرم
// ==========================================
function clearForm() {
    textInput.value = '';
    audioContainer.style.display = 'none';
    audioPlayer.src = '';
    downloadLink.href = '';
    setStatus('', '');
}

// ==========================================
// 📢 وضعیت
// ==========================================
function setStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status';
    if (type) {
        statusDiv.classList.add(type);
    }
}

// ==========================================
// 🎯 رویدادها
// ==========================================
convertBtn.addEventListener('click', convertTextToSpeech);
clearBtn.addEventListener('click', clearForm);

// Enter در textarea (Shift+Enter برای خط جدید)
textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        convertTextToSpeech();
    }
});

// ==========================================

// اجرا
convertTextToSpeech();