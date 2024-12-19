# Mandelbrot.WebGPU
A WebGPU-based visualization of the Mandelbrot set. This program allows users to explore the Mandelbrot set with mouse-based controls.

## Features
- Interactive Panning: Click and drag the canvas to move around the Mandelbrot set.
- Zooming: Use the mouse wheel to zoom in and out of the Mandelbrot.

## Limitations
Due to WebGPU's 32-bit floating-point precision, you cannot zoom infinitely into the Mandelbrot set. The precision constraints cause details to become less accurate at extreme zoom levels.

## Usage
1. Open the application in a WebGPU-supported browser. (https://chrisschroeder01.github.io/Mandelbrot.WebGPU/)
2. Click and drag to pan the view.
3. Scroll with the mouse wheel to zoom in and out.
4. Resize the browser window to adjust the canvas size dynamically.
