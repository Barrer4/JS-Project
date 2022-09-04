//variables
let searchHome = document.getElementById('home')
let ulTag = document.getElementById('pagination')
let totalPages = 100;

let userSearch = document.getElementById('lens')
let clearSearch = document.getElementById('clear-btn')
let responsiveNav = document.getElementById('navIcon');

let aboutPage = document.getElementById('aboutPage');

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
	}if (aboutPage) {
		fetchAnime()
		console.log('it runs')
	}

}

runAll();




/*HOME PAGE*/

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
	fetch(`https://kitsu.io/api/edge/anime?page[limit]=18&page[offset]=${currentPage * 18}`)
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
function createCard(anime, i) {
	return `
		<div id=card-${i} class="flip-card card">
			<div class="flip-card-front">
				<button id="card-${i}-btn0" value="(${anime.attributes.canonicalTitle})"  onclick="addFav(${anime.id})"> <i id="${anime.id}-heart-btn" class="fa fa-fw fa-heart-o"></i></button>
					
				<img class="card__img" src="${anime.attributes.posterImage['small']}" alt="${anime.attributes.canonicalTitle}" data-image="${anime.attributes.posterImage['small']}" height=350px/>     
			</div>

			<div class="flip-card-back">
				<h4 class="card__title">
					${anime.attributes.canonicalTitle}
				</h4>
				<p class="avg-rat">
						Rating: ${anime.attributes.averageRating[0]}/10</p>
			
				<button class="button" id="card-${anime.id}-btn2" onclick="modal(${anime.id})">Learn more</button>
				
				<div id="${anime.id}-modal" class="modal">
					<div class="modal-content">
						<span onclick="closeX(${anime.id})" class="close">&times;</span>
						<h3 class="card__title">
						<span></span>
							${anime.attributes.canonicalTitle}
						</h3>
						
						<p class="card__description ">
							${anime.attributes.description}
						</p>				
					</div>
				</div>
			</div>
		</div>
		`
}

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


/*SEARCH PAGE*/
//To retrieve search results
function showSearchResults() {
	let userInput = document.getElementById('data__search').value

	fetch(`https://kitsu.io/api/edge/anime?filter[text]=${userInput}`)
		.then((response) => response.json())
		.then((userResults) => {
			userList = userResults.data

			let match = ''
			for (let i = 0; i < userList.length; i++) {

				match += searchResults(userList, i)

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
			}
		}
		)
}

/*To create the cards of user's search (called on showSearchResults)*/
function searchResults(cardFound, i) {
	return `
	<div id="search-${i}" class="flip-card card">
		<div class="flip-card-front">
			<button id="card-${i}-btn0" value="(${cardFound[i].attributes.canonicalTitle})" onclick="addFav(${cardFound[i].id})"><i id="${cardFound[i].id}-heart-btn"class="fa fa-fw fa-heart-o"></i></button>
		
			<img class="card2__img" src="${cardFound[i].attributes.posterImage['small']}" alt="${cardFound[i].attributes.canonicalTitle}" data-image="${cardFound[i].attributes.posterImage['small']}" height=350px/>	
		</div>

		<div class="flip-card-back">
			<h4 class="card__title">
				${cardFound[i].attributes.canonicalTitle}
			</h4>

			<button class="button" id="card-${cardFound[i].id}-btn2" onclick="modal(${cardFound[i].id})">Learn more</button>
			
			<div id="${cardFound[i].id}-modal" class="modal">
				<div class="modal-content">
					<span onclick="closeX(${cardFound[i].id})" class="close">&times;</span>
					<h3 class="card__title">
					<span></span>
						${cardFound[i].attributes.canonicalTitle}
					</h3>
						
					<p class="card__description ">
							${cardFound[i].attributes.description}
					</p>				
				</div>
			</div>
		</div>
	</div>`
}

/*To display the description of the cards*/
function modal(id) {

	// Get the modal
	let modal = document.getElementById(`${id}-modal`);

	// Get the button that opens the modal
	let btn = document.getElementById(`card-${id}-btn2`);

	// When the user clicks on the button, open the modal
	btn.onclick = function () {
		modal.style.display = "block";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
}

/*The id received on this function differs from the one received on modal(id)*/
function modal2(id){
	// Get the modal
	let modal = document.getElementById(`${id}-modal`);

	// Get the button that opens the modal
	let btn = document.getElementById(id);

	// Get the <span> element that closes the modal
	let button = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal
	btn.onclick = function () {
		modal.style.display = "block";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}
}

// When the user clicks on <span> (x), close the modal
function closeX(id) {
	document.getElementById(`${id}-modal`).style.display = "none";
}

//To add items to the favorite list
function addFav(id) {

	//To get heart-button
	let icon = document.getElementById(`${id}-heart-btn`)

	//To get favorites from local storage or empty array
	let favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
	let favs = favorites.indexOf(id)

	//Action to be performed when the item is not favorite (add a full heart on click)
	if (favs == -1) {
		favorites.push(id);

		if (icon.classList.contains('fa-heart-o')) {
			icon.classList.remove('fa-heart-o')
			icon.classList.add('fa-heart')
		}

	//Action to be performed when the item item is already favorite (removes the full heart on click)
	} else {
		favorites.splice(favs, 1)
		icon.classList.remove('fa-heart')
		icon.classList.add('fa-heart-o')
	}

	//To store array in local storage
	localStorage.setItem('favorites', JSON.stringify(favorites));
	showFav();
}

//to display the favorite list
function showFav() {
	if(document.getElementById('favorites__container')){
	let favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

	let favInfo = ''
	for (let i = 0; i < favorites.length; i++) {
		let id = favorites[i]

		fetch(`https://kitsu.io/api/edge/anime?filter[id]=${id}`)
			.then((response) => response.json())
			.then((favAttributes) => {
				favContent = favAttributes.data

				favInfo += `
					<div id="fav${id}" class="card-3">
						<h3 class="card-3__title">
						${favContent[0].attributes.canonicalTitle}
						</h3>
						<img class="card3__img" src="${favContent[0].attributes.posterImage['small']}" alt="${favContent[0].attributes.posterImage['small']}" data-image="$favContent[0].attributes.posterImage['small']}" height=350px/>	  
						<button id="card-${i}-btn3"  value="(${favContent[0].attributes.canonicalTitle})" class="fav--btn2" onclick="addFav(${favContent[0].id})"><i id="${favContent[0].id}-heart-btn" class="fa fa-fw fa-heart" ></i></button>
					</div>`
				
					document.getElementById('favorites__container').innerHTML = favInfo
			} 
			)
		} 
	
		if (favorites == "") {
			document.getElementById('favorites__container').innerHTML = (`
				<div id="notfound" class="notfound">
					<h3>
						It seems you do not have any favorites.
					</h3> 
					<p>
						Surf the web and share some love.
					</p>
				</div>`)
		}
	}
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
	let x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}

/*To submit the search with the key enter*/
function enter(event) {
	let input = document.getElementById("data__search");
	input.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("lens").click();
		}
	})
}

/*To clear the user's search*/
function clear() {
	let input = document.getElementById('data__search')
	input.value = '';
	let content = document.getElementById('results__container')
	content.innerHTML = '';
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
					 <img class="img__container" src="${list.attributes.posterImage['large']}" alt="${list.attributes.canonicalTitle}" height=350px/>
					 <div>`

			document.getElementById('i__container').innerHTML = image

		})
}



