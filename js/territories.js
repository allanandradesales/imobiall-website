// City Data with REAL GPS Coordinates
const cities = [
    // CLAIMED (2)
    { name: "Phoenix, AZ", status: "claimed", lat: 33.4484, lng: -112.0740 },
    { name: "Atlanta, GA", status: "claimed", lat: 33.7490, lng: -84.3880 },

    // WEST COAST
    { name: "Seattle, WA", status: "available", lat: 47.6062, lng: -122.3321 },
    { name: "Portland, OR", status: "available", lat: 45.5152, lng: -122.6784 },
    { name: "San Francisco, CA", status: "available", lat: 37.7749, lng: -122.4194 },
    { name: "San Jose, CA", status: "available", lat: 37.3382, lng: -121.8863 },
    { name: "Los Angeles, CA", status: "available", lat: 34.0522, lng: -118.2437 },
    { name: "San Diego, CA", status: "available", lat: 32.7157, lng: -117.1611 },
    { name: "Las Vegas, NV", status: "available", lat: 36.1699, lng: -115.1398 },
    { name: "Salt Lake City, UT", status: "available", lat: 40.7608, lng: -111.8910 },
    { name: "Boise, ID", status: "available", lat: 43.6150, lng: -116.2023 },
    { name: "Denver, CO", status: "available", lat: 39.7392, lng: -104.9903 },
    { name: "Boulder, CO", status: "available", lat: 40.0150, lng: -105.2705 },
    { name: "Albuquerque, NM", status: "available", lat: 35.0844, lng: -106.6504 },
    { name: "Tucson, AZ", status: "available", lat: 32.2226, lng: -110.9747 },

    // TEXAS & CENTRAL
    { name: "Dallas, TX", status: "claimed", lat: 32.7767, lng: -96.7970 },
    { name: "Austin, TX", status: "available", lat: 30.2672, lng: -97.7431 },
    { name: "San Antonio, TX", status: "available", lat: 29.4241, lng: -98.4936 },
    { name: "Houston, TX", status: "available", lat: 29.7604, lng: -95.3698 },
    { name: "Oklahoma City, OK", status: "available", lat: 35.4676, lng: -97.5164 },
    { name: "Kansas City, MO", status: "available", lat: 39.0997, lng: -94.5786 },
    { name: "St. Louis, MO", status: "available", lat: 38.6270, lng: -90.1994 },
    { name: "Minneapolis, MN", status: "available", lat: 44.9778, lng: -93.2650 },
    { name: "Madison, WI", status: "available", lat: 43.0731, lng: -89.4012 },
    { name: "Chicago, IL", status: "available", lat: 41.8781, lng: -87.6298 },
    { name: "Indianapolis, IN", status: "available", lat: 39.7684, lng: -86.1581 },
    { name: "Detroit, MI", status: "available", lat: 42.3314, lng: -83.0458 },
    { name: "Columbus, OH", status: "available", lat: 39.9612, lng: -82.9988 },
    { name: "Cincinnati, OH", status: "available", lat: 39.1031, lng: -84.5120 },
    { name: "Little Rock, AR", status: "available", lat: 34.7465, lng: -92.2896 },
    { name: "New Orleans, LA", status: "available", lat: 29.9511, lng: -90.0715 },

    // SOUTHEAST
    { name: "Nashville, TN", status: "available", lat: 36.1627, lng: -86.7816 },
    { name: "Birmingham, AL", status: "available", lat: 33.5207, lng: -86.8025 },
    { name: "Huntsville, AL", status: "available", lat: 34.7304, lng: -86.5861 },
    { name: "Charlotte, NC", status: "available", lat: 35.2271, lng: -80.8431 },
    { name: "Raleigh, NC", status: "available", lat: 35.7796, lng: -78.6382 },
    { name: "Charleston, SC", status: "available", lat: 32.7765, lng: -79.9311 },
    { name: "Jacksonville, FL", status: "available", lat: 30.3322, lng: -81.6557 },
    { name: "Orlando, FL", status: "available", lat: 28.5383, lng: -81.3792 },
    { name: "Tampa, FL", status: "available", lat: 27.9506, lng: -82.4572 },
    { name: "Miami, FL", status: "available", lat: 25.7617, lng: -80.1918 },

    // NORTHEAST
    { name: "Pittsburgh, PA", status: "available", lat: 40.4406, lng: -79.9959 },
    { name: "Richmond, VA", status: "available", lat: 37.5407, lng: -77.4360 },
    { name: "Washington, DC", status: "available", lat: 38.9072, lng: -77.0369 },
    { name: "Baltimore, MD", status: "available", lat: 39.2904, lng: -76.6122 },
    { name: "Philadelphia, PA", status: "available", lat: 39.9526, lng: -75.1652 },
    { name: "New York, NY", status: "available", lat: 40.7128, lng: -74.0060 },
    { name: "Hartford, CT", status: "available", lat: 41.7658, lng: -72.6734 },
    { name: "Boston, MA", status: "available", lat: 42.3601, lng: -71.0589 }
];

// Initialize Map
const map = L.map('map', {
    center: [39.5, -98.35],
    zoom: 4,
    minZoom: 3,
    maxZoom: 10,
    zoomControl: true
});

// Dark tile layer (CartoDB Dark)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Custom Icon Factory
function createMarkerIcon(status) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-dot ${status}"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

// Create markers
const markers = [];
cities.forEach(city => {
    const marker = L.marker([city.lat, city.lng], {
        icon: createMarkerIcon(city.status)
    });

    const popupContent = `
        <div class="popup-content">
            <div class="popup-city">${city.name}</div>
            <div class="popup-status ${city.status}">
                ${city.status === 'available' ? '● Available' : '● Partner Active'}
            </div>
            ${city.status === 'available' ?
                `<a href="partners.html#apply" class="popup-cta">Claim This Territory</a>` :
                ''}
        </div>
    `;

    marker.bindPopup(popupContent);
    marker.cityData = city;
    marker.addTo(map);
    markers.push(marker);
});

// Populate City List
const cityList = document.getElementById('city-list');

function renderCityList(filter = 'all') {
    const filteredCities = cities.filter(city => {
        if (filter === 'all') return true;
        return city.status === filter;
    });

    const listHTML = filteredCities.map(city => `
        <div class="city-item ${city.status}" data-city="${city.name}">
            <div class="city-dot ${city.status}"></div>
            <div class="city-info">
                <div class="city-name">${city.name}</div>
                <div class="city-status">${city.status === 'available' ? 'Available' : 'Partner Active'}</div>
            </div>
        </div>
    `).join('');

    cityList.innerHTML = `<h3>${filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} Territories (${filteredCities.length})</h3>` + listHTML;

    // Add click handlers
    document.querySelectorAll('.city-item').forEach(item => {
        item.addEventListener('click', () => {
            const cityName = item.dataset.city;
            const city = cities.find(c => c.name === cityName);
            if (city) {
                map.setView([city.lat, city.lng], 8);
                const marker = markers.find(m => m.cityData.name === cityName);
                if (marker) marker.openPopup();
            }
        });
    });
}

renderCityList();

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCityList(btn.dataset.filter);
    });
});

// Update counts
document.getElementById('available-count').textContent = cities.filter(c => c.status === 'available').length;
document.getElementById('claimed-count').textContent = cities.filter(c => c.status === 'claimed').length;
