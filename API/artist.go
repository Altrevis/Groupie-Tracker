package API

// Artist représente un artiste avec ses détails
type Artist struct {
	Id             int64    `json:"id"`            // Identifiant de l'artiste
	Image          string   `json:"image"`         // URL de l'image de l'artiste
	Name           string   `json:"name"`          // Nom de l'artiste
	Members        []string `json:"members"`       // Liste des membres de l'artiste (s'il s'agit d'un groupe)
	CreationDate   uint16   `json:"creationDate"`  // Année de création de l'artiste
	FirstAlbum     string   `json:"firstAlbum"`     // Premier album de l'artiste
	LocationsUrl   string   `json:"locations"`     // URL pour obtenir les lieux associés à l'artiste
	ConcertDatesUrl string   `json:"concertDates"` // URL pour obtenir les dates de concerts de l'artiste
	RelationsUrl   string   `json:"relations"`     // URL pour obtenir les relations de l'artiste avec d'autres artistes
}
