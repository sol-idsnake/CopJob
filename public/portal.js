console.clear()

$(formSubmitListener)

function formSubmitListener() {

	$('.js-form').submit(event => {
		event.preventDefault()

		let input = fetchInput()
		validateInput(input)
		// call function to make ajax resquest
		if (true) {
			serverCall()
		}
	})
}

function fetchInput() {
	console.log('Fetching Input')

	const position = $('#position').val()
	const name = $('#name').val()
	const link = $('#link').val()
	const state = $('#state').val()
	const age = $('#age').val()

	let citizenship = 'yes'
	if ($('#citizen-no').is(':checked')) {
			citizenship = 'no'
		}

	let degree = 'High School degree required'
	if ($('#associate').is(':checked')) {
		degree = "Associate's degree required (2-years)"
	} else if ($('#bachelor').is(':checked')) {
		degree = 'Bachelor degree required (4-years)'
	} else if ($('#masters').is(':checked')) {
		degree = "Master's degree required"
	} else if ($('#doctorate').is(':checked')) {
		degree = "PhD required"
	}

	const salary = $('#salary').val()
	const description = $('#description').val()

	const departmentArray = {position, name, link, state, age, citizenship, degree, salary, description}
	return departmentArray
}

function validateInput(departmentObject) {
	console.log('Validating Input')
	let isValid = true
	const array = Object.keys(departmentObject)

	for(let i=0; i < array.length; i++) {
		keyname = array[i]
		if (departmentObject[keyname] === '') {
			// store error message object
			const errorMsg = `Missing ${keyname} on form`

			isValid = false
			// make css error message available on page
			$()
		}
	}
	return isValid
}
