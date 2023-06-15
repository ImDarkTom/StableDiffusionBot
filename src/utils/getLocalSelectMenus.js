const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) => {
    let localMenus = [];

    const menuCategories = getAllFiles(
        path.join(__dirname, '..', 'menus'),
        true
    );

    for (const menuCategory of menuCategories) {
        const menuFiles = getAllFiles(menuCategory);

        for (const menuFile of menuFiles) {
            const menuObject = require(menuFile);

            if (exceptions.includes(menuObject.id)) {
                continue;
            }

            localMenus.push(menuObject);
        }
    }

    return localMenus;
};