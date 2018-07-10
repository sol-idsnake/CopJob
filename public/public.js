$(getStarted);

function getStarted() {
	navigateWindows();
  showAllJobs();
}

function showAllJobs() {
  let list = [],
    filteredList = [],
    maxDisplayLimit = 10;

  $(".search-keywords").keyup(function() {
    getFilteredItems();
	  generateCountMessage();
  });

  requestDatabaseItems();
  getFilteredItems();

  function requestDatabaseItems() {
    const query = {
      url: "/list",
      method: "GET",
      success: renderDatabaseItems
    };
    $.ajax(query);
  }

  function renderDatabaseItems(res) {
    res.forEach(item => {
    	generateListItem(item)
      list.push(item);
    });
    $('.counter').append(`
  		Showing ${res.length} out of ${res.length} items
  		`)
  }

	function generateCountMessage() {
	  var msg = "";
	  let matches = filteredList.length;
	  switch (true) {
	    case matches === 0:
	      msg = "No matches found";
	      break;
	    case matches === 1:
	      msg = "Showing 1 item";
	      break;
	    case matches <= maxDisplayLimit:
	      msg = "Showing " + filteredList.length + " items";
	      break;
	    default:
	      msg = "Showing " + maxDisplayLimit + " of " + matches + " items";
	  }
	  $('.counter').text(msg);
	}

  function getFilteredItems() {
    filteredList = list.filter(textMatch);
    generateList();
  }

  function textMatch(item) {
    let searchTerm = $(".search-keywords")
      .val()
      .toLowerCase();
    itemText = (
      item.position +
      item.name +
      item.link +
      item.state +
      item.salary +
      item.description
    ).toLowerCase();
    return itemText.indexOf(searchTerm) !== -1;
  }

  function generateList() {
    $(".listItems").empty();
    for (var i = 0; i < filteredList.length; i++) {
      var item = filteredList[i];
      generateListItem(item);
    }
  }

  function generateListItem(item) {
    return $(".listItems").append(`
  		<li class="listItem">
				<span class="name">${item.name}</span>
				<span class="position">Position: ${item.position}</span>
				<span class="state">State: ${item.state}</span>
				<span class="salary">Salary: ${item.salary}</span>
				<span class="link">Link: <a href="${item.link}">${item.link}</a></span>
				<span class="description">Job description:</span>
				<span class="descriptionText"> ${item.description}</span>
			</li>
  		`);
  }
}

function navigateWindows() {
	$('.allSpan').on('click', function() {
		$('.welcome').hide()
		$('.jobSelector').hide()
		$('.allJobsSection').css('display', 'flex')
		$('.topDiv').css('display', 'grid')
	})
}