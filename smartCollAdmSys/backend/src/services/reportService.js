const Marks = require('../models/Marks');
const Report = require('../models/Report');
const Student = require('../models/Student');
const { calculateAttendancePercentage } = require('../utils/attendanceCalculator');

// This helper calculates the average marks percentage of a student.
const calculatePerformanceAverage = async (studentId) => {
    const marksRecords = await Marks.find({ student: studentId });

    if (marksRecords.length === 0) {
        return 0;
    }

    const totalPercentage = marksRecords.reduce((sum, record) => {
        return sum + (record.marksObtained / record.maxMarks) * 100;
    }, 0);

    return Number((totalPercentage / marksRecords.length).toFixed(2));
};

// This function builds simple but meaningful comments for the MVP.
const buildComments = ({ studentName, attendancePercentage, performanceAverage }) => {
    let englishComment = `${studentName} has shown a steady academic journey this semester.`;
    let hindiComment = `${studentName} ne is semester mein lagataar prayas dikhaya hai.`;

    if (performanceAverage >= 75 && attendancePercentage >= 75) {
        englishComment = `${studentName} has performed well in academics and maintained good attendance. The student is disciplined and progressing confidently.`;
        hindiComment = `${studentName} ne academics mein achha pradarshan kiya hai aur attendance bhi theek rakhi hai. Vidyarthi disciplined hai aur achhi progress kar raha hai.`;
    } else if (performanceAverage >= 75 && attendancePercentage < 75) {
        englishComment = `${studentName} has shown good academic performance, but attendance needs improvement to avoid academic risk. Regular class participation is strongly recommended.`;
        hindiComment = `${studentName} ka academic performance achha hai, lekin attendance mein sudhar ki zarurat hai. Regular class participation bahut zaruri hai.`;
    } else if (performanceAverage < 75 && attendancePercentage >= 75) {
        englishComment = `${studentName} attends classes regularly, but needs better focus on academic performance. Extra practice and guidance are recommended.`;
        hindiComment = `${studentName} ki attendance achhi hai, lekin academic performance mein aur mehnat ki zarurat hai. Extra practice aur guidance ki salah di jaati hai.`;
    } else if (performanceAverage < 75 && attendancePercentage < 75) {
        englishComment = `${studentName} requires improvement in both attendance and academics. Timely counseling and regular effort are recommended before final exams.`;
        hindiComment = `${studentName} ko attendance aur academics dono mein sudhar ki zarurat hai. Final exams se pehle counseling aur regular effort ki salah di jaati hai.`;
    }

    return {
        englishComment,
        hindiComment
    };
};

// This service creates and stores a report for one student.
const generateStudentReport = async (studentId, generatedBy) => {
    const student = await Student.findById(studentId);

    if (!student) {
        throw new Error('Student not found');
    }

    const attendancePercentage = await calculateAttendancePercentage(studentId);
    const performanceAverage = await calculatePerformanceAverage(studentId);
    const { englishComment, hindiComment } = buildComments({
        studentName: student.name,
        attendancePercentage,
        performanceAverage
    });

    const report = await Report.create({
        student: student._id,
        semester: student.semester,
        attendancePercentage,
        performanceAverage,
        englishComment,
        hindiComment,
        generatedBy
    });

    return report;
};

module.exports = {
    generateStudentReport,
    calculatePerformanceAverage
};
