package repository

import "../API"

func GetConcertDatesFromArtist(url string) (API.Date, error) {
	dates := API.Date{}

	err := get(url, &dates)
	if err != nil {
		return dates, err
	}

	return dates, nil
}

func GetConcertDatesFromArtistAsync(url string, chanLoc chan<- API.Date) {
	date := API.Date{}

	_ = get(url, date)

	chanLoc <- date
}
