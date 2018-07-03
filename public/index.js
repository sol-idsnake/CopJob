$(displaySite);

function displaySite() {
  showDatabase();
  deleteItem();
}

function showDatabase() {
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
    // console.log(item.link)
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

function deleteItem() {
  $(".list").on("click", ".fa-trash-alt", event => {
    const itemId = $(event.currentTarget)
      .parent()
      .attr("id");
    const itemName = $(event.currentTarget)
      .siblings("span.name")
      .text();

    confirmDelete(itemName, itemId);
  });
}

function confirmDelete(itemName, itemId) {
  console.log(itemId);
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
      success: renderConfirm
    };
    $.ajax(query);
    reload();
  });

  $(".warningConfirm").on("click", ".js-delete-abort", () => {
    $(".warningConfirm").empty();
  });
}

function renderConfirm(itemId) {
  $(".warningConfirm")
    .append(
      `<span class="success">Successfully deleted item ID ${
        this.headers.id
      }</span>`
    )
    .delay(2000)
    .fadeTo(800, 0);
}

function reload() {
  $(".list").empty();
  showDatabase();
}
