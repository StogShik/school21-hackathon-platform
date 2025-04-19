const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage with better filename handling
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        // Use timestamp and original filename to avoid encoding issues
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // Store original filename separately in metadata
        // Use a safe filename for the actual file
        cb(null, uniqueSuffix + '-' + Buffer.from(file.originalname).toString('hex'));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept all files for now - in production you might want to filter by type
    cb(null, true);
};

// Export multer middleware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
});

module.exports = upload;
