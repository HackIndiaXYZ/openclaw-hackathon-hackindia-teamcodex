const env = require('../config/env');

// This function sends the uploaded classroom image to the Python FastAPI service.
const recognizeAttendanceFromImage = async ({ fileBuffer, fileName, mimeType, roster }) => {
    const formData = new FormData();

    formData.append('image', new Blob([fileBuffer], { type: mimeType }), fileName);
    formData.append('roster', JSON.stringify(roster));

    const response = await fetch(`${env.pythonServiceUrl}/api/attendance/recognize`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || data.message || 'Python attendance recognition failed');
    }

    return data;
};

module.exports = {
    recognizeAttendanceFromImage
};
