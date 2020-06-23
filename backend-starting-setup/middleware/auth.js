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
        decodedToken = jwt.verify(token, 'supersecret') // the secret key MUST be same with one in resolvers
    } catch (err) {
        req.isAuth = false
        return next()
    }
    if (!decodedToken) {
        req.isAuth = false
        return next()   
    }
    req.userId = decodedToken.userId
    req.isAuth = true
    next()
}