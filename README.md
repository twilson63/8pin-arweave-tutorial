<img align="center" style="height: 64px" src="app/public/8pin-logo2.png" alt="logo" />
<h1 align="center">8pin Arweave tutorial</h1>
<p align="center">Build a dapp on ArWeave!</p>
<p align="center">In this tutorial we are going to use common web techonologies to build a dapp on the Arweave Blockweave</p>

---

## Who is this tutorial for?

If you are new to Arweave and are comfortable with HTML, CSS, and Javascript, this tutorial will guide you through some of the basic Arweave development components to deliver a Permaweb dapp. To learn more about Arweave, get started at https://www.arweave.org/.

I like to think of Arweave as a decentralized application distribution platform.

Before we dive in, lets have a quick discussion about what we are trying to achieve.

## A geopin application `8pin`

8pin allows users to take some text and a photo and document a moment at a specific location. In this tutorial we 
will step through the process of using many of the Arweave developer tools and libraries to deliver our 8pin application to the Permaweb.

8pin is built using Svelte, Tailwind and NodeJS, so to get the most out of this tutorial you should be familiar with Javascript. The frontend code and styles are already in place, we will walk through the process of integrating the application to the Arweave platform. 

Arweave is unique, because it serves as our storage service as well as our application service and is decentralized. So we will use Arweave to read and write data for our application as well as deploy our application's code to Arweave to serve the app via a web browser. This concept at first may take a little time to comprehend. Arweave is made up of nodes and gateways. The nodes manage the storage and blockweave bits, while the gateways manage the Cache, RPC API, and Query features. The gateway is where the magic happens for our decentralized applications. By storing data with metadata tags like 'Content-Type' we can provide information to the gateway servers how to present our data. This allows a web browser to interact directly with our application as if the gateway is a web server.

## Why Arweave for web3?

Arweave is a blockweave, which means its like a blockchain, but Arweave supports data of any size for transactions, this is fundamentally different that the current blockchains and creates a unique differentiator between other layer 1 networks. With Arweave you get a cloud development and hosting platform in one, Arweave supports web standards, smart contracts, Profit Sharing Tokens (Token), Profit Sharing Communities (DAO) and NFTs (Non-Fungible Tokens), and you can use almost any language to leverage these features, if you are a full stack developer and work with technologies like javascript, graphql, APIs, etc. You are more than prepared to develop on the Arweave ecosystem.

## Prerequisites

* Git/Github - https://github.com
* NodeJS/npm/Javascript - https://nodejs.com
* JSON/GraphQL - https://graphql.org
* Mapbox account - https://www.mapbox.com/

> Create a free mapbox account to take advantage of the mapping and geocoding features. You will need a free developer public API key. https://www.mapbox.com

## Setup

Fork the following repository: https://github.com/twilson63/8pin-arweave-tutorial, then clone it to your local environment, or spin it up in gitpod: https://gitpod.io#[your forked repo]

Open a terminal window in the project directory and run:

```
yarn
```

Create a `app/.env`, the `.env` file will setup our environment settings for the application, we need to specify the following settings:

> NOTE: make sure you create your `.env` file in the `app` directory.

`app/.env`

```
VITE_MAPBOX=MAPBOX_TOKEN_HERE
VITE_ARWEAVE_PORT=1984
VITE_ARWEAVE_PROTOCOL=http
VITE_ARWEAVE_HOST=localhost
```

## Topics

