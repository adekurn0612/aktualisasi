// --- IMPORTS MENGGUNAKAN REQUIRE ---

// Mengganti import Express from "express";
const Express = require("express"); 
const express = Express; // Alias Express

// Mengganti import "dotenv/config";
// Kita perlu panggil .config() secara eksplisit
require("dotenv").config();

// Mengganti import router from "./routers/index.js";
const router = require("./routers/index");

// Mengganti import cors from "cors"
const cors = require("cors");

// Mengganti import { DB } from "./config/connections.js";
const { DB } = require("./config/connections");

// Mengganti import { checkAndSaveDomainStatus } from "./controllers/website_service.js";
const { checkAndSaveDomainStatus } = require("./controllers/website_service");

// Mengganti import cron from 'node-cron';
const cron = require('node-cron');


// --- INI ADALAH LOGIKA APLIKASI ---

const app = express(); // Gunakan alias express

// PORT di cPanel harus diambil dari environment variable (process.env.PORT)
// Karena ini CommonJS, kita bisa menggunakan process.env.PORT secara langsung
const port = process.env.PORT;

app.use(express.json());

app.get("/about", (req, res) => {
    res.send("This is the about page.");
});

// PENTING: Response ini hanya ada jika user akses root URL utama domain cPanel, 
// tapi aplikasi Anda di-deploy di sub-path: /api-monitoring-website
app.get("/api-monitoring-website", (req, res) => {
    res.send("API monitoring website root access.");
});

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(router);


const scheduleWebsiteChecker = () => {
    // Pastikan process.env.CRON tersedia dan valid
    cron.schedule(process.env.CRON ||"5 * * * *", checkAndSaveDomainStatus, {
        scheduled: true,
        timezone: "Asia/Jakarta" 
    });

    console.log('⏰ Website checker scheduled to run now');
};


app.listen(port, async () => {
    // Di cPanel, port sudah disuplai dari lingkungan.
    console.log(`Active in port ${port}`)
    try {
        await DB.authenticate();
        console.log('Database OK');
        // scheduleWebsiteChecker();
    } catch (error) {
        // Logging error agar terlihat di stderr.log
        console.error('Database Error', error);
    }
});