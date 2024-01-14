#include "WiFi.h"
#include "ESPAsyncWebServer.h"
#include <Adafruit_Sensor.h>
#include <DHT.h>

const char *ssid = "your-ssid";
const char *password = "your-password";

const int dthpin = 4;
const int dthtype = DHT11;

DHT dht(dthpin, dthtype);
AsyncWebServer server(80);

bool dhtReadError = false;

String getWiFiLocation() {
  String location = "";

  int numNetworks = WiFi.scanNetworks();

  if (numNetworks > 0) {
    // Sortowanie sieci według sygnału
    int indices[numNetworks];
    for (int i = 0; i < numNetworks; i++) {
      indices[i] = i;
    }

    for (int i = 0; i < numNetworks; i++) {
      for (int j = i + 1; j < numNetworks; j++) {
        if (WiFi.RSSI(indices[j]) > WiFi.RSSI(indices[i])) {
          std::swap(indices[i], indices[j]);
        }
      }
    }
    for (int i = 0; i < min(5, numNetworks); i++) {
      String networkInfo = "SSID: " + WiFi.SSID(indices[i]) + ", RSSI: " + String(WiFi.RSSI(indices[i]));
      location += networkInfo + "\n";
    }
  } else {
    location = "No WiFi networks found.";
  }

  return location;
}

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

  server.on("/data", HTTP_GET, [](AsyncWebServerRequest *request) {

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
