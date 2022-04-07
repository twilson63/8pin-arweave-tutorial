<script>
  import { Route, router, meta } from "tinro";
  import Navbar from "./lib/navbar.svelte";
  import { activity, submit, waitfor, getTx } from "./arweave.js";
  import { toArrayBuffer } from "./fs.js";
  import { pinFromTx } from "./pin.js";
  import Map from "./lib/map.svelte";
  import Marker from "./lib/marker.svelte";
  import { connect } from "./arweaveapp.js";
  import { address } from "./store.js";
  import { writable } from "svelte/store";

  router.mode.hash();
  const { VITE_ARWEAVE_PROTOCOL, VITE_ARWEAVE_HOST, VITE_ARWEAVE_PORT } =
    import.meta.env;
  const arweaveUrl = `${VITE_ARWEAVE_PROTOCOL || "https"}://${
    VITE_ARWEAVE_HOST || "arweave.net"
  }:${VITE_ARWEAVE_PORT || "443"}`;

  let files;
  let title, description, location, timestamp;
  let progress = writable(0);

  async function getRecentPins() {
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
      .then(pinFromTx)
      .then((pin) => {
        pin.image_url = `${arweaveUrl}/${pin.id}`;
        return pin;
      });
  }

  async function publishPin() {
    // Show Progress
    router.goto("/publishing");
    // getData
    const data = await toArrayBuffer(files[0]);

    // createTags
    const tags = [
      { name: "App-Name", value: "8pin" },
      { name: "Protocol", value: "8pin" },
      { name: "Title", value: title },
      { name: "Description", value: description },
      { name: "Location", value: location },
      { name: "Timestamp", value: timestamp },
    ];

    clearData();

    const { ok, uploader, txId } = await submit({ data, tags });
    if (!ok) {
      router.goto("/explore");
      alert(
        "Could not publish pin, make sure you have connected a wallet and there is sufficent funds to create a pin."
      );
    }
    // show upload progress
    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      progress.set(uploader.uploadedChunks / uploader.totalChunks);
      console.log(
        `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
      );
    }
    await waitfor(txId);

    router.goto("/explore");
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition(success, error);
    function success(pos) {
      location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
    }
    function error(err) {
      alert("Could not find your location: " + err.message);
    }
  }
  function clearData() {
    title = null;
    description = null;
    files = null;
    location = null;
    timestamp = null;
  }
</script>

<Route path="/">
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content text-center flex-col">
      <h1 class="text-6xl">8pin</h1>
      <p>Drop a pin anywhere in the world, forever!</p>
      <div>
        <a class="btn btn-primary" href="/explore">Explore</a>
        <a class="btn" href="/pins/new">Drop a Pin</a>
      </div>
    </section>
  </main>
</Route>
<Route path="/explore">
  <Navbar />
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col w-full">
      <h1 class="text-6xl">Explore Pins</h1>
      <div class="w-full h-3/4">
        <Map lat={35} lon={-84} zoom={3.5}>
          {#await getRecentPins() then pins}
            {#each pins as pin}
              <Marker
                lat={pin.location.split(",")[0]}
                lon={pin.location.split(",")[1]}
                label={`
<h1 class="text-2xl">${pin.title}</h1>
<p>${pin.description}</p>  
<a class="btn btn-ghost" href="/pins/${pin.id}/show">View Pin</a>              
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
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-6xl">Create a Pin</h1>
      <div class="w-full">
        <form on:submit|preventDefault={publishPin}>
          <div class="form-control">
            <label for="title" class="label">Title</label>
            <input
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
              type="file"
              id="photo"
              name="photo"
              class="input input-bordered"
              bind:files
            />
          </div>
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
            <button on:click={getLocation} type="button" class="btn"
              >Get Current Location</button
            >
          </div>
          <div class="form-control">
            <label for="timestamp" class="label">Date/Time</label>
            <input
              type="datetime"
              id="timestamp"
              name="timestamp"
              class="input input-bordered"
              bind:value={timestamp}
            />
            <button
              on:click={() => (timestamp = new Date().toISOString())}
              type="button"
              class="btn">Set Current Date/Time</button
            >
          </div>
          <div class="mt-8">
            <button class="btn btn-primary">Submit</button>
            <a class="btn" href="/explore">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  </main>
</Route>
<Route path="/pins/:id/show">
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      {#await getPin(meta().params.id) then pin}
        <h1 class="text-6xl">{pin.title}</h1>
        <p>{pin.description}</p>
        <p>{pin.timestamp}</p>
        <p>{pin.location}</p>
        <img src={pin.image_url} alt={pin.title} />
      {/await}
      <div class="mt-8">
        <a href="/explore" class="btn btn-primary">8pin</a>
        <button on:click={() => null}>Share</button>
      </div>
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
        <button class="btn">ArConnect</button>
      </div>
    </section>
  </main>
</Route>
<Route path="/publishing">
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-6xl">Publishing Pin</h1>

      <div>
        <progress class="w-full" value={$progress} />
      </div>
    </section>
  </main>
</Route>
