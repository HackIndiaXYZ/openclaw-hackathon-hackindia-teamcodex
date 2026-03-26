// This middleware catches unexpected server errors in one place.
const errorMiddleware = (error, req, res, next) => {
    console.error('Unhandled server error:', error);

    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};

module.exports = errorMiddleware;
