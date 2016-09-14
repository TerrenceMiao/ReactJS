var autocomplete;

var map, places, iw;
var markers = [];
var resultsBounds = null;
var resultsCount = 0;
var pagination = null;
var hostnameRegexp = new RegExp('^https?://.+?/');


function initializeMaps() {

    // Basic maps, default is "Melbourne, VIC"
    var latLng = new google.maps.LatLng(-37.8131869, 144.9629796);

    var options = {
        zoom: 12,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        streetViewControl: true,
        zoomControl: true
    }

    map = new google.maps.Map(document.getElementById("map_canvas"), options);
    places = new google.maps.places.PlacesService(map);

    // Show Australia Post Delivery Centre - Port Melbourne
    var deliveryCentreLatLng = new google.maps.LatLng(-37.8310, 144.9400);
    var deliveryCentreIcon = 'images/postal-charcoal.png';
    var deliveryCentreImage = new google.maps.MarkerImage(deliveryCentreIcon,
        new google.maps.Size(38, 33),
        new google.maps.Point(0,0),
        new google.maps.Point(14, 33));
    var deliveryCentreMarker = new google.maps.Marker({
        position: deliveryCentreLatLng,
        map: map,
        clickable: true,
        icon: deliveryCentreImage});

    // Show Australia Post Parcel Locker - Hoppers Crossing
    var parcelLockerLatLng = new google.maps.LatLng(-37.872888, 144.728696);
    var parcelLockerIcon = 'images/parcel-small.png';
    var parcelLockerImage = new google.maps.MarkerImage(parcelLockerIcon,
        new google.maps.Size(38, 33),
        new google.maps.Point(0,0),
        new google.maps.Point(14, 33));
    var parcelLockerMarker = new google.maps.Marker({
        position: parcelLockerLatLng,
        map: map,
        clickable: true,
        icon: parcelLockerImage});

    // Show Australia Post Post Office - Point Cook road
    var postOfficeLatLng = new google.maps.LatLng(-37.895534, 144.753027);
    var postOfficeIcon = 'images/postal.png';
    var postOfficeImage = new google.maps.MarkerImage(postOfficeIcon,
        new google.maps.Size(38, 33),
        new google.maps.Point(0,0),
        new google.maps.Point(14, 33));
    var postOfficeMarker = new google.maps.Marker({
        position: postOfficeLatLng,
        map: map,
        clickable: true,
        icon: postOfficeImage});

    // Show Australia Post Outstation PO Box - St Albans DC
    var outstationLatLng = new google.maps.LatLng(-37.73535200, 144.79680100);
    var outstationIcon = 'images/outstationed-pob.png';
    var outstationImage = new google.maps.MarkerImage(outstationIcon,
        new google.maps.Size(26, 22),
        new google.maps.Point(0,0),
        new google.maps.Point(13, 22));
    var outstationMarker = new google.maps.Marker({
        position: outstationLatLng,
        map: map,
        clickable: true,
        icon: outstationImage});

    // Show Australia Post Red Post Box - Point Cook RAAF base
    var redStreetBoxLatLng = new google.maps.LatLng(-37.92216400, 144.74989300);
    var redStreetBoxIcon = 'images/redbox.png';
    var redStreetBoxImage = new google.maps.MarkerImage(redStreetBoxIcon,
        new google.maps.Size(33, 30),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 30));
    var redStreetBoxMarker = new google.maps.Marker({
        position: redStreetBoxLatLng,
        map: map,
        clickable: true,
        icon: redStreetBoxImage});

    // Show Australia Post Combined Post Box -
    var combinedStreetBoxLatLng = new google.maps.LatLng(-37.84107900, 144.87068300);
    var combinedStreetBoxIcon = 'images/goldbox.png';
    var combinedStreetBoxImage = new google.maps.MarkerImage(combinedStreetBoxIcon,
        new google.maps.Size(33, 30),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 30));
    var combinedStreetBoxMarker = new google.maps.Marker({
        position: combinedStreetBoxLatLng,
        map: map,
        clickable: true,
        icon: combinedStreetBoxImage});

    google.maps.event.addListener(map, 'tilesloaded', tilesLoaded);

    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        showSelectedPlace();
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        console.log("Latitude of bottomLeft  = " + map.getBounds().getSouthWest().lat());
        console.log("Longitude of bottomLeft = " + map.getBounds().getSouthWest().lng());
        console.log("Latitude of topRight  = " + map.getBounds().getNorthEast().lat());
        console.log("Longitude of topRight = " + map.getBounds().getNorthEast().lng());
    });
}

