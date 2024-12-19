@group(0) @binding(0) var<uniform> resolution : vec2<f32>;
@group(0) @binding(1) var<uniform> scale : f32;
@group(0) @binding(2) var<uniform> offset : vec2<f32>;

@fragment
fn main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
    // Normalize the coordinates to [0, 1] space
    let uv = fragCoord.xy / resolution;

    // Adjust the x and y coordinates to account for scale and offset
    let x = ((fragCoord.x - resolution.x / 2.0) / scale) - offset.x;
    let y = ((fragCoord.y - resolution.y / 2.0) / scale) - offset.y;

    // Initialize the complex number z0 = 0 and the complex number c = (x, y)
    var z = vec2<f32>(0, 0);
    let c = vec2<f32>(x, y);

    // Maximum number of iterations to determine if a point is in the Mandelbrot set
    let maxIterations =  i32(sqrt(scale));
    var i: i32 = 0;
    for (i = 0; i < maxIterations; i = i + 1) {
        let zSquared = vec2<f32>(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
        z = zSquared + c;
        if (dot(z, z) > 4.0) {
            break;
        }
    }

    let normalizedIterations = f32(i) / f32(maxIterations);


    let color = vec3<f32>(
        normalizedIterations,        // Red channel: varies from 0 to 1
        1.0 - normalizedIterations,  // Green channel: varies inversely from 1 to 0
        0.5 + 0.5 * sin(normalizedIterations * 3.14159) // Blue channel: oscillates based on the sine function
    );

    return vec4<f32>(color, 1.0);
}