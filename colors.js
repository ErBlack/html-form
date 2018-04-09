
const HEX = document.getElementById('color');

const RGB = document.getElementById('RGB');
const CMYK = document.getElementById('CMYK');
const HSL = document.getElementById('HSL');

function getValues({elements}) {
    return Array.from(elements).map(({value}) => value).map(Number);
}
function setValues({elements}, values) {
    Array.from(elements).forEach((input, i) => input.value = values[i]);
}

class Color {
    constructor(rgb = [0, 0, 0]) {
        this._rgb = rgb;
    }
    get RGB() {
        return this._rgb;
    }
    set RGB(rgb) {
        this._rgb = rgb;
    }
    get CMYK() {
        if (this._rgb.every((number) => number === 0)) {
            return [0, 0, 0, 100];
        }

        const [ar, ag, ab] = this._rgb.map((number) => 1 - number / 255);
        const k = Math.min(ar, ag, ab);

        return [
            Math.round(((ar - k) / (1 - k)) * 100),
            Math.round(((ag - k) / (1 - k)) * 100),
            Math.round(((ab - k) / (1 - k)) * 100),
            Math.round(k * 100)
        ];
    }
    set CMYK(cmyk) {
        const [c, m, y, k] = cmyk.map((number) => number / 100);

        this._rgb = [
            Math.round((1 - Math.min(1, c * (1 - k) + k)) * 255),
            Math.round((1 - Math.min(1, m * (1 - k) + k)) * 255),
            Math.round((1 - Math.min(1, y * (1 - k) + k)) * 255)
        ];
    }
    get HEX() {
        const [r, g, b] = this._rgb;

        return `#${this._to2DigitHex(r)}${this._to2DigitHex(g)}${this._to2DigitHex(b)}`;
    }
    set HEX(hex) {
        this._rgb = [
            parseInt(hex.substr(1, 2), 16),
            parseInt(hex.substr(3, 2), 16),
            parseInt(hex.substr(5, 2), 16)
        ];
    }
    get HSL() {
        const [r, g, b] = this._rgb.map((number) => number / 255);

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        const l = (max + min) / 2;
        let s = 0;
        let h = 0;

        if (max != min) {
            if (l < 0.5) {
                s = (max - min) / (max + min);
            } else {
                s = (max - min) / (2.0 - max - min);
            }

            if (r == max) {
                h = (g - b) / (max - min);
            } else if (g == max) {
                h = 2.0 + (b - r) / (max - min);
            } else {
                h = 4.0 + (r - g) / (max - min);
            }
        }

        return [
            h < 0 ? 360 : Math.floor(h * 60),
            Math.floor(s * 100),
            Math.floor(l * 100)
        ];
    }
    set HSL([h, s, l]) {
        h /= 360;
        l /= 100;
        s /= 100;

        if (s === 0) {
            const v = Math.floor(255 * l);

            this._rgb = [v, v, v];
        } else {
            const q = l < 0.5 ? l * (1 + s) : (l + s) - (l * s);
            const p = 2 * l - q;

            this._rgb = [
                this._hueToRgb(p, q, h + (1 / 3)) * 255,
                this._hueToRgb(p, q, h) * 255,
                this._hueToRgb(p, q, h - (1 / 3)) * 255
            ].map(Math.floor);
        }
    }
    _hueToRgb(p, q, t) {
        if (t < 0) {
            t += 1;
        }
        if (t > 1) {
            t -= 1;
        }
        if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
        }
        if (t < 1 / 2) {
            return q;
        }
        if (t < 2 / 3) {
            return p + (q - p) * ((2 / 3 - t) * 6);
        }

        return p;
    }
    _to2DigitHex(n) {
        return `0${n.toString(16)}`.slice(-2);
    }
}

const color = new Color();

HEX.addEventListener('change', () => {
    color.HEX = HEX.value;

    setValues(RGB, color.RGB);
    setValues(CMYK, color.CMYK);
    setValues(HSL, color.HSL);
});

RGB.addEventListener('input', () => {
    color.RGB = getValues(RGB);

    HEX.value = color.HEX;
    setValues(CMYK, color.CMYK);
    setValues(HSL, color.HSL);
});

CMYK.addEventListener('input', () => {
    color.CMYK = getValues(CMYK);

    HEX.value = color.HEX;
    setValues(RGB, color.RGB);
    setValues(HSL, color.HSL);
})

HSL.addEventListener('input', () => {
    color.HSL = getValues(HSL);

    HEX.value = color.HEX;
    setValues(RGB, color.RGB);
    setValues(CMYK, color.CMYK);
})