const url = (endpoint, search_text) =>
  `https://api.mapbox.com/geocoding/v5/${endpoint}/${search_text}.json?limit=1&access_token=${import.meta.env.VITE_MAPBOX}`


export const getCoordinates = (search_text) =>
  fetch(encodeURI(url('mapbox.places', search_text)))
    .then(res => res.json())
    .then(res => {
      const [lng, lat] = res.features[0].center
      const place = res.features[0].place_name
      return { lng, lat, place }
    })

export const getPlace = (lng, lat) =>
  fetch(encodeURI(url('mapbox.places', `${lng},${lat}`)))
    .then(res => res.json())
    .then(res => {
      console.log(res)
      const pl = res.features[0].place_name.split(',')
      // hide address
      pl.shift()
      return pl.join(',')
    })