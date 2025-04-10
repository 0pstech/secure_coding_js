const fs = require('fs');
const path = require('path');

const models = {};

// Read all files in the current directory
const files = fs.readdirSync(__dirname);

// Filter only .js files excluding index.js
const modelFiles = files.filter(file => 
    file !== 'index.js' && file.endsWith('.js')
);

// Remove .js extension to use as model name
modelFiles.forEach(file => {
    // Import model file and add to models object
    const modelName = path.basename(file, '.js');
    models[modelName] = require(`./${modelName}`);
});

module.exports = models;
