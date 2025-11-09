// const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; // Ambil dari .env
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.CHAT_ID

export async function sendTelegramMessage(message) {
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