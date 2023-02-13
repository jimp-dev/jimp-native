module.exports = async (image, start, end, JimpConstructor) => {
    const font = await JimpConstructor.loadFont(JimpConstructor.FONT_SANS_16_BLACK);

    const maxWidth = image.getWidth();
    let string = 'TEST';

    while (JimpConstructor.measureText(font, string) < maxWidth) {
        string += ' TEST';
    }

    start();
    image.print(font, 10, 10, string);
    image.print(font, 10, 30, string);
    image.print(font, 10, 50, string);
    end();
};
