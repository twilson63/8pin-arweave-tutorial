<script>
  import { Route, router, meta } from "tinro";
  import Navbar from "./lib/navbar.svelte";
  import About from "./about.svelte";
  import { activity, submit, waitfor, getTx } from "./arweave.js";
  import { toArrayBuffer } from "./fs.js";
  import { pinFromTx } from "./pin.js";
  import Map from "./lib/map.svelte";
  import Marker from "./lib/marker.svelte";
  import { connect } from "./arweaveapp.js";
  import * as arconnect from "./arconnect";
  import * as marked from "marked";
  import { address } from "./store.js";
  import { writable } from "svelte/store";
  import { getCoordinates, getPlace } from "./lib/geocoding.js";

  router.mode.hash();

  const { VITE_ARWEAVE_PROTOCOL, VITE_ARWEAVE_HOST, VITE_ARWEAVE_PORT } =
    import.meta.env;
  const arweaveUrl = `${VITE_ARWEAVE_PROTOCOL || "https"}://${
    VITE_ARWEAVE_HOST || "arweave.net"
  }:${VITE_ARWEAVE_PORT || "443"}`;

  let files;
  let title, description, location, place, error;
  let progress = writable(0);
  let timestamp = new Date().toISOString();
  let upload = false;
  let lat = 32.7876;
  let lng = -79.9403;
  let once = false;

  async function getRecentPins() {
    // workaround
    if (!once) {
      getLocation();
      once = true;
    }

    const results = await activity();
    const pins = results
      .map((_) => pinFromTx(_.node))
      .filter((x) => x !== null)
      .map((pin) => {
        pin.image_url = `${arweaveUrl}/${pin.id}`;
        return pin;
      });
    return pins;
  }

  async function getPin(id) {
    return await getTx(id)
      .then((res) => (res !== null ? res : Promise.reject("Not Found!")))
      .then(pinFromTx)
      .then((pin) => {
        pin.image_url = `${arweaveUrl}/${pin.id}`;
        return pin;
      })
      .then((pin) => {
        pin.description =
          marked.parse(pin.description) +
          `<style>.pin-content a { text-decoration: underline; }</style>`;
        return pin;
      })
      .then(async (pin) => {
        const [lat, lng] = pin.location.split(",");
        pin.place = await getPlace(lng, lat);
        return pin;
      })
      .catch((e) => {
        router.goto("/404");
      });
  }

  async function publishPin() {
    // Show Progress
    router.goto("/publishing");
    // getData
    const data = await toArrayBuffer(files[0]);

    // createTags
    const tags = [
      { name: "Content-Type", value: files[0].type },
      { name: "App-Name", value: "8pin" },
      { name: "Protocol", value: "8pin" },
      { name: "Title", value: title },
      { name: "Description", value: description },
      { name: "Location", value: location },
      { name: "Timestamp", value: timestamp },
    ];

    const coords = location.split(",");
    lat = Number(coords[0]);
    lng = Number(coords[1]);

    try {
      const { ok, uploader, txId, message } = await submit({ data, tags });
      if (!ok) {
        if (message.includes("jwk")) {
          error =
            "Could not find wallet, please make sure your wallet is connected.";
        } else {
          error = message;
        }
        return;
      }
      clearData();
      // show upload progress
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        progress.set(uploader.uploadedChunks / uploader.totalChunks);
        console.log(
          `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
        );
      }
      upload = true;
      console.log("tx", txId);
      await waitfor(txId);
      upload = false;
      router.goto("/explore");
    } catch (e) {
      if (e.message.includes("410")) {
        error =
          "Could not publish transaction, please verify you have enough AR";
      }
      console.log(e);
      router.goto("/explore");
    }
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition(success, error);
    async function success(pos) {
      location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
      place = await getPlace(pos.coords.longitude, pos.coords.latitude);
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    }
    function error(err) {
      alert("Could not find your location: " + err.message);
    }
  }

  async function getCoords() {
    const result = await getCoordinates(place);
    location = `${result.lat}, ${result.lng}`;
    place = result.place;
  }

  function clearData() {
    title = null;
    description = null;
    files = null;
    location = null;
    timestamp = null;
  }

  function handleCreatePin(e) {
    location = `${e.detail.lat}, ${e.detail.lng}`;
    router.goto("/pins/new");
  }
</script>

<svelte:head>
  <link rel="canonical" />
</svelte:head>

<Route path="/">
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content text-center flex-col">
      <img src="8pin-logo2.png" alt="8pin-logo" style="height: 240px" />
      <h1 class="text-6xl">8pin</h1>
      <p>Drop a pin anywhere in the world, forever!</p>
      <div>
        <a class="btn btn-primary" href="/connect">Connect</a>
        <!--
        <a class="btn btn-primary" href="/explore">Explore</a>
        <a class="btn" href="/pins/new">Drop a Pin</a>
          -->
      </div>
      <div class="alert alert-info text-white md:w-1/2">
        <p class="">
          To get started, connect your Arweave wallet of choice. It costs less
          than a penny to add a pin to the Permaweb.
        </p>
      </div>
    </section>
  </main>
</Route>
<Route path="/explore">
  <Navbar />
  <main class="hero bg-base-100 min-h-screen">
    <section class="flex flex-col w-full">
      <div class="w-auto h-auto h-3/4 md:mx-4 md:my-4">
        <Map {lat} lon={lng} zoom={8} on:droppin={handleCreatePin}>
          {#await getRecentPins() then pins}
            {#each pins as pin}
              <Marker
                lat={pin.location.split(",")[0]}
                lon={pin.location.split(",")[1]}
                label={`
<div class="m-4 card w-48 md:w-96 bg-base-200">
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
      </div>
    </section>
  </main>
</Route>
<Route path="/pins/new">
  <Navbar />
  <main class="hero bg-base-200 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-3xl">Create a Pin</h1>
      {#if window?.arweaveWallet === undefined}
        <div class="alert alert-error flex-col items-start">
          <h3 class="text-2xl">ERROR: Wallet not found</h3>
          <p>
            Looks like you don't have a wallet on Arweave.app - get one here <a
              class="underline"
              href="https://arweave.app/add">https://arweave.app/add</a
            >
          </p>
          <p class="mt-4">
            Looks like you don't have ArConnect installed - get it here <a
              class="underline"
              href="https://arconnect.io">https://ArConnect.io</a
            >
          </p>
        </div>
      {/if}
      <div class="w-full">
        <form class="form" on:submit|preventDefault={publishPin}>
          <div class="form-control">
            <label for="title" class="label">Title</label>
            <input
              required
              type="text"
              id="title"
              name="title"
              class="input input-bordered"
              bind:value={title}
            />
          </div>
          <div class="form-control">
            <label for="description" class="label">Description</label>
            <input
              required
              type="text"
              id="description"
              name="description"
              class="input input-bordered"
              bind:value={description}
            />
          </div>
          <div class="form-control">
            <label for="photo" class="label">Photo</label>
            <input
              required
              type="file"
              id="photo"
              name="photo"
              class="input input-bordered"
              bind:files
              accept="image/png, image/jpeg, image/gif, image/jpg"
            />
          </div>
          <div class="mt-4 alert alert-warning shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                /></svg
              >
              <span
                >Warning: Any information and image you post will be on the<br
                />
                Permaweb. It is immutable and permanent. Act accordingly - no<br
                />
                copyrighted material or NSFW. It's also connected with your<br
                />
                wallet address. Thanks!</span
              >
            </div>
          </div>
          <!--
          <div class="form-control">
            <label for="place" class="label">Place</label>
            <input
              required
              type="text"
              id="place"
              name="place"
              placeholder="Enter place for pin"
              class="input input-bordered"
              bind:value={place}
              on:blur={getCoords}
            />
          </div>
          -->
          <div class="form-control">
            <label for="location" class="label">Location</label>
            <input
              required
              type="text"
              id="location"
              name="location"
              class="input input-bordered"
              bind:value={location}
            />
            <button on:click={getLocation} type="button" class="btn mt-4"
              >Get Current Location</button
            >
          </div>
          <div class="form-control">
            <label for="timestamp" class="label">Date/Time</label>
            <input
              required
              type="datetime-local"
              id="timestamp"
              name="timestamp"
              class="input input-bordered"
              bind:value={timestamp}
              on:change={(e) => (e.target.value = e.target.value.substr(0, 16))}
            />
          </div>
          <div class="mt-8">
            <button class="btn btn-primary">Submit</button>
            <button
              on:click={() => {
                window.scrollTo(0, 0);
                router.goto("/explore");
              }}
              class="btn">Cancel</button
            >
          </div>
        </form>
      </div>
    </section>
  </main>
</Route>
<Route path="/pins/:id/show">
  <Navbar />
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col md:flex-row space-x-8">
      {#await getPin(meta().params.id) then pin}
        <figure class="md:w-1/2">
          <img class=" rounded-md" src={pin.image_url} alt={pin.title} />
        </figure>
        <div class="card md:w-1/2 bg-base-100 shadow-xl p-4">
          <h1 class="card-title">{pin.title}</h1>
          <div class="card-body">
            <div class="pin-content">{@html pin.description}</div>
            <p>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "full",
                timeStyle: "long",
              }).format(new Date(pin.timestamp))}
            </p>
            <p>{pin.place}</p>
            <p>{pin.location}</p>
          </div>
          <div class="card-actions justify-end mt-8 space-x-4">
            <button
              on:click={() => {
                window.scrollTo(0, 0);
                lat = pin.location.split(",")[0];
                lng = pin.location.split(",")[1];
                router.goto("/explore");
              }}
              class="btn btn-primary">8pin</button
            >
            <a
              class="btn"
              target="_blank"
              href="https://twitter.com/intent/tweet?via=onlyarweave&text={encodeURI(
                'Check out my pin on the permaweb'
              )}&url={window.location.href.replace('#', '%23')}"
            >
              Tweet</a
            >
          </div>
        </div>
      {/await}
    </section>
  </main>
