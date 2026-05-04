#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>

// ================= CONFIG =================
#define IR1 34
#define IR2 35

#define SERVO_PIN 18

#define LED_IN 23
#define LED_GATE 19
#define LED_OUT 5
#define LED_FULL 15

#define MAX_CAPACITY 2

// WiFi
const char* ssid = "Van Hao";
const char* password = "0962410592";

// MQTT
const char* mqtt_server = "192.168.1.13";
const char* mqtt_user = "tcv";
const char* mqtt_pass = "tcv123";

// ==========================================

WiFiClient espClient;
PubSubClient client(espClient);

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo gateServo;

// ===== STATE MACHINE =====
enum State {
  IDLE,
  WAIT_IR2,
  WAIT_IR1,
  WAIT_CLEAR
};

State state = IDLE;

// ===== SYSTEM VARIABLES =====
int count = 0;
bool gateOpen = false;

// debounce
unsigned long lastIR1 = 0;
unsigned long lastIR2 = 0;

// timing
unsigned long stateStartTime = 0;
unsigned long lcdTimer = 0;

// ===== UTILS =====

bool readIR(int pin, unsigned long &lastTime) {
  if (digitalRead(pin) == LOW && millis() - lastTime > 200) {
    lastTime = millis();
    return true;
  }
  return false;
}

bool isIR1Clear() { return digitalRead(IR1) == HIGH; }
bool isIR2Clear() { return digitalRead(IR2) == HIGH; }

// ==========================================
// ===== SERVO CONTROL =====

void openGate() {
  if (gateOpen) return;

  for (int angle = 180; angle >= 90; angle--) {
    gateServo.write(angle);
    delay(10); // chỉnh tốc độ (càng nhỏ càng nhanh)
  }

  gateOpen = true;
  digitalWrite(LED_GATE, HIGH);
}

void closeGate() {
  if (!gateOpen) return;
  for (int angle = 90; angle <= 180; angle++) {
    gateServo.write(angle);
    delay(10);
  }

  gateOpen = false;
  digitalWrite(LED_GATE, LOW);
}

// ==========================================
// ===== LCD =====

void lcdMain() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("So xe: ");
  lcd.print(count);
  lcd.print("/");
  lcd.print(MAX_CAPACITY);

  lcd.setCursor(0, 1);
  if (count == MAX_CAPACITY) lcd.print("BAI DAY XE");
  else lcd.print("San sang");
}

void lcdEvent(String msg) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(msg);

  lcd.setCursor(0, 1);
  lcd.print("So xe: ");
  lcd.print(count);

  lcdTimer = millis();
}

// ===== MQTT =====

void publishState(String event) {
  String payload = "{";
  payload += "\"event\":\"" + event + "\",";
  payload += "\"count\":" + String(count) + ",";
  payload += "\"capacity\":" + String(MAX_CAPACITY) + ",";
  payload += "\"full\":" + String(count == MAX_CAPACITY ? "true" : "false") + ",";
  payload += "\"gate\":\"" + String(gateOpen ? "open" : "close") + "\"";
  payload += "}";

  client.publish("parking/state", payload.c_str());
}

// ==========================================
// ===== WIFI & MQTT =====

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
  }
}

void reconnect() {
  while (!client.connected()) {
    client.connect("ESP32_CLIENT",mqtt_user,mqtt_pass);
  }
}

// ===== SETUP =====

void setup() {
  pinMode(IR1, INPUT);
  pinMode(IR2, INPUT);

  pinMode(LED_IN, OUTPUT);
  pinMode(LED_OUT, OUTPUT);
  pinMode(LED_GATE, OUTPUT);
  pinMode(LED_FULL, OUTPUT);

  lcd.init();
  lcd.backlight();

  gateServo.attach(SERVO_PIN);
  closeGate();

  setup_wifi();
  client.setServer(mqtt_server, 1883);

  lcdMain();
}

// ==========================================
// ===== LOOP =====

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  bool ir1 = readIR(IR1, lastIR1);
  bool ir2 = readIR(IR2, lastIR2);

  // LED FULL
  digitalWrite(LED_FULL, count == MAX_CAPACITY);

  switch (state) {

    case IDLE:
      if (ir1 && count < MAX_CAPACITY) {
        openGate();
        digitalWrite(LED_IN, HIGH);
        state = WAIT_IR2;
        stateStartTime = millis();
      }
      else if (ir2) {
        openGate();
        digitalWrite(LED_OUT, HIGH);
        state = WAIT_IR1;
        stateStartTime = millis();
      }
      break;

    case WAIT_IR2: // xe vào
      if (ir2) {
        count++;
        if (count > MAX_CAPACITY) count = MAX_CAPACITY;

        lcdEvent("Co xe vao");
        publishState("car_in");

        digitalWrite(LED_IN, LOW);
        state = WAIT_CLEAR;
      }
      break;

    case WAIT_IR1: // xe ra
      if (ir1) {
        count--;
        if (count < 0) count = 0;

        lcdEvent("Co xe ra");
        publishState("car_out");

        digitalWrite(LED_OUT, LOW);
        state = WAIT_CLEAR;
      }
      break;

    case WAIT_CLEAR:
      if (isIR1Clear() && isIR2Clear()) {
        closeGate();
        state = IDLE;
      }
      break;
  }

  // timeout chống kẹt
  if (millis() - stateStartTime > 5000) {
    state = IDLE;
    closeGate();
  }

  // LCD quay về màn chính sau 2s
  if (millis() - lcdTimer > 2000) {
    lcdMain();
  }
}