'use strict';

var fs = require('fs');

let buildCategoryTree = (categories, parentId = 0) => {
    let category = {};

    categories.filter(category => {
        // console.log(category.name);

        return category.parentId === parentId;
    }).forEach(childCategory => {
        category[childCategory.name] = buildCategoryTree(categories, childCategory.id);
        category[childCategory.name].id = childCategory.id;
        category[childCategory.name].parentId = childCategory.parentId;
        category[childCategory.name].name = childCategory.name;
        category[childCategory.name].categoryType = childCategory.categoryType;
        category[childCategory.name].description = childCategory.description;
    });

    // console.log(category);

    return category;
};

let findTopCategoryId = categories => {
    // return jsonpath.value(categories, `$..[?(@.parentId==0)]`).id;
    try {
        let root = categories.filter(category => {
            return category.parentId === 0;
        });

        if (root && root.length == 1) return root[0].id;
    } catch (err) {
        return 0;
    }
};

let findCategory = (categoryTree, namePath = 'Content Builder') => {
    if (!namePath.endsWith('/')) namePath = namePath.concat('/');
    if (namePath.startsWith('/')) namePath = namePath.slice(1);

    let categoryName = namePath.slice(0, namePath.indexOf('/'));
    let nextCategoryName = namePath.substr(categoryName.length + 1);

    // console.log('-->' + categoryName);

    // if no more to search and key is the same as
    if (!nextCategoryName.length && categoryTree[categoryName]) return categoryTree[categoryName];

    for (let key in categoryTree) {
        if (key === categoryName && nextCategoryName) return findCategory(categoryTree[key], nextCategoryName);
    }
};

let getAllCategories = () => {
    let hostRestEndpoint = 'https://www.exacttargetapis.com';

    let endPoint = hostRestEndpoint + '/asset/v1/content/assets/$page=100&$pagesize=200';

    // console.log(__dirname);

    var categories = JSON.parse(fs.readFileSync(__dirname + '/categories.json'));

    let catTree = buildCategoryTree(categories);

    return catTree;
};

module.exports = {
    buildCategoryTree: buildCategoryTree,
    findTopCategoryId: findTopCategoryId,
    findCategory: findCategory,
    getAllCategories: getAllCategories
};
//# sourceMappingURL=sfmc-content-builder.js.map