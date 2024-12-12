function getGames() {
	return $.ajax({
		url: '/api/games',
		type: 'get'
	});
}

function addGame(game) {
	return $.ajax({
		url: '/api/register',
		type: 'post',
		contentType: 'application/json',
		data: JSON.stringify(game)
	});
}

function deleteGame(id) {
	return $.ajax({
		url: `/api/delete/${id}`,
		type: 'delete'
	});
}

function editGame(updatedGame) {
	return $.ajax({
		url: `/api/edit`,
		type: 'put',
		contentType: 'application/json',
		data: JSON.stringify(updatedGame)
	});
}

function updateGames() {
	getGames().done((items) => {
		let content = "";
		items.forEach(element => {
			content += `
				<div class="item">
					<h3>${element.name}</h3>
					<p class="price">${element.cost} USD</p>
					<p>Category: ${element.category}</p>
					<button onclick="deleteGame(${element.idgames}).then(updateGames)">Delete</button>
					<button onclick="showEditForm(${element.idgames}, '${element.name}', ${element.cost}, '${element.category}')">Edit</button>
				</div>
			`;
		});
		document.getElementById("items").innerHTML = content;
	}).fail((error) => {
		console.error("Error fetching games:", error);
	});
}

function showEditForm(id, name, cost, category) {
	document.getElementById("edit-id").value = id;
	document.getElementById("edit-name").value = name;
	document.getElementById("edit-cost").value = cost;
	document.getElementById("edit-category").value = category;
	document.getElementById("edit-modal").style.display = "block";
}

function hideEditForm() {
	document.getElementById("edit-modal").style.display = "none";
}

setInterval(updateGames, 2000);
document.addEventListener("DOMContentLoaded", updateGames);