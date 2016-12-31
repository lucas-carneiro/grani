//Libraries
var express = require('express');

//APIs
var nyaaAPI = require("../apis/nyaaAPI.js");

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	var anime = req.query.anime;
	var episode = req.query.episode;

    nyaaAPI.getAnimeTorrent(anime, episode, function(torrents){
        res.render('torrent', {
            title: "Grani",
            anime: anime,
            episode: episode,
            torrents: torrents
        });
    });
});

module.exports = router;
