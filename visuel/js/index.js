const matchList = document.getElementById('card-data'); // Affichage des cartes artistes

const api = "/api/" // Chemin de l'API

const artist = "artists"
const location_ = "locations"
const date = "dates"
const relation = "relation"


async function data(url) { // Fonction pour récupérer les données de l'API
    const res_artist = await fetch(url);
    const dataArtist = await res_artist.json();
    show(dataArtist);
}

data(api + artist);


var arr; // Tableau final des cartes artistes
var mini; // Date min
var maxi; // Date max
var tab; // Tableau des cartes artistes
var ArrOfMembers; // Tableau des membres choisis

function show(dataArtist) { // Affiche les données des artistes
    if (dataArtist === undefined) { 
        data(api + artist)
    }
    arr = []
    tab = []
    mini = document.getElementById("Selectmini").value
    maxi = document.getElementById("Selectmaxi").value
    tab = dataArtist.map(match => `
    <div class="card" id="card">
        <div class="card-header" id="card-header">
            <img src="${match.image}" alt="">
        </div>
            <div class="card-body" id="card-body">
                <ul>
                    <li><h4>Nom :</h4><br>${match.name}</li>
                    <br>
                    <li><h4>Date de création :</h4><br>${match.creationDate}</li>
                    <br>
                    <li><h4>Membres :</h4><br>${match.members}</li>
                    <br>
                    <li><h4>Premier album :</h4><br>${match.firstAlbum}</li>
                </ul>
                <div class="popup-header-cont">
                    <h3>${match.name}</h3>
                </div>
                <div class="read-more-cont">
                    <p class="relation" data-url="${match.relations}">...</p>
                </div>
            <button class="btn" type="button">Voir plus ...</button>
            </div>
    </div>
    `);
    SelectionArtist(dataArtist)
    let nbrPage = Math.ceil(arr.length / 10)
    pageNumber(nbrPage)
    matchList.innerHTML = arr.slice(0, 10).join(''); 
}

function setupPopup() { // Initialisation de la pop-up
    const cardData = document.querySelector(".row");
    const popup = document.querySelector(".popup-box");
    const popupCloseBtn = popup.querySelector(".popup-close-btn")

    cardData.addEventListener("click", async function(event) {
            if (event.target.tagName.toLowerCase() == "button") {
                const item = event.target.parentElement;
                const relation = item.querySelector(".relation");
                const pathPart = relation.dataset.url.split("/");
                let res = await fetch(`/api/relation/${pathPart[pathPart.length-1]}`);
                let data = await res.json();
                elementAPI(data, relation);
                const h3 = item.querySelector(".popup-header-cont").innerHTML;
                const readMoreCont = item.querySelector(".read-more-cont").innerHTML;
                popup.querySelector(".popup-header").innerHTML = h3;
                popup.querySelector(".popup-body").innerHTML = readMoreCont
                popup.classList.toggle("open");
            }
        })

    popupCloseBtn.addEventListener("click", () => { popup.classList.toggle("open"); });

    popup.addEventListener("click", function(event) {
        if (event.target == popup) {
            popup.classList.toggle("open");
        }
    })
}

function elementAPI(elementJSON, relation) { // Affiche les données de l'API dans la pop-up
    let json = JSON.stringify(elementJSON.datesLocations)
    let parseJSON = JSON.parse(json)
    let result = [];
    let index, resultpush

    for (index in parseJSON) {
        resultpush = index + " : " + parseJSON[index]
        result.push(resultpush)

    }

    relation.innerHTML = result.join(', ')

}

var min = document.getElementById("mini")
var max = document.getElementById("maxi")

function minOrMax(param) { // Crée un menu déroulant pour trier par date
    let select = document.createElement("select")
    select.id = "Select" + param.id
    param.appendChild(select)
    select.setAttribute("onchange", "show()")
    if (param == min) {
        minimum(select)
    }
    if (param == max) {
        maximum(select)
    }
}

