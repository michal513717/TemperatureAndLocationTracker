#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char *ssid = "your-ssid";
const char *password = "your-password";

const int dthpin = 4;
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

JsonObject getWiFiLocation() {
  String url = "https://www.googleapis.com/geolocation/v1/geolocate?key=YOUR_GOOGLE_API_KEY";

  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String payload = "{}";
  int httpResponseCode = http.POST(payload);

  JsonObject locationObj;
  if (httpResponseCode == 200) {
    DynamicJsonDocument jsonDoc(1024);
    DeserializationError error = deserializeJson(jsonDoc, http.getString());

    if (!error) {
      float lat = jsonDoc["location"]["lat"];
      float lon = jsonDoc["location"]["lng"];
      locationObj["Latitude"] = lat;
      locationObj["Longitude"] = lon;
    }
  }

  http.end();
  return locationObj;
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

  server.on("/data", HTTP_GET, [](AsyncWebServerRequest *request) {

    float temperature = readTemperature();
    float humidity = readHumidity();
    JsonObject locationObj = getWiFiLocation();

    // Utwórz główny obiekt JSON
    DynamicJsonDocument jsonDoc(256);
    jsonDoc["Temperature"] = temperature;
    jsonDoc["Humidity"] = humidity;
    jsonDoc["Localization"] = locationObj;
    
    String jsonResponse;
    serializeJson(jsonDoc, jsonResponse);

    request->send(200, "application/json", jsonResponse);
  });

  server.begin();
}

void loop() {
  // Do any background tasks if needed
}
