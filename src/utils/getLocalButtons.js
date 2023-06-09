const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
    let localButtons = [];

    const buttonCategories = getAllFiles(
        path.join(__dirname, '..', 'buttons'),
        true
    );

    for (const buttonCategory of buttonCategories) {
        const buttonFiles = getAllFiles(buttonCategory);

        for (const buttonFile of buttonFiles) {
            const buttonObject = require(buttonFile);

            if (exceptions.includes(buttonObject.name)) {
                continue;
            }

            localButtons.push(buttonObject);
        }
    }

    return localButtons;
};