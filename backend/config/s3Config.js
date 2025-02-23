// utils/s3Config.js
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Organize files by product ID and color
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const productId = req.params.id || 'new';
            const color = req.body.color || 'default';
            const view = file.fieldname.includes('front') ? 'front' : 'back';
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            
            // Structure: products/productId/color/view-timestamp.ext
            const key = `products/${productId}/${color}/${view}-${uniqueSuffix}${getFileExtension(file.originalname)}`;
            cb(null, key);
        }
    }),
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Please upload only images'));
        }
    }
});

const getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.'));
};

const deleteFileFromS3 = async (fileKey) => {
    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey
        }));
        return true;
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        return false;
    }
};

const getS3Url = (key) => {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

module.exports = { upload, deleteFileFromS3, getS3Url };