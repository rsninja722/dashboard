// time
function updateTime() {
    let date = new Date();
    timeSpan.innerHTML = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
updateTime();
setInterval(updateTime, 1000)

// date
function showDate() {
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let date = new Date();
    dateSpan.innerHTML = `${days[date.getDay()]}, ${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;
}
showDate();

// weather
function getWeather() {
    // fetch('http://wttr.in/?format=j1').then(response => response.json()).then(function (data) {
        var cur = data.current_condition[0];
        var div = document.createElement("div");

        var p = document.createElement("p");
        p.innerText = cur.weatherDesc[0].value;
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

    // });

}
getWeather();
