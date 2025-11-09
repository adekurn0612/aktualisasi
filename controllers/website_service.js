import website from "../models/website.js";
import { sendTelegramMessage } from "./send_telegram.js";
import axios from 'axios';

const getWebsitesToCheck = async () => {
    return await website.findAll(); 
};

export const checkAndSaveDomainStatus = async () => {

    const domains = await getWebsitesToCheck();
    const checkPromises = domains.map(async (d) => {
        const start = Date.now();
        let newStatus = 1; // Default: UP
        let kode = 0;      // Kode HTTP
        let latency = 0.0;
        
        try {
            const response = await axios.head(d.url, { timeout: 5000 });
            latency = Date.now() - start;
            kode = response.status;

            // Anggap UP hanya jika status 2xx
            if (response.status < 200 || response.status >= 300) {
                newStatus = 0; // DOWN
            }

        } catch (error) {
            latency = Date.now() - start;
            newStatus = 0; // DOWN
            kode = error.response ? error.response.status : 503;
        }

        // Kirim notifikasi hanya jika status berubah dari UP ke DOWN
        if (d.status === 1 && newStatus === 0) {
            const message = `⚠️ ${d.name || d.url} sedang DOWN! Status: ${kode}.`;
            sendTelegramMessage(message).catch(err => console.error('Failed to send Telegram:', err));
        }

        // Update record di database
        await website.update({
            status: newStatus,         
            kode: kode,               
            latency: parseFloat(latency).toFixed(2),
            last_checked: new Date()
        }, {
            where: { id: d.id }
        });

        return { name: d.name, status: newStatus ? 'UP' : 'DOWN', kode, latency };
    });

    const results = await Promise.all(checkPromises);
    console.log(`[${new Date().toISOString()}] Website check finished.`);
    return 
};
