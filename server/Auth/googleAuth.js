
const configGoogle = require('../config');
const {google} = require('googleapis');
const jsonwebtoken = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');


    const OrderControllerMain = function(){
     this.actionGoogleAuth = async () => {
        const auth = new google.auth.OAuth2(
            configGoogle.clientId,
            configGoogle.clientSecret,
            `${configGoogle.baseUrl}/${configGoogle.redirect}`,
        );
        const result = auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ['profile', 'email', 'openid'],
        });
        console.log(result);
        return { result };
    };
     this.actionGoogleAuthUser = async (res) => {
       try{
           const client = new OAuth2Client(
               configGoogle.clientId,
               configGoogle.clientSecret,
               `${configGoogle.baseUrl}/${configGoogle.redirect}`);
           const tokens = await client.getToken(res.code);
           client.setCredentials(tokens.tokens);
           const ticket = await client.verifyIdToken({
               idToken: tokens.tokens.id_token,
               audience: configGoogle.clientId,
           });
           const payload = ticket.getPayload();
           return {  token: tokens.tokens.access_token, payload}
       }
       catch (e) {
           return {  token: undefined, payload: undefined}
       }


    }
// actionGoogleAuth();
     this.createJwtToken =
        async (user, expires, maxAge) => {
            return await jsonwebtoken.sign(
                {
                    expires,
                    message,
                    maxAge,
                    // userId: user.userId,
                    // email: user.email,
                    // name: `${user.firstName} ${user.lastName}`,
                    created: Date.now(),
                },
                configGoogle.jwtSecret);
        };
}
module.exports= new OrderControllerMain();
