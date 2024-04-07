const fs = require('fs');
const rawdataPrompt = fs.readFileSync('./json/BePrompt.json');
const promptData = JSON.parse(rawdataPrompt);

const be_get = (req, res) => {
    res.render('be', {
        promptData: promptData
    });
};

module.exports = {
    be_get
}