package repository

import (
	"encoding/json"
	"../API"
)

// GetLocationsFromArtistAsync récupère de manière asynchrone les emplacements associés à un artiste depuis une URL donnée et les envoie sur un canal
func GetLocationsFromArtistAsync(url string, chanLoc chan<- API.Location) {
	location := API.Location{}

	_ = getLocation(url, &location) // Appel à la fonction getLocation pour récupérer les emplacements

	chanLoc <- location // Envoie des emplacements sur le canal
}

// GetLocationsFromArtist récupère de manière synchrone les emplacements associés à un artiste depuis une URL donnée
func GetLocationsFromArtist(url string) (API.Location, error) {
	location := API.Location{}

	err := getLocation(url, &location) // Appel à la fonction getLocation pour récupérer les emplacements
	if err != nil {
		return location, err
	}
	return location, nil
}

// getLocation effectue une requête GET vers une URL donnée et décode la réponse JSON dans la structure cible de type Location
func getLocation(url string, target *API.Location) error {
	r, err := client.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(target)
}
