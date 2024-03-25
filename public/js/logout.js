document
    .getElementById("logoutLink")
    .addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default anchor tag behavior

        fetch("/logout", {
            method: "POST",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Logout request failed");
                }
                window.location.href = "/"; // Redirect to the Login
            })
            .catch((error) => {
                // Handle network error or request failure
                console.error("Logout failed:", error);
            });
    });
