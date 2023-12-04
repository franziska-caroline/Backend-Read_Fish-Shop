# Backend Read: Products

In this challenge (and the upcoming ones), you'll create a fish shop.
You'll read data from your remote MongoDB using `mongoose` and display it in the frontend.

## Task

### Introduction

Run `npm run dev` and open [localhost:3000](http://localhost:3000) on your browser.

Have a look around:

- there is an overview page with all products and a details page for each of them;
- the data is taken from `lib/products.js`.

Your task is to refactor the app so that it fetches the data from a remote MongoDB.

### 1. Read Products from Database

Use MongoDB Atlas to create a database:

- the database should be called `fish-shop`,
- there should be one collection called `products`,
- download and extract the [resources](README.md#resources) and
- use the `products.json` file to import the data into your `products` collection.
- Note: you can use MongoDB Atlas to import the data by clicking on the `Insert Document` button, changing to the view `{}` and copy-pasting the data from the `products.json` file.

Create a schema for the `Product` model in the `db/models` folder.

The schema should have the following fields:

- `name` (String)
- `description` (String)
- `price` (Number)
- `currency` (String)

At the root of the project, create a `.env.local` file which uses the `MONGODB_URI` environment variable and your MongoDB connection string.

- Copy and paste the following into the `.env.local` file: `MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-name>/fish-shop?retryWrites=true&w=majority`.
- Replace `<user>` with your database username, `<password>` with your password and `<cluster-name>` with the name of your cluster. You can find all of this information on the MongoDB Atlas website.

Switch to `pages/api/products/index.js`:

- Delete the import of `lib/products`.
- Import `dbConnect` from the `db/connect.js` file.
- Import the `Product` model.
- Make the `handler` function `async` and `await` the connection to the database.
- If the `request.method` is `GET`,

  - use the `Product` model to find all products and
  - return them as a response.

Switch to `components/ProductList` and adapt the frontend:

- replace all instances of `product.id` with `product._id`.

Check that it works:

- Reload `localhost:3000`; you should still see all fishes.

Switch to `pages/api/products/[id].js` and adapt it as explained above:

- To find a single product by its id, you can use the `Product` model and the `.findById()` method: `Product.findById(id)`.
- Delete `lib/products.js` because it is not used anymore.

Open the browser and check the details pages: they should now work as well!

### Bonus: Populate Reviews

Some of the products already have reviews which are stored in a second collection. Your task is to read from that collection and display the reviews on the right details page.

Open MongoDB Atlas and adapt your `fish-shop` database:

- Add a new collection called `reviews`; insert the data from `bonus-reviews.json`.
- Drop the `products` collection; recreate it with the same name, but now insert data from the `bonus-products.json` file.
  - Note: The data in `bonus-products.json` contain a `reviews` array with `ids` as a reference to the corresponding review in the `review` collection.

Create a schema for the `Review` model in the `db/models` folder.

The schema should have the following fields:

- `title` (String)
- `text` (String)
- `rating` (Number)

Update the `Product` schema to include a reference to the `Review` model:

- Import the `Review` model with `import "./Review";`
- Below the `currency` key, add a new line for the reviews; you want to define that it is an array of Object-Ids and has a reference to the `Review` schema like so: `reviews: { type: [Schema.Types.ObjectId], ref: "Review" },`

Switch to `pages/api/products/[id].js` and use the `.populate` method to integrate the reviews for each product:

- `const product = await Product.findById(id).populate("reviews");`

Finally, update the frontend to display the reviews:

- Switch to `components/Product/index.js`.
- Inside of the return statement, check whether the fetched `data` contain any reviews and if so, display them.
- Feel free to decide which part of the review data you want to display.

  ### 2. Add a `POST` route

Switch to `./pages/api/products/index.js` and write the code for the `request.method` `POST` :

- Use a `try...catch` block.
- Try to:
  - Save the product data submitted by the form - accessible in `request.body` - to a variable called `productData`.
  - use `Product.create` with the `productData` to create a new document in our collection.
  - _Wait_ until the new product was saved.
  - Respond with a status `201` and the message `{ status: "Product created." }`.
- If an error occurs:
  - Log the error to the console.
  - Respond with a status `400` and the message `{ error: error.message }`.

Submitting the form will not yet work because the form does not know that you've created a `POST` route it can use.

### Send a `POST` request

Switch to `./components/ProductForm/index.js`:

- There already is a `handleSubmit` function which creates a `productData` object with all relevant data.

Your task is to fetch your new `POST` route and send the data to your database. After that use `mutate` from `useSWR` to refetch the data from the database.

- call `useSWR` in your `ProductForm` component with the API endpoint and destructure the `mutate` method.
- inside the handleSubmit function:
  > 💡 Hint: have a look at the handout if you get stuck here.
- send a "POST" request with `fetch` using the following options as the second argument

```js
{
  method: "POST",
headers: {
  "Content-Type": "application/json",
  },
body: JSON.stringify(???),
}
```

- use the productData from the form input as the body of the request
- await the response of the fetch, if the fetch was successful, call the `mutate` method to trigger a data revalidation of the useSWR hooks

## `PUT` Request

#### Add a `PUT` route

Switch to [`pages/api/products/[id].js`](./pages/api/products/[id].js) and write the code for the `request.method` `PUT` :

- Get the updated product from the request body: `const updatedProduct = request.body;`
- _Wait_ for `Product.findByIdAndUpdate(id, updatedProduct)`.
- Respond with a status `200` and the message `{ status: "Product successfully updated." }`.

#### Refactor the `ProductForm` component

For now, the `ProductForm` component sends a `POST` request to your database. We want to reuse the component for editing products and sending `PUT` requests as well.

Switch to `./components/ProductForm/index.js`.

Lift up all logic regarding the creating of the `productData` to the `./pages/index.js` file.

> 💡 This includes the destructuring of `const { mutate } = useSWR("/api/products");`, the `handleSubmit` function and the import of `useSWR`.

After doing so,

- rename the `handleSubmit` function to `handleAddProduct`
- in the return statement, pass `handleAddProduct` to the `ProductForm` component as a prop called `onSubmit`.

Switch back to `./components/ProductForm/index.js` and

- receive the `onSubmit` prop.
- use `onSubmit` instead of `handleSubmit` in the form

> 💡 Bonus: Pass another new prop to the `ProductForm` component to set the heading of the form dynamically ("Add a new Fish" is not a proper headline when updating the product, right?).

#### Send a `PUT` request

Switch to `components/Product/index.js.js`.

You will need the `mutate` method to revalidate the product data after a successful update:

- destructure mutate from the object received from the `useSWR` hook.

Below this code, create a `handleEditProduct()` function:

- it receives `event` as parameter,
- it stores the submitted data in a variable called `productData` (Hint: `new FormData` and `Object.fromEntries` as already used)
- it starts a "PUT" request with `fetch` (hint: this fetch is similar to the "POST" fetch we perform to create products)
- uses `mutate` after a successful fetch to update the product detail page.

We need to update the content of our Product component to display the edit form:

- Create a state called `isEditMode` and initialize it with `false`.
- In the return statement, add a `<button>` with
  - `type="button"`,
  - `onClick={() => { setIsEditMode(!isEditMode); }}`,
  - and a proper text.
- In the return statement, display the `ProductForm` component depending on the `isEditMode` state (Hint: `isEditMode && ...`).
- pass our `handleEditProduct` function to the `ProductForm` as the `onSubmit` prop.

Open [`localhost:3000/`](http://localhost:3000/) in your browser, switch to a details page, edit a fish and be happy about your shop being expanded!

### `DELETE` Request

#### Add a `DELETE` route

Switch to [`pages/api/products/[id].js`](./pages/api/products/[id].js) and write the code for the `request.method` `DELETE` :

- _Wait_ for `Product.findByIdAndDelete(id)`.
- Respond with a status `200` and the message `{ status: "Product successfully deleted." }`.

#### Send a `DELETE` request

Deleting a product should be possible from the details page.

Switch to `./components/Product/index.js` and implement a delete button:

- In the return statement, add a `<button>` with
  - `type="button"`,
  - `onClick={() => handleDeleteProduct(id)}`,
  - and a proper text.

Write the `handleDeleteProduct` function:

- _Wait_ for a `fetch()` with two arguments:
  - the url `/api/products/${id}` and
  - an options object `{ method: "DELETE" }`
- Save the result in a variable called `response`.
- If the `response` is `ok`,
  - _wait_ for `response.json()` and use `push("/")`.
- If the `response` is not `ok`, log the `response.status` as an error to the console.

Open [`localhost:3000/`](http://localhost:3000/) in your browser, switch to a details page, delete a fish and be happy about your shop being expanded!