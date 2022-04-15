<script>
  import { getCoordinates } from "./geocoding.js";
  import { address } from "../store.js";

  let place = "";

  async function changeLocation() {
    const coords = await getCoordinates(place);
    window.map.setCenter([coords.lng, coords.lat]);
  }

  function disconnect() {
    arweaveWallet.disconnect();
    $address = "";
    localStorage.removeItem("address");
    localStorage.removeItem("wallet");
  }
</script>

<header class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost" href="/explore">
      <img src="8pin-logo2.png" alt="8pin logo" class="h-12" />
    </a>
  </div>
  <div class="flex-none">
    <input
      class="input input-bordered hidden md:block"
      placeholder="Enter a place..."
      bind:value={place}
      on:blur={changeLocation}
    />

    <a class="btn btn-ghost" href="/explore">Explore</a>
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
