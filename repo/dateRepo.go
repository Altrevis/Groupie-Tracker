package repository

import "../API" // Import de la structure Date du package API

// GetConcertDatesFromArtist récupère les dates de concerts d'un artiste depuis une URL donnée
func GetConcertDatesFromArtist(url string) (API.Date, error) {
	dates := API.Date{}

	err := get(url, &dates) // Appel à la fonction get pour récupérer les dates de concerts
	if err != nil {
		return dates, err
	}

	return dates, nil
}

// GetConcertDatesFromArtistAsync récupère de manière asynchrone les dates de concerts d'un artiste depuis une URL donnée et les envoie sur un canal
func GetConcertDatesFromArtistAsync(url string, chanLoc chan<- API.Date) {
	date := API.Date{}

	_ = get(url, date) // Appel à la fonction get pour récupérer les dates de concerts

	chanLoc <- date // Envoie des dates de concerts sur le canal
}
