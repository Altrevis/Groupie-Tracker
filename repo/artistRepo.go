package repository

import (
	"encoding/json"
	"fmt"
	"../API"
	"net/http"
	"strconv"
	"time"
)

const artistsUrl string = "https://groupietrackers.herokuapp.com/api/artists" // URL de l'API des artistes
var client = &http.Client{} // Client HTTP pour effectuer les requêtes

// GetArtists récupère la liste des artistes depuis l'API
func GetArtists() ([]API.Artist, error) {
	var artists []API.Artist
	err := getbench(artistsUrl, &artists) // Utilisation de getbench pour récupérer les artistes avec mesure de temps
	if err != nil {
		return nil, err
	}

	return artists, nil
}

// GetArtistById récupère un artiste spécifique par son ID depuis l'API
func GetArtistById(id int) (*API.Artist, error) {
	artist := &API.Artist{}

	err := get(artistsUrl+"/"+strconv.Itoa(id), &artist) // Utilisation de la fonction get pour récupérer un artiste par ID
	if err != nil {
		return nil, err
	}

	return artist, nil
}

// get effectue une requête GET vers une URL donnée et décode la réponse JSON dans la structure cible
func get(url string, target interface{}) error {
	r, err := client.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	err = json.NewDecoder(r.Body).Decode(target)
	if err != nil {
		return err
	}

	return nil
}

// getbench effectue une requête GET avec mesure de temps vers une URL donnée et décode la réponse JSON dans la structure cible
func getbench(url string, target interface{}) error {
	r, err := client.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	start := time.Now() // Mesure du temps de début de la requête

	err = json.NewDecoder(r.Body).Decode(target) // Décodage de la réponse JSON dans la structure cible

	elapsed := time.Since(start) // Calcul du temps écoulé depuis le début de la requête
	fmt.Printf("all took %s \n", elapsed) // Affichage du temps écoulé

	if err != nil {
		return err
	}

	return nil
}
