//variables
let searchHome = document.getElementById('home')
let ulTag = document.getElementById('pagination')
let totalPages = 20

let userSearch = document.getElementById('lens')
let clearSearch = document.getElementById('clear-btn')
let responsiveNav = document.getElementById('navIcon')


//Add event listener if # appears
function runAll() {


	if (searchHome) {
		pagination(totalPages, 1)
		fetchAnimeQuote()
	} if (clearSearch) {
		clearSearch.addEventListener('click', clear)
	} if (navIcon) {
		responsiveNav.addEventListener('click', myFunction)
	} if (userSearch) {
		userSearch.addEventListener('click', showSearchResults)
	}
}
runAll();




//


/*HOME PAGE*/

//Pagination


function pagination(totalPages, page) {
	let liTag = ''
	let activeLi
	let beforePages = page - 1
	let afterPages = page + 1

	if (page > 1) { //if page value is > 1 show the prev button
		liTag += `<li class="btn prev" onclick="pagination(totalPages, ${page - 1})"><span><i class="fa fa-angle-left"></i> Prev</span></li>`
	}

	if (page > 2) { //if page value >  2 add liTag with 1 value
		liTag += `<li class="numb" onclick="pagination(totalPages, 1)"><span>1</span></li>`
		if (page > 3) { //if page value > 3 add liTag with dots value
			liTag += `<li class="dots"><span>...</span></li>`
		}
	}

	//Number of pages shown before current Li
	if (page == totalPages) { //page value = totalPages then substract -2 to the beforePages value
		beforePages = beforePages - 2

	} else if (page == totalPages - 1) { //page value = totalPages then substract -1 to the beforePages value
		beforePages = beforePages - 1
	}

	//Number of pages shown after current Li
	if (page == 1) { //page value = 1 then add +2 to the afterPages value
		afterPages = afterPages + 2

	} else if (page == 2) {  //page value = 2 then add +1 to the beforePages value
		afterPages = afterPages + 1
	}

	for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
		if (pageLength > totalPages) {
			continue;
		}
		if (pageLength == 0) { //if pageLength = 0 add 1 to the pagelength value
			pageLength = pageLength + 1
		}
		if (page == pageLength) { //page = to pageLength assign class="active"
			activeLi = "active"
		} else {
			activeLi = '' //leave empty for the activeLi class
		}
		liTag += `<li id="${activeLi}" class="numb ${activeLi}" onclick="pagination(totalPages, ${pageLength})"><span>${pageLength}</span></li>`
	}

	if (page < totalPages - 1) { //if page value < than totalPages show penultimate liTag available
		if (page < totalPages - 2) { //if page value < than totalPages show last liTag available
			liTag += `<li class="dots"><span>...</span></li>`
		}
		liTag += `<li class="numb" onclick="pagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`
	}

	if (page < totalPages) { //if page value is < 1 show the next button
		liTag += `<li class="btn next" onclick="pagination(totalPages, ${page + 1})"><span>Next <i class="fa fa-angle-right"></i></span></li>`
	}

	ulTag.innerHTML = liTag
	fetchAnimeCard(page)
	window.scrollTo(0, 0);
}


//to retrieve random quote from API (called on runAll())
function fetchAnimeQuote() {
	let list = []
	fetch('https://animechan.vercel.app/api/random')
		.then((response) => response.json())
		.then(animeQuote => {
			list = animeQuote

			let quote =
				`<div class="extra_container">
					<h3 class="extra__title">
						"${animeQuote.quote}"
					</h3>
					<h4 class="extra__p">
					${animeQuote.character} - ${animeQuote.anime}
					</h4>
				</div>
				`
			document.getElementById('extra__container').innerHTML = quote
		})
}

//to retrieve cards from API (called on element(totalPages, 1))
function fetchAnimeCard(currentPage, anime, index) {
	fetch(`https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=${currentPage * 20}`)
		.then((response) => response.json())
		.then((animeList) => {
			list = animeList.data

			let card = ''
			for (let i = 0; i < list.length; i++) {

				card += createCard(list[i], i)
			}

			document.getElementById('card__container').innerHTML = card
		})
}

//to created cards (called on fetchAnimeCard())
function createCard(anime, index) {
	return `
	<div id=card-${index} class="flip-card card">
		<div class="flip-card-inner">
		<div class="card__face flip-card-front">
			<img class="card__img" src="${anime.attributes.posterImage['small']}" alt="${anime.attributes.canonicalTitle}" data-image="${anime.attributes.posterImage['small']}" height=350px/>     
		</div>
		<div class="card__face flip-card-back">
			<h4 class="card__title">
				${anime.attributes.canonicalTitle}
			</h4>
			<p class="avg-rat">
               Rating: ${anime.attributes.averageRating[0]}/10</p>
			<button id="card-${index}-btn"  value="(${anime.attributes.canonicalTitle})" class="button" style="bottom:6px">Add to favorites</button>
		</div>
	</div>
	</div>
	`
}

document.querySelector('card')



