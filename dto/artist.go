package dto

import "../API" // Import de la structure Location, Date et Relation du package API

// Artist représente les données d'un artiste utilisées dans la couche de transfert de données (DTO)
type Artist struct {
	Id           int64          `json:"id"`             // Identifiant de l'artiste
	Image        string         `json:"image"`          // URL de l'image de l'artiste
	Name         string         `json:"name"`           // Nom de l'artiste
	Members      []string       `json:"members"`        // Liste des membres de l'artiste (s'il s'agit d'un groupe)
	CreationDate uint16         `json:"creationDate"`   // Année de création de l'artiste
	FirstAlbum   string         `json:"firstAlbum"`     // Premier album de l'artiste
	Location     API.Location   `json:"locations"`      // Lieux associés à l'artiste
	ConcertDates API.Date       `json:"concertDates"`   // Dates de concert associées à l'artiste
	Relations    API.Relation   `json:"relations"`      // Relations de l'artiste avec d'autres artistes
}
