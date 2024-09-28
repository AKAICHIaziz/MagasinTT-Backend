const RequestedProducts = require('../models/RequestedProductsSchema')
const Request = require('../models/requestSchema')
const User = require('../models/userSchema')
const Product = require('../models/productSchema')
const Notification = require('../models/notificationSchema')
const BonSortie = require('../models/bonSortieShema')
const nodemailer = require('nodemailer');

const createRequest = async (req, res) => {
    try {
        const { employeeId, employeeName, products } = req.body;

        // Check if all products have enough stock
        const insufficientStockProducts = [];

        for (const product of products) {
            const productInStock = await Product.findById(product.productId);  // Assuming Product is your model

            if (!productInStock) {
                return res.status(400).json({ message: `Product with ID ${product.productId} not found` });
            }

            if (productInStock.quantity < product.quantity) {
                insufficientStockProducts.push({
                    productId: product.productId,
                    availableQuantity: productInStock.quantity,
                    requestedQuantity: product.quantity
                });
            }
        }

        // If any product has insufficient stock, return an error
        if (insufficientStockProducts.length > 0) {
            return res.status(400).json({
                message: 'Some products have insufficient stock',
                insufficientStock: insufficientStockProducts
            });
        }

        // If all products have enough stock, create the request
        const newRequest = new Request({
            employeeId,
            employeeName,
            ProdNum: products.length,
            status: 'pending'
        });

        const request = await newRequest.save();

        const ProductsRequests = products.map(product => ({
            reqId: request._id,
            employeeId,
            employeeName,
            productId: product.productId,
            quantity: product.quantity,
            status: 'pending',
            reason: product.reason
        }));

        await RequestedProducts.insertMany(ProductsRequests);

        res.status(200).json({ message: 'Products requested successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Server error', message: error.message });
    }
};


const getRequests = async (req, res) => {
    try {
        const { id } = req.query
        if (req.user.isStoreAdmin) {
            const requests = await Request.find()
            return res.status(200).json({ requests: requests })
        }

        const requests = await Request.find({ employeeId: id })
        res.status(200).json({ requests: requests })

    } catch (error) {
        res.status(401).json({ Error: 'Server error', message: error.message })
    }
}

const getSingleRequest = async (req, res) => {
    try {
        if (req.user.isStoreAdmin) {
            const { id } = req.body
            const request = await Request.findOne({ _id: id })

            const requestedProducts = await RequestedProducts.find({ reqId: id })
            const products = await Promise.all(
                requestedProducts.map(async (requestedProduct) => {
                    const product = await Product.findOne({ _id: requestedProduct.productId });
                    return {
                        requestedProduct,
                        product,
                    };
                })
            );

            const user = await User.findOne({ _id: request.employeeId })
            return res.status(200).json({ request, products, user })
        }

        const { id: employeeId } = req.body;
        const { id: requestId } = req.params;
        const request = await Request.findOne({ _id: requestId, employeeId: employeeId })
        const requestedProducts = await RequestedProducts.find({ reqId: requestId, employeeId: employeeId })
        const products = await Promise.all(
            requestedProducts.map(async (requestedProduct) => {
                const product = await Product.findOne({ _id: requestedProduct.productId });
                return {
                    requestedProduct,
                    product,
                };
            })
        )

        res.status(200).json({ request, products })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getRequestCount = async (req, res) => {
    //if (req.user.isAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { userId } = req.params
        const requests = await Request.find({ employeeId: userId })
        const pendingCount = requests.filter(req => req.status === 'pending').length;
        const approvedCount = requests.filter(req => req.status === 'approved').length;
        const rejectedCount = requests.filter(req => req.status === 'rejected').length;
        const requestCount = requests.length

        res.status(200).json({ requestCount, pendingCount, approvedCount, rejectedCount })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const rejectRequest = async (req, res) => {
    if (req.user.isStoreAdmin == false) return res.status(401).json({ message: "You are not allowed to manage users, you risk to be blocked" })
    try {
        const { id } = req.body
        const reqId = id
        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status: 'rejected' },
            { new: true }
        )

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" })
        }
        const updatedProducts = await RequestedProducts.updateMany(
            { reqId: id },
            { status: 'rejected' }
        );

        if (updatedProducts) {
            const notifContent = 'Your request has been rejected'
            const req = await Request.findOne({ _id: reqId })
            const employeeId = req.employeeId
            console.log(employeeId)
            const newNotification = new Notification({ userId: employeeId, content: notifContent })
            await newNotification.save();
        }

        const request = await Request.findById(reqId);
        const employee = await User.findById(request.employeeId)
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const employeeEmail = employee.email;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USERNAME,
                pass: process.env.PASSWORD,
            }
        });

        transporter.sendMail({
            from: "TT Intern Operation Admin",
            to: employeeEmail,
            subject: 'Request Rejected',
            html: `<p>Your request <i>N°:</i><b>${reqId}</b> is rejcted from the admin because ...</p>`
        }).then(() => {
            console.log("Email sent !")
        }).catch(err => {
            console.log(err)
        })


        res.status(200).json({
            message: "Request and requested products status updated",
            updatedRequest,
            updatedProducts
        });

    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error)
    }
}


const approveRequest = async (req, res) => {
    if (req.user.isStoreAdmin == false)
        return res.status(401).json({ message: "You are not allowed to manage users, you risk being blocked" });

    try {
        const { id } = req.body;
        const reqId = id;

        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status: 'approved' },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Request not found" });
        }

        const updatedProducts = await RequestedProducts.updateMany(
            { reqId: id },
            { status: 'approved' }
        );

        if (updatedProducts) {
            const requestedProducts = await RequestedProducts.find({ reqId: id });

            for (let requestedProduct of requestedProducts) {
                const product = await Product.findById(requestedProduct.productId);
                if (product) {
                    product.quantity -= requestedProduct.quantity;
                    await product.save();
                }
            }

            // const notifContent = 'Your request has been approved';
            // const req = await Request.findOne({ _id: reqId });
            // const employeeId = req.employeeId;
            // const newNotification = new Notification({ userId: employeeId, content: notifContent });
            // await newNotification.save();
        }


        const request = await Request.findById(reqId);
        const employee = await User.findById(request.employeeId)
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const employeeEmail = employee.email;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USERNAME,
                pass: process.env.PASSWORD,
            }
        });

        transporter.sendMail({
            from: "TT Intern Operation Admin",
            to: employeeEmail,
            subject: 'Request approved',
            html: `<h1>Command approval for: ${employee.username}.</h1> <p>Your request <i>N°:</i><b>${reqId}</b> is approved from the admin. You should go and collect it from the inventory or wait for the agent to deliver it to your office.</p><p></p>`
        }).then(() => {
            console.log("Email sent !")
        }).catch(err => {
            console.log(err)
        })

        res.status(200).json({
            message: "Request, requested products status, and product quantities updated, email sent",
            updatedRequest,
            updatedProducts
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};



module.exports = {
    createRequest,
    getRequests,
    getSingleRequest,
    approveRequest,
    rejectRequest,
    getRequestCount
}