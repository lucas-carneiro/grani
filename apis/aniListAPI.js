var request = require('request');

exports.getAnimesSeason = function(season, year, callback) {

    var apiUrl = "https://anilist.co/api/browse/anime?type=tv" 
            + "&season=" + season
            + "&year=" + year;

    var options = {
        url: apiUrl,
        headers:{
            'Authorization': 'Bearer q4HzgX1xAKFdsQqcFzGTMKiSzhUgFH4FalID2VeN'
        }
    };

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            console.log("Sucessful response from " + apiUrl);

            var animes = JSON.parse(body);

            callback(animes);       
        }
    });
}
