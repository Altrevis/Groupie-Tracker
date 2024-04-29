package model

type Index struct {
	Relation []Relation `json:"index"`
}

type Relation struct {
	Id uint64 `json:"id"`
	DatesLocations map[string][]string `json:"datesLocations"`
}