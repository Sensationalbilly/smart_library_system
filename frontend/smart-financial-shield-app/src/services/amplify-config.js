import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    region: 'us-east-1', // Change to your AWS region
    userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your Cognito User Pool ID
    userPoolWebClientId: 'XXXXXXXXX', // Replace with your Cognito Web Client ID
    identityPoolId: 'us-east-1:XXXXXXXXX-XXXXXXXXX-XXXXXXXXX', // Replace with your Identity Pool ID (optional)
    oauth: {
      domain: 'your-domain.auth.us-east-1.amazoncognito.com', // Replace with your Cognito domain
      scope: ['phone', 'email', 'profile', 'openid'],
      redirectSignIn: 'smartshield://auth', // Deep link redirect
      redirectSignOut: 'smartshield://home', // Deep link redirect
      responseType: 'code',
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;
