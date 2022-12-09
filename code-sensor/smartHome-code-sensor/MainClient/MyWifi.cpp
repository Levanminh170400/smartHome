/**
 * Author: Tinasoft.vn
 */
#include "MyWifi.h"


/**
 * constructor
 */
MyWifiClass::MyWifiClass()
{
}

/**
 * destructor
 */
MyWifiClass::~MyWifiClass()
{
}

void MyWifiClass::connect(char* ssid, char* password){
    this->ssid  = ssid;
    this->password = password;
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    ECHO("[MyWifi][Connect] Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(1000);
    }
    ECHO("\n[MyWifi][Connect] My IP: ");
    ECHOLN(WiFi.localIP());
}

MyWifiClass MyWifi;
