// Contact Management Module
// Handles contact form submissions and admin contact management

// Get all contact submissions
function getAllContactSubmissions() {
    return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
}

// Add new contact submission
function addContactSubmission(submission) {
    const submissions = getAllContactSubmissions();
    submissions.push({
        id: Date.now(),
        ...submission,
        status: 'new',
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

// Get contact submission by ID
function getContactSubmissionById(id) {
    const submissions = getAllContactSubmissions();
    return submissions.find(submission => submission.id === id);
}

// Update contact submission status
function updateContactSubmissionStatus(id, status) {
    const submissions = getAllContactSubmissions();
    const submission = submissions.find(s => s.id === id);
    if (submission) {
        submission.status = status;
        submission.updatedAt = new Date().toISOString();
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        return true;
    }
    return false;
}

// Delete contact submission
function deleteContactSubmission(id) {
    const submissions = getAllContactSubmissions();
    const filteredSubmissions = submissions.filter(s => s.id !== id);
    localStorage.setItem('contactSubmissions', JSON.stringify(filteredSubmissions));
}

// Filter contact submissions
function filterContactSubmissions(status = 'all') {
    const submissions = getAllContactSubmissions();
    if (status === 'all') {
        return submissions;
    }
    return submissions.filter(submission => submission.status === status);
}

// Get contact statistics
function getContactStatistics() {
    const submissions = getAllContactSubmissions();
    const total = submissions.length;
    const newCount = submissions.filter(s => s.status === 'new').length;
    const inProgressCount = submissions.filter(s => s.status === 'in-progress').length;
    const resolvedCount = submissions.filter(s => s.status === 'resolved').length;
    
    return {
        total,
        new: newCount,
        inProgress: inProgressCount,
        resolved: resolvedCount
    };
}

// Format contact submission for display
function formatContactSubmission(submission) {
    return {
        id: submission.id,
        name: `${submission.firstName} ${submission.lastName}`,
        email: submission.email,
        subject: submission.subject,
        message: submission.message,
        status: submission.status || 'new',
        createdAt: new Date(submission.createdAt).toLocaleDateString(),
        newsletter: submission.newsletter ? 'Yes' : 'No'
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllContactSubmissions,
        addContactSubmission,
        getContactSubmissionById,
        updateContactSubmissionStatus,
        deleteContactSubmission,
        filterContactSubmissions,
        getContactStatistics,
        formatContactSubmission
    };
} 