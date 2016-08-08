# Auto Suggest example of using React with Browserify

Run `npm install` in the directory to install React from npm. Then run:

```sh
𝜆 npm start
```

to produce `bundle.js` with example code and React.

The open index.html file in Chrome browser or start simple HTTP server:

```sh
𝜆 python -m SimpleHTTPServer 8000
```

Input a few like:
 
- 111 Bourke St Melbourne VIC 3000

![alt text](https://raw.githubusercontent.com/TerrenceMiao/ReactJS/master/auto-suggest/Postal%20Address%20-%20111%20Bourke%20St.png "111 Bourke St Melbourne VIC 3000")

- 18 St Johns Wood Rd Mount Waverley VIC 3149 
- 146 St Kilda Rd St Kilda VIC 3182
- 18 Balfour Cl Point Cook VIC 3030
- 28 Middle Park Dr Point Cook VIC 3030

to see how fewer keystrokes can let the target postal address on the top of the list. And a few more:

- NSW
- TAS
- 3080
- 3081
- Middle Park VIC
- VIC 3052
- 10002

to see what could come up.