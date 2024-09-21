const Bon = require('../models/BonSchema')
const Product = require('../models/productSchema')

const getBons = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed, you risk to be blocked" })
    try {
        const bons = await Bon.find()
        res.status(200).json({ bons: bons })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getBon = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed, you risk to be blocked" })
    try {
        const { NumBon } = req.params
        const bon = await Bon.findOne({ NumBon: NumBon })
        if (!bon) return res.status(404).json({ message: "Bon not found" })
        const products = await Product.find({ bon: bon.NumBon })
        res.status(200).json({ bon: bon, products: products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




module.exports = {
    getBons,
    getBon
}