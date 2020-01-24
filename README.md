# Blink demo

This is the demo app for Blink (working title) which we will use to prototype features and test third party integrations, amongst other things. It is a [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) Front-End and node/express backend (for now)

## FE Installation

Use yarn or npm to install Blink FE app

```bash
yarn
```
or
```bash
npm i
```

## Running FE

In `app` directory

```bash
yarn start
```
or
```bash
npm start
```

## Testing

In `app` directory

```bash
yarn test
```
or
```bash
npm test
```

e2e tests to come once we have some proper flows to test - using cypress, which is awesome


## Running backend server locally

The backend currently consists of node/express apps (likely to change) which are hosted as firebsse cloud functions. You can also run these locally. 

You'll need typescript and firebase-tools installed globally to be able to run them: 


```bash
npm install -g firebase-tools
```

```bash
npm install -g typescript
```

The functions live in `app/functions` and can be served locally by running 
```bash
firebase serve
``` 
in the functions dir. 


You'll need to be logged in to the firebase project first. Talk to Nick P or another owner to get you added. 


You'll need some env vars to run these functions locally. Talk to Nick P or anyone else already set up to give them to you. 

The functions are written in TypeScript so will need to be compiled to be run locally. In `app/functions` run 
```bash
tsc
``` 
and then run firebase serve again. This isn't perfect and having to compile is easy to forget, but it's just for convinience. 

## CI

GitHub actions. There are two workflows in `.github/workflows` to deploy functions (backend) to the cloud and to test/build deploy the app separately. 


## Hosting

The app is currently hosted on firebase although this is likely to change

