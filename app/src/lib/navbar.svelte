<script>
  import { router } from "tinro";
  import { getCoordinates } from "./geocoding.js";
  import { address } from "../store.js";

  let place = "";

  async function changeLocation() {
    const coords = await getCoordinates(place);
    window.map.setCenter([coords.lng, coords.lat]);
    window.scrollTo(0, 0);
  }

  function disconnect() {
    arweaveWallet.disconnect();
    $address = "";
    localStorage.removeItem("address");
    localStorage.removeItem("wallet");
  }
</script>

<header class="navbar bg-base-100 sticky top-0 z-50">
  <div class="flex-1">
    <a class="btn btn-ghost" href="/about">
      <img src="8pin-logo2.png" alt="8pin logo" class="h-12" />
    </a>
  </div>
  <div class="flex-none">
    {#if $router.path === "/explore"}
      <form
        class="hidden md:block mr-4"
        on:submit|preventDefault={changeLocation}
      >
        <div class="form-control">
          <div class="input-group">
            <input
              class="input input-bordered"
              placeholder="Enter a place..."
              bind:value={place}
              on:blur={changeLocation}
            />
            <button class="btn btn-square" type="submit">GO</button>
          </div>
        </div>
      </form>
    {/if}

    <a class="btn btn-ghost" href="/explore">Explore</a>
    <a class="btn btn-ghost hidden md:inline-flex" href="/about">About</a>

    <!--
    <a class="btn btn-ghost" href="/pins/new">Create Pin</a>
    -->
    {#if $address !== ""}
      <button on:click={disconnect} class="btn btn-ghost" href="/disconnect"
        >Disconnect</button
      >
    {:else}
      <a class="btn btn-ghost" href="/connect">Connect</a>
    {/if}
  </div>
</header>