</Route>
<Route path="/connect">
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-6xl">Connect Wallet</h1>
      <p>
        In order to drop a pin and view your pins, you will need to connect to
        your Arweave Wallet
      </p>
      <p>8pin currently supports two wallets, Arweave.app and ArConnect</p>
      <div class="flex space-x-8">
        <button
          class="btn"
          on:click={async () => {
            const addr = await connect();
            $address = addr;
            router.goto("/explore");
          }}>Arweave.app</button
        >
        <button
          class="btn"
          on:click={async () => {
            $address = await arconnect.connect();
            console.log($address);
            if ($address !== "") {
              router.goto("/explore");
            }
          }}>ArConnect</button
        >
      </div>
    </section>
  </main>
</Route>
<Route path="/publishing">
  <main class="hero bg-base-100 min-h-screen min-w-screen">
    <section class="hero-content flex-col">
      {#if error}
        <h1 class="text-6xl">Error Publishing Pin</h1>
        <div class="alert alert-error">
          {error}
        </div>
        <div class="flex space-x-4">
          <a
            on:click={() => (error = null)}
            class="btn btn-primary"
            href="/pins/new">Try Again</a
          >
          <a on:click={() => (error = null)} class="btn" href="/explore"
            >Explore</a
          >
        </div>
      {:else}
        <h1 class="text-6xl">Publishing Pin</h1>

        <div class="bg-base-200 h-16 w-full md:w-full">
          <progress class="w-full block h-16" value={$progress} />
        </div>
        {#if upload}
          <div>
            <h3>Verifying Transaction with arweave...</h3>
          </div>
        {/if}
      {/if}
    </section>
  </main>
</Route>
<Route path="/about">
  <About />
</Route>
<Route path="/404">
  <Navbar />
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <div class="alert alert-warning">
        <h1 class="text-6xl">Pin Not Found!</h1>
      </div>
      <div class="mt-8">
        <a class="btn btn-primary" href="/explore">Explore</a>
      </div>
    </section>
  </main>
</Route>
