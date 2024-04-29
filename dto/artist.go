package dto

import "../API"

type Artist struct {
	Id int64 `json:"id"`
    Image string `json:"image"`
    Name string `json:"name"`
    Members []string `json:"members"`
    CreationDate uint16 `json:"creationDate"`
    FirstAlbum string `json:"firstAlbum"`

    Location API.Location `json:"locations"`

    ConcertDates API.Date `json:"concertDates"`

    Relations API.Relation `json:"relations"`
}