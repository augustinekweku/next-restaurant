import dbConnect from "../../../util/mongo";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { method } = req;

  dbConnect();

  if (method === "GET") {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    //const body = JSON.parse(req.body);
    const body = req.body;
    console.log(body);
    try {
      const products = await Product.create(body);
      res.status(201).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
