package API

// Index représente une structure contenant une liste de relations
type Index struct {
	Relation []Relation `json:"index"` // Liste des relations
}

// Relation représente une relation entre des identifiants et des dates associées à des emplacements
type Relation struct {
	Id              uint64              `json:"id"`             // Identifiant de la relation
	DatesLocations map[string][]string `json:"datesLocations"` // Dates associées aux emplacements
}
