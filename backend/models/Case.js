const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    files: [{
        filename: String,        // System filename (for storage)
        originalname: String,    // Original filename 
        encodedName: String,     // UTF-8 encoded filename
        mimetype: String,
        size: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Case', CaseSchema);
