// --- Ubah ke CommonJS ---
const axios = require('axios'); // Import Axios

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        
        // --- Mengganti fetch dengan axios.post ---
        await axios.post(url, {
            chat_id: CHAT_ID, 
            text: message 
        }, {
            // Pengaturan header otomatis oleh axios
            timeout: 10000 // Opsional: Tambahkan timeout
        });
        // ----------------------------------------

        console.log("Telegram message sent successfully.");
    } catch (err) {
        // Axios error handling
        const errorMessage = err.response ? 
            `Axios error ${err.response.status}: ${err.response.data}` : 
            `Axios error: ${err.message}`;
            
        console.error("Gagal kirim Telegram:", errorMessage);
        // Penting: Throw error agar pemanggil tahu ada masalah.
        throw err;
    }
}

// Ekspor dalam format CommonJS
module.exports = { 
    sendTelegramMessage 
};