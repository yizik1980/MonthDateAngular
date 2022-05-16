import express from 'express';
import fs from 'fs';
import path from 'path';
import fileUpload from 'express-fileupload';
import filehandler from './filehandler.js';

export const apiRouter = express.Router();

const uploadedUrl = path.join() + '/upload-files';
// file validation handler includes file type and file size
const handler = new filehandler({
    mimeTpes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
    ],
    maxSize: 1000000,
});
// get service returning the uploaded file list 
apiRouter.get("/", (req, res) => {

    fs.readdir(uploadedUrl, (err, filesData) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.status(200).json(filesData);
    });
});

/// upload file service to server folder with validations of file type an size
apiRouter.post('/upload', fileUpload({ parseNested: true }), async function(req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const files = req.files;
    for (let f in files) {
        const validate = handler.validate(files[f]);
        if (!validate.valid) {
            return res.status(415).json({ message: 'The file is large try to shrink it ' + validate.reason, success: false });
        }
        let err = await files[f].mv(uploadedUrl + '/' + files[f].name);
        if (err)
            return res.status(500).json({ err, success: false });
        res.status(200).json({ message: files[f].name + ' was uploaded nicely', success: true });
    }
});
// download web api service for folder above 
apiRouter.get('/download/:fileName', async function(req, res) {

    const file = uploadedUrl + '/' + req.params.fileName;
    const exist = await fs.existsSync(file);
    console.log(exist);
    if (exist) {
        res.download(file);
        return;
    }
    res.send('not exist such file');
});