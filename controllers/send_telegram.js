// Import 'node-fetch' sebagai fallback atau solusi universal
// Hapus baris ini jika Node.js di server Anda sudah mendukung global fetch
const fetch = require('node-fetch'); 

// Tidak perlu impor dotenv jika sudah dipanggil di app.js
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.CHAT_ID

async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
        });
        console.log("Telegram message sent successfully.");
    } catch (err) {
        console.error("Gagal kirim Telegram:", err);
        // Penting: Throw error agar pemanggil tahu ada masalah.
        throw err;
    }
}

// Mengganti 'export async function sendTelegramMessage'
// Ekspor fungsi ini dalam bentuk objek agar bisa diakses dengan destructuring
module.exports = { 
    sendTelegramMessage 
};