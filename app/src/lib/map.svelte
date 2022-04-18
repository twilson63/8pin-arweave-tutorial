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
    let pop = null;
    if (!localStorage.getItem("droppin-popup")) {
      pop = new mapbox.Popup({ closeButton: false, closeOnClick: true })
        .setLngLat([lon, lat])
        .setHTML(
          `<div class="m-4 card w-48 md:w-96 bg-base-200">
          <div class="card-body">
            <h1 class="card-title text-center">Drop a Pin</h1>
            <p>Right Click or long press inorder to drop a pin.</p>  
          </div>
          <div class="card-actions pb-4 justify-center">
            <button id="droppin" class="btn btn-ghost">Got It</button> 
          </div>
        </div>  
        `
        )
        .addTo(map);
    }

    map.addControl(new mapbox.NavigationControl());

    map.on("render", () => {
      map.resize();
      if (!localStorage.getItem("droppin-popup")) {
        document.getElementById("droppin").addEventListener("click", () => {
          pop.remove();
          localStorage.setItem("droppin-popup", true);
        });
      }
    });
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

<div bind:this={container} class="min-h-screen">
  {#if map}
    <slot />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
