// Définition des variables globales pour les filtres
let filterName = ""; // Nom du jeu à filtrer
let filterMin = 0; // Prix minimum
let filterMax = 1000; // Prix maximum
let filterCategory = ""; // Catégorie de jeu à filtrer
let maxCost = 0; // Le prix maximum des jeux récupérés
let minCost = 0; // Le prix minimum des jeux récupérés

// Fonction pour récupérer la liste des jeux depuis l'API
function getGames() {
	return $.ajax({
		url: '/api/games', // URL de l'API pour récupérer les jeux
		type: 'get' // Méthode HTTP GET pour récupérer les données
	});
}

// Fonction pour ajouter un nouveau jeu via l'API
function addGame(game) {
	return $.ajax({
		url: '/api/register', // URL de l'API pour enregistrer un jeu
		type: 'post', // Méthode HTTP POST pour envoyer de nouvelles données
		contentType: 'application/json', // Type de contenu pour l'envoi des données en JSON
		data: JSON.stringify(game) // Conversion de l'objet jeu en JSON avant envoi
	});
}

// Fonction pour supprimer un jeu via l'API
function deleteGame(id) {
	return $.ajax({
		url: `/api/delete/${id}`, // URL de l'API pour supprimer un jeu avec son ID
		type: 'delete' // Méthode HTTP DELETE pour supprimer des données
	});
}

// Fonction pour éditer un jeu via l'API
function editGame(updatedGame) {
	return $.ajax({
		url: `/api/edit`, // URL de l'API pour éditer un jeu
		type: 'put', // Méthode HTTP PUT pour modifier des données existantes
		contentType: 'application/json', // Type de contenu pour l'envoi des données en JSON
		data: JSON.stringify(updatedGame) // Conversion de l'objet mis à jour en JSON avant envoi
	});
}

// Fonction pour appliquer les filtres sur les jeux
function applyFilters(name, minPrice, maxPrice, category) {
	// Mise à jour des filtres globaux
	filterName = name; // Filtrer par nom
	filterMin = Number.isInteger(minPrice) ? minPrice : 0; // Filtrer par prix minimum
	filterMax = Number.isInteger(maxPrice) ? maxPrice : 0; // Filtrer par prix maximum
	filterCategory = category; // Filtrer par catégorie
}

// Fonction pour mettre à jour la liste des jeux en appliquant les filtres
function updateGames() {
	// Récupération des jeux depuis l'API
	getGames().done((items) => {
		let content = ""; // Variable pour construire le HTML des jeux filtrés
		items.forEach((element, i) => {
			// Mise à jour des valeurs min et max des prix
			if (i == 0) {
				minCost = element.cost; // Initialisation du prix minimum
			}
			if (element.cost > maxCost) {
				maxCost = element.cost; // Mise à jour du prix maximum
			}
			if (element.cost < minCost) {
				minCost = element.cost; // Mise à jour du prix minimum
			}

			// Vérification si l'élément correspond aux filtres appliqués
			if (element.name.includes(filterName) &&
				element.cost >= filterMin &&
				element.cost <= filterMax &&
				element.category.includes(filterCategory)) {

				// Ajout du jeu filtré à la liste HTML
				content += `
                    <div class="item">
                        <h3>${element.name}</h3>
                        <p class="price">${element.cost} USD</p>
                        <p>Category: ${element.category}</p>
                        <button onclick="deleteGame(${element.idgames}).then(updateGames)">Delete</button>
                        <button onclick="showEditForm(${element.idgames}, '${element.name}', ${element.cost}, '${element.category}')">Edit</button>
                    </div>
                `;
			}
		});

		// Affichage des jeux filtrés dans le conteneur HTML
		document.getElementById("items").innerHTML = content;
	}).fail((error) => {
		// Gestion des erreurs lors de la récupération des jeux
		console.error("Error fetching games:", error);
	});

	// Mise à jour des plages de prix dans les champs de filtre
	document.getElementById('price-min').min = minCost;
	document.getElementById('price-min').max = maxCost;
	document.getElementById('price-max').min = minCost;
	document.getElementById('price-max').max = maxCost;
}

// Fonction pour afficher le formulaire d'édition d'un jeu
function showEditForm(id, name, cost, category) {
	document.getElementById("edit-id").value = id; // Remplir l'ID de l'item à éditer
	document.getElementById("edit-name").value = name; // Remplir le nom de l'item
	document.getElementById("edit-cost").value = cost; // Remplir le prix de l'item
	document.getElementById("edit-category").value = category; // Remplir la catégorie de l'item
	document.getElementById("edit-modal").style.display = "block"; // Afficher la modale
}

// Fonction pour masquer le formulaire d'édition
function hideEditForm() {
	document.getElementById("edit-modal").style.display = "none"; // Masquer la modale
}

// Mise à jour des jeux toutes les 2 secondes
setInterval(updateGames, 2000);

// Lors du chargement de la page, mettre à jour la liste des jeux
document.addEventListener("DOMContentLoaded", updateGames);

// Initialisation des filtres de prix au chargement de la page
window.onload = function() {
	updateGames();
	document.getElementById('price-min').min = minCost; // Prix minimum
	document.getElementById('price-min').value = minCost; // Valeur du prix minimum
	document.getElementById('price-min').max = maxCost; // Prix maximum
	document.getElementById('price-max').min = minCost; // Prix minimum
	document.getElementById('price-max').max = maxCost; // Prix maximum
	document.getElementById('price-max').value = maxCost; // Valeur du prix maximum
};