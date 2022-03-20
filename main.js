function mapRange(value, valueLow, valueHigh, remappedLow, remappedHigh) {
    return remappedLow + ((remappedHigh - remappedLow) * (value - valueLow)) / (valueHigh - valueLow);
}

var hueSlider = document.getElementById("hue");
var root = document.documentElement;

function generateMonth() {
    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();
    var day = date.getDate();
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["S", "M", "T", "W", "T", "F", "S"];

    function addCells(amount, element) {
        for (var k = 0; k < amount; k++) {
            var td = document.createElement("td");
            element.appendChild(td);
        }
    }
    function leapYear(yearToCheck) {
        return (!(yearToCheck % 4) && (yearToCheck % 100) || !(yearToCheck % 400)) ? 1 : 0;
    }

    var div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.border = "none";

    // month name
    div.innerText = monthNames[month];

    var button = document.createElement("button");
    button.innerText = "🗗";
    button.style.width = "fit-content";
    button.onclick = () => toggle("calendar");
    div.appendChild(button);

    var table = document.createElement("table");

    // days header
    var row = document.createElement("tr");
    for (var j = 0; j < 7; j++) {
        var td = document.createElement("td");
        td.innerText = dayNames[j];
        td.className = "header";
        row.appendChild(td);
    }
    table.appendChild(row);

    // days
    row = document.createElement("tr");

    // amount of months in day
    var days = monthDays[month] + (month === 1 ? leapYear(year) : 0);

    // day of the week to start at
    var startDate = new Date(`${monthNames[month]} 1, ${year} 00:00:01`);
    var startDateIndex = startDate.getDay();

    // generate cells with date numbers
    for (var j = 0; j < days; j++) {
        // day of the week
        var dayIndex = (startDateIndex + j) % 7;

        // blank cells at start
        if (j === 0) {
            addCells(dayIndex, row);
        }

        // make a new row when needed
        if (j > 0 && dayIndex === 0) {
            table.appendChild(row);
            row = document.createElement("tr");
        }

        // make cell
        var td = document.createElement("td");
        td.innerText = j + 1;
        td.id = `${year}.${month}.${j + 1}`;
        td.className = "day";

        if(j+1 === day) {
            td.style.backgroundColor = "#2b4254";
        }

        row.appendChild(td);

        // blank cells at end and append last row
        if (j + 1 === days) {
            addCells(6 - dayIndex, row);
            table.appendChild(row);
        }
    }

    div.appendChild(table);

    document.getElementById("month").appendChild(div);
}
generateMonth();

// time
function updateTime() {
    let date = new Date();
    timeSpan.innerHTML = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}
updateTime();
setInterval(updateTime, 1000);

