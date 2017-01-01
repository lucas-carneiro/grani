//Libraries
var feed = require("feed-read");
var schedule = require("node-schedule");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}

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

exports.checkTorrent = function(anime, episode, countdown){

    // Nyaa searches fail for episodes between 1 and 9 if query is done as a single digit.
    // e.g. 'nanbaka 1' fails, while 'nanbaka 01' returns torrents.
    if (episode.length == 1)
        episode = "0" + episode;

    if (countdown <= 0){

        searchTorrent(anime, episode, function(torrents){

            // Pattern used to check each torrent for a match
            // e.g. '<anything> Hibike!! Euphonium 2<anything> 12 '
            var pattern = ".*\\s" + anime + ".*\\s" + episode + "\\s";
            var regexp = new RegExp(pattern, "gi");

            console.log("pattern: " + pattern);

            for (var i = 0; i < torrents.length; i++) {
                if(regexp.test(torrents[i].title)){
                    // telegramBot.notifyUser(user.telegramId);
                    // torrentClient.download(torrent);
                    console.log("TORRENT FOUND!!!");
                    localStorage.setItem(torrents[i].title, torrents[i].link);
                    return;
                }
            }

            //After 30 hours, give up
            if (countdown <= -30)
                return;

            // No torrents found: Check again in 1 hour
            // 3600000 = 1 hour (epoch)
            var scheduleDate = new Date(Date.now() + 3600000);
            schedule.scheduleJob(scheduleDate, exports.checkTorrent.bind(null, anime, episode, countdown - 1));
        });
    }
    else {
        var scheduleDate = new Date(Date.now() + countdown);
        schedule.scheduleJob(scheduleDate, exports.checkTorrent.bind(null, anime, episode, 0));
    }
}

function searchTorrent(anime, episode, callback) {

    anime = encodeURIComponent(anime);

    var apiUrl = "https://www.nyaa.se/?page=rss&term=" + anime + "+" + episode + "&sort=2";
    
    console.log("Getting RSS from " + apiUrl);

    feed(apiUrl, function(error, torrents){
        if (error)
            throw new Error(error);
        
        console.log("Sucessful response from " + apiUrl);

        callback(torrents);
    });
}
