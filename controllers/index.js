import website from "../models/website.js";
import { checkAndSaveDomainStatus } from "./website_service.js";

const get = async (req, res) => {
  try {
    console.log("aaaaaaaa");
    const data = await  website.findAll();
    console.log("data" , data);
    res.json({data : data, message : "success"})
  } catch (error) {
    console.log(error);
    res.json({data : null , message : error})
  }
};

const test = async (req, res) => {
  try {
    const data = await  checkAndSaveDomainStatus()
    res.json({data : data, message : "success"})
  } catch (error) {
    console.log(error);
    res.json({data : null , message : error})
  }
};


export default {
  get,
  test
};