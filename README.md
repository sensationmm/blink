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

The backend currently consists of node/express apps (likely to change) which are hosted as firebsse cloud functions. You can also run these locally. The functions live in `app/functions` and can be served locally by running 
```bash
server.js
``` 
in the root of the project. 

The functions are written in TypeScript so will need to be compiled to be run locally. In `app/functions` run 
```bash
tsc
``` 
and then restart your server

## CI

GitHub actions. There are two workflows in `.github/workflows` to deploy functions (backend) to the cloud and to test/build deploy the app separately. 


## Hosting

The app is urrently hosted on firebase although this is likely to change

