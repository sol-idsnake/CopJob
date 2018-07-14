function fetchInput() {
  console.log("Fetching Input");

  const position = $("#position").val();
  const name = $("#name").val();
  const link = $("#link").val();
  const state = $("#state").val();
  const age = $("#age").val();

  let citizenship = "";
  if ($("#citizen-no").is(":checked")) {
    citizenship = "no";
  } else if ($("#citizen-yes").is(":checked")) {
    citizenship = "yes";
  }

  let degree = "";
  if ($("#highschool").is(":checked")) {
    degree = "High School degree required";
  } else if ($("#associate").is(":checked")) {
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
    requirements: {
      age,
      citizenship,
      degree
    },
    salary,
    description
  };
  return departmentObject;
}

function validateInput(departmentObject) {
  $(".warningDiv").empty();
  let isValid = false;
  let missingBoxes = [];

  departmentObjectCheck(departmentObject);
  // recursive function to iterate over all items and sub-items in departmentObject; checks if any input is empty
  function departmentObjectCheck(departmentObject) {
    let keys = Object.keys(departmentObject);
    for (let i = 0; i < keys.length; i++) {
      if (departmentObject[keys[i]] !== "") {
        // If object in departmentObject is another object, call departmentObjectCheck recursively
        if (departmentObject[keys[i]].constructor === {}.constructor) {
          departmentObjectCheck(departmentObject[keys[i]]);
        }

        $(`#${keys[i]}`).removeClass("warningBox");
        isValid = true;
      } else {
        missingBoxes.push(keys[i]);
        $(`#${keys[i]}`).addClass("warningBox");
        isValid = false;
      }
    }
  }

  missingBoxes.forEach(item => {
    $(".warningDiv").append(`<span>* ${item} field missing</span>`);
  });

  let isValidState = false;
  let states = [
    "ak",
    "al",
    "az",
    "ar",
    "ca",
    "co",
    "ct",
    "de",
    "fl",
    "ga",
    "hi",
    "id",
    "il",
    "in",
    "ia",
    "ks",
    "ky",
    "la",
    "me",
    "md",
    "ma",
    "mi",
    "mn",
    "ms",
    "mo",
    "mt",
    "ne",
    "nv",
    "nh",
    "nj",
    "nm",
    "ny",
    "nc",
    "nd",
    "oh",
    "ok",
    "or",
    "pa",
    "ri",
    "sc",
    "sd",
    "tn",
    "tx",
    "ut",
    "vt",
    "va",
    "wa",
    "wv",
    "wi",
    "wy",
    "alabama",
    "alaska",
    "arizona",
    "arkansas",
    "california",
    "colorado",
    "connecticut",
    "delaware",
    "florida",
    "georgia",
    "hawaii",
    "idaho",
    "illinois",
    "indiana",
    "iowa",
    "kansas",
    "kentucky",
    "louisiana",
    "maine",
    "maryland",
    "massachusetts",
    "michigan",
    "minnesota",
    "mississippi",
    "missouri",
    "montana",
    "nebraska",
    "nevada",
    "new hampshire",
    "new jersey",
    "new mexico",
    "new york",
    "north carolina",
    "north dakota",
    "ohio",
    "oklahoma",
    "oregon",
    "pennsylvania",
    "rhode island",
    "south carolina",
    "south dDakota",
    "tennessee",
    "texas",
    "utah",
    "vermont",
    "virginia",
    "washington",
    "west virginia",
    "wisconsin",
    "wyoming"
  ];
  // check if user's state input equal state abbreviation in 'states' array
  // set 'isValidState' to true if it does
  for (let i = 0; i < states.length; i++) {
    if (
      $("#state")
        .val()
        .toLowerCase() == states[i]
    ) {
      isValidState = true;
      isValid = true;
    }
  }

  // If user input for state does not match state abbreviation from dropwdown, throw error
  if (!isValidState) {
    $(".warningDiv").append(
      `<span class='state-warning'>check state field for error</span>`
    );
    isValid = false;
    return;
  } else {
    isValid = true;
    $(".warningDiv")
      .find(".state-warning")
      .remove();
  }

  if (
    missingBoxes.length == 0 &&
    isValidState &&
    $(".warningDiv").html() === ""
  ) {
    return isValid;
  }
}
