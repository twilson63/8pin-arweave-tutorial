<script>
  import { Route, router } from "tinro";
  import Navbar from "./lib/navbar.svelte";

  router.mode.hash();
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
    </section>
  </main>
</Route>
<Route path="/pins/new">
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-6xl">Drop a Pin</h1>
    </section>
  </main>
</Route>
<Route path="/pins/:id/show">
  <main class="hero bg-base-100 min-h-screen">
    <section class="hero-content flex-col">
      <h1 class="text-6xl">View a Pin</h1>
    </section>
  </main>
</Route>
