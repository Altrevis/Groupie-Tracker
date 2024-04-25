package main

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
	controller "./controller"
)

func main() {
    fmt.Println("[SERVER_INFO] : Starting local Server...")
    c := cors.AllowAll()
    fs := http.FileServer(http.Dir("visuel"))
    http.Handle("/visuel/", http.StripPrefix("/visuel/", fs))
    http.HandleFunc("/api/relation/", controller.RelationData)
    http.HandleFunc("/map", controller.Map)
    http.HandleFunc("/search", controller.Search)
    http.HandleFunc("/api/artists", controller.Artists)
    http.HandleFunc("/api/locations", controller.Locations)
    http.HandleFunc("/api/dates", controller.Dates)
    http.HandleFunc("/api/relation", controller.Relation)
    http.HandleFunc("/", controller.Accueil)
    handler := c.Handler(http.DefaultServeMux)
    fmt.Println("[SERVER_READY] : on http://localhost:8000 ✅ ")
    fmt.Println("[SERVER_INFO] : To stop the program : Ctrl + c")
    http.ListenAndServe(":8000", handler)
}
