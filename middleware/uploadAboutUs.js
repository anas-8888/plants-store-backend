const multer = require("multer");
const path = require("path");

// Storage configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../httpdocs/uploads/aboutUs")); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for validating allowed image types (JPEG, JPG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // File type is valid
  } else {
    cb(new Error("Only JPEG and PNG images are allowed!"), false); // Invalid file type
  }
};

// Multer setup for file upload, with file size limit of 5MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Exporting the upload middleware for single file upload with field name 'photo'
module.exports = upload.single("photo");
