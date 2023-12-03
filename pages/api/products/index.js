import dbConnect from "../../../db/connect";
import Product from "../../../db/models/Product";

export default async function handler(request, response) {
  // to connect to the database
  await dbConnect();

  // request method GET
  if (request.method === "GET") {
    // make a request to the db to get the products
    const products = await Product.find();
    console.log("products: ", products);
    return response.status(200).json(products);
  }

  // try...catch block
  // request method POST
  if (request.method === "POST") {
    try {
      const productData = request.body; // product.Data submitted by the form - accessible in request.body
      await Product.create(productData); // create a new document in our collection

      response.status(201).json({ status: "You added a new fish!🐠" });
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
