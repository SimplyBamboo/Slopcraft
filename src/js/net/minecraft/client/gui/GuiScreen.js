import Gui from "./Gui.js";

export default class GuiScreen extends Gui {

    constructor() {
        super();

        this.buttonList = [];
        this.previousScreen = null;
    }

    setup(minecraft, width, height) {
        this.minecraft = minecraft;
        this.width = width;
        this.height = height;
        this.textureBackground = null;

        this.init();
    }

    init() {
        this.buttonList = [];
    }

    onClose() {

    }

    drawScreen(stack, mouseX, mouseY, partialTicks) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];
            button.minecraft = this.minecraft;
            button.render(stack, mouseX, mouseY, partialTicks);
        }
    }

    updateScreen() {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.onTick();
        }
    }

    keyTyped(key, character) {
        if (key === "Escape") {
            this.minecraft.displayScreen(this.previousScreen);
            return true;
        }

        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.keyTyped(key, character);
        }

        return false;
    }

    keyReleased(key) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.keyReleased(key);
        }

        return false;
    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            if (button.isMouseOver(mouseX, mouseY)) {
                button.mouseClicked(mouseX, mouseY, mouseButton);
            }
        }
    }

    mouseReleased(mouseX, mouseY, mouseButton) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.mouseReleased(mouseX, mouseY, mouseButton);
        }
    }

    mouseDragged(mouseX, mouseY, mouseButton) {
        for (let i in this.buttonList) {
            let button = this.buttonList[i];

            button.mouseDragged(mouseX, mouseY, mouseButton);
        }
    }

    drawDefaultBackground(stack) {
        if (this.minecraft.isInGame()) {
            this.drawRect(stack, 0, 0, this.width, this.height, 'black', 0.6);
        } else {
            this.drawProceduralDirtBackground(stack);
        }
    }

    drawProceduralDirtBackground(stack) {
        stack.save();

        let tileW = 16;
        let tileH = 16;
        let cols = Math.ceil(this.width / tileW) + 1;
        let rows = Math.ceil(this.height / tileH) + 1;

        let canvas = document.createElement('canvas');
        canvas.width = tileW;
        canvas.height = tileH;
        let ctx = canvas.getContext('2d');
        let imgData = ctx.createImageData(tileW, tileH);
        let d = imgData.data;
        let seed = 42;
        for (let py = 0; py < tileH; py++) {
            for (let px = 0; px < tileW; px++) {
                let n = Math.sin(px * 12.9898 + py * 78.233 + seed) * 43758.5453;
                n = n - Math.floor(n);
                let v = 80 + n * 40;
                let idx = (py * tileW + px) * 4;
                d[idx] = Math.floor(v * 0.85);
                d[idx + 1] = Math.floor(v * 0.65);
                d[idx + 2] = Math.floor(v * 0.4);
                d[idx + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);

        let pattern = stack.createPattern(canvas, "repeat");
        stack.filter = "brightness(28%)";
        stack.fillStyle = pattern;
        stack.fillRect(0, 0, this.width, this.height);
        stack.filter = "none";

        stack.restore();
    }
}