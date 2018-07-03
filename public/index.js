$(displaySite);

function displaySite() {
  requestDatabaseItems();
  requestDeleteItem();
  requestUpdateItem();
}

function requestDatabaseItems() {
  const query = {
    url: "/list",
    method: "GET",
    success: renderDatabase
  };
  $.ajax(query);
}

function renderDatabase(res) {
  console.log(res);
  res.forEach((item, index) => {
    // ternary: if index divisible by 2, set className to gray
    const className = index % 2 == 0 ? "gray" : "";

    // shorten url
    let string = `${item.link}`;
    let sliced = string.substring(0, 15);

    $(".list").append(
      `<li class="${className}" id="${item.id}">
      <span class="name">${item.name}</span>
      <span class="state">${item.state}</span>
      <span class="position">${item.position}</span>
      <span class="link"><a href="//${
        item.link
      }" target="_blank">${sliced}...</a></span>
      <i class="fas fa-pencil-alt"></i>
      <i class="fas fa-trash-alt"></i>
      </li>`
    );
  });
}

function requestDeleteItem() {
  $(".list").on("click", ".fa-trash-alt", event => {
    const itemId = $(event.currentTarget)
      .parent()
      .attr("id");
    const itemName = $(event.currentTarget)
      .siblings("span.name")
      .text();

    confirmDeleteItem(itemName, itemId);
  });
}

function confirmDeleteItem (itemName, itemId) {
  $(".warningConfirm").append(`
		<span class="confirmMessage">Remove item: ${itemName}?</span>
		<div>
      <button class="js-delete-confirm" value="js-form">Confirm</button>
      <button class="js-delete-abort">Cancel</button>
    </div>
		`);

  $(".warningConfirm").on("click", ".js-delete-confirm", () => {
    $(".warningConfirm").empty();
    const query = {
      url: `/delete/${itemId}`,
      method: "DELETE",
      headers: {
        id: `${itemId}`
      },
      success: confirmDeleteMessage
    };
    $.ajax(query);
    reload();
  });

  $(".warningConfirm").on("click", ".js-delete-abort", () => {
    $(".warningConfirm").empty();
  });
}

function confirmDeleteMessage(itemId) {
  $(".warningConfirm")
    .append(
      `<span class="success">Successfully deleted item ID ${
        this.headers.id
      }</span>`
    )
    .delay(2000)
    .fadeTo(800, 0);
}

function requestUpdateItem() {
	$('.list').on('click', '.fa-pencil-alt', event => {
		$('.listWrapper').hide()
		$('.updateWrapper').show()
		
		const itemId = $(event.currentTarget)
			.parent()
			.attr("id");
		const query = {
			url: `/list/${itemId}`,
			method: "GET",
			success: insertFormData
		};
		$.ajax(query)
	})
}

function insertFormData(res) {
	console.log(res)
	$('.warningConfirm').append(`Reviewing Item ID: ${res.id}`)
	$('#position').val(`${res.position}`)
	$('#name').val(`${res.name}`)
	$('#link').val(`${res.link}`)
	$('#state').val(`${res.state}`)
	$('#age').val(`${res.requirements.age}`)
	$('#salary').val(`${res.salary}`)
	$('#description').val(`${res.description}`)

	// pre-set citizenship radtio button
	if (res.requirements.citizenship === "yes") {
		$("#citizen-yes").prop("checked", true)
	} else {
		$("#citizen-no").prop("checked", true)
	}

	// pre-set degree radio button
	if (res.requirements.degree === "High School degree required") {
		$('#highschool').prop("checked", true)
	} else if (res.requirements.degree === "Associate's degree required (2-years)") {
		$("#associate").prop("checked", true)
	} else if (res.requirements.degree === "Bachelor degree required (4-years)") {
		$("#bachelor").prop("checked", true)
	} else if (res.requirements.degree === "Master's degree required") {
		$("#masters").prop("checked", true)
	} else if (res.requirements.degree === "PhD required") {
		$("#doctorate").prop("checked", true)
	}

	$('.js-form-reset').on('click', event => {
		event.preventDefault()
		$('.warningConfirm').empty()
		$('.updateWrapper').empty()
		$('.listWrapper').show()
		reload()
	})

	formSubmitListener()
	inner(res)

	
}

function inner(res) {
	console.log(res)
}

function reload() {
  $(".list").empty();
  requestDatabaseItems();
}
