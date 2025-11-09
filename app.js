import Express  from "express";
import "dotenv/config";
import router from "./routers/index.js";
import morgan from "morgan";
import cors from "cors"
import { DB } from "./config/connections.js";
import { checkAndSaveDomainStatus } from "./controllers/website_service.js";
import cron from 'node-cron';

const app = Express();

const port = process.env.PORT;

app.use(Express.json());
app.get("/about", (req, res) => {
    res.send("This is the about page.");
  });

app.use(Express.urlencoded({ extended: true }));
app.use(cors())
app.use(router);
app.use(morgan("dev"));

const scheduleWebsiteChecker = () => {
    cron.schedule(process.env.CRON, checkAndSaveDomainStatus, {
        scheduled: true,
        timezone: "Asia/Jakarta" 
    });

    console.log('⏰ Website checker scheduled to run now');
};

app.listen(port,async ()=>{
  console.log(`Active in port ${port}`)
  try {
      await DB.authenticate();
      console.log('Database OK');
    //   scheduleWebsiteChecker();
  } catch (error) {
      console.error('Database Error',error);
  }
})