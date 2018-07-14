$(getStarted);

function getStarted() {
  requestDatabaseItems();
  requestDeleteItem();
  requestEditItem();
  requestViewItem();
}

function reload() {
  location.reload();
}

function requestDatabaseItems() {
  let list = [];
  let filteredList = [];

  $(".search-keywords").keyup(function() {
    getFilteredItems();
  });

  getRequest();

  function getRequest() {
    const query = {
      url: "/list",
      method: "GET",
      success: renderDatabaseItems
    };
    $.ajax(query);
  }

  function renderDatabaseItems(res) {
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
      generateListItem(item, index);
      list.push(item);
    });
  }

  function generateListItem(item, index) {
    const className = index % 2 == 0 ? "gray" : "";

    // shorten url
    let string = `${item.link}`;
    let sliced = string.substring(0, 22);

    return $(".list").append(
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
  }

  function getFilteredItems() {
    filteredList = list.filter(textMatch);
    generateFilteredList();
  }

  function generateFilteredList() {
    $(".list").empty();

    filteredList.forEach((item, index) => {
      generateListItem(item, index);
    });
  }

  function textMatch(item) {
    let searchTerm = $(".search-keywords")
      .val()
      .toLowerCase();
    itemText = (
      item.name +
      item.state +
      item.requirements.age +
      item.requirements.citizenship +
      item.position +
      item.link
    ).toLowerCase();
    return itemText.indexOf(searchTerm) !== -1;
  }
}

function requestDeleteItem() {
  let itemId = "";
  let itemName = "";

  $(".list").on("click", ".fa-trash-alt", event => {
    itemId = $(event.target)
      .parent()
      .parent()
      .attr("id");
    itemName = $(event.target)
      .parent()
      .siblings("span.name")
      .text();

    $(".warningConfirm").empty();
    $(".warningConfirm").append(`
    <span class="confirmMessage">Remove item: ${itemName}?</span>
    <div>
    <button class="js-delete-confirm" value="js-form">Confirm</button>
    <button class="js-delete-abort">Cancel</button>
    </div>
    `);
  });

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
  });

  $(".warningConfirm").on("click", ".js-delete-abort", () => {
    reload();
  });

  function confirmDeleteMessage(itemId) {
    $(".list").empty();
    requestDatabaseItems();

    $(".warningConfirm").append(
      `<span class="success">Successfully deleted item ID ${
        this.headers.id
      }</span>`
    );

    $(".success")
      .delay(2000)
      .fadeTo(800, 0, () => {
        $(".warningConfirm").empty();
      });
  }
}

function requestEditItem() {
  let itemId = "";

  $(".list").on("click", ".fa-pencil-alt", event => {
    $(".warningConfirm").empty();
    $(".topDiv").hide();
    $(".listWrapper").hide();
    $(".updateWrapper").show();
    $(".js-form-submit").show();
    $(".js-form-reset").show();

    $(".warningConfirm")
      .append(
        `
      <i class="far fa-arrow-alt-circle-left fa-2x"></i>
      `
      )
      .css("flex-direction", "row");

    itemId = $(event.target)
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

  $(".list").on("click", ".fa-eye", event => {
    $(".topDiv").hide();
    $(".listWrapper").hide();
    $(".js-form-submit").hide();
    $(".js-form-reset").hide();
    $(".updateWrapper").show();
    $('.js-form-edit').show();

    $(".warningConfirm")
      .append(
        `
      <i class="far fa-arrow-alt-circle-left fa-2x"></i>
      `
      )
      .css("flex-direction", "row");

    itemId = $(event.target)
      .parent()
      .parent()
      .attr("id");

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

    const query = {
      url: `/list/${itemId}`,
      method: "GET",
      success: insertFormData
    };
    $.ajax(query);
  });

  $('.js-form-edit').on('click', event => {
    event.preventDefault();
    $("#position").prop("readonly", false);
    $("#name").prop("readonly", false);
    $("#link").prop("readonly", false);
    $("#state").prop("readonly", false);
    $("#age").prop("readonly", false);
    $("#salary").prop("readonly", false);
    $("#description").prop("readonly", false);
    $("#citizen-yes").prop("disabled", false);
    $("#citizen-no").prop("disabled", false);
    $("#highschool").prop("disabled", false);
    $("#associate").prop("disabled", false);
    $("#bachelor").prop("disabled", false);
    $("#masters").prop("disabled", false);
    $("#doctorate").prop("disabled", false);

    $('.js-form-edit').hide();
    $(".js-form-submit").show();
    $(".js-form-reset").show().html('Abort');
  });

  $(".js-form-submit").on("click", event => {
    event.preventDefault();
    // fetchInput & validateInput get shared by index & portal from validateInput.js
    let input = fetchInput();
    let validated = validateInput(input);

    if (validated) {
      requestUpdateDatabase(input, itemId);
    }
  });

  $(".js-form-reset").on("click", event => {
    $(".topDiv").show();
    $(".listWrapper").show();
    $(".updateWrapper").hide();
    $(".js-form-submit").hide();
    $(".js-form-reset").hide();
    $(".list").empty();
    $(".warningConfirm").empty();
    requestDatabaseItems();
  });

  function requestUpdateDatabase(input, itemId) {
    const query = {
      url: `/update/${itemId}`,
      method: "PUT",
      contentType: "application/json",
      headers: {
        id: itemId
      },
      data: JSON.stringify({
        id: itemId,
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
    $(".viewing")
      .text(`Updated item #${this.headers.id} in database`)
      .css("color", "green")
      .delay(2000)
      .fadeTo(800, 0, () => {
        $(".viewing")
          .text(`Viewing Item ID: ${this.headers.id}`)
          .css("color", "black")
          .css("opacity", "1");
      });
  }
}

function requestViewItem() {
  let itemId = "";

  

  $(".warningConfirm").on("click", ".fa-arrow-alt-circle-left", event => {
    $(".updateWrapper").hide();
    $(".topDiv").show();
    $(".listWrapper").show();

    $(".warningConfirm")
      .empty()
      .css("flex-direction", "column");

    $('.list').empty()
    requestDatabaseItems()
  });
}

function insertFormData(res) {
  $(".warningConfirm").append(`<span class="viewing">Viewing Item ID: ${res.id}</span>`);

  $("#position").val(`${res.position}`);
  $("#name").val(`${res.name}`);
  $("#link").val(`${res.link}`);
  $("#state").val(`${res.state}`);
  $("#age").val(`${res.requirements.age}`);
  $("#salary").val(`${res.salary}`);
  $("#description").val(`${res.description}`);

  // pre-set citizenship radio button
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
}
