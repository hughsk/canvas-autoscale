var throttle = require('frame-debounce')
var size     = require('element-size')
var raf      = require('raf')
var fps      = require('fps')

var noop = function(){}

var defaultScales = [
    0.25
  , 0.50
  , 1.00
]

if (
  typeof window !== 'undefined' &&
  window.devicePixelRatio > 1
) defaultScales.push(window.devicePixelRatio)

module.exports = fit

function fit(canvas, options, updated) {
  if (typeof options === 'function') {
    updated = options
    options = {}
  }

  options = options || {}
  updated = updated || noop

  canvas.style.position = canvas.style.position || 'absolute'
  canvas.style.top = 0
  canvas.style.left = 0

  var scales = (options.scales || defaultScales).slice().sort()
  var target = options.target || [55, 59]
  var getFPS = options.fps || defaultFPS()
  var sidx   = scales.length - 1
  var scale  = scales[sidx]
  var gap    = options.gap || 60
  var limit  = 0
  var first  = true

  if (!('auto' in options) || options.auto) {
    setupAuto()
  }

  resize.rate   = target[target.length - 1]
  resize.tick   = tick
  resize.resize = resize

  return resize()

  function tick() {
    var framerate = getFPS()
    if (--limit > 0) return
    if (framerate <= target[0]) prevScale(); else
    if (framerate >= target[1]) nextScale()
  }

  function nextScale() {
    if (sidx >= scales.length - 1) return
    if (limit > 0) return
    scale = scales[++sidx]
    limit = gap
    resize()
  }

  function prevScale() {
    if (sidx <= 0) return
    if (limit > 0) return
    scale = scales[--sidx]
    limit = 300
    resize()
  }

  function resize() {
    var p = options.parent || canvas.parentNode
    if (p && p !== document.body) {
      var psize  = size(p)
      var width  = psize[0]|0
      var height = psize[1]|0
    } else {
      var width  = window.innerWidth
      var height = window.innerHeight
    }

    canvas.width = width * scale
    canvas.height = height * scale
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    if (first) {
      first = false
    } else {
      updated(canvas.width, canvas.height)
    }

    return resize
  }

  function setupAuto() {
    window.addEventListener('resize'
      , throttle(resize)
      , false
    )

    raf(frame)

    function frame() {
      raf(frame)
      tick()
    }
  }

  function defaultFPS() {
    var measure = fps({
        decay: 0.05
      , every: Infinity
    })

    return function() {
      measure.tick()
      return resize.rate = measure.rate
    }
  }
}
