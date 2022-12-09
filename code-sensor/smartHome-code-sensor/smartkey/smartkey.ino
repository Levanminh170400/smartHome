#include <Keypad.h>
#include <LiquidCrystal_I2C.h>      // Khai báo thư viện LCD sử dụng I2C
#include <Servo.h>
LiquidCrystal_I2C lcd(0x27, 16, 2); // 0x27 địa chỉ LCD, 16 cột và 2 hàng

int in1 = 10;
int in2 = 11;
int in3 = 12;   
int in4 = 13; 

const byte rows = 4;
const byte columns = 4;
 
int holdDelay = 700; 
int n = 3;
int state = 0; 
char key = 0;
char STR[4] = {'1', '2', '3', '4'};
char str[4] = {' ', ' ', ' ', ' '};
int i, j, count = 0;
 
char keys[rows][columns] =
{
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'},
};
 
byte rowPins[rows] = {2, 3, 4, 5};
byte columnPins[columns] = {6, 7, 8, 9};
 
Keypad keypad = Keypad(makeKeymap(keys), rowPins, columnPins, rows, columns);
void setup() {
  Serial.begin(9600);

  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT);
  pinMode(in4, OUTPUT);
  
  lcd.init();       
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.clear();
  
  lcd.print("  Hi, MR Minh!");
  delay(1000);
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("   Welcome to");
  lcd.setCursor(0,1);
  lcd.print("   Smart Home");
  delay(1000);
  
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Enter password:");
}

void loop() {  
  if(Serial.available()){
    String RxBuffer="";
    while(Serial.available()){
      RxBuffer = Serial.readString();
    }
     Serial.print("RxBuffer:");
     Serial.println(RxBuffer);
    if(RxBuffer=="doorOn"){    //Kiểm tra chuỗi nhận
      lcd.clear();
      lcd.print("Status:Open!");
      delay(1000);
      forword(1400, in3, in4);
      pause(1000, in3, in4);
        
      lcd.clear();
      lcd.print("Status:Opened!");
      Serial.println("=============door đã on!===============");     
    }else if(RxBuffer=="doorOff"){   
      lcd.clear();
      lcd.print("Status:Close!");
      delay(1000);  
      backword(1400, in3, in4);
      pause(1000, in3, in4);
      Serial.println("===========door closed!!!===============");
      lcd.clear();
      lcd.print("Status:Closed!");
      delay(1000);
      lcd.clear();
      lcd.print("Enter Password:"); 
    }else if(RxBuffer=="doorBedroomOn"){
      Serial.println("===========doorBedroomOn đã on!===============");
      forword(800, in1, in2);
      pause(1000, in1, in2);
      lcd.clear();
      lcd.print("Bedroom:Opened!");
      
    }else if(RxBuffer=="doorBedroomOff"){
      Serial.println("==========doorBedroomOff đã off!===========");
      backword(800, in1, in2);
      pause(1000, in1, in2);
      lcd.clear();
      lcd.print("Bedroom:Closed!");
      delay(1000);
      lcd.clear();
      lcd.print("Enter Password:");
    }
  }  
  char temp = keypad.getKey();
  if ((int)keypad.getState() ==  PRESSED) {
    if (temp != 0) {
      key = temp;
    }
  }
  if ((int)keypad.getState() ==  HOLD) {
    state++;
    state = constrain(state, 1, n-1);
    delay(holdDelay);
  }
 
  if ((int)keypad.getState() ==  RELEASED) {
    key += state;
    state = 0;
    if (i == 0) {
      str[0] = key;
      lcd.setCursor(6, 1);
      lcd.print(str[0]);
      delay(1000);
      lcd.setCursor(6, 1);
      lcd.print("*");
    }
    if (i == 1) {
      str[1] = key;
      lcd.setCursor(7, 1);
      lcd.print(str[1]);
      delay(1000);
      lcd.setCursor(7, 1);
      lcd.print("*");
    }
    if (i == 2) {
      str[2] = key;
      lcd.setCursor(8, 1);
      lcd.print(str[2]);
      delay(1000);
      lcd.setCursor(8, 1);
      lcd.print("*");
    }
    if (i == 3) {
      str[3] = key;
      lcd.setCursor(9, 1);
      lcd.print(str[3]);
      delay(1000);
      lcd.setCursor(9, 1);
      lcd.print("*");
      count = 1;
    }
    i = i + 1;
  }
 
  if (count == 1) {
    if (str[0] == STR[0] && str[1] == STR[1] && str[2] == STR[2] &&
        str[3] == STR[3]) {
      lcd.clear();
      lcd.print("    Correct!");
      delay(3000);
      
      i = 0;
      count = 0;
      lcd.clear();
      lcd.print("Status:Open!");
      delay(1000);
      forword(1400, in3, in4);
      pause(3000, in3, in4);
      lcd.clear();
      lcd.print("Status:Opened!");
      delay(1000);
      lcd.clear();
      lcd.print("Status:Pause 3s");
      delay(3000);
      

      lcd.clear();
      lcd.print("Status:Close!");
      delay(1000);
      backword(1400, in3, in4);
      pause(3000, in3, in4);
      lcd.clear();
      lcd.print("Status:Closed!");
      delay(1000);
      lcd.clear();
      lcd.print("Enter Password:");
      
    } else {
      lcd.clear();
      lcd.print("   Incorrect!");
      delay(3000);
      lcd.clear();
      lcd.print("   Try again!");
      delay(3000);
      lcd.clear();
      lcd.print("Enter Password:");
      i = 0;
      count = 0;
    }
  }
 
  switch (key) {
  case 'C':
    lcd.clear();
    lcd.print("     Closed!");
    delay(5000);
    lcd.clear();
    lcd.print(" Enter Password");
    i = -1;
    break;
  }
  delay(50);
}
void forword(int times, int pin1, int pin2) {
  digitalWrite(pin1,LOW);
  digitalWrite(pin2,HIGH);
  delay(times);
};

void backword(int times, int pin1, int pin2) {
  digitalWrite(pin1,HIGH);
  digitalWrite(pin2,LOW);
  delay(times);
}

void pause(int times, int pin1, int pin2) {
  digitalWrite(pin1,LOW);
  digitalWrite(pin2,LOW);
  delay(times);
}