function minimum(param) { // Options de date minimale
    for (let i = 1958; i <= 2021; i++) {
        var optionMin = document.createElement("option")
        optionMin.value = i
        optionMin.text = i
        param.appendChild(optionMin)
    }
}

function maximum(param) { // Options de date maximale
    for (let l = 2021; l >= 1958; l--) {
        var optionMax = document.createElement("option")
        optionMax.value = l
        optionMax.text = l
        param.appendChild(optionMax)
    }
}

minOrMax(min)
minOrMax(max)

function selectionArtistWithMembers() { // Filtrer par nombre de membres
    let index
    for (index = 1; index <= 9; index++) {
        if (index <= 8) {
            selectMembers(index, index)
        } else {
            selectMembers("AllMembers", 0)
        }
    }
}

function selectMembers(name, value) { // Initialise les checkboxes
    let MemberSort = document.getElementById("MemberSort")
    let check = document.createElement("input")
    let label = document.createElement("label")
    label.textContent = " " + name + " :"
    check.id = "Checkbox" + name
    check.value = value
    if (check.value == 0) {
        check.checked = true
    }
    check.setAttribute("type", "checkbox")
    check.setAttribute("onclick", "pushOnArr()")
    check.setAttribute("onclick", "show()")
    MemberSort.appendChild(label)
    MemberSort.appendChild(check)
}

selectionArtistWithMembers()

function SelectionArtist(dataArtist) { // Sélectionne les artistes selon les critères choisis
    pushOnArr()
    for (let i = mini; i <= maxi; i++) { 
        for (let l = 0; l < dataArtist.length; l++) { 
            if (dataArtist[l].creationDate == i) { 
                for (let ArrIndex = 0; ArrIndex < ArrOfMembers.length; ArrIndex++) { 
                    if (dataArtist[l].members.length == ArrOfMembers[ArrIndex]) { 
                        for (let z = 1958; z <= output.innerHTML; z++) { 
                            const Album = dataArtist[l].firstAlbum.split('-')
                            const YearOfAlbum = Album[2]
                            if (YearOfAlbum == z) { 
                                arr.push(tab[l]) 
                            }
                        }
                    }
                }
            }
        }
    }
}

function pushOnArr() { // Récupère les valeurs des checkboxes
    ArrOfMembers = [];
    for (let NbrDeCheckbox = 1; NbrDeCheckbox <= 8; NbrDeCheckbox++) {
        if (document.getElementById("Checkbox" + NbrDeCheckbox).checked === true) {
            ArrOfMembers.push(document.getElementById("Checkbox" + NbrDeCheckbox).value)
        } else {
            if (document.getElementById("CheckboxAllMembers").checked === true) {
                ArrOfMembers.push(document.getElementById("Checkbox" + NbrDeCheckbox).value)
            }
        }
    }
    return ArrOfMembers
}


var range = document.getElementById("input-range")
var output = document.getElementById("dateOutput")
output.innerHTML = range.value

range.oninput = function() {
    output.innerHTML = this.value
}

let contener = document.getElementById("PageChoosing")

function pageNumber(param) { // Affiche le nombre de pages à générer
    contener.innerHTML = ""
    for (let index = 1; index <= param; index++) {
        let page = document.createElement("button")
        page.setAttribute("onclick", "pagination(" + index + ")")
        page.id = "page" + index
        page.innerText = "Page n° " + index
        contener.appendChild(page)
    }
}

var arrBis = []

function pagination(param) { // Pagination
    matchList.innerHTML = ""
    if (param == 1) {
        arrBis = arr.slice(0, 10)
    } else if (param == 2) {
        arrBis = arr.slice(10, 20)
    } else if (param == 3) {
        arrBis = arr.slice(20, 30)
    } else if (param == 4) {
        arrBis = arr.slice(30, 40)
    } else if (param == 5) {
        arrBis = arr.slice(40, 50)
    } else {
        arrBis = arr.slice(50)
    }
    matchList.innerHTML = arrBis.join('');
}

setupPopup()
