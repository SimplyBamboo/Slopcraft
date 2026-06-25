import Gui from "../Gui.js";

export default class GuiButton extends Gui {

    constructor(string, x, y, width, height, callback) {
        super();

        this.string = string;
        this.enabled = true;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.callback = callback;
    }

    render(stack, mouseX, mouseY, partialTicks) {
        let mouseOver = this.isMouseOver(mouseX, mouseY);
        this.drawButton(stack, this.enabled, mouseOver, this.x, this.y, this.width, this.height);
        this.drawCenteredString(stack, this.string, this.x + this.width / 2, this.y + this.height / 2 - 4);
    }

    onPress() {
        if (this.enabled) {
            this.callback();
        }
    }

    onTick() {

    }

    mouseClicked(mouseX, mouseY, mouseButton) {
        this.onPress();
    }

    mouseReleased(mouseX, mouseY, mouseButton) {

    }

    mouseDragged(mouseX, mouseY, mouseButton) {

    }

    keyTyped(key, character) {

    }

    keyReleased(key) {

    }

    isMouseOver(mouseX, mouseY) {
        return mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height;
    }

    drawButton(stack, enabled, mouseOver, x, y, width, height) {
        stack.save();

        let r, g, b;
        if (!enabled) {
            r = 60; g = 60; b = 60;
        } else if (mouseOver) {
            r = 100; g = 140; b = 200;
        } else {
            r = 70; g = 85; b = 140;
        }

        stack.fillStyle = `rgb(${Math.floor(r * 0.5)},${Math.floor(g * 0.5)},${Math.floor(b * 0.5)})`;
        stack.fillRect(x, y, width, height);

        stack.fillStyle = `rgb(${Math.floor(r * 0.8)},${Math.floor(g * 0.8)},${Math.floor(b * 0.8)})`;
        stack.fillRect(x + 1, y + 1, width - 2, height - 2);

        stack.fillStyle = `rgb(${r},${g},${b})`;
        stack.fillRect(x + 2, y + 2, width - 4, height - 4);

        if (enabled) {
            stack.fillStyle = `rgba(255,255,255,0.15)`;
            stack.fillRect(x + 2, y + 2, width - 4, Math.floor(height / 2) - 2);
        }

        stack.restore();
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }

}
