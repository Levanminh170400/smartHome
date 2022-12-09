#include "Sensor_LightSensor.h"


LightSensor :: LightSensor(){
	pinMode(pin,INPUT);
}

uint16_t LightSensor :: readLightSensor(uint8_t type){
	uint16_t Value;
	uint16_t ValueReturn;
	if(!type){
		return (analogRead(pin));
	}
	Value = analogRead(pin);
	if(Value < LIGHTSENSOR_MIN){
		return 0;
	}
	else{
		if (Value > LIGHTSENSOR_MAX){
			return 100;
		}
		else{
			ValueReturn = (Value - LIGHTSENSOR_MIN)/9;
		}
	}
	return ValueReturn;
}



