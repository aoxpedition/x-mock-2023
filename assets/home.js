// Map
var lastTxtM = null
// script intersection options
let sOp = {
  rootMargin: '0px 0px 200% 0px',
  threshold: 0.5
}
let sIo = new IntersectionObserver(sIoH, sOp);
sIo.observe(document.getElementById('map'))
// map script handle Intersection
function sIoH(es, o) { //(entries, observer)
  es.forEach(function (e) {
    if (e.intersectionRatio > 0) {
      var mj = document.getElementById('maps-js')
      mj.setAttribute('src', mj.dataset.src)
      o.unobserve(e.target)
    }
  })
}