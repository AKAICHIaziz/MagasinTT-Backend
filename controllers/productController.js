const Product = require('../models/productSchema')
const Category = require('../models/categorySchema')
const BonEntrer = require('../models/BonEntrerSchema')



const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            return res.status(204).json({ message: "No products available" });
        }
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Ensure server errors return a 500 status
    }
};

const getProductsByBon = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { numBon } = req.params
        const products = await Product.find({ bon: numBon })
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) return res.status(401).json({ message: "No product found" })
        const productCategory = await Category.findOne({ id: product.category })
        res.status(200).json({ product, productCategory })
    } catch (error) {
        res.json({ message: error.message })
    }
}

const addProduct = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { category, name, description, ref } = req.body
        const newProduct = new Product({ category, name, description, ref })
        await newProduct.save()
        if (newProduct) res.status(201).json({ message: "Product added successfully", New_Product: newProduct })
    } catch (error) {
        res.json({ message: error.message })
    }
}



const ajouterBon = async (req, res) => {
    if (req.user.isAdmin === false) {
        return res.status(401).json({ message: "You are not allowed , you risk to be blocked" });
    }
    try {
        const products = req.body.products;
        const numBon = req.body.bon;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "No products provided" });
        }
        const validProducts = products.map(product => {
            return {
                category: product.category,
                quantity: product.quantity,
                qte: product.quantity,
                name: product.name,
                description: product.description,
                ref: product.ref,
                maker: product.maker,
                provider: product.provider,
                bon: numBon,
                image: product.image
            };
        });
        const numberOfProducts = products.length;

        const newProducts = await Product.insertMany(validProducts);
        const newBon = new BonEntrer({ NumBon: numBon, NumProd: numberOfProducts })
        await newBon.save()
        res.status(201).json({
            message: "Products added successfully",
            New_Products: newProducts,
            New_Bon: newBon,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
};


const deleteProduct = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const isProductDeleted = await Product.findByIdAndDelete(id)
        if (!isProductDeleted) return res.status(401).json({ message: "Product not found" })
        res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

const patchProduct = async (req, res) => {
    if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not updated" });
        }
        res.status(200).json({ message: "Product updated", Updated_Product: updatedProduct });
    } catch (error) {
        res.status(403).json({ message: error.message })
    }
}

module.exports = {
    getProducts,
    getProductsByBon,
    getProduct,
    addProduct,
    deleteProduct,
    patchProduct,
    ajouterBon
}