// date
function showDate() {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let date = new Date();
    dateSpan.innerHTML = `${days[date.getDay()]}, ${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
}
showDate();

// weather
function getWeather() {
    var weatherURL = "http://wttr.in/";
    if (localStorage.getItem("city") !== undefined) {
        weatherURL += localStorage.getItem("city") + "?format=j1";
    } else {
        weatherURL += "?format=j1";
    }

    fetch(weatherURL).then(response => response.json()).then(function (data) {
    weather.innerHTML = "";

    var titleP = document.createElement("p");
    titleP.className = "titleP";
    titleP.innerText = "WEATHER";
    weather.appendChild(titleP);
    
    var cur = data.current_condition[0];

    var leftDiv = document.createElement("div");
    leftDiv.style.display = "inline-block";
    leftDiv.style.marginRight = "3em";
    leftDiv.style = "display: inline-block;margin-right:3em;border:none";
    var rightDiv = document.createElement("div");
    rightDiv.style = "display: inline-block;vertical-align: top;border:none";

    // description
    span = document.createElement("div");
    span.innerText = cur.weatherDesc[0].value;
    span.style="display:block;border:none";
    leftDiv.appendChild(span);

    // temperature
    var span = document.createElement("div");
    span.innerText = `${cur.temp_C}°`;
    span.style="display:block;border:none;font-size:2em";
    leftDiv.appendChild(span);

    // precipitation
    span = document.createElement("div");
    span.innerText = `🌧 ${cur.precipMM}mm`;
    span.style="display:block;border:none";
    leftDiv.appendChild(span);


    // wind
    var span = document.createElement("div");
    span.innerText = `${cur.windspeedKmph} km/h`;
    span.style="display:inline-block;border:none";
    rightDiv.appendChild(span);

    // direction
    span = document.createElement("div");
    span.innerText = "⇒";
    span.style.transform = `rotate(${parseInt(cur.winddirDegree) + 90}deg)`;
    span.style.display = "inline-block";
    span.style.border = "none";
    rightDiv.appendChild(span);

    // cloud cover/visibility
    span = document.createElement("div");
    span.innerText = `👁 ${cur.visibility}  ☁ ${cur.cloudcover}%`;
    span.style="display:block;border:none";
    rightDiv.appendChild(span);
    
    var refreshButton = document.createElement("button");
    refreshButton.onclick = getWeather;
    refreshButton.innerText = "↺";
    rightDiv.appendChild(refreshButton);


    weather.appendChild(leftDiv);
    weather.appendChild(rightDiv);

    for (var w = 0; w < 2; w++) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("height", "128");
        svg.setAttribute("width", "256");

        var hourly = data.weather[w].hourly;
        var futureDiv = document.createElement("div");
        futureDiv.id = w == 0 ? "weatherToday" : "weatherTomorrow";

        var poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        var points = "0,128 ";

        var min = Infinity;
        var max = -Infinity;

        // find max and min price
        for (var i = 0; i < hourly.length; i++) {
            if (parseInt(hourly[i].tempC) < min) {
                min = parseInt(hourly[i].tempC);
            }
            if (parseInt(hourly[i].tempC) > max) {
                max = parseInt(hourly[i].tempC);
            }
        }

        for (var i = 0; i < hourly.length; i++) {
            var yPos = mapRange(parseInt(hourly[i].tempC),min,max,96,32);
            points += `${i*32},${yPos} `;

            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x",i*32);
            text.setAttribute("y",yPos);
            text.innerHTML = hourly[i].tempC;
            svg.appendChild(text);
        }
        
        points += `256, ${mapRange(hourly[7].tempC,min,max,96,32)} `;
        points += "256,128 ";
        poly.setAttribute("points", points);
        poly.style = "stroke:#b81200;stroke-width:1;fill-opacity: 0.3;fill:#de5243;";
        svg.insertBefore(poly, svg.firstChild);
        
        var poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        var points = "0,128 ";
        for (var i = 0; i < hourly.length; i++) {
            var yPos = mapRange(Math.max(parseInt(hourly[i].chanceofrain), parseInt(hourly[i].chanceofsnow), parseInt(hourly[i].chanceofthunder)),0,100,96,32);
            points += `${i*32},${yPos} `;
        }
        points += `256, ${mapRange(Math.max(parseInt(hourly[7].chanceofrain), parseInt(hourly[7].chanceofsnow), parseInt(hourly[7].chanceofthunder)),0,100,96,32)} `;
        points += "256,128 ";
        poly.setAttribute("points", points);
        poly.style = "stroke:#3dabf5;stroke-width:1;fill-opacity: 0.3;fill:#285f85;";
        svg.insertBefore(poly, svg.firstChild);
        

        futureDiv.appendChild(svg);
        
        weather.appendChild(futureDiv);
    }

    weatherTomorrow.style.display = "none";

    // switch button
    var button = document.createElement("button");
    button.innerText = "tomorrow";
    button.style.height = "1.5rem";
    button.onclick = function () {
        if (this.innerText === "tomorrow") {
            this.innerText = "today";
            weatherTomorrow.style.display = "flex";
            weatherToday.style.display = "none";
        } else {
            this.innerText = "tomorrow";
            weatherTomorrow.style.display = "none";
            weatherToday.style.display = "flex";
        }
    };
    weather.appendChild(button);

    });
}
getWeather();

// crypto
// https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=cad&days=7&interval=hourly
// https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=cad&days=7&interval=hourly
// https://api.coingecko.com/api/v3/coins/dogecoin/market_chart?vs_currency=cad&days=7&interval=hourly
function getCrypto() {
    fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=cad&days=7&interval=hourly").then(response => response.json()).then(function (data) {
        makeCryptoChart(data,"BTC");
    });
    fetch("https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=cad&days=7&interval=hourly").then(response => response.json()).then(function (data) {
        makeCryptoChart(data,"ETH");
    });
    fetch("https://api.coingecko.com/api/v3/coins/dogecoin/market_chart?vs_currency=cad&days=7&interval=hourly").then(response => response.json()).then(function (data) {
        makeCryptoChart(data,"DOGE");
    });
}
function makeCryptoChart(data,label) {
    var min = Infinity;
    var max = 0;
    // find max and min price
    for (var i = 0; i < data.prices.length; i++) {
        if (data.prices[i][1] < min) {
            min = data.prices[i][1];
        }
        if (data.prices[i][1] > max) {
            max = data.prices[i][1];
        }
    }

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "220");
    svg.setAttribute("width", "358");
    
    // gradient
    // svg.innerHTML = `<defs><linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:rgba(0, 47, 255, 1);stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(24, 24, 24, 0);stop-opacity:1" /></linearGradient></defs>`;
    
    svg.style="width:358px,height:220;padding:5px";

    for(var i=0;i<10;i++) {
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1",0);
        line.setAttribute("x2",358);
        line.setAttribute("y1",~~mapRange(i,0,9,0,200)+0.5);
        line.setAttribute("y2",~~mapRange(i,0,9,0,200)+0.5);
        line.style = "stroke:var(--background-color);";
        svg.appendChild(line);
    }

    var poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    var points = "20,200 ";
    for (var i = 0; i < data.prices.length; i++) {
        points += `${i*2+20},${mapRange(data.prices[i][1],min,max,200,0)} `;
    }
    points += "358,200";
    poly.setAttribute("points", points);
    poly.style = "stroke:var(--base-color);stroke-width:1;fill-opacity: 0.3;fill:var(--base-color);";
    svg.appendChild(poly);

    var heights = [15,105,195];
    var values = ["$"+Math.round(max),"$"+Math.round((max+min)/2),"$"+Math.round(min)];
    if(max < 100) {
        values = ["$"+Math.round(max*1000)/1000,"$"+Math.round((max+min)*500)/1000,"$"+Math.round(min*1000)/1000];
    }

    for(var i=0;i<3;i++) {
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x",0);
        text.setAttribute("y",heights[i]);
        text.innerHTML = values[i];
        svg.appendChild(text);
    }

    // price
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.innerHTML = `$${Math.round(data.prices[data.prices.length-1][1]*1000)/1000}`;
    text.setAttribute("x",358-text.innerHTML.length*7);
    text.setAttribute("y",190);
    svg.appendChild(text);

    // change
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    var diff = Math.round((data.prices[data.prices.length-1][1] - data.prices[0][1]) * 1000) / 1000;
    text.innerHTML = (Math.sign(diff) == 1 ?"🡹":"🡻") + Math.abs(diff);
    text.setAttribute("x",358-text.innerHTML.length*7);
    text.setAttribute("y",170);
    svg.appendChild(text);

    // label
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.innerHTML = label;
    text.style.fontSize = "16px";
    text.setAttribute("x",60);
    text.setAttribute("y",15);
    svg.appendChild(text);

    // graph
    var date = new Date(data.prices[0][0]);
    for(var i=0;i<data.prices.length;i++) {
        var newDate = new Date(data.prices[i][0]);
        if(date.getDate() !== newDate.getDate()) {
            date = newDate;

            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1",i*2+20.5);
            line.setAttribute("x2",i*2+20.5);
            line.setAttribute("y1",200);
            line.setAttribute("y2",205);
            line.style = "stroke:#00ffff";
            svg.appendChild(line);

            text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x",i*2+15);
            text.setAttribute("y",215);
            text.innerHTML = date.getDate().toString().padStart(2, "0");
            svg.appendChild(text);
        }
    }

    cryptoDiv.appendChild(svg);
}
getCrypto();

