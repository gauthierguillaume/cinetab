// Clés par défaut (fournies par le développeur)
// Note: Ces clés sont partagées et ont des limites d'utilisation
// Pour une utilisation intensive, créez vos propres clés API
const DEFAULT_TMDB_API_KEY = "0a973ea824d8a0973f3187843af64e2b";
const DEFAULT_OMDB_API_KEY = "cdb36cb4";

// Variables pour les clés API
let TMDB_API_KEY = DEFAULT_TMDB_API_KEY;
let OMDB_API_KEY = DEFAULT_OMDB_API_KEY;

// Préférences de listes par défaut
const DEFAULT_LIST_PREFERENCES = {
	moviePopular: true,
	movieTopRated: true,
	movieTrending: true,
	movieUpcoming: false,
	movieNowPlaying: false,
	tvPopular: true,
	tvTopRated: true,
	tvTrending: true,
	tvAiringToday: false,
	tvOnAir: false,
	// Genres Films
	movieAction: false,
	movieComedy: false,
	movieDrama: false,
	movieHorror: false,
	movieRomance: false,
	movieThriller: false,
	movieScifi: false,
	movieFantasy: false,
	movieAnimation: false,
	movieDocumentary: false,
	// Genres TV
	tvAction: false,
	tvComedy: false,
	tvDrama: false,
	tvCrime: false,
	tvReality: false,
	tvAnimation: false,
	tvDocumentary: false,
	// Régions Films
	movieUs: false,
	movieUk: false,
	movieFrench: false,
	movieKorean: false,
	movieJapanese: false,
	// Régions TV
	tvUs: false,
	tvUk: false,
	tvFrench: false,
	tvKorean: false,
	tvJapanese: false,
};

// Variables pour les préférences de listes
let listPreferences = DEFAULT_LIST_PREFERENCES;

// Charger les clés API et les préférences depuis le storage
function loadApiKeys() {
	return new Promise((resolve) => {
		chrome.storage.sync.get(["tmdbApiKey", "omdbApiKey", "listPreferences"], function (result) {
			TMDB_API_KEY = result.tmdbApiKey || DEFAULT_TMDB_API_KEY;
			OMDB_API_KEY = result.omdbApiKey || DEFAULT_OMDB_API_KEY;
			listPreferences = result.listPreferences || DEFAULT_LIST_PREFERENCES;
			resolve();
		});
	});
}

// Ouvrir les paramètres de l'extension
function openExtensionSettings() {
	// Afficher un message d'instructions stylé
	const overlay = document.createElement("div");
	overlay.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10000;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
	`;

	overlay.innerHTML = `
		<div style="
			background: #2a2a2a;
			padding: 30px;
			border-radius: 12px;
			text-align: center;
			max-width: 400px;
			border: 2px solid #f5c518;
			color: #ffffff;
		">
			<h2 style="color: #f5c518; margin-bottom: 20px;">🔧 Open Extension Settings</h2>
			<p style="color: #cccccc; margin-bottom: 20px; line-height: 1.5;">
				1. Look for the <strong>CineTab icon</strong> in your browser toolbar<br>
				2. Click on it to open the settings popup<br>
				3. Enter your API keys and save
			</p>
			<div style="margin-bottom: 20px;">
				<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjZjVjNTE4Ii8+Cjwvc3ZnPgo=" 
					 style="width: 24px; height: 24px; margin: 0 10px;" alt="CineTab icon">
				<span style="color: #f5c518; font-weight: 600;">← Look for this icon</span>
			</div>
			<button id="got-it-btn" style="
				background: #f5c518;
				color: #000000;
				border: none;
				padding: 10px 20px;
				border-radius: 6px;
				cursor: pointer;
				font-weight: 600;
			">
				Got it!
			</button>
		</div>
	`;

	document.body.appendChild(overlay);

	// Ajouter les event listeners après avoir créé le HTML
	const gotItBtn = overlay.querySelector("#got-it-btn");
	gotItBtn.addEventListener("click", function () {
		overlay.remove();
	});

	// Fermer en cliquant sur l'overlay
	overlay.addEventListener("click", function (e) {
		if (e.target === overlay) {
			overlay.remove();
		}
	});
}

const PAGES = 5; // nombre de pages à charger par section (5 = 100 titres par section)

// Génerer les endpoints avec la clé API chargée et les préférences
function getEndpoints() {
	const endpoints = [];

	// Films - Listes principales
	if (listPreferences.moviePopular) {
		endpoints.push(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.movieTopRated) {
		endpoints.push(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.movieTrending) {
		endpoints.push(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.movieUpcoming) {
		endpoints.push(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.movieNowPlaying) {
		endpoints.push(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}

	// Séries - Listes principales
	if (listPreferences.tvPopular) {
		endpoints.push(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.tvTopRated) {
		endpoints.push(`https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.tvTrending) {
		endpoints.push(`https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.tvAiringToday) {
		endpoints.push(`https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}
	if (listPreferences.tvOnAir) {
		endpoints.push(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
	}

	// Films - Par genre
	if (listPreferences.movieAction) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieComedy) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieDrama) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=18&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieHorror) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieRomance) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieThriller) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=53&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieScifi) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieFantasy) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=14&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieAnimation) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=16&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieDocumentary) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99&language=en-US&sort_by=popularity.desc&page=1`);
	}

	// Séries - Par genre
	if (listPreferences.tvAction) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10759&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvComedy) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=35&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvDrama) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=18&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvCrime) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=80&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvReality) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10764&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvAnimation) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=16&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvDocumentary) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=99&language=en-US&sort_by=popularity.desc&page=1`);
	}

	// Films - Par région
	if (listPreferences.movieUs) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=US&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieUk) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=GB&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieFrench) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=FR&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieKorean) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=KR&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.movieJapanese) {
		endpoints.push(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_origin_country=JP&language=en-US&sort_by=popularity.desc&page=1`);
	}

	// Séries - Par région
	if (listPreferences.tvUs) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_origin_country=US&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvUk) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_origin_country=GB&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvFrench) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_origin_country=FR&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvKorean) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_origin_country=KR&language=en-US&sort_by=popularity.desc&page=1`);
	}
	if (listPreferences.tvJapanese) {
		endpoints.push(`https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_origin_country=JP&language=en-US&sort_by=popularity.desc&page=1`);
	}

	return endpoints;
}

