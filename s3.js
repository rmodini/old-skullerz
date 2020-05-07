const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

// export as a middleware func
exports.upload = function(req, res, next) {
    if (!req.file) {
        console.log("multer didnt work");
        res.sendStatus(500);
        return;
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            //file name will be id we gave + original extension
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            next();
            // unlink to delete the img on the uploads folder, optional
            fs.unlink(path, () => {});
        })
        .catch(err => {
            // uh oh
            console.log(err);
            res.sendStatus(500);
        });
};
