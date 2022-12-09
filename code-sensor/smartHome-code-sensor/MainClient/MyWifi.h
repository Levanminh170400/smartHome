/**
 * Author: Tinasoft.vn
 */
#ifndef _MY_WIFI_H_
#define _MY_WIFI_H_

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include "AppDebug.h"

class MyWifiClass
{
    private:
        char* ssid;
        char* password;
    public:
        WiFiClient espClient;
        MyWifiClass();
        ~MyWifiClass();
        void connect(char* ssid = "Haian-PC", char* password =  "1122334455");
};

extern MyWifiClass MyWifi;

#endif /* _MY_WIFI_H_ */
