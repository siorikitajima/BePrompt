const fs = require('fs');
const rawdataPrompt = fs.readFileSync('./json/prompts.json');
const promptData = JSON.parse(rawdataPrompt);
const rawdataArtist = fs.readFileSync('./json/artists.json');
const artistData = JSON.parse(rawdataArtist);
const rawdataStyle = fs.readFileSync('./json/styles.json');
const styleData = JSON.parse(rawdataStyle);
const rawdataMusic = fs.readFileSync('./json/music.json');
const musicData = JSON.parse(rawdataMusic);
const rawdataKids = fs.readFileSync('./json/kids.json');
const kidsData = JSON.parse(rawdataKids);

const be_get = (req, res) => {
    res.render('be', {
        promptData: promptData,
        artistData: artistData,
        styleData: styleData,
        musicData: musicData
    });
};

const prompt_get = (req, res) => {
    res.render('prompt', {
        promptData: promptData
    });
};

const kids_get = (req, res) => {
    res.render('kids', {
        kidsData: kidsData
    });
};

module.exports = {
    be_get,
    prompt_get,
    kids_get
}