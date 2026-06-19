import Amplify from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: 'eu-north-1', // your AWS region
    userPoolId: 'eu-north-1_nryjzh', // your User Pool ID
    userPoolWebClientId: '7lfib29kd2adtk1dh4rj8r62go', // your App Client ID
    oauth: {
      domain: 'smartshield.auth.eu-north-1.amazoncognito.com', // your Hosted UI domain
      scope: ['email', 'openid'],
      redirectSignIn: 'smartshield://callback',
      redirectSignOut: 'smartshield://signout',
      responseType: 'code',
    },
  },
});
