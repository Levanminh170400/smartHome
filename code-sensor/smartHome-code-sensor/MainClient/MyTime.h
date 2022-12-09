/**
 * Author: Tinasoft.vn
 */
#ifndef _MY_TIME_H_
#define _MY_TIME_H_

#include <Arduino.h>
#include <ESP8266WiFi.h>

#include <time.h>
#include <TimeLib.h>
#include "AppDebug.h"

class MyTimeClass
{
    private:
        int timezone = 7;
        int dst = 0;
        bool checkWifi();
    public:
        MyTimeClass();
        ~MyTimeClass();
        void configTimeDate();
        long getTimeChoice(int choice);
        String getTime();
        String getDate();
        void printTimeDate();
};

extern MyTimeClass MyTime;

#endif /* _MY_TIME_H_ */
