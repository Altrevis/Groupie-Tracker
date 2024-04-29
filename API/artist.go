package API

type Artist struct {
	Id int64 `json:"id"`
	Image string `json:"image"`
	Name string `json:"name"`
	Members []string `json:"members"`
	CreationDate uint16 `json:"creationDate"`
	FirstAlbum string `json:"firsAlbum"`

	LocationsUrl string `json:"locations"`
	ConcertDatesUrl string `json:"concertDates"`
	RelationsUrl string `json:"relations"`
}