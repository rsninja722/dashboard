var curData = "";
var head = "year ,month,day ,6:00 ,6:30 ,7:00 ,7:30 ,8:00 ,8:30 ,9:00 ,9:30 ,10:00,10:30,11:00,11:30,12:00,12:30,1:00 ,1:30 ,2:00 ,2:30 ,3:00 ,3:30 ,4:00 ,4:30 ,5:00 ,5:30 ,6:00 ,6:30 ,7:00 ,7:30 ,8:00 ,8:30 ,9:00 ,9:30 ,10:00,10:30,11:00,11:30,12:00,12:30,1:00 ,1:30 ,2:00 ,2:30 ,3:00 ,3:30 ,4:00 ,4:30 ,5:00 ,5:30 ";
var headLength;
var sickAnimationTimer = 0;

var presets = {
    school: "sl,sl,aa,aa,aa,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,aa,aa,,,,,,,,,,,,,,,,,,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl",
    robotics: "sl,sl,aa,aa,aa,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,aa,rb,rb,rb,rb,rb,rb,rb,rb,rb,rb,aa,,,,,,,,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl",
    work: "sl,sl,aa,aa,aa,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,sc,aa,aa,aa,aa,kw,kw,kw,kw,kw,kw,kw,kw,aa,,,,,,,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl,sl"
}

function preset(presetKeyName) {
    var curData = presets[presetKeyName].split(",");
    for (var i = 3; i < headLength; i++) {
        document.getElementById(`${i}`).value = curData[i-3];
    }
}

setInterval(function () {
    var outputText = "";
    for (var i = 0; i < headLength; i++) {
        outputText += document.getElementById(i.toString()).value + (i < headLength-1 ? "," : "");
    }
    document.getElementById("output").innerText = outputText;
}, 100)

function copy() {
    navigator.clipboard.writeText(document.getElementById("output").innerText).then(function () { sickAnimation(); }, function () { console.log("failure copying"); });
}

function sickAnimation() {
    var speed = 250;
    var pos = Math.round(sickAnimationTimer / (speed / headLength));
    if (pos - 2 >= 0 && pos - 1 < headLength) { document.getElementById((pos - 2).toString()).style.backgroundColor = `hsl(190,30%,20%)`; }
    if (pos - 1 >= 0 && pos - 1 < headLength) { document.getElementById((pos - 1).toString()).style.backgroundColor = `hsl(190,30%,25%)`; }
    if (pos >= 0 && pos < headLength) { document.getElementById(pos.toString()).style.backgroundColor = `hsl(190,30%,30%)`; }
    if (pos + 1 < headLength) { document.getElementById((pos + 1).toString()).style.backgroundColor = `hsl(190,30%,20%)`; }
    if (pos + 2 < headLength) { document.getElementById((pos + 2).toString()).style.backgroundColor = `hsl(190,30%,20%)`; }

    if (sickAnimationTimer < speed) {
        sickAnimationTimer++;
        requestAnimationFrame(sickAnimation);
    } else {
        sickAnimationTimer = 0;
    }
}

function parseData(text) {
    curData = text.split("\n");
    var heads = curData[0].split(",");
    headLength = heads.length;
    var now = new Date;
    for (var i = 0; i < heads.length; i++) {
        var divElement = document.createElement("div");
        var spanElement = document.createElement("span");
        var inputElement = document.createElement("input");

        inputElement.type = "text";
        inputElement.id = i;

        spanElement.innerText = heads[i];
        if (i === 0) { inputElement.value = now.getFullYear(); }
        if (i === 1) { 
            var month = (now.getMonth() + 1).toString();
            month = month.length<2 ? "0" + month : month;
            inputElement.value = month;
        }
        if (i === 2) { 
            var date = now.getDate().toString();  
            date = date.length<2 ? "0" + date : date;
            inputElement.value = date;
        }
        if (i > 40) { inputElement.value = "sl"; }

        divElement.appendChild(spanElement);
        divElement.appendChild(inputElement);

        document.getElementById("inputs").appendChild(divElement)
    }
}

parseData(head);