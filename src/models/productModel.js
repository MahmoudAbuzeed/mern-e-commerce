const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true, defualt: 0 },
  category: { type: String, required: true },
  countInStock: { type: Number, required: true, defualte: 0 },
  description: { type: String, required: true },
  rating: { type: Number, required: true, defualt: 0 },
  numReviews: { type: Number, required: true, defualt: 0 },
  reviews: [reviewSchema],
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
