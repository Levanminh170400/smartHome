
#ifndef _LIGHTSENSOR_H_
#define _LIGHTSENSOR_H_

#include <Arduino.h>

#define LIGHTSENSOR_MIN	50
#define LIGHTSENSOR_MAX	950

class LightSensor{
	public:
		/*
		 * Set sensor
		 * pin input
		 */
		LightSensor();
		
		
		/*
		 * Read value from sensor
		 * Value return is uint16_t
		 */
		uint16_t readLightSensor(uint8_t type);
		
	private:
		uint8_t pin = A0;	
};

#endif

