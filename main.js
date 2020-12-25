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
    dateSpan.innerHTML = `${days[date.getDay()]}, ${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
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
    // fetch(weatherURL).then(response => response.json()).then(function (data) {
    var cur = data.current_condition[0];
    var div = document.createElement("div");
    div.style.display = "block";

    var p = document.createElement("p");
    p.innerText = cur.weatherDesc[0].value;
    div.appendChild(p);

    p = document.createElement("p");
    p.innerText = `🌧 ${cur.precipMM}mm`;
    div.appendChild(p);

    p = document.createElement("p");
    p.innerText = `${cur.temp_C}°`;
    div.appendChild(p);

    var span = document.createElement("span");
    span.innerText = `${cur.windspeedKmph} km/h`;
    div.appendChild(span);

    span = document.createElement("span");
    span.innerText = "⇒";
    span.style.transform = `rotate(${parseInt(cur.winddirDegree) + 90}deg)`;
    span.style.display = "inline-block";
    div.appendChild(span);

    p = document.createElement("p");
    p.innerText = `👁 ${cur.visibility}  ☁ ${cur.cloudcover}%`;
    div.appendChild(p);

    weather.appendChild(div);

    for (var w = 0; w < 2; w++) {
        var hourly = data.weather[w].hourly;
        var futureDiv = document.createElement("div");
        futureDiv.id = w == 0 ? "weatherToday" : "weatherTomorrow";
        for (var i = 0; i < hourly.length; i++) {
            div = document.createElement("div");
            div.title = hourly[i].weatherDesc[0].value;
            div.style.position = "relative";
            div.style.display = "block";

            p = document.createElement("p");
            p.innerText = hourly[i].time;
            div.appendChild(p);

            p = document.createElement("p");
            p.innerText = `${hourly[i].tempC}°`;
            div.appendChild(p);

            p = document.createElement("p");
            p.innerText = `${Math.max(hourly[i].chanceofrain, hourly[i].chanceofsnow, hourly[i].chanceofthunder)}% 🌧${hourly[i].precipMM}mm`;
            div.appendChild(p);

            var div2 = document.createElement("div");
            div2.style = "right:10%;position:absolute;width:1rem;border:none;";
            div2.style.height = `${Math.abs((hourly[i].tempC / 80) * 100)}%`;
            div2.style.backgroundColor = hourly[i].tempC > 0 ? "red" : "blue";
            if (hourly[i].tempC > 0) {
                div2.style.bottom = "50%";
            } else {
                div2.style.top = "50%";
            }
            div.appendChild(div2);

            futureDiv.appendChild(div);
        }

        weather.appendChild(futureDiv);
    }

    weatherTomorrow.style.display = "none";

    var button = document.createElement("button");
    button.innerText = "tomorrow";
    button.style.height = "1.5rem";
    button.onclick = function() {
        if(this.innerText === "tomorrow") {
            this.innerText = "today";
            weatherTomorrow.style.display = "flex";
            weatherToday.style.display = "none";
        } else {
            this.innerText = "tomorrow";
            weatherTomorrow.style.display = "none";
            weatherToday.style.display = "flex";
        }
    }
    weather.appendChild(button);

    // });
}
getWeather();
