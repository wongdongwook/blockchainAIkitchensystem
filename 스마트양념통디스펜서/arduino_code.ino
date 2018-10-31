#include<Stepper.h>
#include <Servo.h>
int IN1=3; //스텝모터
int IN2=4;
int IN3=6;
int IN4=7;
const int servoPin = 9; //서보모터
Servo myservo;
int IN5=11;  //워터펌프모터
int IN6=12;

void setup()
{
  Serial.begin(9600);
  
 pinMode(IN1,OUTPUT);
 pinMode(IN2,OUTPUT);
 pinMode(IN3,OUTPUT);
 pinMode(IN4,OUTPUT);
 myservo.attach(servoPin); 

 pinMode(IN5, OUTPUT);
 pinMode(IN6, OUTPUT);
}

void loop() 
{
  char aaa= Serial.read();
if(aaa=='p'){
  pump(1);
  delay(8000);
  pumpstop();
}
 
if(aaa=='a')
step1(110);

if(aaa=='b')
step2(110);

if(aaa=='v')
servo();
}

void pump(int flag) //워터펌프 함수
{
  for(int i=0;i<flag;i++){ 
   digitalWrite(IN5,HIGH);
   digitalWrite(IN6,LOW);
  }
}

void step1(int flag){
   for(int i=0;i<flag;i++){ //i값이 클수록 멀리이동
    digitalWrite(IN1,LOW);
    digitalWrite(IN2,HIGH);
    digitalWrite(IN3,HIGH);
    digitalWrite(IN4,LOW);
    delay(10); //회전속도

    digitalWrite(IN1,LOW);
    digitalWrite(IN2,HIGH);
    digitalWrite(IN3,LOW);
    digitalWrite(IN4,HIGH);
    delay(10);

    digitalWrite(IN1,HIGH);
    digitalWrite(IN2,LOW);
    digitalWrite(IN3,LOW);
    digitalWrite(IN4,HIGH);
    delay(10);

    digitalWrite(IN1,HIGH);
    digitalWrite(IN2,LOW);
    digitalWrite(IN3,HIGH);
    digitalWrite(IN4,LOW);
    delay(10);
   }
}


void step2(int flag)
{
   for(int i=0;i<flag;i++){// 반대로 움직이는 코드
    digitalWrite(IN1,HIGH);
    digitalWrite(IN2,LOW);
    digitalWrite(IN3,HIGH);
    digitalWrite(IN4,LOW);
    delay(10);

    digitalWrite(IN1,HIGH);
    digitalWrite(IN2,LOW);
    digitalWrite(IN3,LOW);
    digitalWrite(IN4,HIGH);
    delay(10);

    digitalWrite(IN1,LOW);
    digitalWrite(IN2,HIGH);
    digitalWrite(IN3,LOW);
    digitalWrite(IN4,HIGH);
    delay(10);

    digitalWrite(IN1,LOW);
    digitalWrite(IN2,HIGH);
    digitalWrite(IN3,HIGH);
    digitalWrite(IN4,LOW);
    delay(10);
 }
}

void servo(){
  delay(1000); 
  myservo.write(90);  //서보모터 00도로 이동             
  delay(1000);  
  myservo.write(0); //서보모터 0도로 이동
  delay(2000); 
}

void pumpstop(){
  digitalWrite(IN5,LOW);
  digitalWrite(IN6,LOW);
}
