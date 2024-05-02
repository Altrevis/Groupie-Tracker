package API

// Date représente une structure contenant un identifiant et une liste de dates
type Date struct {
	Id    uint64   `json:"id"`     // Identifiant de la date
	Dates []string `json:"dates"`  // Liste des dates au format texte
}
