$(formSubmitListener);

function formSubmitListener() {
  $(".js-form").submit(event => {
    event.preventDefault();

    let input = fetchInput();
    let valid = validateInput(input);

    // call function to make ajax resquest
    if (valid) {
      serverCall(input, renderInput);
    } else {
      console.log("trigger function for when ");
    }
  });
}

function fetchInput() {
  console.log("Fetching Input");

  const position = $("#position").val();
  const name = $("#name").val();
  const link = $("#link").val();
  const state = $("#state").val();
  const age = $("#age").val();

  let citizenship = "yes";
  if ($("#citizen-no").is(":checked")) {
    citizenship = "no";
  }

  let degree = "High School degree required";
  if ($("#associate").is(":checked")) {
    degree = "Associate's degree required (2-years)";
  } else if ($("#bachelor").is(":checked")) {
    degree = "Bachelor degree required (4-years)";
  } else if ($("#masters").is(":checked")) {
    degree = "Master's degree required";
  } else if ($("#doctorate").is(":checked")) {
    degree = "PhD required";
  }

  const salary = $("#salary").val();
  const description = $("#description").val();

  const departmentObject = {
    position,
    name,
    link,
    state,
    age,
    citizenship,
    degree,
    salary,
    description
  };
  return departmentObject;
}

function validateInput(departmentObject) {
  console.log("Validating Input");
  let isValid = true;
  let missingBoxes = [];
  const array = Object.keys(departmentObject);

  // add missing elements to missingBoxes and show a red border on missing field
  for (let i = 0; i < array.length; i++) {
    keyname = array[i];
    if (departmentObject[keyname] !== "") {
      $(`#${keyname}`).removeClass("warningBox");
      isValid = true;
    } else {
      missingBoxes.push(keyname);
      $(`#${keyname}`).addClass("warningBox");
      isValid = false;
    }
  }

  // edge case => show warning on citizenship radio buttons if both left unchecked
  // Need the edge case because radio buttons can't be evaluated on empty values. If '' doesn't work.
  if ($("#citizen-yes").is(":checked") || $("#citizen-no").is(":checked")) {
    $(".citizen").removeClass("warningBox");
    isValid = true;
  } else if (
    !($("#citizen-yes").is(":checked") && $("#citizen-no").is(":checked"))
  ) {
    $(".citizen").addClass("warningBox");
    missingBoxes.push("citizenship");
    isValid = false;
  }

  // edge case => show warning on degree radio buttons if all left unchecked
  // Need the edge case because radio buttons can't be evaluated on empty values. If '' doesn't work.
  if (
    $("#highschool").is(":checked") ||
    $("#associate").is(":checked") ||
    $("#bachelor").is(":checked") ||
    $("#masters").is(":checked") ||
    $("#doctorate").is(":checked")
  ) {
    $(".degree").removeClass("warningBox");
    isValid = true;
  } else {
    $(".degree").addClass("warningBox");
    missingBoxes.push("degree");
    isValid = false;
  }

  // remove all warning spans each validation function runs.
  $(".warningDiv").empty();
  // If items in missingBoxes are found in the departmentObject, show warning span
  for (let i = 0; i < missingBoxes.length; i++) {
    if (missingBoxes[i] in departmentObject) {
      $(".warningDiv").append(
        `<span>* ${missingBoxes[i]} field missing</span>`
      );
    }
  }

  let states = [
    "AK",
    "AL",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY"
  ];
  let isValidState = false
  // check if user's state input equal state abbreviation in 'states' array
  // set 'isValidState' to true if it does
  for (let i = 0; i < states.length; i++) {
  	if ($("#state").val() == states[i]) {
  		isValidState = true
  	}
  }
  
  // If user input for state does not match state abbreviation from dropwdown, throw error
  if (!isValidState) {
  	$(".warningDiv").append(
        `<span class='state-warning'>* Please select a valid state from the dropdown</span>`
      );
  } else {
  	$('.warningDiv').find('.state-warning').remove();
  }

  // Have to add a last check to confirm that all conditions are met before setting 'isValid' to true
  // This way we ensure that inputs have values AND are selected.
  if (
    !$(".citizen").hasClass("warningBox") &&
    !$(".degree").hasClass("warningBox") &&
    missingBoxes.length === 0
  ) {
    isValid = true;
  } else {
    isValid = false;
  }
  return isValid;
}

function serverCall(departmentObject, callback) {
  const query = {
    url: "/create",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      position: departmentObject.position,
      name: departmentObject.name,
      link: departmentObject.link,
      state: departmentObject.state,
      requirements: {
        age: departmentObject.age,
        citizenship: departmentObject.citizenship,
        degree: departmentObject.degree
      },
      salary: departmentObject.salary,
      description: departmentObject.description
    }),
    success: callback
  };
  $.ajax(query);
}

function renderInput() {
  console.log("success");
}
