# Auto Suggest example of using React with Browserify

Current Postal Address and Location data is based on **ElasticSearch 2.x**. To run this application on localhost, visit from browser like Chrome, need to have extension _Allow-Control-Allow-Origin: *_ (https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi) installed and enabled, with setting:

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Allow-Control-Allow-Origin%20setting.png "Allow-Control-Allow-Origin: * setting")

Latest Chrome complains Cross Origin API request for ... Origin: http://evil.com/, Host: ... which caused by _Allow-Control-Allow-Origin: *_ extension.

An **alternative solution** has been provided. Without client side CORS enabled (Enable CORS on ElasticSearch server side).

Based on ElasticSearch 5.x, back compatible with ElasticSearch 2.x data, and run ElasticSearch in Docker container. Check details on: [https://github.com/TerrenceMiao/docker/blob/master/elasticsearch/README.adoc](https://github.com/TerrenceMiao/docker/blob/master/elasticsearch/README.adoc)

- Run: 

```sh
𝜆 npm install
``` 

in the directory to install React from npm. 

- Replace "[Google API Key]" in index.html with Google API Key - https://console.cloud.google.com/

- Change the URL of ElasticSearch, which with Postal Addresses and Post Office Location data, in **settings.json** file before app runs

```sh
{
    "elasticSearchUrl": "http://10.101.36.82:9200"
}
```  

- Run:

```sh
𝜆 npm start
```

and produce `bundle.js` artefact. 

- The open index.html file in Chrome browser, or

- go to [http://localhost:3000/](http://localhost:3000/), or

- start simple HTTP server without dependency on "npm":

```sh
𝜆 python -m SimpleHTTPServer 8000

```

on Python 3, run:

```sh
𝜆 python -m http.server 8000

```

go to [http://localhost:8000/](http://localhost:8000/)

- Input an Postal Address _111 Bourke St Melbourne VIC 3000_ like **"111 Bo St M"**

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Address%20-%20111%20Bourke%20St.png "111 Bourke St Melbourne VIC 3000")

After select the Postal Address, address is pinned on Google Maps:

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Address%20-%20111%20Bourke%20St%20on%20Google%20Maps.png "111 Bourke St Melbourne VIC 3000 on Google Maps")

In put more addresses:

- 18 St Johns Wood Rd Mount Waverley VIC 3149 
- 146 St Kilda Rd St Kilda VIC 3182
- 8 Balfour Cl Point Cook VIC 3030
- 60 Middle Park Dr Point Cook VIC 3030

to see how fewer keystrokes can let the target postal address on the top of the list. And a few more:

- NSW
- TAS
- 3080
- 3081
- Middle Park VIC
- VIC 3052
- 10002

to see what could come up.

### Display Postal Services on map

Postal Services like Post Offices, Delivery Centre, Parcel Lockers / Parcel Collect, Out Stationed PO Boxes, Street Red / Express Post Boxes  

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20on%20Google%20Maps.png "Postal Services on map")

Postal Services show up in Google Maps after address search

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20on%20Google%20Maps%20after%20search.png "Postal Services on map after search")

### Available Postal Services on Google Maps with detailed information

- Delivery Centre

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20-%20Delivery%20Centre.png "Delivery Centre")

- Outstationed Box

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20-%20Outstationed%20Box.png "Outstationed Box")

- Parcel Locker

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20-%20Parcel%20Locker.png "Parcel Locker")

- Post Office

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20-%20Post%20Office.png "Post Office")

- Street Box Express

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20-%20Street%20Box%20Express.png "Street Box Express")

- Street Box Red

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Services%20-%20Street%20Box%20Red.png "Street Box Red")
 
### Reference

- Google Maps GPS Coordinates, [http://www.gps-coordinates.net/](http://www.gps-coordinates.net/)
- Reactive Maps, A real time components library for building reactive UIs, [https://opensource.appbase.io/reactivemaps/](https://opensource.appbase.io/reactivemaps/)
- React Native Mapview component for iOS + Android, [https://github.com/airbnb/react-native-maps](https://github.com/airbnb/react-native-maps)