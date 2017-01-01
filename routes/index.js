//Libraries
var express = require('express');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

//APIs
var aniListAPI = require("../apis/aniListAPI.js");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var date = new Date();
    var season = "Winter"

    //Japan has four television seasons: 
    //  Winter (January–March), 
    //  Spring (April–June), 
    //  Summer (July–September), 
    //  Fall (October–December).

    switch (date.getMonth()){
        case 3: case 4: case 5:
          season = "Spring";
        case 6: case 7: case 8:
          season = "Summer";
        case 9: case 10: case 11:
          season = "Fall";
    }

    aniListAPI.getAnimesSeason(season, date.getFullYear(), function(animes){
        res.render('index', {
            title: "Grani",
            season: season,
            year: date.getFullYear(),
            animes: animes
        });
    });
});

/* POST form. */
router.post('/', function(req, res, next) {

    for (var key in req.body){
        var attrName = key;
        var attrValue = req.body[key];
        console.log(attrName + ": " + attrValue);
    }

    localStorage.setItem(req.body.nickname, JSON.stringify(req.body));

    res.send("Animes successfully saved! Enjoy " + req.body.nickname + "!");
});

module.exports = router;
