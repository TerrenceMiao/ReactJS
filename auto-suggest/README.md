# Auto Suggest example of using React with Browserify

- Run: 

```sh
𝜆 npm install
``` 

in the directory to install React from npm. 

- Replace "[Google API Key]" in index.html with Google API Key - https://console.cloud.google.com/

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

### How React Redux work

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Redux%20Async%20Actions.png "Redux in React Delegation Model")

### Reference

- React Ajax Best Practices, [http://andrewhfarmer.com/react-ajax-best-practices/](http://andrewhfarmer.com/react-ajax-best-practices/)
