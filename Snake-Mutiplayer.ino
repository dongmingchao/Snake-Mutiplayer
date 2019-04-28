#include "wifi.h"

#define UP A0
#define DOWN A1
#define LEFT A2
#define RIGHT A3
#define MENU 2
#define OTHER 1

void setup(){
  wifi_setup();
  wifi_get("/move/start?name=aaa");
}

void loop(){
  bool up = analogRead(UP) > 1000;
  bool down = analogRead(DOWN) > 1000;
  bool left = analogRead(LEFT) > 1000;
  bool right = analogRead(RIGHT) > 1000;
  if (up) wifi_get("/move/up");
  if (down) wifi_get("/move/down");
  if (left) wifi_get("/move/left");
  if (right) wifi_get("/move/right");
}

void initPin(void)

{
  //定义引脚的输入输出模式
  pinMode(UP, INPUT);

  pinMode(DOWN, INPUT);

  pinMode(LEFT, INPUT);

  pinMode(RIGHT, INPUT);

  pinMode(MENU, INPUT);

  pinMode(OTHER, INPUT);
}

//读取按键值
int read_key(){

  int key_temp;

  if (digitalRead(UP) == LOW)
  {

    key_temp = UP;

    return key_temp;
  }

  if (digitalRead(DOWN) == LOW)
  {

    key_temp = DOWN;

    return key_temp;
  }

  if (digitalRead(LEFT) == LOW)
  {

    key_temp = LEFT;

    return key_temp;
  }

  if (digitalRead(RIGHT) == LOW)
  {

    key_temp = RIGHT;

    return key_temp;
  }

  return 0;
}
