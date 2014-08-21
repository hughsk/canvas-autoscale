# canvas-autoscale [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A variant of [canvas-fit](http://github.com/hughsk/canvas-fit) that handles
some extra magic for you: adjusting the scale of the canvas to maintain
smooth framerates.

## Usage

[![NPM](https://nodei.co/npm/canvas-autoscale.png)](https://nodei.co/npm/canvas-autoscale/)

### `resize = autoscale(canvas, [options], [updated])`

Returns a `resize` function you can use to update the size of the canvas to
fit within its parent element. Takes the following options:

* `parent`: the parent element to fit within. Defaults to the canvas' parent element.
* `scales`: an array of scales to attempt. Defaults to `[0.25, 0.5, 1, devicePixelRatio]`.
* `target`: a two-element array containing the target framerates – the first
  element is the maximum rate before reducing scale, and the second is the minimum
  before increasing it again. Defaults to `[55, 59]`.
* `fps`: a custom function that should return the current framerate. Optional.
* `gap`: the amount of frames to wait between rescales. Defaults to 60.

`updated` is called every time the canvas size is changed – pass your render
function in here to avoid the screen flickering every time your canvas is
resized.

## License

MIT. See [LICENSE.md](http://github.com/hughsk/canvas-autoscale/blob/master/LICENSE.md) for details.
