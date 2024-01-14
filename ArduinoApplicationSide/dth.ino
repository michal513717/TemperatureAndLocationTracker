#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <HTTPClient.h>  // Dodane dla obsługi HTTP
#include <ArduinoJson.h> // Dodane dla obsługi JSON

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

String getWiFiLocation() {
  String url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDHaR0-dajgW7AJmjDV0VHPAX-PW52EMOU";
  
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String payload = "{}";
  int httpResponseCode = http.POST(payload);

  String location = "";
  if (httpResponseCode == 200) {
    DynamicJsonDocument jsonDoc(1024);
    DeserializationError error = deserializeJson(jsonDoc, http.getString());
    
    if (!error) {
      float lat = jsonDoc["location"]["lat"];
      float lon = jsonDoc["location"]["lng"];
      location = "Latitude: " + String(lat, 6) + ", Longitude: " + String(lon, 6);
    }
  }

  http.end();
  return location;
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

  server.on("/location", HTTP_GET, [](AsyncWebServerRequest *request) {
    String location = getWiFiLocation();
    request->send_P(200, "text/plain", location.c_str());
  });

  server.begin();
}

void loop() {
  // Do any background tasks if needed
}
