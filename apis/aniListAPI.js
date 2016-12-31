//Libraries
var request = require('request');
var credentials = require("../credentials.json");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./storage');
}
var Promise = require('promise');

exports.getAnimesSeason = function(season, year, callback) {

    var expireTokenTime = localStorage.getItem('expireTokenTime');
    var currentUTC = Math.floor(Date.now() / 1000);

    console.log (currentUTC + " > " + expireTokenTime + "?");

    if (currentUTC > expireTokenTime)
        getNewToken().done(
            getAnimes.bind(null, season, year, callback),
            function(error){
                throw new Error(error);
            });
    else
        getAnimes(season, year, callback);
}

function getAnimes(season, year, callback){
    var apiUrl = "https://anilist.co/api/browse/anime?type=tv" 
            + "&season=" + season
            + "&year=" + year;

    var options = {
        url: apiUrl,
        headers:{
            'Authorization': localStorage.getItem('token')
        }
    };

    console.log("Connecting to " + apiUrl);

    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            console.log("Sucessful response from " + apiUrl);

            var animes = JSON.parse(body);

            callback(animes);       
        }
    });
}

function getNewToken(){
    return new Promise(function(resolve, reject){
        console.log('Getting new token...');

        var apiUrl = "https://anilist.co/api/auth/access_token";

        var options = {
            url: apiUrl,
            formData:{
                grant_type: 'client_credentials',
                client_id: credentials.client_id,
                client_secret: credentials.client_secret
            }
        };

        request.post(options, function (error, response, body) {

            if (!error) {
                if (response.statusCode == 200){
                    console.log("Sucessful response from " + apiUrl);

                    var tokenInfo = JSON.parse(body);
                    var accessToken = tokenInfo.token_type + ' ' + tokenInfo.access_token;

                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('expireTokenTime', tokenInfo.expires);  

                    console.log("End of token request.");
                    resolve();
                }
                else
                    reject(response.statusCode);
            }
            else
                reject(error);
        });
    });
}
