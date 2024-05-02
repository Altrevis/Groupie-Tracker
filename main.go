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
	log.Fatal(http.ListenAndServe(":8081", nil))
}
