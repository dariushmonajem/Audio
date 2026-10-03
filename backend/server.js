const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 5000;

// ========== Middleware ==========
app.use(cors());
app.use(express.json());

// ========== پوشه خروجی ==========
const OUTPUT_DIR = path.join(__dirname, 'outputs');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// ========== مسیر اصلی ==========
app.get('/', (req, res) => {
    res.send('✅ Server is running! Use POST /convert');
});

// ========== API تبدیل ==========
app.post('/convert', (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'متن رو وارد کن' });
    }

    
    const cleanedText = text.replace(/\n+/g, ' ').replace(/\r+/g, ' ');
    // ========== مسیر فایل‌ها ==========
    const inputFile = path.join(OUTPUT_DIR, 'input.txt');
    const outputFile = path.join(OUTPUT_DIR, 'output.wav');

    // ========== ذخیره متن در فایل ==========
    fs.writeFileSync(inputFile,cleanedText, 'utf-8');

    // ========== مسیر worker.py ==========
    const workerPath = path.join(__dirname, '../worker/worker.py');

    // ========== اجرای worker با آرگومان‌های درست ==========
    const command = `python "${workerPath}" "${inputFile}" "${outputFile}"`;

    console.log(`⏳ Running: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error:', stderr);
            return res.status(500).json({ error: 'خطا در تبدیل: ' + stderr });
        }

        // ========== چک کردن فایل خروجی ==========
        if (!fs.existsSync(outputFile)) {
            return res.status(500).json({ error: 'فایل صوتی ساخته نشد' });
        }

        // ========== ارسال فایل به کاربر ==========
        res.sendFile(outputFile, (err) => {
            if (err) {
                console.error('❌ Error sending file:', err);
                return res.status(500).json({ error: 'خطا در ارسال فایل' });
            }

            // ========== (اختیاری) پاک کردن فایل‌های موقت ==========
            // fs.unlinkSync(inputFile);
            // fs.unlinkSync(outputFile);
        });
    });
});

// ========== اجرا ==========
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Output folder: ${OUTPUT_DIR}`);
});
