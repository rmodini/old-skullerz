const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

// we're using the same AWS_KEY/AWS_SECRET from imageboard!
const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1"
});

exports.sendEmail = function(to, subject, message) {
    return ses
        .sendEmail({
            Source: "Twilight Candle <twilight.candle@spicedling.email>",
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    Text: {
                        Data: message
                    }
                },
                Subject: {
                    Data: subject
                }
            }
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch(err => console.log(err));
};
