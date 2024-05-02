package repository

import "../API"

func GetRelationsFromArtist(url string) (API.Relation, error) {
	var relations API.Relation
	err := get(url, &relations)
	if err != nil {
		return relations, err
	}
	return relations, nil
}

func GetRelationsFromArtistAsync(url string, chanLoc chan<- API.Relation) {
	relation := API.Relation{}
	_ = get(url, &relation)
	chanLoc <- relation
}