export default class ProceduralTextureGenerator {

    static ATLAS_SIZE = 256;
    static SLOT_SIZE = 16;
    static SLOTS_PER_ROW = 16;

    constructor() {
        this.cache = new Map();
    }

    getCanvas(key) {
        if (this.cache.has(key)) return this.cache.get(key);
        let canvas = document.createElement('canvas');
        this.cache.set(key, canvas);
        return canvas;
    }

    seededRandom(seed) {
        let s = seed | 0;
        return () => {
            s = (s * 16807 + 0) % 2147483647;
            return (s - 1) / 2147483646;
        };
    }

    noise2d(x, y, seed) {
        let n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
        return n - Math.floor(n);
    }

    drawPixel(data, w, x, y, r, g, b, a = 255) {
        let i = (y * w + x) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = a;
    }

    fillRect(data, w, h, rx, ry, rw, rh, r, g, b, a = 255) {
        for (let y = ry; y < ry + rh && y < h; y++) {
            for (let x = rx; x < rx + rw && x < w; x++) {
                if (x >= 0 && y >= 0) {
                    this.drawPixel(data, w, x, y, r, g, b, a);
                }
            }
        }
    }

    blendPixel(data, w, x, y, r, g, b, a) {
        let i = (y * w + x) * 4;
        let srcA = a / 255;
        let dstA = data[i + 3] / 255;
        let outA = srcA + dstA * (1 - srcA);
        if (outA > 0) {
            data[i] = Math.round((r * srcA + data[i] * dstA * (1 - srcA)) / outA);
            data[i + 1] = Math.round((g * srcA + data[i + 1] * dstA * (1 - srcA)) / outA);
            data[i + 2] = Math.round((b * srcA + data[i + 2] * dstA * (1 - srcA)) / outA);
            data[i + 3] = Math.round(outA * 255);
        }
    }

    generateTerrainAtlas() {
        let size = ProceduralTextureGenerator.ATLAS_SIZE;
        let slotSize = ProceduralTextureGenerator.SLOT_SIZE;
        let canvas = this.getCanvas('terrain');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        let rng = this.seededRandom(42);

        for (let slot = 0; slot < 16; slot++) {
            let sx = (slot % 16) * slotSize;
            let sy = Math.floor(slot / 16) * slotSize;

            switch (slot) {
                case 0: this.genStone(data, size, sx, sy, slotSize, rng); break;
                case 1: this.genGrassTop(data, size, sx, sy, slotSize, rng); break;
                case 2: this.genDirt(data, size, sx, sy, slotSize, rng); break;
                case 3: this.genGrassSide(data, size, sx, sy, slotSize, rng); break;
                case 4: this.genLogBark(data, size, sx, sy, slotSize, rng); break;
                case 5: this.genLogTop(data, size, sx, sy, slotSize, rng); break;
                case 6: this.genLeaves(data, size, sx, sy, slotSize, rng); break;
                case 7: this.genWater(data, size, sx, sy, slotSize, rng); break;
                case 8: this.genSand(data, size, sx, sy, slotSize, rng); break;
                case 9: this.genTorch(data, size, sx, sy, slotSize, rng); break;
                case 10: this.genPlanks(data, size, sx, sy, slotSize, rng); break;
                case 11: this.genBedrock(data, size, sx, sy, slotSize, rng); break;
                case 12: this.genGlass(data, size, sx, sy, slotSize, rng); break;
                case 13: this.genGravel(data, size, sx, sy, slotSize, rng); break;
                case 14: this.genCobblestone(data, size, sx, sy, slotSize, rng); break;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    genStone(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x, y, 1) * 0.3;
                let v = 128 + n * 40 - 20;
                this.drawPixel(data, w, sx + x, sy + y, v, v, v);
            }
        }
        for (let i = 0; i < 20; i++) {
            let x = Math.floor(rng() * size);
            let y = Math.floor(rng() * size);
            let c = 110 + rng() * 30;
            this.drawPixel(data, w, sx + x, sy + y, c, c, c);
        }
    }

