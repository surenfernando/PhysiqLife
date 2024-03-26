function openModal(partialFileName) {
    // Select the modal content element
    var modalContent = document.getElementById('modalContent');

    // Load the content based on the partial file name
    modalContent.innerHTML = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            modalContent.innerHTML = this.responseText;
        }
    };
    xhttp.open("GET", `/partials/${partialFileName}.ejs`, true);
    xhttp.send();

    // Show the modal backdrop
    document.getElementById('modalBackdrop').classList.remove('hidden');
}

function closeModal() {
    // Hide the modal backdrop
    document.getElementById('modalBackdrop').classList.add('hidden');
}