let fullList = [];
let currentItem = null;
let currentFanarts = [];
let currentFanartIndex = 0;

// Charge plusieurs pages pour chaque endpoint
async function fetchMultiplePages(baseUrl, pages = PAGES) {
	let results = [];
	for (let i = 1; i <= pages; i++) {
		const url = baseUrl.replace("page=1", `page=${i}`);
		try {
			const resp = await fetch(url);
			const data = await resp.json();
			if (data && data.results) {
				results = results.concat(data.results);
			}
		} catch (e) {
			/* ignore */
		}
	}
	return results;
}

// Charge une grosse liste multi-sources/multi-pages (une seule fois au démarrage)
async function buildBigList() {
	let allItems = [];
	const endpoints = getEndpoints();
	for (let endpoint of endpoints) {
		let type = endpoint.includes("/tv") ? "tv" : "movie";
		const items = await fetchMultiplePages(endpoint, PAGES);
		items.forEach((item) => (item._type = type));
		allItems = allItems.concat(items);
	}
	// Supprime les doublons (id unique sur chaque type)
	fullList = [];
	const ids = new Set();
	for (let item of allItems) {
		let key = `${item._type}-${item.id}`;
		if (!ids.has(key)) {
			ids.add(key);
			fullList.push(item);
		}
	}
}

// Tire un film/série random dans toute la liste
async function pickRandomAndLoad() {
	if (!fullList.length) await buildBigList();
	const item = fullList[Math.floor(Math.random() * fullList.length)];
	currentItem = item;

	// Récupère toutes les fanarts (film ou série)
	const imgUrl = `https://api.themoviedb.org/3/${item._type}/${item.id}/images?api_key=${TMDB_API_KEY}`;
	const imgResp = await fetch(imgUrl);
	const imgData = await imgResp.json();
	currentFanarts = imgData.backdrops || [];
	currentFanartIndex = 0;

	updateDisplay();
}

// Fonction pour détecter si on est en ultrawide
function isUltrawide() {
	return window.innerWidth >= 3440;
}

// Fonction pour ajuster la position de l'image de fond en ultrawide
function adjustFanartPosition() {
	const cover = document.getElementById("cover");
	const fanartBg = document.getElementById("fanart-bg");

	function positionFanart() {
		const coverRect = cover.getBoundingClientRect();
		const coverRightEdge = coverRect.right;
		const windowWidth = window.innerWidth;

		// Vérifier que la cover a bien des dimensions valides
		if (coverRightEdge > 0 && coverRect.width > 0) {
			// Positionner l'image de fond juste après la cover
			fanartBg.style.left = coverRightEdge + "px";
			fanartBg.style.width = windowWidth - coverRightEdge + "px";
			fanartBg.style.height = "100vh";
			fanartBg.style.objectFit = "cover";
			fanartBg.style.objectPosition = "center top"; // Garde le haut, crop par le bas
		} else {
			// Si la cover n'a pas encore de dimensions, réessayer
			setTimeout(positionFanart, 100);
		}
	}

	// Attendre que l'image soit chargée ET que le DOM soit prêt
	if (cover.complete && cover.naturalWidth > 0) {
		// Image déjà chargée - plusieurs tentatives pour s'assurer que ça marche
		setTimeout(positionFanart, 50);
		setTimeout(positionFanart, 150); // Double vérification
		setTimeout(positionFanart, 300); // Triple vérification
	} else {
		// Image pas encore chargée
		cover.onload = function () {
			setTimeout(positionFanart, 50);
			setTimeout(positionFanart, 150); // Double vérification
		};
		// Fallback au cas où onload ne se déclenche pas
		setTimeout(positionFanart, 200);
		setTimeout(positionFanart, 500); // Fallback tardif
	}
}

