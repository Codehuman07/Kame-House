let container = document.getElementById("rows-container");

let currentUrl = "https://api.jikan.moe/v4/top/anime";

function loadAnime(url) {
    let loadingHTML = "<div style='display:flex; gap:16px; padding: 20px 4%;'>";
    for (let i = 0; i < 8; i++) {
        loadingHTML += "<div class='anime-card' style='background:#222; height:250px;'></div>";
    }
    loadingHTML += "</div>";
    container.innerHTML = loadingHTML;

    setTimeout(function() {
        container.innerHTML = "";

        let genres = [
            { name: "Top Anime", url: url },
            { name: "Action", url: "https://api.jikan.moe/v4/anime?genres=1" },
            { name: "Comedy", url: "https://api.jikan.moe/v4/anime?genres=4" },
            { name: "Fantasy", url: "https://api.jikan.moe/v4/anime?genres=10" }
        ];

        let sorter = document.getElementById("sorter");
        if (sorter) {
            genres[0].name = sorter.options[sorter.selectedIndex].text;
        }

        genres.forEach(function(genre, i) {
            loadRow(genre.name, genre.url, i);
        });
    }, 100);
}

loadAnime(currentUrl);

let sorterDropdown = document.getElementById("sorter");
if (sorterDropdown) {
    sorterDropdown.addEventListener("change", function () {
        currentUrl = this.value;
        loadAnime(currentUrl);
    });
}

function loadRow(name, url, index) {
    setTimeout(function () {
        let section = document.createElement("div");
        section.className = "row-section";

        let headingHTML = "<h2 class='row-heading'>" + name + "</h2>";
        let loadingHTML = "<p class='row-loading' id='loading-" + index + "'>Loading...</p>";
        
        section.innerHTML = headingHTML + loadingHTML;
        container.appendChild(section);

        fetch(url)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                let loadingEl = document.getElementById("loading-" + index);
                if (loadingEl) {
                    loadingEl.style.display = "none";
                }

                let list = data.data;
                if (list == null || list.length === 0) {
                    section.innerHTML += "<p class='row-error'>Results not found</p>";
                    return;
                }

                let tempArr = list.filter(function(a) {
                    return a != null && a.images != null && a.images.jpg != null && a.images.jpg.image_url != null;
                });

                let rowHTML = "<div class='anime-row'>" + tempArr.map(function(anime) {
                    let safeTitle = "";
                    if (anime.title != null) {
                        safeTitle = anime.title.split("'").join("\\'").split('"').join("&quot;");
                    }
                    
                    let cardHTML = "<div class='anime-card'>";
                    cardHTML += "<img src='" + anime.images.jpg.image_url + "'>";
                    cardHTML += "<p class='anime-title'>" + anime.title + "</p>";
                    
                    let onclickFunc = "toggleFav(" + anime.mal_id + ", '" + safeTitle + "', '" + anime.images.jpg.image_url + "', this)";
                    cardHTML += "<button class='btnfav' data-id='" + anime.mal_id + "' onclick=\"" + onclickFunc + "\">+</button>";
                    
                    cardHTML += "</div>";
                    return cardHTML;
                }).join('') + "</div>";

                section.innerHTML += rowHTML;

                checkFavs();

            })
            .catch(function (err) {
                console.log("error");
                let loadingEl = document.getElementById("loading-" + index);
                if (loadingEl) {
                    loadingEl.style.display = "none";
                }
                section.innerHTML += "<p class='row-error'>Network Error</p>";
            });

    }, index * 1000);
}

function toggleFav(id, title, imgUrl, buttonElement) {
    let favsString = localStorage.getItem("kamehouse-favorites");
    let favs = [];
    
    if (favsString !== null) {
        favs = JSON.parse(favsString);
    }
    
    let existingFav = favs.find(function(anime) {
        return anime.mal_id === id;
    });
    
    if (existingFav == null) {
        let newFav = {
            mal_id: id,
            title: title,
            image: imgUrl
        };
        favs.push(newFav);
        buttonElement.innerText = "✓";
    } else {
        let newFavs = favs.filter(function(anime) {
            return anime.mal_id !== id;
        });
        favs = newFavs;
        buttonElement.innerText = "+";
    }
    
    localStorage.setItem("kamehouse-favorites", JSON.stringify(favs));
}

function checkFavs() {
    let favsString = localStorage.getItem("kamehouse-favorites");
    if (favsString === null) {
        return;
    }
    
    let favs = JSON.parse(favsString);
    let buttons = document.getElementsByClassName("btnfav");
    
    for (let i = 0; i < buttons.length; i++) {
        let btn = buttons[i];
        let btnId = parseInt(btn.getAttribute("data-id"));
        
        let isFav = favs.some(function(anime) {
            return anime.mal_id === btnId;
        });
        
        if (isFav) {
            btn.innerText = "✓";
        }
    }
}