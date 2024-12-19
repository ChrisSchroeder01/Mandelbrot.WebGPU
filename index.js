import { fetchShader } from './src/ShaderUtils.js';
import Material from './src/Material.js';

class Main {
    constructor() {
        this.canvas = document.querySelector('canvas');
        this.scaleValue = 250;
        this.offset = { x: 0, y: 0 };
        this.moving = false;
        this.start = { x: 0, y: 0 };
    }

    async initialize() {
        if (!navigator.gpu) {
            console.error("WebGPU not supported on this browser.");
            return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter.requestDevice();
        const context = this.canvas.getContext('webgpu');
        const format = navigator.gpu.getPreferredCanvasFormat();

        context.configure({
            device,
            format,
            alphaMode: 'opaque',
        });

        this.device = device;
        this.context = context;
        this.format = format;

        await this.setupShaders();
        this.createMaterial();
        this.setupEventListeners();
        this.resize();
    }

    async setupShaders() {
        this.vertexShaderCode = await fetchShader('./src/shader/vertex.wgsl');
        this.fragmentShaderCode = await fetchShader('./src/shader/fragment.wgsl');
    }

    createMaterial() {
        this.material = new Material(this.device, this.vertexShaderCode, this.fragmentShaderCode, {
            0: { size: 8, usage: GPUBufferUsage.UNIFORM }, // resolution
            1: { size: 4, usage: GPUBufferUsage.UNIFORM }, // scale
            2: { size: 8, usage: GPUBufferUsage.UNIFORM }, // offset
        });

        this.material.createPipeline(this.format);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousedown', (event) => this.onMouseDown(event));
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('wheel', (event) => this.onWheel(event));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.material.updateUniform('0', new Float32Array([this.canvas.width, this.canvas.height]));
        this.material.updateUniform('1', new Float32Array([this.scaleValue]));
        this.render();
    }

    onMouseDown(event) {
        this.start.x = event.pageX;
        this.start.y = event.pageY;
        this.moving = true;
    }

    onMouseMove(event) {
        if (this.moving) {
            this.offset.x += event.movementX / this.scaleValue;
            this.offset.y += event.movementY / this.scaleValue;
            this.material.updateUniform('2', new Float32Array([this.offset.x, this.offset.y]));
            this.render();
        }
    }

    onMouseUp() {
        this.moving = false;
    }

    onWheel(event) {
        this.scaleValue -= (event.deltaY / 100) * (this.scaleValue / 5);
        this.material.updateUniform('1', new Float32Array([this.scaleValue]));
        this.resize();
    }

    render() {
        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();
        this.material.render(commandEncoder, textureView);
        this.device.queue.submit([commandEncoder.finish()]);
    }
}

const app = new Main();
app.initialize();