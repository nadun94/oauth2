const Express = require('express');
const configGoogle = require('./config');
const googleAuth = require('./Auth/googleAuth');
const {google} = require('googleapis');
const cors = require('cors')
const jsonwebtoken = require('jsonwebtoken');
const BodyParser = require('body-parser');
const app = Express();
app.use(BodyParser.json());
app.use(cors());

app.listen(5000, (err) => {
    if(err){
        console.log('Error while connecting to the server. : ', err);
        return 0;
    }
    console.log('Successfully connected to the server via port 5000.');
});

 app.route('/auth')
    .post((req,res) => {
        googleAuth.actionGoogleAuth()
            .then((value) => {
                    res.send({ redirect: value.result })
                }
            )
    });
app.route('/auth-user')
    .post((req,res) => {
        googleAuth.actionGoogleAuthUser(req.body)
            .then((value) => {
                    res.send({  tokens: value.token, payload: value.payload })
                }
            )
    });

app.route('/upload')
    .post( function (req, res) {
        console.log('upload request: ', req.body);
    if (!req.body.accessToken) res.send({ message: 'please authenticate'});
    else {

        // config google drive with client token
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            'access_token': req.body.accessToken
        });

        const drive = google.drive({
            version: 'v3',
            auth: oauth2Client
        });

        let { name: filename, mimetype, data } = req.body.files;
        const driveResponse = drive.files.create({
            requestBody: {
                name: filename,
                mimeType: mimetype
            },
            media: {
                mimeType: mimetype,
                body: Buffer.from(data).toString()
            }
        });

        driveResponse.then(data => {

            if (data.status == 200) res.send({ message: 'success' })
            else res.send({ message: 'failed' })

        }).catch(err => { throw new Error(err) })
    }
})
