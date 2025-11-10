// Mengganti 'import website from "../models/website.js";'
const website = require("../models/website.js");

// Mengganti 'import { checkAndSaveDomainStatus } from "./website_service.js";'
// Diasumsikan website_service.js mengekspor fungsi ini dengan module.exports = { checkAndSaveDomainStatus: ... }
const { checkAndSaveDomainStatus } = require("./website_service.js");

const get = async (req, res) => {
  try {
    console.log("aaaaaaaa");
    const data = await website.findAll();
    console.log("data", data);
    res.json({ data: data, message: "success" });
  } catch (error) {
    console.log(error);
    res.json({ data: null, message: error });
  }
};

const test = async (req, res) => {
  try {
    const data = await checkAndSaveDomainStatus();
    res.json({ data: data, message: "success" });
  } catch (error) {
    console.log(error);
    res.json({ data: null, message: error });
  }
};

// Mengganti 'export default { get, test };'
module.exports = {
  get,
  test
};