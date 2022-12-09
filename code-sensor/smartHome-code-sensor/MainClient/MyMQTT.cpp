/**
 * Author: Tinasoft.vn
 */
#include "MyMQTT.h"


/**
 * constructor
 */
MyMQTT::MyMQTT(WiFiClient espClient, IPAddress mqttServer, char* mqttTopic, int mqttPort, char* mqttUser, char* mqttPassword)
{
    this->mqttServer = mqttServer;
    this->mqttPort = mqttPort;
    this->mqttUser = mqttUser;
    this->mqttPassword = mqttPassword;
    this->mqttTopic = mqttTopic;

    client.setClient(espClient);
    client.setServer(mqttServer, mqttPort);
//    client.setCallback(callback);
}

/**
 * destructor
 */
MyMQTT::~MyMQTT()
{
}

//
//{"sensor":"gps","time":1351824120,"data":[48.756080,2.302038]}
static void callback(char* topic, byte* payload, unsigned int length) {
 
  ECHO("[MyMQTT][callback] Message arrived in topic: ");
  ECHOLN(topic);
 
  ECHO("[MyMQTT][callback] Message:");
  for (int i = 0; i < length; i++) {
    ECHO((char)payload[i]);
  }
 
  ECHOLN();
  ECHOLN("-----------------------");

}

void MyMQTT::connect(){
    while (!client.connected()) {
    ECHOLN("[MyMQTT][connect] Connecting to MQTT...");

    if (client.connect("ESP8266Client")) {

      ECHOLN("[MyMQTT][connect] connected");

    } else {

      ECHO("[MyMQTT][connect] failed with state ");
      ECHO("[MyMQTT][connect] ");
      ECHO(client.state());
      delay(2000);

    }
  }
}

void MyMQTT::subscribe(char* topic){
    client.subscribe(topic);
}
void MyMQTT::publish(char* topic, String message){
    char res[200];
    message.toCharArray(res, 200);
    publish(topic, res);
}
void MyMQTT::publish(char* topic, char* message){
    client.publish(topic, message);
}
void MyMQTT::loop(){
    client.loop();
}
PubSubClient MyMQTT::getClient(){
  return client;  
}

