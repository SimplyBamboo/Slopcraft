import Minecraft from './net/minecraft/client/Minecraft.js';
import ProceduralTextureGenerator from './net/minecraft/client/render/ProceduralTextureGenerator.js';

class Start {

    generateTextures() {
        let generator = new ProceduralTextureGenerator();
        return generator.generateAll();
    }

    launch(canvasWrapperId) {
        let resources = this.generateTextures();
        window.app = new Minecraft(canvasWrapperId, resources);
    }
}

window.addEventListener('pageshow', function (event) {
    if (window.app) {
        if (!window.app.running) {
            window.location.reload();
        }
    } else {
        new Start().launch("canvas-container");
    }
});

export function require(module) {
    return window[module];
}
