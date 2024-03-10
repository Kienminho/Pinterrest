// imageViewer.js
export function createImageViewer(element) {
  return new Viewer(element, {
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 1,
      reset: 1,
      prev: 1,
      play: {
        show: 0,
        size: "large",
      },
      next: 1,
      rotateLeft: 1,
      rotateRight: 1,
      flipHorizontal: 1,
      flipVertical: 1,
    },
  });
}

//get token from local storage
export function getToken() {
  let token = JSON.parse(localStorage.getItem("data"));
  return token.AccessToken;
}

export function formatDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("en-GB", options);
}
