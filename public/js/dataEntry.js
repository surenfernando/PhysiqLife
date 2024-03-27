function setCurrentDate() {
    // Get the current date in local time
    let currentDate = new Date();

    // Adjust the date to your local time zone
    currentDate.setMinutes(
        currentDate.getMinutes() - currentDate.getTimezoneOffset(),
    );

    // Convert the adjusted date to ISO 8601 format (YYYY-MM-DD)
    let isoDate = currentDate.toISOString();

    // Set the value of the hidden input field with id 'current-date' to the ISO date
    let currentDateInputs = document.querySelectorAll(".hidden-date");
    currentDateInputs.forEach((input) => {
        input.value = isoDate;
    });
}

// Call the setCurrentDate function when the document is loaded
document.addEventListener("DOMContentLoaded", setCurrentDate);
