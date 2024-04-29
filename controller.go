package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func loadApi(w http.ResponseWriter, r *http.Request, endpoint string) {
	tab := [4]string{"artists", "locations", "dates", "relation"}

	endpointIsValid := false

	for i := 0; i < len(tab); i++ {
		if endpoint == tab[i] {
			endpointIsValid = true
			break
		}
	}

	if !endpointIsValid {
		codeErreur(w, r, 400, "Invalid endpoint")
		return
	}

	response, err := http.Get("https://groupietrackers.herokuapp.com/api/" + endpoint)

	if err != nil {
		codeErreur(w, r, 500, "Server API is not responding")
		return
	}

	responseData, err := ioutil.ReadAll(response.Body)

	if err != nil {
		codeErreur(w, r, 500, "No data to sent")
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.Write(responseData)
}

func artistsHandler(w http.ResponseWriter, r *http.Request) {
	loadApi(w, r, "artists")
}

func locationsHandler(w http.ResponseWriter, r *http.Request) {
	loadApi(w, r, "locations")
}

func datesHandler(w http.ResponseWriter, r *http.Request) {
	loadApi(w, r, "dates")
}

func relationHandler(w http.ResponseWriter, r *http.Request) {
	pathPart := strings.Split(r.URL.Path, "/")
	getId(w, r, pathPart[len(pathPart)-1])
}

func getId(w http.ResponseWriter, r *http.Request, id string) {
	response, err := http.Get("https://groupietrackers.herokuapp.com/api/relation/" + id)

	if err != nil {
		codeErreur(w, r, 500, "Server API is not responding")
		return
	}

	responseData, err := ioutil.ReadAll(response.Body)

	if err != nil {
		codeErreur(w, r, 500, "No data to sent")
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.Write(responseData)
}

func codeErreur(w http.ResponseWriter, _ *http.Request, status int, message string) {

	if status == 404 {
		http.Error(w, "404 not found", http.StatusNotFound)
		fmt.Println("[SERVER_ALERT] - 404 : File not found, or missing...", message)
	}
	if status == 400 {
		http.Error(w, "400 Bad request", http.StatusBadRequest)
		fmt.Println("[SERVER_ALERT] - 400 : Bad request", message)
	}
	if status == 500 {
		http.Error(w, "500 Internal server error", http.StatusInternalServerError)
		fmt.Println("[SERVER_ALERT] - 500 : Internal server error", message)
	}

}

