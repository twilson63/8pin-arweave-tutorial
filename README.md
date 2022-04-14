<h1 align="center">8pin ArWeave tutorial</h1>
<p align="center">Build a dapp on ArWeave!</p>
<p align="center">In this tutorial we are going to use common web techonologies to build a dapp on the ArWeave Blockweave</p>

---

## Who is this tutorial for?

If you are familiar with Arweave and are comfortable with javascript, this tutorial will guide you through some of the arweave development components to deliver a permaweb dapp. To learn more about Arweave, get started at https://www.arweave.org/.

Before we dive in, lets have a quick discussion about what we are trying to achieve.

## A geopin drop application `8pin`

At the end of this guide you will have built a geopin drop application deployed permanently on arweave. Because both data and front end will be stored on arweave, no third party or bad actor can censor them or take it down. All for the cost of less than a penny!

We are going to assume you already have some familiarity with Svelte and Tailwind, and start with a sample app -- filling in the Arweave specific functionality to learn how to build directly on Arweave.

We will create a protocol for 8pin, the protocol will be common to any geopin drop application on ArWeave, we do not need to use a cloud or even a database, we will use the blockweave to store and access our data. ArWeave enables composability, so that many frontend applications can leverage the same data and render or manage it differently. Composability is a big part of the web3 ecosystem, by defining a re-usable protocol we can create rapid iteration and exploration by building on top of existing building blocks without having to invent from scratch each time.

## Why Arweave for web3?

Arweave is a blockweave, which means its like a blockchain, but arweave supports data of any size for transactions, this is fundamentally different that the current blockchains and creates a unique differentiator between other layer 1 networks. With arweave you get a entire cloud development platform and hosting platform in one, it supports web standards, smart contracts and NFTs, but you don't have to learn any specific languages to leverage these features, if you are a full stack developer and work with technologies like javascript, graphql, APIs, etc. You are more than prepared to develop on the arweave ecosystem.

## Prerequisites

* Git/Github - https://github.com
* NodeJS/npm/Javascript - https://nodejs.com
* JSON/GraphQL - https://graphql.org
* Mapbox account - https://www.mapbox.com/

> Create a free mapbox account to take advantage of the mapping and geocoding features. You will need a free developer public API key.

## Setup

Fork the following repository: https://github.com/twilson63/8pin-arweave-tutorial, then clone it to your local environment, or spin it up in gitpod: https://gitpod.io#[your forked repo]

Open a terminal window in the project directory and run:

```
yarn
```

## Topics