    genGrassTop(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 3, y * 3, 2);
                let r = 75 + n * 30;
                let g = 160 + n * 40;
                let b = 35 + n * 20;
                this.drawPixel(data, w, sx + x, sy + y, r, g, b);
            }
        }
    }

    genDirt(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 2, y * 2, 3);
                let v = 120 + n * 40;
                this.drawPixel(data, w, sx + x, sy + y, v * 0.85, v * 0.65, v * 0.4);
            }
        }
        for (let i = 0; i < 15; i++) {
            let x = Math.floor(rng() * size);
            let y = Math.floor(rng() * size);
            this.drawPixel(data, w, sx + x, sy + y, 80, 55, 30);
        }
    }

    genGrassSide(data, w, sx, sy, size, rng) {
        this.genDirt(data, w, sx, sy, size, rng);
        for (let x = 0; x < size; x++) {
            let grassHeight = 2 + Math.floor(this.noise2d(x, 0, 4) * 3);
            for (let y = 0; y < grassHeight; y++) {
                let n = this.noise2d(x, y, 5);
                let g = 140 + n * 50;
                this.drawPixel(data, w, sx + x, sy + y, 60 + n * 30, g, 30 + n * 20);
            }
        }
    }

    genLogBark(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let stripe = Math.sin(y * 0.8) * 10;
                let n = this.noise2d(x, y, 6) * 15;
                let v = 100 + stripe + n;
                this.drawPixel(data, w, sx + x, sy + y, v * 0.75, v * 0.5, v * 0.25);
            }
        }
    }

    genLogTop(data, w, sx, sy, size, rng) {
        let cx = size / 2, cy = size / 2;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let dx = x - cx, dy = y - cy;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let ring = Math.sin(dist * 1.5) * 15;
                let n = this.noise2d(x, y, 7) * 10;
                if (dist > size / 2 - 1) {
                    this.drawPixel(data, w, sx + x, sy + y, 80, 55, 30);
                } else {
                    let v = 140 + ring + n;
                    this.drawPixel(data, w, sx + x, sy + y, v * 0.9, v * 0.7, v * 0.35);
                }
            }
        }
    }

    genLeaves(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 2, y * 2, 8);
                let n2 = this.noise2d(x * 4, y * 4, 9);
                let r = 30 + n * 40 + n2 * 20;
                let g = 100 + n * 60 + n2 * 30;
                let b = 20 + n * 30;
                let a = n2 > 0.1 ? 255 : 200;
                this.drawPixel(data, w, sx + x, sy + y, r, g, b, a);
            }
        }
    }

    genWater(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 2, y * 2, 10);
                let wave = Math.sin(x * 0.5 + y * 0.3) * 10;
                let r = 30 + wave * 0.3;
                let g = 80 + wave + n * 20;
                let b = 200 + wave + n * 20;
                this.drawPixel(data, w, sx + x, sy + y, r, g, b, 180);
            }
        }
    }

    genSand(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 2, y * 2, 11);
                let v = 210 + n * 30;
                this.drawPixel(data, w, sx + x, sy + y, v, v * 0.92, v * 0.68);
            }
        }
    }

    genTorch(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                this.drawPixel(data, w, sx + x, sy + y, 0, 0, 0, 0);
            }
        }
        let torchW = 2, torchH = 10;
        let ox = 7, oy = 6;
        for (let y = 0; y < torchH; y++) {
            for (let x = 0; x < torchW; x++) {
                let v = 100 + y * 3;
                this.drawPixel(data, w, sx + ox + x, sy + oy + y, v * 0.7, v * 0.5, v * 0.2);
            }
        }
        for (let x = 0; x < 2; x++) {
            this.drawPixel(data, w, sx + ox + x, sy + oy - 1, 255, 200, 50);
        }
    }

    genPlanks(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let stripe = Math.floor(y / 4) % 2;
                let n = this.noise2d(x, y, 12) * 15;
                let v = 170 + stripe * 15 + n;
                this.drawPixel(data, w, sx + x, sy + y, v * 0.85, v * 0.65, v * 0.35);
            }
        }
        for (let y = 0; y < size; y += 4) {
            for (let x = 0; x < size; x++) {
                this.drawPixel(data, w, sx + x, sy + y, 120, 85, 45);
            }
        }
    }

    genBedrock(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 3, y * 3, 13);
                let v = 40 + n * 50;
                this.drawPixel(data, w, sx + x, sy + y, v, v, v);
            }
        }
    }

    genGlass(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let border = x === 0 || y === 0 || x === size - 1 || y === size - 1;
                let highlight = x === 1 && y === 1;
                if (border) {
                    this.drawPixel(data, w, sx + x, sy + y, 200, 220, 240, 200);
                } else if (highlight) {
                    this.drawPixel(data, w, sx + x, sy + y, 255, 255, 255, 150);
                } else {
                    this.drawPixel(data, w, sx + x, sy + y, 200, 220, 255, 40);
                }
            }
        }
    }

    genGravel(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 3, y * 3, 14);
                let v = 110 + n * 50;
                this.drawPixel(data, w, sx + x, sy + y, v, v * 0.95, v * 0.9);
            }
        }
        for (let i = 0; i < 25; i++) {
            let x = Math.floor(rng() * size);
            let y = Math.floor(rng() * size);
            let v = 80 + rng() * 60;
            this.drawPixel(data, w, sx + x, sy + y, v, v * 0.9, v * 0.85);
        }
    }

    genCobblestone(data, w, sx, sy, size, rng) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 2, y * 2, 15);
                let brickX = (x + Math.floor(y / 4) * 4) % 8;
                let brickY = y % 8;
                let edge = brickX === 0 || brickY === 0;
                let v = edge ? 80 : 110 + n * 40;
                this.drawPixel(data, w, sx + x, sy + y, v, v, v);
            }
        }
    }

    generateGuiTexture() {
        let size = 256;
        let canvas = this.getCanvas('gui');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        this.fillRect(data, size, size, 0, 0, size, size, 0, 0, 0, 0);

        this.genHotbar(data, size, 0, 0);
        this.genSelectionHighlight(data, size, 0, 22);
        this.genButton(data, size, 0, 66, false, false);
        this.genButton(data, size, 0, 86, false, true);
        this.genButton(data, size, 0, 46, true, false);

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    genHotbar(data, w, sx, sy) {
        for (let y = 0; y < 22; y++) {
            for (let x = 0; x < 200; x++) {
                let border = y === 0 || y === 21 || x === 0 || x === 199;
                let innerBorder = y === 1 || y === 20 || x === 1 || x === 198;
                if (border) {
                    this.drawPixel(data, w, sx + x, sy + y, 30, 30, 30, 200);
                } else if (innerBorder) {
                    this.drawPixel(data, w, sx + x, sy + y, 80, 80, 80, 200);
                } else {
                    this.drawPixel(data, w, sx + x, sy + y, 40, 40, 40, 180);
                }
            }
        }
    }

    genSelectionHighlight(data, w, sx, sy) {
        for (let y = 0; y < 24; y++) {
            for (let x = 0; x < 24; x++) {
                let border = y === 0 || y === 23 || x === 0 || x === 23;
                let innerBorder = y === 1 || y === 22 || x === 1 || x === 22;
                if (border) {
                    this.drawPixel(data, w, sx + x, sy + y, 255, 255, 255, 230);
                } else if (innerBorder) {
                    this.drawPixel(data, w, sx + x, sy + y, 200, 200, 200, 200);
                } else {
                    this.drawPixel(data, w, sx + x, sy + y, 0, 0, 0, 0);
                }
            }
        }
    }

    genButton(data, w, sx, sy, disabled, hover) {
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 200; x++) {
                let border = y === 0 || y === 19 || x === 0 || x === 199;
                let innerBorder = y === 1 || y === 18 || x === 1 || x === 198;
                let r, g, b;
                if (disabled) {
                    r = 60; g = 60; b = 60;
                } else if (hover) {
                    r = 100; g = 140; b = 200;
                } else {
                    r = 70; g = 85; b = 140;
                }
                if (border) {
                    this.drawPixel(data, w, sx + x, sy + y, r * 0.5, g * 0.5, b * 0.5, 220);
                } else if (innerBorder) {
                    this.drawPixel(data, w, sx + x, sy + y, r * 0.8, g * 0.8, b * 0.8, 220);
                } else {
                    this.drawPixel(data, w, sx + x, sy + y, r, g, b, 200);
                }
            }
        }
    }

    generateIconsTexture() {
        let size = 256;
        let canvas = this.getCanvas('icons');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        this.fillRect(data, size, size, 0, 0, size, size, 0, 0, 0, 0);

        this.genCrosshair(data, size, 0, 0);

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    genCrosshair(data, w, sx, sy) {
        let size = 15;
        let half = Math.floor(size / 2);
        let thickness = 2;
        let color = [255, 255, 255, 200];
        let shadowColor = [0, 0, 0, 120];

        for (let i = 0; i < size; i++) {
            for (let t = -Math.floor(thickness / 2); t <= Math.floor(thickness / 2); t++) {
                if (i >= 2 && i <= size - 3) {
                    this.drawPixel(data, w, sx + i, sy + half + t, ...shadowColor);
                    this.drawPixel(data, w, sx + half + t, sy + i, ...shadowColor);
                }
            }
        }
    }

    generateBackgroundTexture() {
        let size = 256;
        let canvas = this.getCanvas('background');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;
        let rng = this.seededRandom(100);

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 0.5, y * 0.5, 20) * 0.4;
                let v = 80 + n * 40;
                this.drawPixel(data, w, x, y, v * 0.85, v * 0.65, v * 0.4);
            }
        }

        for (let i = 0; i < 100; i++) {
            let x = Math.floor(rng() * size);
            let y = Math.floor(rng() * size);
            this.drawPixel(data, size, x, y, 50, 35, 20);
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generateFontTexture() {
        let charSize = 8;
        let cols = 16;
        let rows = 16;
        let w = cols * charSize;
        let h = rows * charSize;
        let canvas = this.getCanvas('font');
        canvas.width = w;
        canvas.height = h;
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 7px monospace';
        ctx.textBaseline = 'top';
        ctx.imageSmoothingEnabled = false;

        let chars = "\u00c0\u00c1\u00c2\u00c8\u00ca\u00cb\u00cd\u00d3\u00d4\u00d5\u00da\u00df\u00e3\u00f5\u011f\u0130\u0131\u0152\u0153\u015e\u015f\u0174\u0175\u017e\u0207\u0000\u0000\u0000\u0000\u0000\u0000\u0000 !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u0000\u00c7\u00fc\u00e9\u00e2\u00e4\u00e0\u00e5\u00e7\u00ea\u00eb\u00e8\u00ef\u00ee\u00ec\u00c4\u00c5\u00c9\u00e6\u00c6\u00f4\u00f6\u00f2\u00fb\u00f9\u00ff\u00d6\u00dc\u00f8\u00a3\u00d8\u00d7\u0192\u00e1\u00ed\u00f3\u00fa\u00f1\u00d1\u00aa\u00ba\u00bf\u00ae\u00ac\u00bd\u00bc\u00a1\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255d\u255c\u255b\u2510\u2514\u2534\u252c\u251c\u2500\u253c\u255e\u255f\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256b\u256a\u2518\u250c\u2588\u2584\u258c\u2590\u2580\u03b1\u03b2\u0393\u03c0\u03a3\u03c3\u03bc\u03c4\u03a6\u0398\u03a9\u03b4\u221e\u2205\u2208\u2229\u2261\u00b1\u2265\u2264\u2320\u2321\u00f7\u2248\u00b0\u2219\u00b7\u221a\u207f\u00b2\u25a0\u0000";

        for (let i = 0; i < chars.length && i < 256; i++) {
            let ch = chars[i];
            if (ch === '\u0000') continue;
            let cx = (i % cols) * charSize;
            let cy = Math.floor(i / cols) * charSize;
            ctx.fillText(ch, cx + 1, cy);
        }

        return canvas;
    }

    generateGrassColorTexture() {
        let size = 256;
        let canvas = this.getCanvas('grasscolor');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let temperature = 1.0 - x / 255;
                let humidity = 1.0 - y / 255;
                let adjustedHumidity = humidity * temperature;

                let r = Math.floor(60 + adjustedHumidity * 100 + temperature * 50);
                let g = Math.floor(120 + adjustedHumidity * 80 + temperature * 40);
                let b = Math.floor(20 + adjustedHumidity * 30);

                r = Math.max(0, Math.min(255, r));
                g = Math.max(0, Math.min(255, g));
                b = Math.max(0, Math.min(255, b));

                this.drawPixel(data, size, x, y, r, g, b);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generateSunTexture() {
        let size = 64;
        let canvas = this.getCanvas('sun');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        let cx = size / 2, cy = size / 2, radius = size / 2 - 2;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let dx = x - cx, dy = y - cy;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius) {
                    let brightness = dist < radius - 2 ? 255 : Math.floor(255 * (1 - (dist - (radius - 2)) / 2));
                    this.drawPixel(data, size, x, y, brightness, brightness, brightness * 0.9);
                } else {
                    this.drawPixel(data, size, x, y, 0, 0, 0, 0);
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generateMoonTexture() {
        let size = 64;
        let canvas = this.getCanvas('moon');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        let cx = size / 2, cy = size / 2, radius = size / 2 - 2;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let dx = x - cx, dy = y - cy;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius) {
                    let crater = this.noise2d(x * 0.3, y * 0.3, 30) > 0.6 ? 0.7 : 1.0;
                    let brightness = dist < radius - 2 ? 200 * crater : Math.floor(200 * crater * (1 - (dist - (radius - 2)) / 2));
                    this.drawPixel(data, size, x, y, brightness, brightness, brightness * 1.05);
                } else {
                    this.drawPixel(data, size, x, y, 0, 0, 0, 0);
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generatePanoramaTexture(face) {
        let size = 256;
        let canvas = this.getCanvas('panorama_' + face);
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        let colors = [
            [100, 150, 220],
            [80, 130, 200],
            [120, 160, 230],
            [90, 140, 210],
            [110, 155, 225],
            [85, 135, 205]
        ];
        let base = colors[face] || [100, 150, 220];

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let n = this.noise2d(x * 0.02, y * 0.02, face * 100) * 30;
                let gradient = y / size;
                let r = Math.floor(base[0] * (0.6 + gradient * 0.4) + n);
                let g = Math.floor(base[1] * (0.6 + gradient * 0.4) + n);
                let b = Math.floor(base[2] * (0.7 + gradient * 0.3) + n);
                this.drawPixel(data, size, x, y, r, g, b);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generateLogoTexture() {
        let canvas = this.getCanvas('minecraft');
        canvas.width = 274;
        canvas.height = 89;
        let ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, 274, 89);
        ctx.fillStyle = '#3f3f3f';
        ctx.font = 'bold 40px "Arial Black", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.shadowColor = '#000000';
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 0;
        ctx.fillText('SlopCraft', 10, 5);

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('SlopCraft', 8, 3);

        return canvas;
    }

    generateCharTexture() {
        let canvas = this.getCanvas('char');
        canvas.width = 64;
        canvas.height = 64;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(64, 64);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i + 3] = 0;
        }

        let skin = [
            [180, 130, 90],
            [100, 60, 40],
            [70, 130, 200]
        ];

        this.fillRectRegion(data, 64, 16, 0, 8, 8, ...skin[0]);
        this.fillRectRegion(data, 64, 16, 8, 8, 8, 8, ...skin[0]);
        this.fillRectRegion(data, 64, 24, 8, 8, 8, 8, ...skin[0]);
        this.fillRectRegion(data, 64, 0, 8, 8, 8, ...skin[0]);

        this.fillRectRegion(data, 64, 8, 0, 8, 8, ...skin[1]);
        this.fillRectRegion(data, 64, 32, 0, 16, 8, ...skin[2]);
        this.fillRectRegion(data, 64, 40, 0, 16, 8, ...skin[2]);
        this.fillRectRegion(data, 64, 16, 16, 8, 12, ...skin[2]);
        this.fillRectRegion(data, 64, 24, 16, 8, 12, ...skin[2]);

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    fillRectRegion(data, w, rx, ry, rw, rh, r, g, b, a = 255) {
        this.fillRect(data, w, 64, rx, ry, rw, rh, r, g, b, a);
    }

    generateCreativeTexture() {
        let size = 256;
        let canvas = this.getCanvas('creative');
        canvas.width = size;
        canvas.height = size;
        let ctx = canvas.getContext('2d');
        let imageData = ctx.createImageData(size, size);
        let data = imageData.data;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let border = x < 2 || y < 2 || x > size - 3 || y > size - 3;
                if (border) {
                    this.drawPixel(data, size, x, y, 60, 60, 60, 240);
                } else {
                    this.drawPixel(data, size, x, y, 30, 30, 30, 220);
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generateAll() {
        let resources = {};

        resources['terrain/terrain.png'] = this.generateTerrainAtlas();
        resources['gui/gui.png'] = this.generateGuiTexture();
        resources['gui/icons.png'] = this.generateIconsTexture();
        resources['gui/background.png'] = this.generateBackgroundTexture();
        resources['gui/font.png'] = this.generateFontTexture();
        resources['misc/grasscolor.png'] = this.generateGrassColorTexture();
        resources['terrain/sun.png'] = this.generateSunTexture();
        resources['terrain/moon.png'] = this.generateMoonTexture();
        resources['char.png'] = this.generateCharTexture();
        resources['gui/title/minecraft.png'] = this.generateLogoTexture();
        resources['gui/container/creative.png'] = this.generateCreativeTexture();

        for (let i = 0; i < 6; i++) {
            resources['gui/title/background/panorama_' + i + '.png'] = this.generatePanoramaTexture(i);
        }

        return resources;
    }
}
