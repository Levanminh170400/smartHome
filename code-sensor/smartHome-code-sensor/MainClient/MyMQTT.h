/**
 * Author: Tinasoft.vn
 */
#ifndef _MY_MQTT_H_
#define _MY_MQTT_H_

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "AppDebug.h"

class MyMQTT
{
    private:
        IPAddress mqttServer;
        int mqttPort;
        char* mqttUser;
        char* mqttPassword;        
        char* mqttTopic;

    public:
        PubSubClient client;
        MyMQTT(WiFiClient espClient, IPAddress mqttServer, char* mqttTopic="Sensor", int mqttPort=1883, char* mqttUser="jbeynmmp", char* mqttPassword ="_U9TnFaDZ3uv");
        ~MyMQTT();
        void callback(char* topic, byte* payload, unsigned int length);
        void connect();
        void loop();
        void subscribe(char* topic);
        void publish(char* topic, char* message);
        void publish(char* topic, String message);
        PubSubClient getClient();
};

#endif /* _MY_MQTT_H_ */
