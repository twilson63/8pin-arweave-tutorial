<h1 align="center">8pin ArWeave tutorial</h1>
<p align="center">Build a dapp on ArWeave!</p>
<p align="center">In this tutorial we are going to use common web techonologies to build a dapp on the ArWeave Blockweave</p>

---

Before we dive in, lets have a quick discussion about what we are trying to achieve.

## A geopin drop application `8pin`

At the end of this guide you will have built a geopin drop application deployed permanently on arweave. Because both data and front end will be stored on arweave, no third party or bad actor can censor them or take it down. All for the cost of less than a penny!

We are going to assume you already have some familiarity with Svelte and Tailwind, and start with a sample app -- filling in the Arweave specific functionality to learn how to build directly on Arweave.

We will create a protocol for 8pin, the protocol will be common to any geopin drop application on ArWeave, we do not need to use a cloud or even a database, we will use the blockweave to store and access our data. ArWeave enables composability, so that many frontend applications can leverage the same data and render or manage it differently. Composability is a big part of the web3 ecosystem, by defining a re-usable protocol we can create rapid iteration and exploration by building on top of existing building blocks without having to invent from scratch each time.

## Prerequisite

* Git/Github - https://github.com
* NodeJS/npm/Javascript - https://nodejs.com
* JSON/GraphQL - https://graphql.org

## Topics

This guide is broken into sections that take roughly 20 - 30 minutes to complete, depending on your experience. The level of Svelte understanding you should have is the amount taught by the [Svelte Tutorial](https://svelte.dev). If you are not familiar with Svelte then https://svelte.dev/tutorial is a great place to start.

1. Setting up Arlocal (10 - 20 minutes)
1. Querying ArWeave (25 - 30 minutes)
1. Creating the 8pin protocol (10 - 20 minutes)
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
```

You can find out more about Arlocal in its repository - https://github.com/textury/arlocal - check out the readme, it has some cool options that you may be interested in, like running on a different port, or hiding the logs, or running programatically.

