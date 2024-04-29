package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	// Gestion des fichiers statiques
	fs := http.FileServer(http.Dir("./visuel"))
	http.Handle("/visuel/", http.StripPrefix("/visuel/", fs))

	// Routes HTML
	r.HandleFunc("/", accueilHandler).Methods("GET")
	r.HandleFunc("/map", mapHandler).Methods("GET")
	r.HandleFunc("/search", searchHandler).Methods("GET")

	// Routes API
	r.HandleFunc("/api/artists", artistsHandler).Methods("GET")
	r.HandleFunc("/api/locations", locationsHandler).Methods("GET")
	r.HandleFunc("/api/dates", datesHandler).Methods("GET")
	r.HandleFunc("/api/relation/{id}", relationHandler).Methods("GET")

	fmt.Println("[SERVER_READY] : on http://localhost:8000 ✅ ")
	log.Fatal(http.ListenAndServe(":8000", r))
}

func accueilHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "index.html", nil)
}

func mapHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "map.html", nil)
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "search.html", nil)
}

func renderTemplate(w http.ResponseWriter, tmpl string, data interface{}) {
	tmpl = fmt.Sprintf("./templates/%s", tmpl)
	t, err := template.ParseFiles(tmpl)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := t.Execute(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
