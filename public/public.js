$(getStarted)

function getStarted() {
	showAllJobs()
}

function showAllJobs() {
	$('.allSpan').on('click', () => {
		$('.welcome').hide()
		$('.jobSelector').hide()
		$('.allJobsSection').show()
		$('.topDiv').css('display', 'flex')


		const query = {
	    url: "/list",
	    method: "GET",
	    success: renderDatabaseItems
	  };
	  $.ajax(query);
	})
}

function renderDatabaseItems(res) {
	res.forEach(item => {
		$('.listItems').append(`
				<li class="listItem">
				<span class="name">${item.name}</span>
				<span class="position">Position: ${item.position}</span>
				<span class="state">State: ${item.state}</span>
				<span class="salary">Salary: ${item.salary}</span>
				<span class="link">Link: <a href="${item.link}">${item.link}</a></span>
				<span class="description">Job description:</span>
				<span class="descriptionText"> ${item.description}</span>
				</li>
			`)
	})

	$('.topDiv').append(`<span class="deptCount">Total departments in database: ${res.length}</span>`)
}