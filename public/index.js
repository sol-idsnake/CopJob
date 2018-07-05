$(displaySite);

function displaySite() {
  requestDatabaseItems();
  requestDeleteItem();
  requestUpdateItem();
  requestViewItem();
}

function requestDatabaseItems() {
  const query = {
    url: "/list",
    method: "GET",
    success: renderDatabaseItem
  };
  $.ajax(query);
}

function renderDatabaseItem(res) {
  $(".list").append(`
		<li class="tab">
		<span class="name">Name</span>
		<span class="state">State</span>
		<span class="age">Age</span>
		<span class="citizenship">Citizenship?</span>
		<span class="position">Position</span>
		<span class="link">Link</span>
		</li>
		`);

  res.forEach((item, index) => {
    // ternary: if index divisible by 2, set className to gray
    const className = index % 2 == 0 ? "gray" : "";

    // shorten url
    let string = `${item.link}`;
    let sliced = string.substring(0, 22);

    $(".list").append(
      `<li class="${className}" id="${item.id}">
      <span class="name">${item.name}</span>
      <span class="state">${item.state}</span>
      <span class="age">${item.requirements.age}</span>
      <span class="citizenship">${item.requirements.citizenship}</span>
      <span class="position">${item.position}</span>
      <span class="link"><a href="//${
        item.link
      }" target="_blank">${sliced}...</a></span>
      <span class="actions">
      <i class="fas fa-eye"></i>
      <i class="fas fa-pencil-alt"></i>
      <i class="fas fa-trash-alt"></i>
      </span>
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

function confirmDeleteItem(itemName, itemId) {
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
  $(".list").on("click", ".fa-pencil-alt", event => {
    $(".listWrapper").hide();
    $(".updateWrapper").show();

    const itemId = $(event.currentTarget)
      .parent()
      .parent()
      .attr("id");
      console.log(itemId)
    const query = {
      url: `/list/${itemId}`,
      method: "GET",
      success: insertFormData
    };
    $.ajax(query);
  });
}

function insertFormData(res) {
  $(".warningConfirm").append(`<span>Reviewing Item ID: ${res.id}</span>`);
  $("#position").val(`${res.position}`);
  $("#name").val(`${res.name}`);
  $("#link").val(`${res.link}`);
  $("#state").val(`${res.state}`);
  $("#age").val(`${res.requirements.age}`);
  $("#salary").val(`${res.salary}`);
  $("#description").val(`${res.description}`);

  // pre-set citizenship radtio button
  if (res.requirements.citizenship === "yes") {
    $("#citizen-yes").prop("checked", true);
  } else {
    $("#citizen-no").prop("checked", true);
  }

  // pre-set degree radio button
  if (res.requirements.degree === "High School degree required") {
    $("#highschool").prop("checked", true);
  } else if (
    res.requirements.degree === "Associate's degree required (2-years)"
  ) {
    $("#associate").prop("checked", true);
  } else if (res.requirements.degree === "Bachelor degree required (4-years)") {
    $("#bachelor").prop("checked", true);
  } else if (res.requirements.degree === "Master's degree required") {
    $("#masters").prop("checked", true);
  } else if (res.requirements.degree === "PhD required") {
    $("#doctorate").prop("checked", true);
  }

  $(".js-form-reset").on("click", event => {
    event.preventDefault();
    $(".warningConfirm").empty();
    $(".updateWrapper").empty();
    $(".listWrapper").show();
    reload();
  });

  $(".js-form-submit").on("click", event => {
    event.preventDefault();

    // fetchInput & validateInput get shared by index & portal from validateInput.js
    let input = fetchInput();
    let validated = validateInput(input);
    if (validated) {
      requestUpdateDatabase(input, res);
    }
  });
}

function requestUpdateDatabase(input, res) {
  const query = {
    url: `/update/${res.id}`,
    method: "PUT",
    contentType: "application/json",
    headers: {
      id: `${res.id}`
    },
    data: JSON.stringify({
      id: `${res.id}`,
      position: input.position,
      name: input.name,
      link: input.link,
      state: input.state,
      requirements: {
        age: input.requirements.age,
        citizenship: input.requirements.citizenship,
        degree: input.requirements.degree
      },
      salary: input.salary,
      description: input.description
    }),
    success: confirmUpdate
  };
  $.ajax(query);
}

function confirmUpdate() {
  $(".warningConfirm")
    .empty()
    .append(
      `
		<span class="success">Updated item #${this.headers.id} in database</span>
		`
    )
    .delay(2000)
    .fadeTo(800, 0);
  $(".updateWrapper").hide();
  $(".listWrapper").show();
  reload();
}

function requestViewItem() {
  $(".list").on("click", ".fa-eye", event => {
    event.preventDefault();
    $(".listWrapper").hide();
    $(".updateWrapper").show();
    $(".warningConfirm").append("<span>View only</span>");
    $(".js-form-submit").hide();
    $(".js-form-reset").hide();

    $("#position").prop("readonly", true);
    $("#name").prop("readonly", true);
    $("#link").prop("readonly", true);
    $("#state").prop("readonly", true);
    $("#age").prop("readonly", true);
    $("#salary").prop("readonly", true);
    $("#description").prop("readonly", true);
    $("#citizen-yes").prop("disabled", true);
    $("#citizen-no").prop("disabled", true);
    $("#highschool").prop("disabled", true);
    $("#associate").prop("disabled", true);
    $("#bachelor").prop("disabled", true);
    $("#masters").prop("disabled", true);
    $("#doctorate").prop("disabled", true);

    const itemId = $(event.currentTarget)
      .parent()
      .parent()
      .attr("id");
    const query = {
      url: `/list/${itemId}`,
      method: "GET",
      success: insertFormData
    };
    $.ajax(query);
  });
}

function reload() {
  $(".list").empty();
  requestDatabaseItems();
}
