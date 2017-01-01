//Libraries
var express = require('express');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

//APIs
var aniListAPI = require("../apis/aniListAPI.js");
var nyaaAPI = require("../apis/nyaaAPI.js");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    var date = new Date();
    var season = "Winter";
    var year = date.getFullYear();

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

    season = "Fall";
    year = 2016;

    aniListAPI.getAnimesSeason(season, year, function(animes){
        res.render('index', {
            title: "Grani",
            season: season,
            year: year,
            animes: animes
        });
    });
});

/* POST form. */
router.post('/', function(req, res, next) {

    for (var id in req.body){
        // Ignoring nickname input
        if (id != "nickname")
            aniListAPI.getAnimeDetails(id, function(details){
                // nyaaAPI.checkTorrent(details.title_romaji, "" + details.airing.next_episode, details.airing.countdown);
                // Casting to string
                nyaaAPI.checkTorrent(details.title_romaji, "" + 7, 0);
            });
    }

    // TODO many users case
    // localStorage.setItem(req.body.nickname, JSON.stringify(req.body));
    localStorage.setItem("user", JSON.stringify(req.body));

    res.send("Animes successfully saved! Enjoy, " + req.body.nickname + "!");
});

module.exports = router;
