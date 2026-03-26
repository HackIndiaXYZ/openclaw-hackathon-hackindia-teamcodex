const fs = require('fs/promises');
const path = require('path');

// This folder is where the Python face-recognition service looks for student face images.
const knownFacesDirectory = path.resolve(__dirname, '../../../python-service/known_faces');

const createSafeFaceLabel = ({ name, rollNumber, faceLabel }) => {
    const rawLabel = faceLabel || `${name}_${rollNumber}`;

    // We keep only simple file-name friendly characters.
    return String(rawLabel)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, '');
};

const getFileExtension = (originalName) => {
    return path.extname(originalName || '').toLowerCase() || '.jpg';
};

const saveStudentFaceImage = async ({ file, name, rollNumber, faceLabel }) => {
    if (!file) {
        return {
            savedFileName: '',
            savedFaceLabel: createSafeFaceLabel({ name, rollNumber, faceLabel })
        };
    }

    const savedFaceLabel = createSafeFaceLabel({ name, rollNumber, faceLabel });
    const extension = getFileExtension(file.originalname);
    const savedFileName = `${savedFaceLabel}${extension}`;
    const savedFilePath = path.join(knownFacesDirectory, savedFileName);

    await fs.mkdir(knownFacesDirectory, { recursive: true });
    await fs.writeFile(savedFilePath, file.buffer);

    return {
        savedFileName,
        savedFaceLabel
    };
};

module.exports = {
    saveStudentFaceImage,
    createSafeFaceLabel
};
