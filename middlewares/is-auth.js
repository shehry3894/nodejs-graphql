const jws = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        req.isAuth = false
        return next()
    }

    const token = authHeader.split(' ')[1] // Bearer <token-here>
    if (!token || token === '') {
        req.isAuth = false
        return next()
    }

    try {
        decodedToken = jws.verify(token, 'supersecretkey')
        console.log(decodedToken)
    } catch (err) {
        req.isAuth = false
        console.log(err)
        return next()
    }

    if (!decodedToken) {
        req.isAuth = false
        return next()
    }

    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}