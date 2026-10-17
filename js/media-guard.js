/* AN:RIEL: casual image/audio saving deterrents (not DRM). */
(() => {
  document.addEventListener('contextmenu', event => {
    if (event.target.closest('img, picture, audio, video')) event.preventDefault();
  });
  document.addEventListener('dragstart', event => {
    if (event.target.closest('img, picture')) event.preventDefault();
  });
  const protect = root => {
    if (root.matches?.('img')) root.draggable = false;
    root.querySelectorAll?.('img').forEach(img => { img.draggable = false; });
    if (root.matches?.('audio')) root.setAttribute('controlsList', 'nodownload noplaybackrate');
    root.querySelectorAll?.('audio').forEach(audio => audio.setAttribute('controlsList', 'nodownload noplaybackrate'));
  };
  protect(document.documentElement);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) protect(node);
  }))).observe(document.documentElement, {childList:true,subtree:true});
})();
