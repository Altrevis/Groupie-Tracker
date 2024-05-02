package API

// Location représente une structure contenant un identifiant et une URL vers des dates associées à une location
type Location struct {
	Id      uint64 `json:"id"`       // Identifiant de la location
	DateUrl string `json:"dates"`    // URL pour obtenir les dates associées à cette location
}
