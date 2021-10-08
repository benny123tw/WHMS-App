$('input[name="daterange"]').daterangepicker({
  disabledDates: [],
  disableHoliday: $("#passHoliday")[0].checked,
  timePicker: false,
  showDropdowns: true,
  ranges: {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
      moment().subtract(1, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ],
  },
  startDate: moment(),
  endDate: moment(),
  buttonClasses: "button",
  applyClass: "is-info is-small",
  cancelClass: "is-light is-small",
  alwaysShowCalendars: true,
  locale: {
    direction: $("#rtl").is(":checked") ? "rtl" : "ltr",
    format: "YYYY/MM/DD",
    separator: " ~ ",
    applyLabel: "Apply",
    cancelLabel: "Cancel",
    fromLabel: "From",
    toLabel: "To",
    customRangeLabel: "Custom",
    daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    firstDay: 0,
  },
});

$("#mdp").daterangepicker({
  multiDatesPicker: true,
  showDropdowns: true,
  buttonClasses: "button",
  applyClass: "is-info is-small",
  cancelClass: "is-light is-small",
  locale: {
    direction: $("#rtl").is(":checked") ? "rtl" : "ltr",
    format: "YYYY/MM/DD",
    separator: " ~ ",
    applyLabel: "Apply",
    cancelLabel: "Cancel",
    fromLabel: "From",
    toLabel: "To",
    customRangeLabel: "Custom",
    daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    firstDay: 1,
  },
});

$("#passHoliday")[0].onclick = function () {
  const passHoliday = this.checked;
  $('input[name="daterange"]').data("daterangepicker").disableHoliday =
    passHoliday;
};

var projectSelector, userSelector;
$("body").on("DOMNodeInserted", "success", function () {
  var $wrappers = $('div[name="selector-wrapper"]');
  $wrappers.each(function (idx, item) {
    item.classList.remove("is-loading");
  });
  var $select1 = $("#project-selector");
  $select1[0].classList.remove("input");
  $select1.selectize({
    allowEmptyOption: true,
  });
  projectSelector = $select1[0].selectize;

  var $select2 = $("#username-selector");
  $select2[0].classList.remove("input");
  $select2.selectize({
    allowEmptyOption: false,
  });
  userSelector = $select2[0].selectize;

  safeCheckSetup();
});

function safeCheckSetup() {
  const userList = document.querySelector("#username-selector");
  const saveBtn = document.querySelector("#save-btn");
  const inputDiv = document.querySelector(
    ".selectize-control .selectize-input.input"
  ); //first input = username

  saveBtn.disabled = true;
  inputDiv.classList.add("is-danger");

  userList.onchange = function () {
    console.log("change");
    if (!userList.value) {
      saveBtn.disabled = true;
      inputDiv.classList.add("is-danger");
    } else {
      saveBtn.disabled = false;
      inputDiv.classList.remove("is-danger");
      inputDiv.classList.add("is-success");
    }
  };
}
