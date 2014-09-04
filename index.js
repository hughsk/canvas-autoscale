var throttle = require('frame-debounce')
var size     = require('element-size')
var clamp    = require('clamp')
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

  var scales      = (options.scales || defaultScales).slice().sort(numeric)
  var target      = options.target || [55, 59]
  var getFPS      = options.fps || defaultFPS()
  var sensitivity = options.sensitivity || 0.01
  var gap         = options.gap || 60
  var scale       = scales[0]
  var goalScale   = 0
  var currScale   = 0
  var limit       = 0
  var first       = true

  resize.rate   = target[1]
  resize.tick   = tick
  resize.resize = resize

  Object.defineProperty(resize, 'scale', {
    get: function() { return scale }
  })

  if (!('auto' in options) || options.auto) {
    setupAuto()
  }

  return resize()

  function defaultFPS() {
    var measure = fps({ decay: 1, every: Infinity })

    return function() {
      measure.tick()
      return measure.rate
    }
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

  function tick() {
    var framerate = resize.rate = getFPS()
    if (limit-- > 0) return

    var nextScale = framerate <= target[0]
      ? goalScale + 1
      : framerate >= target[1]
      ? goalScale - 1
      : goalScale

    nextScale = clamp(nextScale, 0, scales.length - 1)
    goalScale = goalScale + (nextScale - goalScale) * sensitivity
    nextScale = Math.round(goalScale)

    if (nextScale !== currScale) {
      currScale = nextScale
      scale = scales[currScale]
      limit = gap
      resize()
    }
  }
}

function numeric(a, b) {
  return b - a
}
