// =============By Lê Văn Minh - B18DCDT154 - D18DTMT01===============
const express = require("express"); // Module xử lí chung
const mysql = require("mysql2"); // Module cho phép sử dụng cơ sở dữ liệu mySQL
const mqtt = require("mqtt"); // Module cho phép sử dụng giao thức mqtt
const app = express();
const port = 6060; // Port của localhost do mình chọn
const exportCharts = require("./export.js"); // Require file export.js

app.use(express.static("public"));
app.set("views engine", "ejs");
app.set("views", "./views");

const server = require("http").Server(app);
const io = require("socket.io")(server); // import thư viện socket.io

app.get("/", function (req, res) {
  res.render("login.ejs");
});

app.get("/login", function (req, res) {
  res.render("login.ejs");
});

app.get("/signup", function (req, res) {
  res.render("signup.ejs");
});

app.get("/home", function (req, res) {
  res.render("homeview.ejs");
});

app.get("/control", function (req, res) {
  res.render("control.ejs");
});

app.get("/history", function (req, res) {
  res.render("history.ejs");
});

server.listen(port, function () {
  console.log("Server listening on port " + port);
});

//----------------------MQTT-------------------------

var options = {
  host: "bfe2e16806fa4b1ba9cb3a93ad3c8309.s2.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "levanminh",
  password: "levanminhptit123",
};
//MQTT
// connect for esp
var client = mqtt.connect("mqtt://broker.hivemq.com:1883");
// connect for test
// var client = mqtt.connect(options);

// // declare topics
var topic1 = "livingroomLight";
var topic2 = "livingroomTelevision";
var topic3 = "livingroomFan";

var topic4 = "bedroomConditioner";
var topic5 = "bedroomLight";
var topic6 = "bedroomDoor";

var topic7 = "door";
var topic8 = "outdoorLight";

var topic_list = ["temperature-humidity"];

client.on("connect", function () {
  console.log("connected mqtt " + client.connected);
});

client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1);
});

// SQL--------Temporarily use PHPMyAdmin------------------------------
var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Tinhtrihau2x",
  database: "newDatabase",
});
// //---------------------------------------------CREATE TABLE-------------------------------------------------
con.connect(function (err) {
  if (err) throw err;
  console.log("mysql connected");
  var sql =
    "CREATE TABLE IF NOT EXISTS sensors11(ID int(10) not null primary key auto_increment, Time datetime not null, Temperature int(3) not null, Humidity int(3) not null, Light int(5) not null )";
  con.query(sql, function (err) {
    if (err) throw err;
    console.log("Table created");
  });
});

// var humi_graph = [];
// var temp_graph = [];
// var date_graph = [];
client.subscribe("home/sensors/temperature-humidity");
var m_time;
var newTemp;
var newHumi;
var newLight;

// //--------------------------------------------------------------------
var cnt_check = 0;
client.on("message", function (topic, message) {
  console.log("topic:" + topic.toString());
  console.log("message is " + message);
  const objData = JSON.parse(message);
  if (topic == "home/sensors/temperature-humidity") {
    cnt_check = cnt_check + 1;
    newTemp = objData.Temperature;
    newHumi = objData.Humidity;
    newLight = objData.Light;
    // newLight = 100;
  }
  // cnt_check: dùng để kiểm tra để lưu dữ liệu vào database
  if (cnt_check == 1) {
    console.log("ready to save");
    var n = new Date();
    var month = n.getMonth() + 1;
    var Date_and_Time =
      n.getFullYear() +
      "-" +
      month +
      "-" +
      n.getDate() +
      " " +
      n.getHours() +
      ":" +
      n.getMinutes() +
      ":" +
      n.getSeconds();
    var sql =
      "INSERT INTO sensors11 (Time, Temperature, Humidity, Light) VALUES ('" +
      Date_and_Time.toString() +
      "', '" +
      newTemp +
      "', '" +
      newHumi +
      "', '" +
      newLight +
      "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table inserted");
      console.log(
        Date_and_Time + " " + newTemp + " " + newHumi + " " + newLight
      );
    });
    exportCharts(con, io);
    cnt_check = 0;
  }
});
//================SocketControl devices================

io.on("connection", function (socket) {
  console.log("socket " + socket.id + " connected");
  socket.on("disconnect", function () {
    console.log(socket.id + " disconnected");
  });

  socket.on("handleLED1", function (data) {
    if (data == "on") {
      console.log("livingroomLight ON");
      client.publish(topic1, "On");
    } else {
      console.log("livingroomLight OFF");
      client.publish(topic1, "Off");
    }
  });

  socket.on("handleLED2", function (data) {
    if (data == "on") {
      console.log("livingroomTelevision ON");
      client.publish(topic2, "On");
    } else {
      console.log("livingroomTelevision OFF");
      client.publish(topic2, "Off");
    }
  });

  socket.on("handleLED3", function (data) {
    if (data == "on") {
      console.log("livingroomFan ON");
      client.publish(topic3, "On");
    } else {
      console.log("livingroomFan OFF");
      client.publish(topic3, "Off");
    }
  });

  socket.on("handleLED4", function (data) {
    if (data == "on") {
      console.log("bedroomConditioner ON");
      client.publish(topic4, "On");
    } else {
      console.log("bedroomConditioner OFF");
      client.publish(topic4, "Off");
    }
  });

  socket.on("handleLED5", function (data) {
    if (data == "on") {
      console.log("bedroomLight ON");
      client.publish(topic5, "On");
    } else {
      console.log("bedroomLight OFF");
      client.publish(topic5, "Off");
    }
  });

  socket.on("handleLED6", function (data) {
    if (data == "on") {
      console.log("bedroomCurtain ON");
      client.publish(topic6, "On");
    } else {
      console.log("bedroomCurtain OFF");
      client.publish(topic6, "Off");
    }
  });

  socket.on("handleLED7", function (data) {
    if (data == "on") {
      console.log("door ON");
      client.publish(topic7, "On");
    } else {
      console.log("door OFF");
      client.publish(topic7, "Off");
    }
  });

  socket.on("handleLED8", function (data) {
    if (data == "on") {
      console.log("outdoorLight ON");
      client.publish(topic8, "On");
    } else {
      console.log("outdoorLight OFF");
      client.publish(topic8, "Off");
    }
  });

  // Send data to History page
  var sql1 = "SELECT * FROM sensors11 ORDER BY ID";
  con.query(sql1, function (err, result, fields) {
    if (err) throw err;
    console.log("Full Data selected");
    var fullData = [];
    result.forEach(function (value) {
      var m_time = value.Time.toString().slice(4, 24);
      fullData.push({
        id: value.ID,
        time: m_time,
        temp: value.Temperature,
        humi: value.Humidity,
        light: value.Light,
      });
    });
    io.sockets.emit("send-full", fullData);
  });
});
