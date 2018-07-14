$(formSubmitListener);

function formSubmitListener() {
  $(".js-form-submit").on("click", event => {
    event.preventDefault();

    let input = fetchInput();
    let valid = validateInput(input);

    // call function to make ajax resquest
    if (valid) {
      serverCall(input, renderInput);
    } else {
      console.log("Input can't be validated");
    }
  });

  $(".js-form-reset").on("click", event => {
    event.preventDefault();
    resetForm();
  });
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
        age: departmentObject.requirements.age,
        citizenship: departmentObject.requirements.citizenship,
        degree: departmentObject.requirements.degree
      },
      salary: departmentObject.salary,
      description: departmentObject.description
    }),
    success: callback
  };
  $.ajax(query);
}

function renderInput() {
  resetForm();

  $(".success").fadeTo(0, 1, function() {
    $(".success")
      .delay(2000)
      .fadeTo(800, 0);
  });
}

function resetForm() {
  $("#position").val("");
  $("#name").val("");
  $("#link").val("");
  $("#state").val("");
  $("#age").val("");
  $("#citizen-yes").prop("checked", false);
  $("#citizen-no").prop("checked", false);
  $("#associate").prop(":checked", false);
  $("#bachelor").prop(":checked", false);
  $("#masters").prop(":checked", false);
  $("#doctorate").prop(":checked", false);
  $("#salary").val("");
  $("#description").val("");
}
