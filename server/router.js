import express from 'express';
import fs from 'fs';
import path from 'path';
import fileUpload from 'express-fileupload';
export const apiRouter = express.Router();

const app = express();
const dirname = path.resolve(path.dirname(''));
apiRouter.get("/", (req, res) => {

    fs.readdir(path.join() + '/upload-files', (err, filesData) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.status(200).json(filesData);
    });
});


apiRouter.post('/upload', fileUpload({ parseNested: true }), async function(req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const files = req.files;
    for (let f in files) {
        let mvResult = await files[f].mv(dirname + '/upload-files/' + files[f].name);
        if (mvResult)
            return res.status(500).json(mvResult);
        res.status(200).json({ message: files[f].name + ' was uploaded nicely', success: true });
    }
});