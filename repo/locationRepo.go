package repository

import (
	"encoding/json"
	"../API"
)

func GetLocationsFromArtistAsync(url string, chanLoc chan<- API.Location) {
	location := API.Location{}

	_ = getLocation(url, &location)
	chanLoc <- location
}

func GetLocationsFromArtist(url string) (API.Location, error) {
	location := API.Location{}

	err := getLocation(url, &location)
	if err != nil {
		return location, err
	}
	return location, nil
}

func getLocation(url string, target *API.Location) error {
	r, err := client.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(target)
}