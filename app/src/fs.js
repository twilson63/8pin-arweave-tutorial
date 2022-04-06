export const toArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener("loadend", (evt) => {
      resolve(evt.target.result);
    })
  })