
#include "DHT.h"
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "ArduinoJson.h"
#include <Wire.h>

// Thông tin về wifi
const char* ssid = "Minh sky:=))";
const char* password = "Hoianhminh";
const char* mqtt_server = "broker.hivemq.com";
const uint16_t mqtt_port = 1883; //Port của MQTT


#define topic1 "home/sensors/temperature-humidity"

#define DHTPIN D2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

void setup()
{
  Serial.begin(9600);
  Wire.begin();
  setup_wifi();                             
  client.setServer(mqtt_server, mqtt_port); 
  client.setCallback(callback);            

    if (!client.connected())
    { 
      reconnect();
    }
  client.subscribe("livingroomLight");
  client.subscribe("livingroomTelevision");
  client.subscribe("livingroomFan");
  
  client.subscribe("bedroomConditioner");
  client.subscribe("bedroomLight");
  client.subscribe("bedroomDoor");

  client.subscribe("door");
  client.subscribe("outdoorLight");

  pinMode(A0,INPUT); //gan A0 cho LDR
  
  pinMode(D0, OUTPUT); // livingroomLight
  pinMode(D1, OUTPUT); // livingroomTelevision
  pinMode(D3, OUTPUT); // livingroomFan
  
  pinMode(D4, OUTPUT); // bedroomConditioner
  pinMode(D5, OUTPUT); // bedroomLight
  
  pinMode(D6, OUTPUT); // outdoorLight
  
  dht.begin();
}

// Hàm kết nối wifi
void setup_wifi() {

  delay(10);
//   We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid,password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP());
}
// Hàm call back để nhận dữ liệu
void callback(char *topic, byte *payload, unsigned int length)
{
  char p[length + 1];
  memcpy(p, payload, length);
  p[length] = NULL;
  String message(p);

  if (String(topic) == "livingroomLight")
  {
    if (message == "On")
    {
        digitalWrite(D0, HIGH);
    }
    if (message == "Off")
    {
        digitalWrite(D0, LOW);
    }
  }

  if (String(topic) == "livingroomTelevision")
  {
    if (message == "On")
    {
      digitalWrite(D1, HIGH);
    }
    if (message == "Off")
    {
      digitalWrite(D1, LOW);
    }
  }

  if (String(topic) == "livingroomFan")
  {
    if (message == "On")
    {
      digitalWrite(D3, LOW);
    }
    if (message == "Off")
    {
      digitalWrite(D3, HIGH);
    }
  }

  if (String(topic) == "bedroomConditioner")
  {
    if (message == "On")
    {
      digitalWrite(D4, HIGH);
    }
    if (message == "Off")
    {
      digitalWrite(D4, LOW);
    }
  }

  if (String(topic) == "bedroomLight")
  {
    if (message == "On")
    {
      digitalWrite(D5, HIGH);
    }
    if (message == "Off")
    {
      digitalWrite(D5, LOW);
    }
  }

  if (String(topic) == "bedroomDoor")
  {
    if (message == "On")
    {
      Serial.print("doorBedroomOn");
    }
    if (message == "Off")
    {
      Serial.print("doorBedroomOff");
    }
  }

  if (String(topic) == "door")
  {
    if (message == "On")
    {
         Serial.print("doorOn");
    }
    if (message == "Off")
    {
        Serial.print("doorOff");
    }
  }

  if (String(topic) == "outdoorLight")
  {
    if (message == "On")
    {
        digitalWrite(D6, HIGH);
    }
    if (message == "Off")
    {
        digitalWrite(D6, LOW);
    }
  }
}

 //Hàm reconnect thực hiện kết nối lại khi mất kết nối với MQTT Broker
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
//    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-MyClient";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(),"levanminh", "levanminhptit123")) {
//      Serial.println("connected");
      
      client.subscribe("livingroomLight");
      client.subscribe("livingroomTelevision");
      client.subscribe("livingroomFan");
      
      client.subscribe("bedroomConditioner");
      client.subscribe("bedroomLight");
      client.subscribe("bedroomDoor");

      client.subscribe("door");
      client.subscribe("outdoorLight");
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
//       Wait 5 seconds before retrying
      delay(2000);
    }
  }
}

long lastMsg = 0;
void loop()
{
  if (!client.connected()){// Kiểm tra kết nối
        reconnect();
      }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000)
  {
    lastMsg = now;
    int h = dht.readHumidity();
    int t = dht.readTemperature();
    int luminance = analogRead(A0);

    if (isnan(h) || isnan(t))
    {
      return;
    }

    char tempString[10];
    sprintf(tempString, "%d", t);

    char humiString[10];
    sprintf(humiString, "%d", h);

    
    char lightString[10];
    sprintf(lightString, "%f", luminance);

    StaticJsonDocument<100> doc;
    doc["Temperature"] = t;
    doc["Humidity"] = h;
    doc["Light"] = luminance;

    char buffer[100];
    serializeJson(doc, buffer);
    client.publish(topic1, buffer);
  }
}
