const premiumAccess = (req, res, next) => {
    if (req.user && req.user.role === 'premium') {
        return next();
    }

    res.status(403).json({ status: 'error', error: 'Acceso no autorizado' });
};

module.exports = premiumAccess;
