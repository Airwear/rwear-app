/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const elt = document.getElementById("map");

const points = getLocations();

function initMap() {

    const map = new google.maps.Map(
        elt,
        {
            zoom: 2,
            //center: { lat: 49.983333, lng: 2.066667 },
            center: centerPoint(),
        }
    );

    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });


    // Add some markers to the map.
    const markers = points.map((point, i) => {
        const label = null;
        const position = {lat: point.latitude, lng: point.longitude};

        const marker = new google.maps.Marker({
            position,
            label,
        });

        // markers can only be keyboard focusable when they have click listeners
        // open info window when marker is clicked
        marker.addListener("click", () => {
            infoWindow.setContent(template(point));
            infoWindow.open(map, marker);
        });

        return marker;
    });

    // Add a marker clusterer to manage the markers.
    new MarkerClusterer({ markers, map });
}

function getLocations() {
    if (! elt) {
        return [];
    }
    const data = JSON.parse(elt.getAttribute('data-points'));
    //console.log(data);
    return data ?? [];
}

function centerPoint() {

    if (points.length === 0) {
        return {
            lat: 49.983333,
            lng:  2.066667
        }
    }

    let lat = 0;
    let lng = 0;
    for (let index in points) {

        const point = points[index];

        lat+= point.latitude ?? 0;
        lng+= point.longitude ?? 0;

    }

    return {
        lat: lat / points.length,
        lng: lng / points.length
    }
}

function template({type, capacity, duration, id, installation_type, hybrid_type, designation}) {
    return `
        <div class='text-center'>
            <h3 class='text-uppercase'>${designation}</h3>
            <div>${installation_type}</div>
            <div>${hybrid_type}</div>
            <div>${capacity}</div>
            <div>${duration}</div>
        </div>
    `
}

export default initMap;