function doQuery() {
    var query = document.getElementById('autocomplete').value;
    resultsBounds = new google.maps.LatLngBounds();
    resultsCount = 0;
    clearResults();
    clearMarkers();
    places.textSearch({
        'query': query,
        'bounds': map.getBounds()
    }, addResults);
}

function addResults(results, status, p) {
    pagination = p;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < (results.length < 20 ? results.length : 20); i++) {
            markers[i] = new google.maps.Marker({
                position: results[i].geometry.location,
                map: map
            });
            google.maps.event.addListener(markers[i], 'click', getDetails(results[i], i));
            addResult(results[i], i);
            resultsBounds.extend(results[i].geometry.location);
        }
        resultsCount += results.length;
        if (resultsCount == 1) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(17);
        } else {
            map.fitBounds(resultsBounds);
        }
    }
}

function tilesLoaded() {
    google.maps.event.clearListeners(map, 'tilesloaded');

    // Have to disable "zoom_changed" event due to it flushes searched location
    // google.maps.event.addListener(map, 'zoom_changed', search);
    google.maps.event.addListener(map, 'dragend', search);

    search();
}

function showSelectedPlace() {

    clearResults();
    clearMarkers();

    var place = autocomplete.getPlace();
    map.panTo(place.geometry.location);
    markers[0] = new google.maps.Marker({
        position: place.geometry.location,
        map: map
    });
    iw = new google.maps.InfoWindow({
        content: getIWContent(place)
    });
    iw.open(map, markers[0]);
}

function search() {
    var type;
    for (var i = 0; i < document.controls.type.length; i++) {
        if (document.controls.type[i].checked) {
            type = document.controls.type[i].value;
        }
    }

    autocomplete.setBounds(map.getBounds());

    var search = {
        bounds: map.getBounds()
    };

    if (type != 'establishment') {
        search.types = [ type ];
    }

    places.search(search, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            for (var i = 0; i < results.length; i++) {
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP
                });
                google.maps.event.addListener(markers[i], 'click', getDetails(results[i], i));
                setTimeout(dropMarker(i), i * 100);
                addResult(results[i], i);
            }
        }
    })
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
            markers[i] == null;
        }
    }
}

function dropMarker(i) {
    return function() {
        markers[i].setMap(map);
    }
}

function addResult(result, i) {
    var results = document.getElementById("results");
    var tr = document.createElement('tr');
    tr.style.backgroundColor = (i% 2 == 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function() {
        google.maps.event.trigger(markers[i], 'click');
    };

    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');
    icon.src = result.icon;
    icon.setAttribute("class", "placeIcon");
    icon.setAttribute("className", "placeIcon");
    nameTd.setAttribute("class", "placeName");
    nameTd.setAttribute("className", "placeName");
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
}

function clearResults() {
    var results = document.getElementById("results");
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}


function getDetails(result, i) {
    return function() {
        places.getDetails({reference: result.reference}, showDetails(i));
    }
}

function showDetails(i) {
    return function(place, status) {
        if (iw) {
            iw.close();
            iw = null;
        }

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            iw = new google.maps.InfoWindow({
                content: getIWContent(place)
            });
            iw.open(map, markers[i]);
            showReviews(place.reviews);
        }
    }
}

function showReviews(reviews) {
    if (reviews === undefined) {
        return;
    }

    var reviewsDiv = document.getElementById('reviews');
    while (reviewsDiv.hasChildNodes()) {
        reviewsDiv.removeChild(reviewsDiv.childNodes[0]);
    }

    for (var i = 0; i < reviews.length; i++) {
        var table = document.createElement('table');
        table.setAttribute('class', 'review');
        table.setAttribute('className', 'review');
        var tableBody = document.createElement('tbody');
        var aspectsTr = document.createElement('tr');
        var aspectsTd = document.createElement('td');
        aspectsTd.appendChild(getAspectsTable(reviews[i].aspects));
        aspectsTd.setAttribute('colSpan', '2');
        aspectsTr.appendChild(aspectsTd);

        var reviewTr = document.createElement('tr');
        var reviewTd = document.createElement('td');
        reviewTd.setAttribute('colSpan', '2');
        reviewTd.innerHTML = reviews[i].text;
        reviewTr.appendChild(reviewTd);

        var whenWhoTr = document.createElement('tr');
        var dateTd = document.createElement('td');
        var reviewDate = new Date(reviews[i].time * 1000);
        dateTd.setAttribute('class', 'reviewDate');
        dateTd.setAttribute('className', 'reviewDate');
        dateTd.appendChild(document.createTextNode(reviewDate.toLocaleDateString()));

        var authorTd = document.createElement('td');
        authorTd.setAttribute('class', 'reviewAuthor');
        authorTd.setAttribute('className', 'reviewAuthor');
        if (reviews[i].author_url) {
            var authorLink = document.createElement('a');
            authorLink.setAttribute('href', reviews[i].author_url);
            authorLink.appendChild(document.createTextNode(reviews[i].author_name));
            authorTd.appendChild(authorLink);
        } else {
            authorTd.appendChild(document.createTextNode(reviews[i].author_name));
        }
        whenWhoTr.appendChild(dateTd);
        whenWhoTr.appendChild(authorTd);

        tableBody.appendChild(aspectsTr);
        tableBody.appendChild(reviewTr);
        tableBody.appendChild(whenWhoTr);
        table.appendChild(tableBody);
        reviewsDiv.appendChild(table);
    }
}

