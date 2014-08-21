var canvas   = document.body.appendChild(document.createElement('canvas'))
var gl       = require('gl-context')(canvas, render)
var triangle = require('a-big-triangle')
var Shader   = require('glslify')
var scaler   = require('../')

var scale = scaler(canvas, {
    scales: [0.25, 0.5, 1, 2]
  , parent: window
  , target: [55, 59]
}, render)

var shader = Shader({
    vert: './shader.vert'
  , frag: './shader.frag'
})(gl)

function render() {
  console.clear()
  console.log('width:', canvas.width)
  console.log('height:', canvas.height)
  console.log('fps:', Math.round(scale.rate))

  gl.viewport(0, 0, canvas.width, canvas.height)
  shader.bind()
  triangle(gl)
}
