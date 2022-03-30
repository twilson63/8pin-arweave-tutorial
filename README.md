<h1 align="center">8pin ArWeave tutorial</h1>
<p align="center">Build a dapp on ArWeave!</p>
<p align="center">In this tutorial we are going to use common web techonologies to build a dapp on the ArWeave Blockweave</p>

---

Before we dive in, lets have a quick discussion about what we are trying to achieve.

## A geopin drop application `8pin`

At the end of this guide you will have built a geopin drop application deployed permanently on arweave. Because both data and front end will be stored on arweave, no third party or bad actor can censor them or take it down. All for the cost of less than a penny!

We are going to assume you already have some familiarity with Svelte and Tailwind, and start with a sample app -- filling in the Arweave specific functionality to learn how to build directly on Arweave.

We will create a protocol for 8pin, the protocol will be common to any geopin drop application on ArWeave, we do not need to use a cloud or even a database, we will use the blockweave to store and access our data. ArWeave enables composability, so that many frontend applications can leverage the same data and render or manage it differently. Composability is a big part of the web3 ecosystem, by defining a re-usable protocol we can create rapid iteration and exploration by building on top of existing building blocks without having to invent from scratch each time.

## Prerequisites

* Git/Github - https://github.com
* NodeJS/npm/Javascript - https://nodejs.com
* JSON/GraphQL - https://graphql.org

## Setup

Fork the following repository: https://github.com/twilson63/8pin-arweave-tutorial, then clone it to your local environment, or spin it up in gitpod: https://gitpod.io#[your forked repo]

Open a terminal window in the project directory and run:

```
yarn
```

## Topics

This guide is broken into sections that take roughly 20 - 30 minutes to complete, depending on your experience. The level of Svelte understanding you should have is the amount taught by the [Svelte Tutorial](https://svelte.dev). If you are not familiar with Svelte then https://svelte.dev/tutorial is a great place to start.

1. Setting up Arlocal (10 - 20 minutes)
1. Querying ArWeave (25 - 30 minutes)
1. Discussing the 8pin protocol (10 - 20 minutes)
1. Integrating Arweave-js (25 - 30 minutes)
1. Integrating Arweave.app (25 - 30 minutes)
1. Posting transactions (15 - 20 minutes)
1. Deploying to Arweave.net (25 - 30 minutes)


---

## Setting up Arlocal (10 - 20 minutes)

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

## Querying ArWeave (25 - 30 minutes)

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


Discussing the 8pin protocol (10 - 20 minutes)