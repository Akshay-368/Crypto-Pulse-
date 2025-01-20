document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.getElementById("spinner");
    const dashboard = document.getElementById("dashboard");

    // delay of 2 seconds
    setTimeout(() => {
        spinner.classList.add("hidden"); 
        dashboard.classList.remove("hidden"); 
    }, 2000);
});