function updateDisplay() {
	if (!currentItem) return;
	const poster = currentItem.poster_path ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${currentItem.poster_path}` : "";
	const fanart = currentFanarts.length > 0 ? `https://image.tmdb.org/t/p/original${currentFanarts[currentFanartIndex].file_path}` : "";

	// Ne pas effacer la note avant le fetch pour éviter le clignotement
	// document.getElementById("imdb-rating").textContent = "";

	fetch(`https://api.themoviedb.org/3/${currentItem._type}/${currentItem.id}/external_ids?api_key=${TMDB_API_KEY}`)
		.then((r) => r.json())
		.then((ids) => {
			const imdbUrl = ids.imdb_id ? `https://www.imdb.com/title/${ids.imdb_id}/` : "#";

			// Créer l'URL Trakt
			const title = currentItem.title || currentItem.name || "";
			const year = (currentItem.release_date || currentItem.first_air_date || "").slice(0, 4);
			const titleSlug = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
				.replace(/\s+/g, "-") // Remplacer les espaces par des tirets
				.replace(/-+/g, "-") // Supprimer les tirets multiples
				.replace(/^-|-$/g, ""); // Supprimer les tirets en début/fin

			const traktUrl = currentItem._type === "movie" ? `https://trakt.tv/movies/${titleSlug}-${year}` : `https://trakt.tv/shows/${titleSlug}`;

			// Assigner les liens
			document.getElementById("cover-link").href = traktUrl;
			document.getElementById("imdb-rating").href = imdbUrl;

			// Stocker les données IMDb pour mise à jour ultérieure
			window.pendingImdbData = null;

			// Fetch la note IMDb via OMDb
			if (ids.imdb_id) {
				fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${ids.imdb_id}`)
					.then((r) => r.json())
					.then((data) => {
						const rating = data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "–";
						const votes = data.imdbVotes && data.imdbVotes !== "N/A" ? data.imdbVotes : "";

						// Formatter le nombre de votes (ex: "1,234,567" -> "1.2M")
						let formattedVotes = "";
						if (votes) {
							const numVotes = parseInt(votes.replace(/,/g, ""));
							if (numVotes >= 1000000) {
								formattedVotes = (numVotes / 1000000).toFixed(1) + "M";
							} else if (numVotes >= 1000) {
								formattedVotes = (numVotes / 1000).toFixed(0) + "K";
							} else {
								formattedVotes = numVotes.toString();
							}
						}

						// Stocker les données pour mise à jour après le changement d'image
						window.pendingImdbData = {
							html: `
								<div class="rating-container">
									<span class="rating-star">⭐</span>
									<span class="rating-value">${rating}</span>
									<span class="rating-divider">/</span>
									<span class="rating-max">10</span>
								</div>
								${formattedVotes ? `<span class="rating-votes">${formattedVotes}</span>` : ""}
							`,
						};

						// Mettre à jour immédiatement
						document.getElementById("imdb-rating").innerHTML = window.pendingImdbData.html;
						// Pas besoin d'ajouter la classe loaded, elle est déjà là
					})
					.catch(() => {
						window.pendingImdbData = {
							html: `
								<div class="rating-container">
									<span class="rating-star">⭐</span>
									<span class="rating-value">–</span>
									<span class="rating-divider">/</span>
									<span class="rating-max">10</span>
								</div>
							`,
						};

						// Mettre à jour immédiatement
						document.getElementById("imdb-rating").innerHTML = window.pendingImdbData.html;
						// Pas besoin d'ajouter la classe loaded, elle est déjà là
					});
			} else {
				window.pendingImdbData = {
					html: `
						<div class="rating-container">
							<span class="rating-star">⭐</span>
							<span class="rating-value">–</span>
							<span class="rating-divider">/</span>
							<span class="rating-max">10</span>
						</div>
					`,
				};

				// Mettre à jour immédiatement
				document.getElementById("imdb-rating").innerHTML = window.pendingImdbData.html;
				// Pas besoin d'ajouter la classe loaded, elle est déjà là
			}
		});

	const fanartBg = document.getElementById("fanart-bg");
	const coverImg = document.getElementById("cover");
	const imdbRating = document.getElementById("imdb-rating");

	// Réinitialiser les classes loaded seulement pour les images
	fanartBg.classList.remove("loaded");
	document.getElementById("cover-link").classList.remove("loaded");
	// Supprimer aussi la classe loaded du bouton IMDb pour qu'il ait la même transition
	imdbRating.classList.remove("loaded");

	// Afficher immédiatement le bouton avec un contenu par défaut
	imdbRating.innerHTML = `
		<div class="rating-container">
			<span class="rating-star">⭐</span>
			<span class="rating-value">–</span>
			<span class="rating-divider">/</span>
			<span class="rating-max">10</span>
		</div>
		<span class="rating-votes" style="opacity: 0;">0</span>
	`;
	imdbRating.classList.add("loaded");

	// Charger le fanart
	fanartBg.src = fanart;
	fanartBg.onload = function () {
		fanartBg.classList.add("loaded");
	};

	// Charger le poster
	coverImg.src = poster;
	coverImg.onload = function () {
		document.getElementById("cover-link").classList.add("loaded");

		// Ajuster la position de l'image de fond en ultrawide après chargement
		if (isUltrawide()) {
			setTimeout(() => {
				adjustFanartPosition();
			}, 50);
		}
	};

	// Ajuster la position de l'image de fond en ultrawide
	if (isUltrawide()) {
		// Attendre un peu plus pour s'assurer que l'image est chargée
		setTimeout(() => {
			adjustFanartPosition();
		}, 100);
	} else {
		// Reset des styles inline pour les écrans normaux
		fanartBg.style.left = "";
		fanartBg.style.width = "";
		fanartBg.style.height = "";
		fanartBg.style.objectFit = "";
		fanartBg.style.objectPosition = "";
	}
}

// Fonction pour changer uniquement l'image de fond (sans recharger le bouton IMDb)
function changeFanartOnly() {
	if (!currentFanarts.length) return;

	const fanart = `https://image.tmdb.org/t/p/original${currentFanarts[currentFanartIndex].file_path}`;
	const fanartBg = document.getElementById("fanart-bg");

	// Transition fluide sans clignotement
	fanartBg.classList.remove("loaded");

	// Pré-charger l'image pour éviter le délai
	const tempImg = new Image();
	tempImg.onload = function () {
		fanartBg.src = fanart;
		fanartBg.classList.add("loaded");

		// Ajuster la position en ultrawide si nécessaire
		if (isUltrawide()) {
			setTimeout(() => {
				adjustFanartPosition();
			}, 50);
		}
	};
	tempImg.src = fanart;
}

// Clique sur le fond = changer de backdrop pour le même item
document.getElementById("fanart-bg").addEventListener("click", function () {
	if (!currentFanarts.length) return;
	currentFanartIndex = (currentFanartIndex + 1) % currentFanarts.length;
	changeFanartOnly(); // Utiliser la nouvelle fonction au lieu de updateDisplay()
});

// (Re-)Tirer un nouveau film/série random au chargement initial seulement
async function init() {
	await loadApiKeys();
	pickRandomAndLoad();
}

init();

// Parallax cover 3D élégant
const cover = document.getElementById("cover");

cover.addEventListener("mousemove", function (e) {
	const rect = cover.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	const w = rect.width;
	const h = rect.height;

	// Ajustements pour ultrawide vs écran normal
	const ultrawide = isUltrawide();
	const rotateY = (x / w - 0.5) * (ultrawide ? 8 : 15); // Moins d'effet sur ultrawide
	const rotateX = (0.5 - y / h) * (ultrawide ? 6 : 10); // Moins d'effet sur ultrawide
	const scale = ultrawide ? 1.02 : 1.03; // Zoom plus subtil sur ultrawide

	cover.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
	cover.style.transition = "transform 0.1s ease-out";
});

cover.addEventListener("mouseleave", function () {
	cover.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
	cover.style.transition = "transform 0.4s ease-out";
});

// Réajuster l'effet si la fenêtre est redimensionnée
window.addEventListener("resize", function () {
	// Reset transform on resize pour éviter les bugs
	cover.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";

	// Réajuster la position de l'image de fond en ultrawide
	if (isUltrawide()) {
		adjustFanartPosition();
	} else {
		// Reset des styles inline pour les écrans normaux
		const fanartBg = document.getElementById("fanart-bg");
		fanartBg.style.left = "";
		fanartBg.style.width = "";
		fanartBg.style.height = "";
		fanartBg.style.objectFit = "";
		fanartBg.style.objectPosition = "";
	}
});