This guide is broken into sections that take roughly 20 - 30 minutes to complete, depending on your experience. The level of Svelte understanding you should have is the amount taught by the [Svelte Tutorial](https://svelte.dev). If you are not familiar with Svelte then https://svelte.dev/tutorial is a great place to start.

1. [Arweave Developer Tools Review (5 minutes)](#arweave-devtools)
1. [Setting up Arlocal (10 - 20 minutes)](#setting-up-arlocal)
1. [Querying Arweave (25 - 30 minutes)](#querying-arweave)
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

Arlocal allows us to run a `devnet` local Arweave gateway/node, to iterate on our development locally. https://github.com/textury/arlocal

> Arlocal is a great tool, I have not found any differences between my interaction with arlocal and the arweave.net, when my code works with arlocal, I am 100% confident it will work on arweave.net.

ArweaveJS is a javascript library that provides us with the APIs to post data on the weave and query data from the weave using `GraphQL`. https://github.com/ArweaveTeam/arweave-js

> Arweave js abstacts the JSON RPC api and wraps the commands using a javascript friendly promised based api, so you can generate wallets, create, sign, and post transactions.

ArweaveWalletConnector is a module that allows us to connect with the wallet application called `arweave.app`. https://github.com/jfbeats/ArweaveWalletConnector

> Arweave wallet connector interacts with the arweave.app wallet and gives you the connect, disconnect and several wallet connection events.

ArConnect is a module that allows us to connect with the ArConnect browser extension wallet, the most popular wallet in the arweave community. https://github.com/th8ta/ArConnect

> ArConnect interacts with the ArConnect browser extension, the extension injects arweaveWallet into the browser, so that you can interact with arconnect via the arweaveWallet API.

Arkb is a command-line application that publishes our web application to the permaweb. https://github.com/textury/arkb

> arkb allows you to deploy your web application to the permaweb the layer on top of the arweave network that is managed by arweave gateways, the permaweb uses the tags on the arweave transaction to serve up specific transactions in the web browser. This technology allows you to deploy any web asset as a blockweave transaction.


---

## Setting up Arlocal

Time: (10 - 20 minutes)

Arlocal is a local server that implements the same API as the Arweave network, this enables you to develop locally then when ready deploy your app to https://arweave.net.

It is easy to setup, you simply install it from npm and setup a script for you to start the server.

```
npx arlocal
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

One of the coolest things about Arweave is the gateway server supports Graphql out of the box! Yes! Out of the box, you can use Graphql to query the blockweave! Crazy right? 

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

When we post our transaction with tags, we can use those tags as selectors in our Graphql 
queries to filter our query requests. In our above example, we are using the tag name `App-Name` and the tag value `8pin` as selector criteria in our Graphql query. 

---


## Discussing the 8pin protocol (10 - 20 minutes)

Since Arweave is a decentralized data storage layer, you can leverage Arweave to become your cloud backend! The way this works, is that you create a protocol for your data, the protocol is very much like a schema in a database, it defines the shape of your data for your application. An Arweave transaction is made up of several properties, but the most important properties for our protocol design is the data property and the tags properties. With Arweave you can create tags on every transactions, but tthe combination of all the tags you create can only contain a total 2048 bits of data. These tags can be used to enable queryable transactions via Graphql. Our goals for the 8pin protocol is to be able to list our transactions on a map, in an efficient way. Our graphql query will need to return location data, a title, we also want to filter the list via timestamps, so we need to make sure timestamps are added to our tags specification.

```
data: image
tags:
  App-Name: '8pin' // constant
  Protocol: '8pin' // constant
  Content-Type: 'image/png|jpg|gif' // only support images
  Title: 'Title of Pin' // limit 20 characters
  Description: 'Description of Pin' // limit 100 characters
  Location: 'lat, lng' // Latitude, Longitude 
  Timestamp: '' // new Date.toISOString()
```

With this basic protocol, anyone can drop a pin in any application, and 8pin will be able to find it and show it on a map.

> We want to keep the protocol simple, if you want to make enhancements you can extend, but not change these properties, if you modify any of the properties above, then they will not show in this 8pin application.

### Model Schema

We want to make sure we have a solid validation process to verify transactions coming from Arweave to match our protocol, and when we create transactions that they can be signed and posted to the Arweave network. This model schema will validate our data for 8pin.

> NOTE: This is for reference purposes, no need to enter this in to `src/pin.js` it is already there.

We will use `zod` to create a schema check:

``` js
import { z } from 'zod'

const schema = z.object({
  id: z.string(),
  title: z.string().max(20),
  description: z.string().max(100),
  location: z.string().max(50),
  timestamp: z.string().max(50)
})
```

``` js
export const pinFromTx = (tx) => {

  try {
    return schema.parse({
      id: tx.id,
      title: (tx.tags.find(t => t.name === 'Title')).value,
      description: (tx.tags.find(t => t.name === 'Description')).value,
      location: tx.tags.find(t => t.name === 'Location').value,
      timestamp: tx.tags.find(t => t.name === 'Timestamp').value
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

export const formToTx = (formData) => {
  return {
    data: formData.photo,
    tags: [
      { name: 'App-Name', value: '8pin' },
      { name: 'Protocol', value: '8pin' },
      { name: 'Title', value: formData.title },
      { name: 'Location', value: formData.location },
      { name: 'Description', value: formData.description },
      { name: 'Timestamp', value: formData.timestamp }
    ]
  }
}
```

### Summary

Thinking in terms of protocols instead of models is a bit of a challenge when 
moving from web2 to web3. It is important to keep your protocol schema, clean
and simple, if you need to extend in the future you can create additional protocols
and compose them. Be sure to always validate incoming data from the blockweave.

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
```

> Import the arweave module and initialize our arweave constant using the `.env` variables or default to mainet. Mainet 
> is the production version of Arweave's network.

Below the init block we will add our first arweave function:

``` js
export const activity = async () => {
  try {
    const result = await arweave.api.post('graphql', {
      query: `
query {
  transactions (first: 100, tags: { name: "Protocol", values: ["8pin"] }) {
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
    return result?.data?.data?.transactions?.edges
  } catch (e) {
    return []
  }
}
```

This function will query the Arweave network for all of the 8pin pins and return the most recent 100 pins dropped on the network using Graphql. You will notice the result returns two nested data objects, then transactions, and edges.

Now that we have our activity function, lets connect it to our interface, by opening up the `src/App.svelte` file and updating the `getRecentPins` function with a call to `activity` in the arweave module.

Lets plug this module into our app module

``` svelte
<script>
...
import { activity } from './arweave.js'
...

async function getRecentPins() {
  const pins = await activity()
  return pins.map((_) => pinFromTx(_.node)) //
    .filter((x) => x !== null) // filter out invalid pins
    .map((pin) => {
        pin.image_url = `${arweaveUrl}/${pin.id}`;
        return pin;
      })
}
...
</script>
<!-- No need to type this -->
<Map {lat} lon={lng} zoom={8} on:droppin={handleCreatePin}>
{#await getRecentPins() then pins}
  {#each pins as pin}
    <Marker
      lat={pin.location.split(",")[0]}
      lon={pin.location.split(",")[1]}
      label={`
<div class="m-4 card w-96 bg-base-200">
  <div class="card-body">
    <h1 class="card-title text-center">${pin.title}</h1>
    <p>${pin.description}</p>  
  </div>
  <div class="card-actions pb-4 justify-center">
    <a class="btn btn-ghost" href="/pins/${pin.id}/show">View Pin</a> 
  </div>
</div>             
     `}
      />
  {/each}
{/await}
</Map>
```

Now when you navigate to the `/explore` page you should see a couple of pins on our map.

🎉

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
	name: '8pin',
	logo: `${window.location.origin}/8pin-logo2.png`
})

wallet.setUrl('arweave.app')

export const connect = async () => {
  const result = await wallet.connect()
  if (result.ready) {
    const addr = arweaveWallet.getActiveAddress()
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

Here are some of the permissions we will be using: `['ACCESS_ADDRESS', 'SIGN_TRANSACTION']`

You can find out more about all the permissions for ArConnect in their project readme (https://github.com/th8ta/ArConnect#permissions)


#### ArConnect AppInfo

AppInfo is the second argument to the connect method, this is where you can show the name and logo of your app within the wallet view. It is optional, but can provide value to give the user observability to connect the wallet with the dapp.

``` js
await arweaveWallet.connect(permissions, {name: '8pin', `${window.location.origin}/8pin-logo2.png`})
```

#### ArConnect Module

Lets create our ArConnect module:

``` js
export const connect = async () => {
  if (!window.arweaveWallet) {
    alert('ArConnect is not installed!')
    return ''
  }
  await arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ENCRYPT', 'DECRYPT'], { name: '8pin', logo: `${window.location.origin}/8pin-logo.png` })
  const addr = await arweaveWallet.getActiveAddress()
  localStorage.setItem('address', addr)
  localStorage.setItem('wallet', 'arconnect')
  return addr
}

```

---

## Posting transactions

Time:  (15 - 20 minutes)

Now that we have Arweave.js installed and a wallet connected, we are ready to create our first pin. Before we do that, lets mint some ar tokens for our local environment.

// https://[arlocal url]/mint/address/[winston 1000000000000000]

// Arweave.js

Lets build an Arweave transaction, we will use Arweave.js to build it.

``` js

export const submit = async ({ data, tags }) => {
  // 1. Wallet not Connected!
  if (window?.arweaveWallet === undefined) {
    return { ok: false, message: 'Wallet not connected!' }
  }

  const balance = await getBalance(await window.arweaveWallet.getActiveAddress())

  try {
    const tx = await arweave.createTransaction({ data })
    tags.map(({ name, value }) => tx.addTag(name, value))
    await arweave.transactions.sign(tx)
    // 2. check reward and wallet balance
    if (Number(tx.reward) > Number(balance)) {
      return { ok: false, message: 'Not Enough AR to complete request!' }
    }
    const uploader = await arweave.transactions.getUploader(tx)
    return { ok: true, uploader, txId: tx.id }
  } catch (e) {
    return { ok: false, txId: tx.id, message: e.message }
  }
}
```

This function will take care of the create, sign and upload of our arweave transaction, and using our pin model we can validate the form entry data and convert to a `transactionObject` this is just a simple object that can be sent to the the submitTx function.

Next, we need to add a waitfor function, this function will gracefully check the Arweave gateway for a status on the processing of a transaction. Once the transaction is uploaded, we need verification from the gateway that the transaction has been accepted.

``` js
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

### Get Single Transaction

In order to view our newly saved transaction, we need to implement the getTx function in the `src/arweave.js` file.

`src/arweave.js`

``` js
export const getTx = async (id) => {
  try {
    const result = await arweave.api.post('graphql', {
      query: `
  query {
    transaction(id: "${id}") {
      id
      owner {
        address
      }
      tags {
        name
        value
      }
    }
  }
      `
    })
    return result?.data?.data?.transaction
  } catch (e) {
    return null
  }
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
arkb deploy app/dist --wallet mywallet.json --tag-name Deploy --tag-value 8pin
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

There is a lot more to discover with Arweave, hopefully this tutorial and workshop, gives you many ideas on how to innovate with the permaweb the new scalable decentralized app development platform.
