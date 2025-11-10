// Mengganti 'import website from "../models/website.js";'
const website = require("../models/website.js");

// Mengganti 'import { sendTelegramMessage } from "./send_telegram.js";'
// Diasumsikan send_telegram.js mengekspor fungsi tersebut sebagai { sendTelegramMessage: ... }
const { sendTelegramMessage } = require("./send_telegram.js");

// Mengganti 'import axios from 'axios';'
const axios = require('axios');

const getWebsitesToCheck = async () => {
    return await website.findAll();
};

// Mengganti 'export const checkAndSaveDomainStatus = async () => { ... }'
// Kita harus mengekspor function ini secara eksplisit.

const checkAndSaveDomainStatus = async () => {

    const domains = await getWebsitesToCheck();
    const checkPromises = domains.map(async (d) => {
        const start = Date.now();
        let newStatus = 1; // Default: UP
        let kode = 0;       // Kode HTTP
        let latency = 0.0;

        try {
            // timeout harus dalam milidetik
            let config = {
                method: 'head',
                maxBodyLength: Infinity,
                url: d.url,
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'
                }
            };

            const response = await axios.request(config)
            latency = Date.now() - start;
            kode = response.status;

            // Anggap UP hanya jika status 2xx
            if (response.status < 200 || response.status >= 300) {
                newStatus = 0; // DOWN
            }

        } catch (error) {
            latency = Date.now() - start;
            newStatus = 0; // DOWN
            // Gunakan 503 jika error tidak memiliki response (misalnya timeout, DNS error)
            kode = error.response ? error.response.status : 503;
        }
        if (d.status !== newStatus) {
            // Kirim notifikasi hanya jika status berubah dari UP ke DOWN
            if (d.status === 1 && newStatus === 0) {
                const message = `⚠️ ${d.name || d.url} sedang DOWN! Status: ${kode}.`;
                // Pastikan error handling di sini juga menggunakan CommonJS jika sendTelegramMessage
                // bergantung pada modul internal lain. Log errornya akan terlihat di stderr.log
                sendTelegramMessage(message).catch(err => console.error('Failed to send Telegram:', err));
            }
            else if (d.status === 0 && newStatus === 1) {
                const message = `✅ ${d.name || d.url} sedang Kembali Online!`;
                // Pastikan error handling di sini juga menggunakan CommonJS jika sendTelegramMessage
                // bergantung pada modul internal lain. Log errornya akan terlihat di stderr.log
                sendTelegramMessage(message).catch(err => console.error('Failed to send Telegram:', err));
            }

            // Update record di database
            await website.update({
                status: newStatus,
                code: kode,
                // Pastikan latency disimpan sebagai string/number yang sesuai di DB
                latency: parseFloat(latency).toFixed(2),
                last_checked: new Date()
            }, {
                where: { id: d.id }
            });

            return { name: d.name, status: newStatus ? 'UP' : 'DOWN', kode, latency };
        }
    });

    const results = await Promise.all(checkPromises);
    console.log(`[${new Date().toISOString()}] Website check finished.`);
    return results; // Mengembalikan hasil check
};

// Ekspor function ini agar bisa dipanggil dari app.js (atau file scheduler)
module.exports = {
    checkAndSaveDomainStatus
};