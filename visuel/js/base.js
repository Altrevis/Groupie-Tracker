function obtenirArtistes() {
    const creationDateMin = document.getElementById('creation-date-min').value;
    const creationDateMax = document.getElementById('creation-date-max').value;
    const firstAlbumDateMin = document.getElementById('first-album-date-min').value;
    const firstAlbumDateMax = document.getElementById('first-album-date-max').value;
    const membersMin = document.getElementById('members-min').value;
    const membersMax = document.getElementById('members-max').value;
    const locationCheckboxes = document.querySelectorAll('#locations-checkboxes input:checked');
    const selectedLocations = Array.from(locationCheckboxes).map(cb => cb.value);
    const artistName = document.getElementById('artist-name').value.toLowerCase();

    fetch('/artist')
        .then(response => response.json())
        .then(artistes => {
            const filteredArtistes = artistes.filter(artiste => {
                const creationDate = artiste.creationDate;
                const firstAlbumDate = new Date(artiste.firstAlbum).getFullYear();
                const numberOfMembers = artiste.members.length;
                const passesCreationDateFilter = (!creationDateMin || creationDate >= creationDateMin) &&
                                                 (!creationDateMax || creationDate <= creationDateMax);
                const passesFirstAlbumDateFilter = (!firstAlbumDateMin || firstAlbumDate >= firstAlbumDateMin) &&
                                                   (!firstAlbumDateMax || firstAlbumDate <= firstAlbumDateMax);
                const passesMembersFilter = (!membersMin || numberOfMembers >= membersMin) &&
                                            (!membersMax || numberOfMembers <= membersMax);
                const passesLocationFilter = selectedLocations.length === 0 || selectedLocations.some(location => artiste.locations.includes(location));
                const passesNameFilter = !artistName || artiste.name.toLowerCase().includes(artistName);

                return passesCreationDateFilter && passesFirstAlbumDateFilter && passesMembersFilter && passesLocationFilter && passesNameFilter;
            });

            const listeArtistes = document.getElementById('listeArtistes');
            listeArtistes.innerHTML = '';
            filteredArtistes.forEach(artiste => {
                const elementArtiste = document.createElement('div');
                elementArtiste.classList.add('slot');
                elementArtiste.innerHTML = `
                    <h3>${artiste.name}</h3>
                    <img src="${artiste.image}" alt="${artiste.name}">
                    <a href="artist.html?id=${artiste.id}">voir plus</a>
                `;
                listeArtistes.appendChild(elementArtiste);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des artistes :', error));
}

function initLocationCheckboxes(locations) {
    const container = document.getElementById('locations-checkboxes');
    container.innerHTML = ''; // Vider le conteneur avant d'ajouter de nouvelles checkboxes
    locations.forEach(location => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = location;
        const label = document.createElement('label');
        label.textContent = location;
        container.appendChild(checkbox);
        container.appendChild(label);
    });
}

function obtenirArtiste(artistId) {
    fetch(`/artist?id=${artistId}`)
        .then(response => response.json())
        .then(artiste => {
            document.getElementById('artist-name').textContent = artiste.name;
            document.getElementById('artist-image').src = artiste.image;
            document.getElementById('creation-date').textContent = artiste.creationDate;
            document.getElementById('first-album').textContent = artiste.firstAlbum;

            const membersList = document.getElementById('members-list');
            membersList.innerHTML = '';
            artiste.members.forEach(member => {
                const li = document.createElement('li');
                li.textContent = member;
                membersList.appendChild(li);
            });

            const concertDates = document.getElementById('concert-dates');
            concertDates.innerHTML = '';
            for (const date in artiste.concertDates) {
                const li = document.createElement('li');
                li.classList.add('collection-item');
                li.innerHTML = `
                    ${date}
                    <span class="secondary-content location">${artiste.concertDates[date]}</span>
                `;
                concertDates.appendChild(li);
            }

            initMap(artiste.locations);
        })
        .catch(error => console.error('Erreur lors de la récupération des détails de l\'artiste :', error));
}



function initMap() {
    const map = L.map('map').setView([48.8566, 2.3522], 2); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

    if (!artistId) {
        console.error('No artist ID provided in URL.');
        return;
    }

    const apiUrl = `https://groupietrackers.herokuapp.com/api/locations/${artistId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.locations.forEach(location => {
                geocodeLocation(location, map);
            });
        })
        .catch(error => console.error('Error fetching artist locations:', error));
}

function geocodeLocation(location, map) {
    const openCageApiKey = 'c2d0683dd5c04916bd6d587fe06880e6'; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${openCageApiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const coords = data.results[0].geometry;
                L.marker([coords.lat, coords.lng]).addTo(map)
                    .bindPopup(location.replace('-', ', ').replace('_', ' '));
            } else {
                console.error('No results found for location:', location);
            }
        })
        .catch(error => console.error('Error geocoding location:', error));
}





// Exemple d'appel pour initialiser les checkboxes avec des lieux de concerts disponibles
// Cela devrait être appelé une seule fois, par exemple, au chargement de la page
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

    if (artistId) {
        obtenirArtiste(artistId);
    } else {
        initLocationCheckboxes(['Paris', 'New York', 'Tokyo', 'London']); // Initialiser les checkboxes
        obtenirArtistes();
        initMap();
    }
};
