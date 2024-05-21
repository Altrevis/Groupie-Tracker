function obtenirArtistes() {
    fetch('/artist')
      .then(response => response.json())
      .then(artistes => {
            document.getElementById('listeArtistes').innerHTML = '';
            artistes.forEach(artiste => {
                const elementArtiste = document.createElement('div');
                elementArtiste.classList.add('slot');
                elementArtiste.innerHTML = `
                    <h2>${artiste.name}</h2>
                    <img src="${artiste.image}" alt="${artiste.name}">
                    <a href="artist.html?id=${artiste.id}">voir plus</a>
                `;
                document.getElementById('listeArtistes').appendChild(elementArtiste);
            });
        })
      .catch(error => console.error('Erreur lors de la récupération des artistes :', error));
}
window.onload = obtenirArtistes;