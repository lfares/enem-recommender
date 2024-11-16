# Recommendation System for ENEM
A personalized recommender system to study based on ENEM test results

Public URL: https://dev.d1cntwz97jp7ba.amplifyapp.com/

## Initial Setup

1. Install dependencies
```
brew install node
npm install -g @aws-amplify/cli
```

2. Initiate AWS Amplify

`amplify init`

3. Setup Frontend configs

```
npx create-react-app 
npm install aws-amplify @aws-amplify/ui-react
```

4. Setup DynamoDB storage

`amplify add storage`

5. Push changes to AWS

`amplify push`

6. Test UI locally

`npm start`

7. Deploy the application

```
amplify add hosting
amplify publish
```
