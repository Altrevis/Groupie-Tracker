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
                    <h2>${artiste.name}</h2>
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
                const locations = artiste.concertDates[date];
                locations.forEach(location => {
                    const li = document.createElement('li');
                    li.classList.add('collection-item');
                    li.innerHTML = `
                        ${date}
                        <span class="secondary-content location">${location}</span>
                    `;
                    concertDates.appendChild(li);
                });
            }

            initMap(artiste.concertDates);
        })
        .catch(error => console.error('Erreur lors de la récupération des détails de l\'artiste :', error));
}

function initMap(concertDates) {
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
        const map = new Microsoft.Maps.Map('#map', {
            center: new Microsoft.Maps.Location(0, 0),
            zoom: 2
        });

        const searchManager = new Microsoft.Maps.Search.SearchManager(map);
        const geocodeRequests = [];

        for (const date in concertDates) {
            const locations = concertDates[date];
            locations.forEach(location => {
                geocodeRequests.push(geocodeLocation(location, map, searchManager));
            });
        }

        Promise.all(geocodeRequests).then(results => {
            const locations = results.filter(location => location !== null);
            if (locations.length > 0) {
                const bounds = Microsoft.Maps.LocationRect.fromLocations(locations);
                map.setView({ bounds: bounds });
            }
        });
    });
}

function geocodeLocation(location, map, searchManager) {
    return new Promise((resolve, reject) => {
        const requestOptions = {
            where: location,
            callback: function (geocodeResult) {
                if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
                    const coordinates = geocodeResult.results[0].location;
                    const pushpin = new Microsoft.Maps.Pushpin(coordinates);
                    map.entities.push(pushpin);
                    resolve(coordinates);
                } else {
                    resolve(null);
                }
            },
            errorCallback: function (e) {
                console.error('Geocode error:', e);
                resolve(null);
            }
        };
        searchManager.geocode(requestOptions);
    });
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
    }
};
