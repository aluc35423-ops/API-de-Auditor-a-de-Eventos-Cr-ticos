const appTokenValidator = (req, res, next) => {
    const token = req.headers['app-token'];

    if (!token || token !== process.env.APP_TOKEN) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Falta el app-token o es incorrecto" 
        });
    }
    next();
};

module.exports = appTokenValidator;