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
        Source: 'Funky Chicken <axiomatic.shallot@spicedling.email>', //dodao sa spiced
        Destination: {
            ToAddresses: ['disco.duck@spiced.academy']
        },
        Message: {
            Body: {
                Text: {
                    Data: "We can't wait to start working with you! Please arrive on Monday at 9:00 am. Dress code is casual so don't suit up."
                }
            },
            Subject: {
                Data: "Your Application Has Been Accepted!"
            }
        }
    }).promise().then(
        () => console.log('it worked! reset email sent')
    ).catch(
        err => console.log("err in ses.send", err)
    );
};