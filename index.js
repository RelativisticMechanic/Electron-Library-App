$ = require('jquery');

function UpdateVersionString()
{
    $("#node-version").html(process.version);
    $("#chrome-version").html(navigator.userAgent.toString().split("Chrome/")[1].split(" ")[0]);
    $("#electron-version").html(process.versions.electron);
}

$(document).ready( () => { 
    UpdateVersionString();
});