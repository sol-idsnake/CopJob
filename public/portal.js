$(formSubmitListener);

function formSubmitListener() {
  $(".js-form").submit(event => {
    event.preventDefault();

    let input = fetchInput();
    validateInput(input);
    // call function to make ajax resquest
    if (true) {
      // serverCall()
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

  const departmentArray = {
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
  return departmentArray;
}

function validateInput(departmentArray) {
  console.log("Validating Input");
  let isValid = true;
  let missingBoxes = [];
  const array = Object.keys(departmentArray);

  // add missing elements to missingBoxes and show a red border on missing field
  for (let i = 0; i < array.length; i++) {
    keyname = array[i];
    if (departmentArray[keyname] !== "") {
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
  // If items in missingBoxes are found in the departmentArray, show warning span
  for (let i = 0; i < missingBoxes.length; i++) {
    if (missingBoxes[i] in departmentArray) {
      $(".warningDiv").append(
        `<span>* ${missingBoxes[i]} field missing</span>`
      );
    }
  }

  // Have to add a last check for whether all conditions are met before setting 'isValid' to true
  // This way we ensure that inputs have values or are selected.
  if (
    !$(".citizen").hasClass("warningBox") &&
    !$(".degree").hasClass("warningBox") & (missingBoxes.length === 0)
  ) {
    isValid = true;
  } else {
    isValid = false;
  }

  return isValid;
}
