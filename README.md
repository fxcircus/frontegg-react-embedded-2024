# Frontegg - Hosted Login + React SDK + Entitlements

Reference documentation - [Embedded Login Integration (React)](https://docs.frontegg.com/docs/react-embedded-login-guide).

## How to run

### Frontegg account setup
Signup for a Frontegg account on one of our public regions:
- EU ➜ https://portal.frontegg.com/signup
- US ➜ https://portal.us.frontegg.com/signup
- CA ➜ https://portal.ca.frontegg.com/signup
- AU ➜ https://portal.au.frontegg.com/signup

Come back here once you complete the initial onboarding form

### Code setup

1. Clone the repo & install the dependencies
```
git clone https://github.com/fxcircus/frontegg-react-demo.git frontegg_react_sample

cd frontegg_react_sample

npm i
```

2. Navigate to `src/index.js` in your IDE or open it from the terminal
```
code .
```

 Add your Client ID and API Key from `Frontegg Portal ➜ [ENVIRONMENT] ➜ Env Settings page`:

```
const contextOptions = {
  baseUrl: 'https://[YOUR_SUBDOMAIN].frontegg.com',
  clientId: '[YOUR-CLIENT-ID]'
};
```
Save the file

### Complete the integration

Run the code from your terminal
```
npm start
```

Open your browser and navigate to `http://localhost:3000`