# canvas-autoscale [![deprecated](http://badges.github.io/stability-badges/dist/deprecated.svg)](http://github.com/badges/stability-badges)

**Deprecated: this doesn't work as well as I'd like it to, and would be better off rewritten :)**

A variant of [canvas-fit](http://github.com/hughsk/canvas-fit) that handles
some extra magic for you: adjusting the scale of the canvas to maintain
smooth framerates.

As of version `2.x.x`, the approach for scaling has changed slightly to make
it more predictable.

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
* `auto`: automatically resize/rescale the canvas in response to window resizes
  and framerate changes respectively. Defaults to `true`, set to `false` to disable.
* `sensitivity`: the amount of sensitivity for canvas rescales. Set to `0` to ignore
  rescales, and `1` to make them immediate. It's recommended you choose a figure around
  `0.01`, which is the default.

`updated` is called every time the canvas size is changed – pass your render
function in here to avoid the screen flickering every time your canvas is
resized.

### `resize.tick()`

If you're using `auto: false`, call this method once per frame to check the
canvas' framerate and update the scale accordingly.

### `resize.scale`

Read-only property to get the current scale of the canvas.

### `resize.rate`

The most recent framerate captured.

### `resize()`

Manually trigger a resize of the canvas. Useful, for example, when resizing the
screen.

## License

MIT. See [LICENSE.md](http://github.com/hughsk/canvas-autoscale/blob/master/LICENSE.md) for details.
