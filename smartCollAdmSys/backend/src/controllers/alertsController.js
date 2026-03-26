const { getActiveAlerts } = require('../services/alertService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getAlerts = async (req, res) => {
    try {
        const alerts = await getActiveAlerts();
        return sendSuccess(res, 200, 'Alerts fetched successfully', { alerts });
    } catch (error) {
        console.error('getAlerts error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    getAlerts
};
