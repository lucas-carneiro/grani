//Libraries
var feed = require("feed-read");

exports.getAnimeTorrent = function(anime, episode, callback) {

    var apiUrl = "https://www.nyaa.se/?page=rss&term=" + anime + "+" + episode + "&sort=2";
	
	console.log("Getting RSS from " + apiUrl);

    feed(apiUrl, function(error, torrents){
    	if (error)
    		throw new Error(error);
    	
    	console.log("Sucessful response from " + apiUrl);

    	callback(torrents);
    });
}