function createNews() {
    // var newsData;
    fetch("https://api.currentsapi.services/v1/latest-news?country=CA&language=en&"+this[createNews.name[18-([]+{}).length]+(this+"")[parseInt(20,3)]+(this+"")[+!![]]+(this+"")[+!![]+!![]]]((Math.min()+[])[7].toUpperCase()+"XBpS2V5PUpRNmRBcVBJb1plcnV0dlF2ZXFtM3ktcnBFUDdCdWpPUVZIQmp2LWlqNnFGRi1lZw==")).then(response => response.json()).then(function (d) {  
        // console.log(JSON.stringify(d))
        var newsData = d.news;
        
        // newsData = dataN.split("\n").join("");

        // remove quotes in titles
        // var quotes = [];
        // for(var i=0;i<newsData.length;i++) {
        //     if(newsData[i] === `"`) {
        //         quotes.push(i);
        //         if(/([\[\]\{\}:,])/.exec(newsData[i+1]) !== null && quotes.length > 1) {
        //             while(quotes.length > 2) {
        //                 var index = quotes.splice(1,1)[0];
        //                 for(var j=1;j<quotes.length;j++) {
        //                     quotes[j]--;
        //                 }
        //                 i--;
        //                 newsData = newsData.slice(0,index) + newsData.slice(index+1,newsData.length); 
        //             }
        //             quotes = [];
        //         }
        //     }
        // }

        // newsData = JSON.parse(newsData).news;
        var span = document.createElement("span");
        for(var i=0;i<newsData.length;i++) {
            var a = document.createElement("a");
            a.href = newsData[i].url;
            a.target = "_blank";
            a.innerText = newsData[i].title + "  |  ";
            span.appendChild(a);
        }
        span.id = "scrollText";
        span.style.animationDuration = `${span.innerText.length/15}s`;
        news.appendChild(span);
    });
}
createNews();

