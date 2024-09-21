const jwt = require('jsonwebtoken')

const verifyAuthToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.status(401).json({ message: 'Login required' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token, login required" })
        }
        req.user = user
        next()
    })
}

module.exports = {
    verifyAuthToken
}