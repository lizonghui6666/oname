export function getAbsScrollTop(e) {
  let x = e.offsetLeft;
  let y = e.offsetTop;
  while (e = e.offsetParent) {
    x += e.offsetLeft;
    y += e.offsetTop;
  }
  return {x, y};
}