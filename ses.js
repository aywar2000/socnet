const aws = require("aws-sdk");

let secrets;
if ((process.env.NODE_ENV == "production")) {
    secrets = process.env; //prod-mode, our secrets are in env variables
} else {
    secrets = require("./secrets.json"); //in dev secrets, put to git ignore
}

//secrets json with aws credentials

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-west-1', //for spicedling
});

exports.sendEmail = function (recipient, message, subject) {
    return ses.sendEmail({
        Source: 'socnet <axiomatic.shallot@spicedling.email>', //dodao sa spiced
        Destination: {
            ToAddresses: [recipient]
        },
        Message: {
            Body: {
                Text: {
                    Data: "here's a code to reset your password"
                }
            },
            Subject: {
                Data: "password reset"
            }
        }
    }).promise().then(
        () => console.log('reset email sent')
    ).catch(
        err => console.log("err in ses.send", err)
    );
};