<script>
  import { Route, router } from "tinro";
  import Navbar from "./lib/navbar.svelte";
  import { activity } from "./arweave.js";
  import { pinFromTx } from "./pin.js";

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
      <h1 class="text-6xl">Recent Pins</h1>
      {#await getRecentPins() then pins}
        {#each pins as pin}
          <div>{pin.id}</div>
          <h2 class="text-3xl">{pin.title}</h2>
          <img src={pin.image_url} />
        {/each}
      {/await}
    </section>
  </main>
</Route>
<Route path="/pins/new">
  <Navbar />
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-6xl">Drop a Pin</h1>
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
