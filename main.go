package main

import (
	"./controller"
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("visuel"))
	http.Handle("/visuel/", http.StripPrefix("/visuel/", fs))

	http.HandleFunc("/", controller.MainPage)
	http.HandleFunc("/artist/", controller.Get)

	http.HandleFunc("/artist.html", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "templates/artist.html")
    })
	
	log.Fatal(http.ListenAndServe(":8081", nil))
}
