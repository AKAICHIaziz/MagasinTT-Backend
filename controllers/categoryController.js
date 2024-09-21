const Category = require('../models/categorySchema')

const getCategories = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getCategory = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { name } = req.params
        const category = await Category.findOne({ categoryName: name })
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const addCategory = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { categoryName, categoryDesc } = req.body
        const category = new Category({ categoryName, categoryDesc })
        await category.save()
        if (category) {
            res.status(201).json({ message: "Category added successfully!", category: category })
        }
    }
    catch (error) {
        res.status(403).json({ message: error.message })
    }
}

const patchCategory = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { name } = req.params
        const updatedCategory = await Category.findOneAndUpdate(
            { categoryName: name },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(403).json({ message: error.message })
    }
}

const deleteCategory = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.params
        const isCategoryDeleted = await Category.findOneAndDelete({ id: id })
        if (!isCategoryDeleted) return res.json({ message: "Enable de delete category" })
        res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
        res.status(403).json({ message: error.message })
    }
}

module.exports = {
    getCategories,
    getCategory,
    addCategory,
    deleteCategory,
    patchCategory
}