package controller

import (
	"encoding/json"
	"fmt"
	"../service" // Import relatif, assurez-vous que la structure du projet est correcte
	"html/template"
	"net/http"
	"strconv"
)

// handle404 gère les requêtes aboutissant à une erreur 404
func handle404(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(404)

	t, err := template.ParseFiles("templates/base.html")

	if err != nil {
		handle500(w, err) // En cas d'erreur de template, gérer avec une erreur 500
		return
	}

	err = t.Execute(w, nil)

	if err != nil {
		handle500(w, err) // En cas d'erreur d'exécution de template, gérer avec une erreur 500
		return
	}
}

// handle400 gère les requêtes aboutissant à une erreur 400
func handle400(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(400)

	t, err := template.ParseFiles("templates/base.html")

	if err != nil {
		handle500(w, err) // En cas d'erreur de template, gérer avec une erreur 500
		return
	}

	err = t.Execute(w, nil)

	if err != nil {
		handle500(w, err) // En cas d'erreur d'exécution de template, gérer avec une erreur 500
		return
	}
}

// handle500 gère les erreurs internes du serveur
func handle500(w http.ResponseWriter, err error) {
	w.WriteHeader(500)

	t, other := template.ParseFiles("templates/base.html")

	if other != nil {
		w.Write([]byte("Something went wrong\nError 500\n" + other.Error())) // Si une erreur survient lors du chargement du template de base
		return
	}

	fmt.Println(err) // Affiche l'erreur dans les logs du serveur
	t.Execute(w, err) // Affiche l'erreur à l'utilisateur
}

// Get gère les requêtes GET
func Get(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Path[len("/artist/"):]
    if len(id) == 0 {
        w.Header().Set("Content-Type", "application/json")
        if err := getArtists(w); err != nil {
            handle500(w, err)
            return
        }
    } else {
        idArtist, err := strconv.Atoi(id)
        if err != nil {
            handle404(w, r)
            return
        }

        if r.Method == "GET" {
            artist, err := service.GetArtistById(idArtist)
            if err != nil {
                handle500(w, err)
                return
            }
            t, err := template.ParseFiles("templates/base.html", "templates/artist.html")
            if err != nil {
                handle400(w, r)
                return
            }

            err = t.Execute(w, artist)
            if err != nil {
                handle400(w, r)
                return
            }
        } else {
            handle404(w, r)
            return
        }
    }
}

// MainPage gère la page d'accueil
func MainPage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		t, err := template.ParseFiles("templates/base.html")

		if err != nil {
			handle500(w, err)
			return
		}
		artists, err := service.Get()
		if err != nil {
			handle500(w, err)
			return
		}
		err = t.Execute(w, artists)
		if err != nil {
			handle500(w, err)
			return
		}
	} else {
		handle404(w, r) // Si la route demandée n'existe pas, renvoyer une erreur 404
		return
	}
}

// getArtists récupère la liste des artistes et les renvoie au format JSON
func getArtists(w http.ResponseWriter) error {
	artists, err := service.Get()
	if err != nil {
		return err // Si une erreur survient lors de la récupération des artistes, renvoyer l'erreur
	}

	artistsJson, err := json.Marshal(artists)
	if err != nil {
		return err // Si une erreur survient lors de la conversion en JSON, renvoyer l'erreur
	}

	_, err = w.Write(artistsJson)
	if err != nil {
		return err // Si une erreur survient lors de l'écriture de la réponse, renvoyer l'erreur
	}

	return nil
}
