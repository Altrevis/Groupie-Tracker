package repository

import "../API" // Import de la structure Relation du package API

// GetRelationsFromArtist récupère de manière synchrone les relations associées à un artiste depuis une URL donnée
func GetRelationsFromArtist(url string) (API.Relation, error) {
	var relations API.Relation
	err := get(url, &relations) // Appel à la fonction get pour récupérer les relations
	if err != nil {
		return relations, err
	}
	return relations, nil
}

// GetRelationsFromArtistAsync récupère de manière asynchrone les relations associées à un artiste depuis une URL donnée et les envoie sur un canal
func GetRelationsFromArtistAsync(url string, chanLoc chan<- API.Relation) {
	relation := API.Relation{}
	_ = get(url, &relation) // Appel à la fonction get pour récupérer les relations
	chanLoc <- relation // Envoie des relations sur le canal
}