// checklist
function updateChecklist() {
    var obj = {};
    obj.daily = document.getElementById("dailyText").value;
    obj.today = document.getElementById("todayText").value;
    localStorage.setItem("checkList", JSON.stringify(obj));
    loadChecklist();
}

function loadChecklist() {
    document.getElementById("daily").innerHTML = "";
    document.getElementById("today").innerHTML = "";
    var checkObj = localStorage.getItem("checkList");
    if (checkObj !== null) {
        checkObj = JSON.parse(checkObj);

        document.getElementById("dailyText").value = checkObj.daily;
        createChecks(checkObj.daily.split("\n"), document.getElementById("daily"));

        document.getElementById("todayText").value = checkObj.today;
        createChecks(checkObj.today.split("\n"), document.getElementById("today"));
    }
}

function createChecks(words, div) {
    for (var i = 0; i < words.length; i++) {
        var label = document.createElement("label");
        label.className = "checks";
        label.innerText = words[i];

        var input = document.createElement("input");
        input.onclick = function () {
            this.parentElement.style.color = this.checked ? "#4e9edf" : "#bad9f3";
            // if (this.checked) {
            //     pulse();
            // }
        };
        input.type = "checkbox";
        input.className = "checkInput";
        label.appendChild(input);

        var span = document.createElement("span");
        span.className = "checkbox";
        label.appendChild(span);

        div.appendChild(label);
    }
}

function reset() {
    for (var i of document.getElementById("checkList").getElementsByTagName("input")) {
        i.checked = false;
        i.parentElement.style.color = "#bad9f3";
    }
}

function pulse() {
    document.body.parentElement.style.backgroundColor = "rgb(0, 60, 60)";
    var count = 60;
    var interval = setInterval(() => {
        count--;
        document.body.parentElement.style.backgroundColor = `rgb(30, ${count}, ${count})`;
        if (count <= 30) {
            document.body.parentElement.style.backgroundColor = "#0a3044";
            clearInterval(interval);
        }
    }, 16);
}


loadChecklist();

function toggle(elementName) {
    var c = document.getElementById(elementName);
    c.style.display = c.style.display === "none" ? "block" : "none";
}

var canvas = document.getElementById("clock");
var ctx = canvas.getContext("2d");
var data = ctx.getImageData(0, 0, 300, 288);

var timeText = document.getElementById("time");

function updateClock() {
    // get time
    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    // go up until this point with color
    var pixelsToColor = hours * 3600 + minutes * 60 + seconds;

    var currentPixel = 0;
    // position in image data
    var pos = 0;

    var rgb = hslToRgb(parseInt(hueSlider.value)/360);

    // go through data
    var d = data.data;
    for (var y = 0; y < 288; y++) {
        for (var x = 0; x < 300; x++) {
            if (currentPixel === pixelsToColor) {
                d[pos] = 0;
                d[pos + 1] = 221;
                d[pos + 2] = 255;
                d[pos + 3] = 255;
                // dark
            } else if (currentPixel > pixelsToColor) {
                d[pos] = 2;
                d[pos + 1] = 10;
                d[pos + 2] = 14;
                d[pos + 3] = 255;
                // blue
            } else {
                var shading = Math.max(currentPixel+255-pixelsToColor,0);
                d[pos] = rgb[0]+shading;
                d[pos + 1] = rgb[1]+shading;
                d[pos + 2] = rgb[2]+shading;
                d[pos + 3] = 255;
            }
            ++currentPixel;
            pos += 4;
        }
    }

    ctx.putImageData(data, 0, 0);
}

updateClock();
setInterval(updateClock, 1000);


function hslToRgb(h, s=0.95, l=0.10){
    var r, g, b;

    var hue2rgb = function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function setHue() {
//   root.style.setProperty("--base-color", `hsl(${hueSlider.value},100%,80%)`);
//   root.style.setProperty("--background-color", `hsl(${hueSlider.value},75%,10%)`);
//   root.style.setProperty("--darker-color", `hsl(${hueSlider.value},75%,20%)`);
    root.style.setProperty("--hue", hueSlider.value);
}

hueSlider.addEventListener("input", function(){
  setHue();
});

// setInterval(function() {
//     hueSlider.value = parseInt(hueSlider.value) + 1;
//     if(parseInt(hueSlider.value) === 360) {
//         hueSlider.value = 0;
//     }
//     setHue();
// },16);