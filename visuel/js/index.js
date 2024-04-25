// Sélection des éléments du DOM
const matchList = document.getElementById('card-data');
const api = "/api/"
const artist = "artists"
const location_ = "locations"
const date = "dates"
const relation = "relation"
// Fonction asynchrone pour récupérer les données de l'API
async function data(url) {
    const res_artist = await fetch(url);
    const dataArtist = await res_artist.json();
    show(dataArtist); // Appel de la fonction pour afficher les données
}
// Appel initial pour charger les données des artistes
data(api + artist);
// Définition des variables globales
var arr;
var mini;
var maxi;
var tab; 
var ArrOfMembers; 
// Fonction pour afficher les données des artistes dans des cartes HTML
function show(dataArtist) {
    // Vérification si les données sont définies
    if (dataArtist === undefined) {
        data(api + artist) // Recharge des données si elles ne sont pas définies
    }
    arr = []; // Réinitialisation du tableau
    tab = []; // Réinitialisation du tableau
    // Récupération des valeurs des éléments de sélection
    mini = document.getElementById("Selectmini").value;
    maxi = document.getElementById("Selectmaxi").value;
    // Création des cartes HTML pour chaque artiste dans les données
    tab = dataArtist.map(match => `
        <div class="card" id="card">
            <!-- Contenu de la carte -->
        </div>
    `);
    // Sélection des artistes en fonction des critères de filtrage
    SelectionArtist(dataArtist);
    // Calcul du nombre de pages en fonction du nombre d'artistes
    let nbrPage = Math.ceil(arr.length / 10);
    // Affichage des numéros de page
    pageNumber(nbrPage);
    // Affichage des 10 premières cartes
    matchList.innerHTML = arr.slice(0, 10).join('');
}
// Fonction pour configurer la boîte contextuelle des détails d'artiste
function setupPopup() {
    // Sélection des éléments du DOM pour la boîte contextuelle
    const cardData = document.querySelector(".row");
    const popup = document.querySelector(".popup-box");
    const popupCloseBtn = popup.querySelector(".popup-close-btn")
    // Gestion de l'événement clic pour afficher les détails d'un artiste dans la boîte contextuelle
    cardData.addEventListener("click", async function(event) {
        // Vérification si le bouton "Voir plus" est cliqué
        if (event.target.tagName.toLowerCase() == "button") {
            // Récupération des informations de l'artiste sélectionné
            const item = event.target.parentElement;
            const relation = item.querySelector(".relation");
            const pathPart = relation.dataset.url.split("/");
            // Récupération des détails supplémentaires de l'API
            let res = await fetch(`/api/relation/${pathPart[pathPart.length-1]}`);
            let data = await res.json();
            // Affichage des détails dans la boîte contextuelle
            elementAPI(data, relation);
            const h3 = item.querySelector(".popup-header-cont").innerHTML;
            const readMoreCont = item.querySelector(".read-more-cont").innerHTML;
            popup.querySelector(".popup-header").innerHTML = h3;
            popup.querySelector(".popup-body").innerHTML = readMoreCont
            popup.classList.toggle("open"); // Affichage de la boîte contextuelle
        }
    })
    // Gestion de l'événement clic pour fermer la boîte contextuelle
    popupCloseBtn.addEventListener("click", () => { popup.classList.toggle("open"); });
    popup.addEventListener("click", function(event) {
        if (event.target == popup) {
            popup.classList.toggle("open");
        }
    })
}
// Fonction pour formater et afficher les éléments d'une relation
function elementAPI(elementJSON, relation) {
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
// Sélection des valeurs minimum et maximum pour les filtres
var min = document.getElementById("mini")
var max = document.getElementById("maxi")
function minOrMax(param) {
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
// Fonction pour générer les options de sélection pour l'année minimum
function minimum(param) {
    for (let i = 1958; i <= 2021; i++) {
        var optionMin = document.createElement("option")
        optionMin.value = i
        optionMin.text = i
        param.appendChild(optionMin)
    }
}
// Fonction pour générer les options de sélection pour l'année maximum
function maximum(param) {
    for (let l = 2021; l >= 1958; l--) {
        var optionMax = document.createElement("option")
        optionMax.value = l
        optionMax.text = l
        param.appendChild(optionMax)
    }
}
// Appel des fonctions pour définir les sélecteurs d'année minimum et maximum
minOrMax(min)
minOrMax(max)
// Fonction pour générer les sélecteurs de membres d'artiste
function selectionArtistWithMembers() {
    let index
    for (index = 1; index <= 9; index++) {
        if (index <= 8) {
            selectMembers(index, index)
        } else {
            selectMembers("AllMembers", 0)
        }
    }
}
// Fonction pour créer les cases à cocher des membres d'artiste
function selectMembers(name, value) {
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
// Appel des fonctions pour générer les sélecteurs de membres d'artiste
selectionArtistWithMembers()
// Fonction pour sélectionner les artistes en fonction des filtres
function SelectionArtist(dataArtist) {
    pushOnArr() // Récupération des critères de filtrage
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
// Fonction pour récupérer les critères de filtrage des membres d'artiste
function pushOnArr() {
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
// Gestion de l'input range pour la sélection de l'année
var range = document.getElementById("input-range")
var output = document.getElementById("dateOutput")
output.innerHTML = range.value

range.oninput = function() {
    output.innerHTML = this.value
}
// Génération des numéros de page pour la pagination
let contener = document.getElementById("PageChoosing")
function pageNumber(param) {
    contener.innerHTML = ""
    for (let index = 1; index <= param; index++) {
        let page = document.createElement("button")
        page.setAttribute("onclick", "pagination(" + index + ")")
        page.id = "page" + index
        page.innerText = "Page n° " + index
        contener.appendChild(page)
    }
}
// Tableau temporaire pour stocker les données de la page actuelle
var arrBis = []
// Fonction pour gérer la pagination
function pagination(param) {
    matchList.innerHTML = "" // Réinitialisation de la liste des artistes
    // Sélection des données en fonction de la page actuelle
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
    matchList.innerHTML = arrBis.join(''); // Affichage des artistes de la page actuelle
}
// Initialisation de la boîte contextuelle
setupPopup()
