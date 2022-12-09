/**
 * Author: Tinasoft.vn
 */
#include "MyTime.h"


/**
 * constructor
 */
MyTimeClass::MyTimeClass()
{
}

/**
 * destructor
 */
MyTimeClass::~MyTimeClass()
{
}

//
void MyTimeClass::configTimeDate(){
    ECHO("[MyTime][configTime] Config time date");
    if (!checkWifi()) return;
    configTime(timezone * 3600, dst * 0, "it.pool.ntp.org", "nist.time.gov");
    while (!time(nullptr)) {
        ECHO(".");
        delay(1000);
    }
    ECHO("\n[MyTime][configTime] Waiting 10secs to config time");
    for(int i=1; i<=10; i++){
        ECHO(".");
        delay(1000);
    }
    ECHOLN();
}

bool MyTimeClass::checkWifi(){
    if (WiFi.status() != WL_CONNECTED) {
        ECHOLN("[MyTime][checkWifi] No internet access!");
        return false;
    }
    return true;
}
long MyTimeClass::getTimeChoice(int choice){
    time_t t;
    time(&t);
    switch(choice){
        case 1: return hour(t);
        case 2: return minute(t);
        case 3: return second(t);
        case 4: return day(t);
        case 5: return month(t);
        case 6: return year(t);
        case 7: return weekday(t);
        default: return t;
    }
    //  time_t now;
//  struct tm * timeinfo;
//  time(&now);
//  timeinfo = localtime(&now);
//  Serial.println(timeinfo->tm_hour);
}

String MyTimeClass::getTime(){
    String s = (String) (getTimeChoice(1)) + ":" + (String) (getTimeChoice(2)) + ":" + String (getTimeChoice(3));
    return s;
}
String MyTimeClass::getDate(){
    String s = String (getTimeChoice(7)) + " " + String (getTimeChoice(4)) + "/" + String (getTimeChoice(5)) + "/" + String (getTimeChoice(6));
    return s;
}
void MyTimeClass::printTimeDate(){
    ECHOLN("[MyTime][printTimeDate] " + getTime() + " " + getDate());
}

MyTimeClass MyTime;
