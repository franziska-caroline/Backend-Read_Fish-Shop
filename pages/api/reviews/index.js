import Review from "@/db/models/Review";
import dbConnect from "../../../db/connect";

export default async function handler(request, response) {
  // to connect to the database
  await dbConnect();

  // request method GET
  if (request.method === "GET") {
    // make a request to the db to get the reviews
    const reviews = await Review.find();
    console.log("reviews: ", reviews);
    return response.status(200).json(reviews);
  }

  // try...catch block
  // request method POST
  if (request.method === "POST") {
    try {
      const reviewData = request.body; // product.Data submitted by the form - accessible in request.body
      await Review.create(reviewData); // create a new document in our collection

      response.status(201).json({ status: "You added a new review" });
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
