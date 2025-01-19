import multer from "multer"

// Configure multer for memory storage
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB (optional)
  },
  fileFilter: (req, file, cb) => {
    // Optional: Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type!'), false); // Reject the file
    }
  },
});

