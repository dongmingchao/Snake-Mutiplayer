#include "WiFiEsp.h"
// Emulate Serial1 on pins 6/7 if not present
#ifndef HAVE_HWSERIAL1
#include "SoftwareSerial.h"
SoftwareSerial Serial1(6, 7); // RX, TX
#endif
char ssid[] = "503";         // your network SSID (name)
char pass[] = "565095526";   // your network password
int status = WL_IDLE_STATUS; // the Wifi radio's status

char server[] = "192.168.1.119";
int port = 3000;
WiFiEspClient client;
String web_session = "";

void printWifiStatus()
{
  // print the SSID of the network you're attached to
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength
  long rssi = WiFi.RSSI();
  Serial.print("Signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

void wifi_setup()
{
    // initialize serial for debugging
    Serial.begin(115200);
    // initialize serial for ESP module
    Serial1.begin(9600);
    // initialize ESP module
    WiFi.init(&Serial1);

    // check for the presence of the shield
    if (WiFi.status() == WL_NO_SHIELD)
    {
        Serial.println("WiFi shield not present");
        // don't continue
        while (true)
            ;
    }

    // attempt to connect to WiFi network
    while (status != WL_CONNECTED)
    {
        Serial.print("Attempting to connect to WPA SSID: ");
        Serial.println(ssid);
        // Connect to WPA/WPA2 network
        status = WiFi.begin(ssid, pass);
    }

    // you're connected now, so print out the data
    Serial.println("You're connected to the network");

    printWifiStatus();
}

void wifi_recv()
{
    String rec = "";
    while (client.available())
    {
        char c = client.read();
        if (c == '\n')
        {
            int id = rec.indexOf("Set-Cookie");
            if (id != -1)
            {
                int sp_end = rec.indexOf(';');
                web_session += "; " + rec.substring(12, sp_end);
            }
            rec = "";
        }
        else
            rec += c;
    }
    if (web_session.startsWith("; "))
      web_session = web_session.substring(2);
    //Serial.println();
    //Serial.println(web_session);
    while (client.connected());
    client.stop();
}

void wifi_get(String url)
{
    Serial.println();
    Serial.println("Starting connection to server... "+url);
    if (client.connect(server, port))
    {
        Serial.println("Connected to server");
        client.println("GET " + url + " HTTP/1.1");
        client.println("Host: 192.168.1.119:3000");
        if (web_session != "")
        {
            client.print("Cookie: ");
            client.println(web_session);
            //web_session = "";
        }
        client.println("Connection: close");
        client.println();
        wifi_recv();
    }
}
