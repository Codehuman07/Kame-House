let btn = document.getElementById("themeToggle");

let saved = localStorage.getItem("theme");
if (saved === "light") {
    document.body.classList.add("light-mode");
    btn.innerText = "Dark";
} else {
    btn.innerText = "Light";
}

btn.addEventListener("click", function() {
    if (document.body.classList.contains("light-mode")) {
        document.body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
        btn.innerText = "Light";
    } else {
        document.body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
        btn.innerText = "Dark";
    }
});
