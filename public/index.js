$(displaySite)

function displaySite() {
	showDatabase()
	deleteItem()
}

function showDatabase() {
	const query = {
		url: "/list",
		method: "GET",
		success: renderDatabase
	};
	$.ajax(query)
}

function renderDatabase(res) {
	console.log(res)
  res.forEach((item, index) => {
    // ternary: if index divisible by 2, set className to gray
    const className = index % 2 == 0 ? "gray" : "";
    $(".list").append(
      `<li class="${className}" id="${item.id}">
      <span class="name">${item.name}</span>
      <span class="state">${item.state}</span>
      <span class="position">${item.position}</span>
      <span class="link">${item.link}</span>
      <i class="fas fa-trash-alt"></i>
      <i class="fas fa-pencil-alt"></i>
      </li>`
    );
  });
}

function deleteItem() {
	$('.list').on('click', '.fa-trash-alt', event => {
		const itemId = $(event.currentTarget).parent().attr('id');
		const itemName = $(event.currentTarget).siblings('span.name').text()

		let confirmRemoval = false
		confirmDelete(itemName)

		if (confirmRemoval) {
			const query = {
				url: `/delete/${itemId}`,
				method: "DELETE",
				headers: {
					id: `${itemId}`
				},
				success: renderConfirm
			};
			$.ajax(query);
			reload()
		}
	})
}

function renderConfirm(itemId) {
	$('.warningConfirm').append(`Successfully deleted item ID ${this.headers.id}`).delay(2000).fadeTo(800, 0)
}

function confirmDelete(itemName) {
	$('.warningConfirm').append(`
		<span class="confirmMessage">Remove item: ${itemName}?</span>
		<div class="controls">
      <button class="js-delete-confirm" value="js-form">Confirm</button>
      <button class="js-delete-abort">Cancel</button>
    </div>
		`)
	
}

function reload() {
	$('.list').empty()
	showDatabase()
}