<script>
  import { Route, router } from "tinro";
  import Navbar from "./lib/navbar.svelte";
  import { activity } from "./arweave.js";
  import { pinFromTx } from "./pin.js";
  import Map from "./lib/map.svelte";
  import Marker from "./lib/marker.svelte";
  import { connect } from "./arweaveapp.js";
  import { address } from "./store.js";

  router.mode.hash();
  const { VITE_ARWEAVE_PROTOCOL, VITE_ARWEAVE_HOST, VITE_ARWEAVE_PORT } =
    import.meta.env;
  const arweaveUrl = `${VITE_ARWEAVE_PROTOCOL || "https"}://${
    VITE_ARWEAVE_HOST || "arweave.net"
  }:${VITE_ARWEAVE_PORT || "443"}`;
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
    <section class="hero-content flex-col">
      <h1 class="text-6xl">Explore Pins</h1>
      <div class="w-full h-3/4">
        <Map lat={35} lon={-84} zoom={3.5}>
          {#await getRecentPins() then pins}
            {#each pins as pin}
              <Marker
                lat={pin.location.split(",")[0]}
                lon={pin.location.split(",")[1]}
                label={pin.title}
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
        <form>
          <div class="form-control">
            <label for="title" class="label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label for="description" class="label">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label for="photo" class="label">Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label for="location" class="label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              class="input input-bordered"
            />
          </div>
          <div class="form-control">
            <label for="timestamp" class="label">Date/Time</label>
            <input
              type="datetime"
              id="timestamp"
              name="timestamp"
              class="input input-bordered"
            />
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
  <Navbar />
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-6xl">View a Pin</h1>
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
