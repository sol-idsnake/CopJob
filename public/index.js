$(showDatabase)

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
		const className = index % 2 == 0 ? 'gray' : '';
		$('.list').append(`<li class=${className}>${item.name}</li>`);
	})

	$('.sort').on('click', function(res, index) {
		res.sort()
	})
}