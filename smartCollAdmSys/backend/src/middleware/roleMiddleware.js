// This middleware helps us restrict routes by role.
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to access this route'
            });
        }

        next();
    };
};

module.exports = roleMiddleware;
