function postAsync(){

    var url = "/";
    var fields = "";

    var form = document.getElementById('animeForm');
    var formData = new FormData(form);

    // field[0] = input.id
    // field[1] = input.value
    for (var field of formData){
        fields += field[0] + "=" + field[1] + "&"
    }
    // Removing last &
    fields = fields.slice(0, -1);

    var req;

    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
    } 
    else
        if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }

    if (req != undefined) {
        // req.overrideMimeType("application/json"); // if request result is JSON
        try {
            // 3rd param is whether "async". It should be always true, as stated in https://xhr.spec.whatwg.org/#the-open()-method
            req.open("POST", url, true); 
        }
        catch(err) {
            console.log("Couldn't complete request. Is JS enabled for that domain?\\n\\n" + err.message);
        }

        //Send the proper header information along with the request
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        //Call a function when the state changes.
        req.onreadystatechange = function() {
            if(req.readyState == XMLHttpRequest.DONE){
                if (req.status == 200){
                    console.log("Form succesfully sent!");
                }
                else{
                    console.log("XHR error: " + req.status + " " +req.statusText);
                }
            }
        }

        // Param string only used for POST
        req.send(fields); 
    }
    else
        console.log("Req for getAsync is undefined.");
}
