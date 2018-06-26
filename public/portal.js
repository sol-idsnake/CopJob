console.clear()

$(formSubmitListener)

function formSubmitListener() {

	$('.js-form').submit(event => {
		console.log('Form Submit')
		event.preventDefault()

		fetchInput()
	})

}

function fetchInput() {
	console.log('Fetching Input')
}