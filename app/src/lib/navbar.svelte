<script>
  import { address } from "../store.js";

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
    <a class="btn btn-ghost" href="/explore">Explore</a>
    <a class="btn btn-ghost" href="/pins/new">Create Pin</a>
    {#if $address !== ""}
      <button on:click={disconnect} class="btn btn-ghost" href="/disconnect"
        >Disconnect</button
      >
    {:else}
      <a class="btn btn-ghost" href="/connect">Connect</a>
    {/if}
  </div>
</header>
