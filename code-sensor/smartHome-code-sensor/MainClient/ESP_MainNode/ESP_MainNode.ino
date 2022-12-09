/*
    Project: IoT Training 2019
    Device: Node Kit LHV-IoT
    Author: Tinasoft.vn
    Version: v2.0.0
*/

#include "MyTime.h"
#include "MyWifi.h"
#include "AppDebug.h"
#include "Sensor_DHT.h"
#include "Sensor_LightSensor.h"
#include "MyJson.h"
#include "MyMQTT.h"
#include <string.h>
#define BUTTON1 "button-led1"
#define BUTTON2 "button-led2"
#define BUTTON3 "button-led3"

//config
char* ssid = "lophocvui.com 2.4GHz";
char* password = "88889999";
DHT dht(D0, DHT11);
LightSensor light;
IPAddress mqttServer(192, 168, 1, 112);
char* mqttTopic = "control";
MyMQTT mqtt = MyMQTT(MyWifi.espClient, mqttServer);

char* topic1 = "Sensors";
char* topic2 = "Control/button";
char* topic3 = "Feedback/button";
char* topic4 = "Control/buzzer";
int ledStatus[4] = {0, 1, 2, 3};
char* buttonArr[4] = {BUTTON1, BUTTON1, BUTTON2, BUTTON3};

//delay
//1 sec. frequency
unsigned long interval = 1000;
unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);
  MyWifi.connect(ssid, password);
  //  MyTime.configTimeDate();
  dht.begin();
  mqtt.client.setCallback(callback);
  mqtt.connect();
  mqtt.subscribe(topic2);
  mqtt.subscribe(topic4);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);
  pinMode(D6, OUTPUT);
  pinMode(D8, OUTPUT);
}

void loop() {
  if ((unsigned long)(millis() - previousMillis) >= interval) {
    previousMillis = millis();
    updateData();
  }  
  mqtt.loop();
}
/*
   Update data from sensors to pi by MQTT each 3secs
*/
void updateData() {
  int temp = dht.readTemperature();
  int humi = dht.readHumidity();
  int ligh = light.readLightSensor(1);

  MyJsonClass json;
  //  MyTime.printTimeDate();
  json.encode("currentTime", MyTime.getTimeChoice(0));
  json.encode("temperature", temp);
  json.encode("humidity", humi);
  json.encode("light", ligh);

  String message = json.getStringEncode().substring(ledStatus[0]);
  ECHOLN(message);
  mqtt.publish(mqttTopic, message);
}
/*
   control KIT LHV-IoT
   device = 0: Buzzer
   device = 1: Led1
   devide = 2: Led2
   device = 3: Led3
*/
int controlDevice(int device, int value) {

  switch (device) {
    case 0: if (value <= 5) digitalWrite(D6, LOW);
      else analogWrite(D6, value);
      return 0;
    case 1: digitalWrite(D3, value == 2 ? LOW : HIGH);
      break;
    case 2: digitalWrite(D4, value == 2 ? LOW : HIGH);
      break;
    case 3: digitalWrite(D8, value == 2 ? LOW : HIGH);
      break;
  }
  ledStatus[device] = value - 2;
}
/*
   function when receiver new message from topic subscribed
*/
void callback(char* topic, byte* payload, unsigned int length) {
  char* message = "";
  for (int i = 0; i < length; i++) {
    message[i] = (char)payload[i];
    message[i + 1] = '\0';
    
  }
  ECHO("[MyMQTT][Callback] ");
  ECHOLN(message);

  if (strstr(topic, topic2) != NULL) {
    char* json = "";
    strcpy(json, message);
    JsonObject& object = MyJson.decode(json);
    const char* button = object["button"];
    int value = object["value"];
    ledStatus[0] = 6;
    //answear status when web open
    if (value == -1) {
      
      for (int i = 1; i <= 3; i++) {
        MyJson.encode("button", buttonArr[i]);
        MyJson.encode("value", ledStatus[i]);
        String m = MyJson.getStringEncode().substring(6);
        ECHO("[MyMQTT][Feedback] ");
        ECHOLN(m);
        mqtt.publish(topic3, m);
      }
      return;
    }
    strcmp(button, BUTTON1) == 0 ? controlDevice(1, value) : 0;
    strcmp(button, BUTTON2) == 0 ? controlDevice(2, value) : 0;
    strcmp(button, BUTTON3) == 0 ? controlDevice(3, value) : 0;

    MyJson.encode("button", button);
    MyJson.encode("value", abs(value - 2));
    String m = MyJson.getStringEncode().substring(6);
    ECHO("[MyMQTT][Feedback] ");
    ECHOLN(m);
    mqtt.publish(topic3, m);
  }
  if (strstr(topic, topic4) != NULL) {
    int val = atoi(message) * 255 / 100;
    controlDevice(0, val);
    ledStatus[0] = length;
  }
}

