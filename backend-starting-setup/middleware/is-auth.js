const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.isAuth = false
        return next()      
    }
    const token = authHeader.split(' ')[1] // split 'Bearer token'
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'secretString')
    } catch (err) {
        req.isAuth = false
        return next()
    }
    if (!decodedToken) {
        req.isAuth = false
        return next()   
    }
    req.userId = decodedToken.userId // store in req
    req.isAuth = true
    next()
}