//to retrieve search results
function showSearchResults() {
	let userInput = document.getElementById('data__search').value

	fetch(`https://kitsu.io/api/edge/anime?filter[text]=${userInput}`)
		.then((response) => response.json())
		.then((userResults) => {
			userList = userResults.data

			let match = ''
			for (let i = 0; i < userList.length; i++) {

				match += searchResults(userList, i)
			}

			match != ""
				? document.getElementById('results__container').innerHTML = match
				: document.getElementById('results__container').innerHTML = (`
					<div id="notfound" class="notfound">
						<h3>
							Oops! There are no matches for your search
						</h3> 
						<p>
							Please, try again.
						</p>
					</div>`)
		})
}

function searchResults(cardFound, i) {
	return `
	<div id=${cardFound[i].id} class="card-2">
	<button id="card-${i}-btn"  value="(${cardFound[i].attributes.canonicalTitle})" class="fav--btn2" onclick="addFav(${cardFound[i].id})"><i id="star-btn"class="fa fa-fw fa-star-o" onclick="changeIcon(this)"></i></button>
		<div class="flip-card-inner-2">
			<div class="flip-card-front-2">
				<img class="card2__img" src="${cardFound[i].attributes.posterImage['small']}" alt="${cardFound[i].attributes.canonicalTitle}" data-image="${cardFound[i].attributes.posterImage['small']}" height=350px/>	  
			</div>
			<div class="flip-card-back-2">
				<h4 class="card__title">
					${cardFound[i].attributes.canonicalTitle}
				</h4>
				<p class="card__description">
					${cardFound[i].attributes.description}
				</p>
				
			</div>
		</div>
	</div>`
}


function changeIcon(icon) {
	if (icon.classList.contains('fa-star-o')) {
		icon.classList.remove('fa-star-o')
		icon.classList.add('fa-star')
	} else {
		icon.classList.remove('fa-star')
		icon.classList.add('fa-star-o')
	}
}

function addFav(id) {

	fetch(`https://kitsu.io/api/edge/anime?filter[id]=${id}`)
		.then((response) => response.json())
		.then((favAttributes) => {
			favContent = favAttributes.data

			let favInfo = {
				id: favContent[0].id,
				image: favContent[0].attributes.posterImage['small'],
				title: favContent[0].attributes.canonicalTitle,
				description: favContent[0].attributes.description,
			}
/*
			let favorites = JSON.parse(localStorage.getItem('favorites') ||[])
			
			let favCheck = favorites.findIndex(function (){
				return e.id = favInfo.id,
					e.image = favInfo.image,
					e.title = favInfo.title,
					e.description = favInfo.description
			})
			console.log(favCheck)
		})}
			*/

			let favorites = localStorage.getItem('favorites') ||[]
         if(favorites.indexOf(favInfo) == -1) {
            favorites.push(favInfo)
         } else {
            favorites.splice(favorites.indexOf(favInfo.id), 1)
         } 
         localStorage.setItem('favorites', JSON.stringify(favInfo))
	})}
		/*
		// get favorites from local storage or empty array
		let favorites = localStorage.getItem('favorites') || '[]'
		favorites = JSON.parse(favorites)
		
		let favs = favorites.indexOf(id)
		 // return if target doesn't have an id (shouldn't happen)
		if (!id) return;
	 // item is not favorite
	 if (favs == -1) {
		favorites.push(favInfo);
		document.getElementById(id).className = 'is-favorite';
	 // item is already favorite
	 } else {
		favorites.splice(index, 1);
		document.getElementById(id).className = '';
	 }
	 // store array in local storage
	 localStorage.setItem('favorites', JSON.stringify(favorites));
  });*/

			
			/*
				function addFav(value){

					let favInfo = {
						id: favContent[0].id,
						image: favContent[0].attributes.posterImage['small'],
						title: favContent[0].attributes.canonicalTitle,
						description: favContent[0].attributes.description,
					}

               if(localStorage.getItem('favorites')){//If there are favourites
                   let storage = JSON.parse(localStorage['favorites']);
                   for (let i = 0;i <= storage.length;i++){
                       if(storage[i] == (userInput.data.id) == -1){//Id already stored, we dont want a duplicate id so ignore
                           console.log('id already stored');
                           break;
                       }
                       else{//game id doesn't exist in storage so add the id to storage
                           storage.push(userInput.data.id);
                           localStorage.setItem('favorites', JSON.stringify(storage));
                           console.log('must be a new id?');
                       }
                   }
               }else{//No favourites in local storage, so add new
                   let favArray= [];
                   favArray.push(userInput.data.id);
                   localStorage.setItem("favorites", JSON.stringify(favArray));
                   console.log('New favorites list');
               }
				}
			*/

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
	var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

function enter(event) {
	var input = document.getElementById("data__search");
	input.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("lens").click();
		}
	})
}

function clear() {

	var input = document.getElementById('data__search')
	input.value = ''
	var content = document.getElementById('results__container')
	content.innerHTML = ''
}
function fetchAnime() {
	let randomNum = Math.floor(Math.random() * (14000 - 1) + 1)
	let list = []

	fetch(`https://kitsu.io/api/edge/anime/${randomNum}`)
		.then((response) => response.json())
		.then((characterData) => {
			list = characterData.data


			let image = `
					 <div>
					 <img class="img__container" src="${list.attributes.posterImage['small']}" alt="${list.attributes.canonicalTitle}" height=350px/>
					 <div>`

			document.getElementById('i__container').innerHTML = image

		}
		)
}



