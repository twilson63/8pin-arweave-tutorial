<script>
  import { router } from "tinro";
  import Navbar from "./lib/navbar.svelte";
</script>

<Navbar />
<main class="hero bg-base-100 min-h-screen">
  <section class="hero-content">
    <div>
      <img alt="8pin" src="8pin-logo2.png" style="height: 120px" />
      <h1 class="text-4xl">About 8pin</h1>
      <p class="mt-8 md:w-1/2">
        8pin is a permaweb app and tutorial to showcase the basic functionality
        of an Arweave development platform. Using common web development
        toolkits and graphql, you can build completely decentralized
        applications that are deployed on the permaweb forever.
      </p>
      <p class="mt-4 md:w-1/2">
        Interested in building an Arweave dapp, checkout this tutorial. And then
        register for the build program and get started. <a
          class="underline"
          href="https://arweave.build">Arweave.build</a
        >
      </p>
      <p class="mt-4 md:w-1/2">
        In collaboration with <a
          class="underline"
          href="https://twitter.com/onlyarweave">@onlyarweave</a
        >
        follow for updates and announcements to more tutorials and educational information
        about Arweave.
      </p>
      <button
        class="btn mt-8"
        on:click={async () => {
          window.scrollTo(0, 0);
          router.goto("/explore");
        }}>Explore</button
      >
    </div>
  </section>
</main>
