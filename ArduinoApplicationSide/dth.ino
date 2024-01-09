#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <stdbool.h>

const char *ssid = "your-ssid";
const char *password = "your-password";

const int dthpin = 17;
const int dthtype = DHT11;

DHT dht(dthpin, dthtype);
AsyncWebServer server(80);

bool dhtReadError = false;

float readTemperature() {
  float t = dht.readTemperature();

  if (isnan(t)) {
    Serial.println("The temperature could not be read.");
    dhtReadError = true;
    return 0.0;
  }
  dhtReadError = false;
  Serial.println(t);
  return t;
}

float readHumidity() {
  float h = dht.readHumidity();

  if (isnan(h)) {
    Serial.println("The humidity could not be read.");
    dhtReadError = true;
    return 0.0;
  }
  dhtReadError = false;
  Serial.println(h);
  return h;
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  Serial.print("Ready, go to: http://");
  Serial.print(WiFi.localIP());

  server.on("/temperature", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/plain", String(readTemperature()).c_str());
  });

  server.on("/humidity", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send_P(200, "text/plain", String(readHumidity()).c_str());
  });

  server.begin();
}

void loop() {
}
