import dbConnect from "@/db/connect";
import Product from "@/db/models/Product";

export default async function handler(request, response) {
  await dbConnect();

  const { id } = request.query;

  if (request.method === "GET") {
    // .populate() method
    const product = await Product.findById(id).populate("reviews");
    // const product = await Product.findById(id);
    // const product = products.find((product) => product.id === id);

    if (!product) {
      return response.status(404).json({ status: "Not Found" });
    }

    response.status(200).json(product);
  }
}
