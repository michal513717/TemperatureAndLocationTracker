#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

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
  String url = "https://www.googleapis.com/geolocation/v1/geolocate?key=YOUR_GOOGLE_API_KEY";
  
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

  server.on("/data", HTTP_GET, [](AsyncWebServerRequest *request) {
    // Odczytaj wartości zmiennych
    float temperature = readTemperature();
    float humidity = readHumidity();
    String location = getWiFiLocation();

    // Utwórz obiekt JSON
    DynamicJsonDocument jsonDoc(256);
    jsonDoc["Temperature"] = temperature;
    jsonDoc["Humidity"] = humidity;
    jsonDoc["Localization"] = location;

    // Serializuj obiekt JSON do ciągu znaków
    String jsonResponse;
    serializeJson(jsonDoc, jsonResponse);

    // Wyślij odpowiedź JSON
    request->send(200, "application/json", jsonResponse);
  });

  server.begin();
}

void loop() {
  // Do any background tasks if needed
}
