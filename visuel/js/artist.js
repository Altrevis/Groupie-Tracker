document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const artistId = params.get('id');
  
    fetch('/artist/' + artistId)
        .then(response => response.json())
        .then(artistData => {
            document.getElementById('artist-name').innerText = artistData.Name;
            artistData.Members.forEach(member => {
                const li = document.createElement('li');
                li.innerText = member;
                document.getElementById('members-list').appendChild(li);
            });
            document.getElementById('creation-date').innerText = artistData.CreationDate;
            document.getElementById('first-album').innerText = artistData.FirstAlbum;
            document.getElementById('artist-image').src = artistData.Image;
            Object.entries(artistData.Relations.DatesLocations).forEach(([date, location]) => {
                const li = document.createElement('li');
                li.className = 'collection-item';
                li.innerText = date;
                const span = document.createElement('span');
                span.className = 'secondary-content location';
                span.innerText = location;
                li.appendChild(span);
                document.getElementById('concert-dates').appendChild(li);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des détails de l\'artiste :', error));
  });