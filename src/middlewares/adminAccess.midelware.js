const adminAccess = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    res.status(403).json({ status: 'error', error: 'Acceso no autorizado' });
}

module.exports = adminAccess