This guide is broken into sections that take roughly 20 - 30 minutes to complete, depending on your experience. The level of Svelte understanding you should have is the amount taught by the [Svelte Tutorial](https://svelte.dev). If you are not familiar with Svelte then https://svelte.dev/tutorial is a great place to start.

1. [Arweave Developer Tools (10 - 15 minutes)](#arweave-devtools)
1. [Setting up Arlocal (10 - 20 minutes)](#setting-up-arlocal)
1. [Querying ArWeave (25 - 30 minutes)](#querying-arweave)
1. [Discussing the 8pin protocol (5 minutes)](#discussing-8pin-protocol)
1. [Integrating Arweave-js (25 - 30 minutes)](#integrating-arweave-js)
1. [Integrating Arweave.app (25 - 30 minutes)](#integrating-arweave-app)
1. [Posting transactions (15 - 20 minutes)](#posting-transactions)
1. [Deploying to Arweave.net (25 - 30 minutes)](#deploying-to-arweave.net)


---

## Arweave DevTools

* ArLocal
* ArweaveJS
* ArweaveWalletConnector
* ArConnect
* Arkb

These are a list of tools that we will be using from the Arweave ecosystem to help us with our application, 

arlocal allows us to run a `devnet` local arweave gateway/node, to iterate on our development locally. https://github.com/textury/arlocal

> arlocal is a great tool, I have not found any differences between my interaction with arlocal and the arweave.net, when my code works with arlocal, I am 100% confident it will work on arweave.net.

ArweaveJS is a javascript library that provides us with the APIs to post data on the weave and query data from the weave using `GraphQL`. https://github.com/ArweaveTeam/arweave-js

> arweave js abstacts the JSON RPC api and wraps the commands using a javascript friendly promised based api, so you can generate wallets, create, sign, and post transactions.

ArweaveWalletConnector is a module that allows us to connect with the wallet application called `arweave.app`. https://github.com/jfbeats/ArweaveWalletConnector

> arweave wallet connector interacts with the arweave.app wallet and gives you the connect, disconnect and several wallet connection events.

ArConnect is a module that allows us to connect with the ArConnect browser extension wallet, the most popular wallet in the arweave community. https://github.com/th8ta/ArConnect

> arconnect interacts with the arconnect browser extension, the extension injects arweaveWallet into the browser, so that you can interact with arconnect via the arweaveWallet API.

Arkb is a command-line application that publishes our web application to the permaweb. https://github.com/textury/arkb

> arkb allows you to deploy your web application to the permaweb the layer on top of the arweave network that is managed by arweave gateways, the permaweb uses the tags on the arweave transaction to serve up specific transactions in the web browser. This technology allows you to deploy any web asset as a blockweave transaction.


---

## Setting up Arlocal

Time: (10 - 20 minutes)

Arlocal is a local server that implements the same API as the Arweave network, this enables you to develop locally then when ready deploy your app to https://arweave.net.

It is easy to setup, you simply install it from npm and setup a script for you to start the server.

```
npm install --save-dev arlocal
npx json -I -f package.json -e 'this.scripts.arlocal = "arlocal --persist"'
yarn arlocal
```

You can find out more about Arlocal in its repository - https://github.com/textury/arlocal - check out the readme, it has some cool options that you may be interested in, like running on a different port, or hiding the logs, or running programatically.

Open another terminal window and run:

```
yarn load-data
```

> This command is just setting up some transactional data for us to play with.

---

## Querying ArWeave

Time: (25 - 30 minutes)

One of the coolest things about arweave is the gateway server supports graphql out of the box! Yes! Out of the box, you can use graphql to query the blockweave! Crazy right? 

Make sure your `arlocal` server is running, we want to open a browser to http://localhost:1984/graphql. You should get a screen requesting you to launch the apollo graphql visual tool. Click on that button, and you should see the graphql query environment. Yay! ⭐️

This environment gives you the ability to create graphql queries and run them against your arlocal server. For example, lets run this query:

``` gql
query {
  transactions (tags: {
    name: "App-Name"
    values: ["8pin"]
  }) {
    edges {
      node {
        id
        tags {
          name
          value
        }
        data {
          size
        }
        block {
          id
        }
      }
    }
  }
}
```

You should see some results like:

``` json
{
  "data": {
    "transactions": {
      "edges": [
        {
          "node": {
            "id": "wOFui-eLxA8DKjgzUI9JDopa-EN9ARCxiG2oTcL0qjM",
            "tags": [
              {
                "name": "App-Name",
                "value": "8pin"
              },
              {
                "name": "Version",
                "value": "0.1"
              },
              {
                "name": "Content-Type",
                "value": "image/png"
              },
              {
                "name": "title",
                "value": "Mount Pleasant, SC"
              },
              {
                "name": "location",
                "value": "33.074600,-79.762800"
              },
              {
                "name": "timestamp",
                "value": "2022-03-30T19:02:52.716Z"
              }
            ],
            "data": {
              "size": "15720267"
            },
            "block": {
              "id": "r7983ilr0sxvlwz2boo04luf9olhppqxee81dn9iqq67pnj7kugudi0iod89wv8w"
            }
          }
        }
      ]
    }
  }
}
```

We can use tags to create queries on graphql and get access to specific transactions, in this case we are getting all the transactions that use the App-Name `8pin`. 

---


## Discussing the 8pin protocol (10 - 20 minutes)

Since arweave is a decentralized data storage layer, you can leverage arweave to become you cloud backend, the way you do this, you create a protocol for use by any similar application, the protocol is very much like a schema in a database, it defines the shape of your data for your application. An Arweave transaction is made up of several properties, but the most important properties for our protocol design is the data property and the tags properties. With Arweave you can create tags that can only contain 2048 bits of data, but these tags can be used to enable queryable transactions via graphql. Our goals for the 8pin protocol is to be able to list our transactions on a map, in an efficient way. So our graphql query will need to return location data, a title, we also want to filter the list via timestamps, so we need to make sure timestamps are added to our tags specification.

```
data: image
tags:
  App-Name: '8pin' // constant
  Protocol: '8pin' // constant
  Content-Type: 'image/png|jpg|gif' // only support images
  Title: 'Title of Pin' // limit 20 characters
  Location: 'lat, lng' // Latitude, Longitude 
  Timestamp: '' // new Date.toISOString()
```

With this basic protocol, anyone can drop a pin in any application, and 8pin will be able to find it and show it on a map.

> We want to keep the protocol simple, if you want to make enhancements you can extend, but not change these properties, if you modify any of the properties above, then they will not show in this 8pin application.

### Model Schema

We want to make sure we have a solid validation process to verify transactions coming from the blockweave match our
protocol, and when we create transactions that they can be signed and posted to the arweave network. This model schema will validate our data f

---

## Integrating Arweave-js

Time: (25 - 30 minutes)

Arweave-js is the official javascript/typescript library for interacting with Arweave Blockweave. 

### install arweave-js

```
cd app
yarn add arweave
```

Lets create a new file called `arweave.js` in the `app/src` folder

``` js
import Arweave from 'arweave'

// we want to use a `.env` file for arlocal and if not set, then use
// arweave.net for production
const arweave = Arweave.init({
  host: import.meta.env.VITE_ARWEAVE_HOST || 'arweave.net',
  port: import.meta.env.VITE_ARWEAVE_PORT || 443,
  protocol: import.meta.env.VITE_ARWEAVE_PROTOCOL || 'https'
})

export const activity = async () => {
  // TODO: this function will return the most recent pins
  return arweave.api.post('graphql', {
    query: `
query {
  transactions (tags: { name: "Protocol", values: ["8pin"] }) {
    edges {
      node {
        id
        tags {
          name
          value
        }
      }
    }
  }
}
    `
  })
}

```

Lets plug this module into our app module

``` svelte
<script>
...
import { activity } from './arweave.js'
// replace current function with this one
function getRecentPins() {
  return activity()
    .map((_) => pinFromTx(_.node))
    .filter((x) => x !== null)
}
...

</script>
```

Now when you navigate to the `/explore` page you should see a couple of pins on our map.

---

### arweave access layer

Lets create a arweave access layer for our application, so that all of our components can access the arweave functionality from a single module.


---

## Integrating Arweave.app and arConnect

Time:  (25 - 30 minutes)

A digital wallet is an application that holds your keys to interact with a blockchain like network. In Arweave there are many wallets, for our application, we will give our users the option to use ArConnect a web extension wallet or Arweave.app a browser based wallet. ArConnect only works on the desktop and you have to install is as a web extension, Arweave.app is a web wallet, so it will work on the mobile web just fine, you do have the change the tab back to the application once connected.

### Setting up Arweave.app

The first thing we need to do is install the arweave connector modules

``` sh
yarn add arweave-wallet-connector
```

Then we can create `arweaveapp.js` file in our `app/src` folder to contain the following code:

``` js
import { ArweaveWebWallet } from 'arweave-wallet-connector'

const wallet = new ArweaveWebWallet({
	name: 'Connector Example',
	logo: 'https://jfbeats.github.io/ArweaveWalletConnector/placeholder.svg'
})

wallet.setUrl('arweave.app')

export const connect = async () => {
  const result = await wallet.connect()
  if (result.ready) {
    const addr = arweaveWallet.getActiveAddress()
    address.set(addr)
    localStorage.setItem('address', addr)
    localStorage.setItem('wallet', 'arweave.app')
    return addr
  }
  else {
    return null
  }
}

```

### Setting up ArConnect

ArConnect is the web browser extension wallet, similar to metamask, this wallet, holds the users keys in an extension and injects the `arweaveWallet` object into the window object. So you can tell if ArConnect is available by checking that object.

#### ArConnect Permissions

With ArConnect, when you connect as an app you can indicate the permissions you would like to access for the wallet.

Here are some of the permissions we will be using: `['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ENCRYPT', 'DECRYPT']`

You can find out more about all the permissions for ArConnect in their project readme (https://github.com/th8ta/ArConnect#permissions)


#### ArConnect AppInfo

AppInfo is the second argument to the connect method, this is where you can show the name and logo of your app within the wallet view. It is optional, but can provide value to give the user observability to connect the wallet with the dapp.

``` js
await arweaveWallet.connect(permissions, {name: '8pin', logo: 'url'})
```

#### ArConnect Module

Lets create our arconnect module:

``` js

export const connect = async () => {
  if (!arweaveWallet) {
    alert('ArConnect is not installed!')
  }
  await arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ENCRYPT', 'DECRYPT'], { name: '8pin' })
  return await arweaveWallet.getPublicAddress()
}
```

---

## Posting transactions

Time:  (15 - 20 minutes)

Now that we have arweave.js installed and a wallet connected, we are ready to create our first pin. Before we do that, lets mint some ar tokens for our local environment.

// https://[arlocal url]/mint/address/[winston]

// arweave.js

Lets build an arweave transaction, we will use arweave.js to build it.

``` js

export async function submitTx(txObj) {
  const tx = await arweave.createTransaction({
    data: txObj.data
  })
  txObj.tags.map(tag => tx.addTag(tag.name, tag.value))
  await arweave.transactions.sign(tx)
  // upload tx
  let uploader = await arweave.transactions.getUploader(tx)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    //console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
  }
  return
}
```

This function will take care of the create, sign and upload of our arweave transaction, and using our pin model we can validate the form entry data and convert to a `transactionObject` this is just a simple object that can be sent to the the submitTx function.

``` js
export const submit = async ({ data, tags }) => {
  const tx = await arweave.createTransaction({ data })
  tags.map(({ name, value }) => tx.addTag(name, value))
  try {
    await arweave.transactions.sign(tx)
    const uploader = await arweave.transactions.getUploader(tx)
    return { ok: true, uploader, txId: tx.id }
  } catch (e) {
    console.log(e)
    return { ok: false, tx, message: e.message }
  }
}

export const waitfor = async (txId) => {
  let count = 0;
  let foundPost = null;

  while (!foundPost) {
    count += 1;
    console.log(`attempt ${count}`);
    await delay(2000 * count);
    const result = await arweave.api.post('graphql', {
      query: `
query {
  transaction(id: "${txId}") {
    id
  }
}
    `});
    foundPost = result.data.data.transaction.id === txId;
    if (count > 10) {
      break; // could not find post
    }
  }
  return foundPost
}


```

---

## Deploying to Arweave.net 

Time: (25 - 30 minutes)

Now that we have a functioning application, we want to deploy the app to permaweb, but lets practice on arlocal first. We will be using a cli tool called `arkb`, this command-line tool will deploy.

Arkb is a command-line tool that makes it easy


``` sh
arkb deploy app/dist --wallet mywallet.json --gateway http://localhost:1984
```

## Production Deploy

``` sh
arkb deploy app/dist --wallet mywallet.json
```

---

## Summary

Congrats! You have reached the end of the Arweave 8pin dapp tutorial, in this tutorial you should have learned:

* how to use arlocal for development
* how to use graphql to query the blockweave
* how to work with arweave-js to create, sign and post a transaction
* how to think in terms of protocols as data models
* how to use arweave.app as a wallet
* how to use arconnect as a wallet
* how to submit a 8pin transaction and wait for the response
* how to deploy to arlocal
* how to deploy to production

There is a lot more to discover with arweave, hopefully this tutorial and workshop, gives you many ideas on how to innovate with the permaweb the new scalable decentralized app development platform.