import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from "multer";

const app = express();
const PORT = 5000;


// noinspection JSUnusedGlobalSymbols
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + path.extname(file.originalname))
});


const upload = multer({storage: storage});


app.post('/api/files', upload.single('file'), (req, res) => {
  res.status(200).json({
        message: 'File uploaded successfully!',
        filename: req.file.filename
    });
});


app.get('/api/files/:filename', (req, res) => {
    const filename = req.params.filename;

    const filePath = path.join('uploads', filename);

    res.download(filePath)
});

app.get('/health', (req, res) => {
    res.status(200).json({
        up: true
    });
});


// Middleware
app.use(express.json());
app.use(cors());



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app


