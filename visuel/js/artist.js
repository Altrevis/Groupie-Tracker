document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    });
    const artistData = {
      Name: "Nom de l'artiste",
      Members: ["Membre 1", "Membre 2", "Membre 3", "Membre 4"],
      CreationDate: "Date de création",
      FirstAlbum: "Premier album",
      Image: "URL de l'image",
      Relations: {
        DatesLocations: {
          "Date 1": "Lieu 1",
          "Date 2": "Lieu 2",
          "Date 3": "Lieu 3",
          "Date 4": "Lieu 4",
        }
      }
    };
    
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