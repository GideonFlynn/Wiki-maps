var initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {});
    bounds = new google.maps.LatLngBounds();

    // Place some markers on the map.
    // locations are found in viewmodel.js.
    for (var i = 0; i < locations.length; i++) {
        // Get the position and title from the location array.
        var position = locations[i].location;
        var title = locations[i].title;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
        // Two event listeners - one for mouseover, one for mouseout, to change the colors back and forth.
    }

    var largeInfowindow = new google.maps.InfoWindow({});

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker !== marker) {
            // Clear the infowindow content to give the API time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
                // Move the map back to its boundaries,
                // bounds are defined in showMarkers(), located at the bottom of this file.
                map.fitBounds(bounds);
            });
            // Request data from Wikipedia asynchronously.
            // Parameter one is the search term (en.wikipedia.com/wiki/<MY_SEARCH> ).
            // Parameter two is the current infowindow.
            wiki_ajax(marker.title, infowindow);

            // Pan map to display the whole infowindow.
            map.panTo(marker.position);
            map.panBy(0, -450);

            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }

    // Make sure every marker can be seen on map.
    function showMarkers() {
        // Extend the boundaries of the map for each marker and display the marker
        // The variable bounds can be found at the start of this file.
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    showMarkers();
};

// To avoid JetBrains's WebStorm freaking out about functions not being used
//noinspection BadExpressionStatementJS
initMap;