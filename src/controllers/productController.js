const Product = require("../models/productModel");

const productController = {};
const productController2 = {};

productController.get = async (req, res) => {
  const category = req.query.category ? { category: req.query.category } : {};
  const searchKeyword = req.query.searchKeyword
    ? {
        name: {
          $regex: req.query.searchKeyword,
          $options: "i",
        },
      }
    : {};
  const sortOrder = req.query.sortOrder
    ? req.query.sortOrder === "lowest"
      ? { price: 1 }
      : { price: -1 }
    : { _id: -1 };

  const products = await Product.find({
    ...category,
    ...searchKeyword,
  }).sort(sortOrder);
  res.send(products);
};

productController2.get = async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found. " });
  }
};

productController.post = async (req, res, next) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
    rating,
    numReviews,
  } = req.body;
  const newProduct = new Product({
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
    rating,
    numReviews,
  });
  const product = await newProduct.save();
  if (product) {
    return res.send({ message: "New Product Created", data: product });
  } else {
    return res.status(500).send({ message: " Error in Creating Product." });
  }
};

productController.update = async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    if (updatedProduct) {
      return res
        .status(200)
        .send({ message: "Product Updated", data: updatedProduct });
    }
  }
  return res.status(500).send({ message: " Error in Updating Product." });
};

productController.destroy = async (req, res, next) => {
  const productId = req.params.id;
  const deletedProduct = await Product.findById(productId);
  if (deletedProduct) {
    deletedProduct.remove();
    res.send({ message: "Product Deleted" });
  } else {
    res.send("Error in Deletion.");
  }
};

productController2.post = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const review = {
      name: req.body.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      message: "Review saved successfully.",
    });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
};
module.exports = { productController, productController2 };
