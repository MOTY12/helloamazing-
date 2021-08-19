const jwt = require('jsonwebtoken')

const authorization = async(req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.send('Invalid User Credentials');
    }
    try {
        const data = await jwt.verify(token, process.env.secret);
        req.userId = data.userId;
        req.schoolemail = data.schoolemail;
        req.schoolname = data.schoolname;
        return next();
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports = authorization