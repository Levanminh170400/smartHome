var socket = io("http://localhost:6060");

socket.on("server-update-data", function (data) {
  // Home page
  $("#currentTemp").html(data.temp);
  $("#currentHumi").html(data.humi);
  $("#currentLight").html(data.light);
  if (currentHumi > 80) {
    alert("Humidity in Home is greater than 80%!!!");
  }

  //History page
  $("#id-content").append("<div class='h-para'>" + data.id + "</div>");
  $("#time-content").append("<div class='h-para'>" + data.time + "</div>");
  $("#temp-content").append("<div class='h-para'>" + data.temp + "</div>");
  $("#humi-content").append("<div class='h-para'>" + data.humi + "</div>");
  $("#light-content").append("<div class='h-para'>" + data.light + "</div>");
});

socket.on("send-full", function (data) {
  // History page
  $("#light-content").html("");
  $("#time-content").html("");
  $("#temp-content").html("");
  $("#humi-content").html("");
  $("#id-content").html("");

  // console.log(data)
  data.forEach(function (item) {
    $("#light-content").append("<div class='h-para'>" + item.light + "</div>");
    $("#time-content").append("<div class='h-para'>" + item.time + "</div>");
    $("#temp-content").append("<div class='h-para'>" + item.temp + "</div>");
    $("#humi-content").append("<div class='h-para'>" + item.humi + "</div>");
    $("#id-content").append("<div class='h-para'>" + item.id + "</div>");
  });
});

// ---- Control devices ----
function handleLed(number) {
  var checkBox = document.getElementById(`led${number}`);
  // console.log(checkBox);
  if (checkBox.checked == true) {
    if (number < 7) {
      var status = document.getElementById(`s${number}`);
      status.innerHTML = "On";
    }
    // console.log(`LED ${number} ON`);
    socket.emit(`handleLED${number}`, "on");
  } else {
    if (number < 7) {
      var status = document.getElementById(`s${number}`);
      status.innerHTML = "Off";
    }
    // console.log(`LED ${number} OFF`);
    socket.emit(`handleLED${number}`, "off");
  }
}
// xu ly date-time
var timeDisplay = document.getElementById("time");
var dateDisplay = document.getElementById("date");
var dateMessage = document.getElementById("date-message");

function refreshTime() {
  const date = new Date();
  var hour = date.getHours();
  var formatMonth = "";

  if (Number(hour) >= 0 && Number(hour) < 12) {
    dateMessage.innerHTML = "Good morning, Minh";
  } else if (Number(hour) >= 12 && Number(hour) < 18) {
    dateMessage.innerHTML = "Good afternoon, Minh";
  } else if (Number(hour) >= 18 && Number(hour) < 20) {
    dateMessage.innerHTML = "Good evening, Minh";
  } else {
    dateMessage.innerHTML = "Good night, Minh";
  }

  const format = (number) => {
    if (number < 10) {
      return `0${number}`;
    } else return number;
  };

  switch (Number(date.getMonth() + 1)) {
    case 1:
      formatMonth = "January";
      break;

    case 2:
      formatMonth = "February";
      break;

    case 3:
      formatMonth = "March";
      break;

    case 4:
      formatMonth = " April";
      break;

    case 5:
      formatMonth = "May";
      break;

    case 6:
      formatMonth = "June";
      break;

    case 7:
      formatMonth = "July";
      break;

    case 8:
      formatMonth = "August";
      break;

    case 9:
      formatMonth = "September";
      break;

    case 10:
      formatMonth = "October";
      break;

    case 11:
      formatMonth = "November";
      break;

    case 12:
      formatMonth = "December";
      break;
  }
  timeDisplay.innerHTML = `${format(Number(hour))}: ${format(
    Number(date.getMinutes())
  )}`;
  dateDisplay.innerHTML = `Today, ${formatMonth} ${date.getDate()}  ${date.getFullYear()}`;
}

setInterval(refreshTime, 1000);
// change color bg
var changeColor = document.getElementById("changeColor");
var layout = document.getElementById("layout");
var containerBlock = document.getElementById("containerBlock");
var homeView = document.getElementById("homeView");
var weather = document.getElementById("weather");
var dashboardHome = document.getElementById("dashboardHome");

changeColor.onclick = () => {
  dashboardHome.classList.remove("dashboard-item-active");
  changeColor.classList.toggle("bg-active");
  layout.classList.toggle("bg-layout");
  containerBlock.classList.toggle("bg-big");
  homeView.classList.toggle("bg-view");
  weather.classList.toggle("bg-weather");
};
