export default class GrassColorizer {

    constructor(minecraft) {
        this.texture = minecraft.resources["misc/grasscolor.png"];

        if (this.texture instanceof HTMLCanvasElement) {
            this.bitMap = this.texture.getContext('2d').getImageData(0, 0, this.texture.width, this.texture.height).data;
            this.width = this.texture.width;
        } else {
            this.bitMap = this.createBitMap(this.texture);
            this.width = this.texture.width;
        }
    }

    getColor(temperature, humidity) {
        humidity *= temperature;

        let x = Math.floor((1.0 - temperature) * 255);
        let y = Math.floor((1.0 - humidity) * 255);

        let index = (x + y * this.width) * 4;
        if (index >= this.bitMap.length) {
            return -65281;
        }

        let red = this.bitMap[index];
        let green = this.bitMap[index + 1];
        let blue = this.bitMap[index + 2];

        return red << 16 | green << 8 | blue;
    }

    createBitMap(img) {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        return canvas.getContext('2d').getImageData(0, 0, img.width, img.height).data;
    }

}
