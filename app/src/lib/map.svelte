<script>
  import { onDestroy, setContext, createEventDispatcher } from "svelte";
  import { mapbox, key } from "./mapbox.js";

  const dispatch = createEventDispatcher();

  setContext(key, {
    getMap: () => map,
  });

  export let lat;
  export let lon;
  export let zoom;

  let container;
  let map;

  function load() {
    map = new mapbox.Map({
      container,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [lon, lat],
      zoom,
    });
    map.addControl(new mapbox.NavigationControl());
    map.on("render", () => map.resize());
    map.on("contextmenu", (e) => {
      dispatch("droppin", e.lngLat);
    });
    init_ios_context_menu();

    window.map = map;

    function init_ios_context_menu() {
      let iosTimeout = null;
      let clearIosTimeout = () => {
        clearTimeout(iosTimeout);
      };

      map.on("touchstart", (e) => {
        if (e.originalEvent.touches.length > 1) {
          return;
        }
        iosTimeout = setTimeout(() => {
          dispatch("droppin", e.lngLat);
        }, 500);
      });
      map.on("touchend", clearIosTimeout);
      map.on("touchcancel", clearIosTimeout);
      map.on("touchmove", clearIosTimeout);
      map.on("pointerdrag", clearIosTimeout);
      map.on("pointermove", clearIosTimeout);
      map.on("moveend", clearIosTimeout);
      map.on("gesturestart", clearIosTimeout);
      map.on("gesturechange", clearIosTimeout);
      map.on("gestureend", clearIosTimeout);
    }
  }

  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/mapbox-gl/dist/mapbox-gl.css"
    on:load={load}
  />
</svelte:head>

<div bind:this={container}>
  {#if map}
    <slot />
  {/if}
</div>

<style>
  div {
    width: 100%;
    height: 1050px;
  }
</style>