function getAspectsTable(aspects) {
    var scoresTable = document.createElement('table');
    scoresTable.setAttribute('class', 'aspectsTable');
    scoresTable.setAttribute('className', 'aspectsTable');

    var scoresTBody = document.createElement('tbody');
    var scoresTr = document.createElement('tr');
    for (var j = 0; j < aspects.length; j++) {
        var aspectTd = document.createElement('td');
        aspectTd.setAttribute('class', 'aspectName');
        aspectTd.setAttribute('className', 'aspectName');

        var scoreTd = document.createElement('td');
        scoreTd.setAttribute('class', 'aspectScore');
        scoreTd.setAttribute('className', 'aspectScore');

        aspectTd.appendChild(document.createTextNode(aspects[j].type.toUpperCase() + ':'));
        scoreTd.appendChild(document.createTextNode(aspects[j].rating));

        scoresTr.appendChild(aspectTd);
        scoresTr.appendChild(scoreTd);
    }
    scoresTBody.appendChild(scoresTr);
    scoresTable.appendChild(scoresTBody);
    return scoresTable;
}

function getIWContent(place) {
    var content = "";
    content += '<table><tr><td>';
    content += '<img class="placeIcon" src="' + place.icon + '"/></td>';
    content += '<td class="placeName"><b><a href="' + place.url + '">' + place.name + '</a></b>';
    content += '</td></tr></table>';
    return content;
}

function getIWContentLodging(place) {
    var content = '';
    content += '<table>';
    content += '<tr class="iw_table_row">';
    content += '<td style="text-align: right"><img class="iwPlaceIcon" src="' + place.icon + '"/></td>';
    content += '<td><b><a href="' + place.url + '">' + place.name + '</a></b></td></tr>';
    content += '<tr class="iw_table_row"><td class="iw_attribute_name">Address:</td><td>' + place.vicinity + '</td></tr>';
    if (place.formatted_phone_number) {
        content += '<tr class="iw_table_row"><td class="iw_attribute_name">Telephone:</td><td>' + place.formatted_phone_number + '</td></tr>';
    }
    if (place.rating) {
        var ratingHtml = '';
        for (var i = 0; i < 5; i++) {
            if (place.rating < (i + 0.5)) {
                ratingHtml += '&#10025;';
            } else {
                ratingHtml += '&#10029;';
            }
        }
        content += '<tr class="iw_table_row"><td class="iw_attribute_name">Rating:</td><td><span id="rating">' + ratingHtml + '</span></td></tr>';
    }
    if (place.website) {
        var fullUrl = place.website;
        var website = hostnameRegexp.exec(place.website);
        if (website == null) {
            website = 'http://' + place.website + '/';
            fullUrl = website;
        }
        content += '<tr class="iw_table_row"><td class="iw_attribute_name">Website:</td><td><a href="' + fullUrl + '">' + website + '</a></td></tr>';
    }
    if (place.opening_hours) {
        var dayToday = (new Date()).getDay();
        var periods = place['opening_hours'].periods;
        var hours_html = '';
        for (var i = 0; i < periods.length; i++) {
            if (periods[i].open.day == dayToday) {
                hours_html += periods[i].open.time + ' - ' + periods[i].close.time + '<br/>';
            }
        }
        content += '<tr class="iw_table_row"><td class="iw_attribute_name">Open today: </td><td>' + hours_html + '</td></tr>';
    }
    content += '</table>';
    return content;
}

function reviewsScroll() {
    var listing = document.getElementById('listing');
    if (listing.scrollTop + listing.clientHeight == listing.scrollHeight && pagination.hasNextPage) {
        pagination.nextPage();
    }
}
