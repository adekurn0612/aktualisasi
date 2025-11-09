import website from "../models/website.js";

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

export default {
  get,
};