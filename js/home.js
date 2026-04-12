let container = document.getElementById("rows-container");

let currentUrl = "https://api.jikan.moe/v4/top/anime";

function loadAnime(url) {
    container.innerHTML = `
        <div style="display:flex; gap:16px; padding: 20px 4%;">
            <div class="anime-card" style="background:#222; height:250px;"></div>
            <div class="anime-card" style="background:#222; height:250px;"></div>
            <div class="anime-card" style="background:#222; height:250px;"></div>
            <div class="anime-card" style="background:#222; height:250px;"></div>
            <div class="anime-card" style="background:#222; height:250px;"></div>
            <div class="anime-card" style="background:#222; height:250px;"></div>
            <div class="anime-card" style="background:#222; height:250px;"></div>
            <div class="anime-card" style="background:#222; height:250px;"></div>
        </div>
    `;

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

        for (let i = 0; i < genres.length; i++) {
            loadRow(genres[i].name, genres[i].url, i);
        }
    }, 100);
}

loadAnime(currentUrl);

document.getElementById("sorter").addEventListener("change", function () {
    currentUrl = this.value;
    loadAnime(currentUrl);
});

function loadRow(name, url, index) {

    setTimeout(function () {

        let section = document.createElement("div");
        section.className = "row-section";

        let heading = document.createElement("h2");
        heading.className = "row-heading";
        heading.innerText = name;
        section.appendChild(heading);

        let loading = document.createElement("p");
        loading.className = "row-loading";
        loading.innerText = "Loading...";
        section.appendChild(loading);

        container.appendChild(section);

        fetch(url)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {

                if (section.contains(loading)) {
                    section.removeChild(loading);
                }

                let list = data.data;
                if (!list || list.length === 0) {
                    let empty = document.createElement("p");
                    empty.className = "row-error";
                    empty.innerText = "Results not found";
                    section.appendChild(empty);
                    return;
                }

                let newList = list.filter(function (a) {
                    return a && a.images && a.images.jpg && a.images.jpg.image_url;
                });

                let row = document.createElement("div");
                row.className = "anime-row";

                let cards = newList.map(function (anime) {

                    let card = document.createElement("div");
                    card.className = "anime-card";

                    let img = document.createElement("img");
                    img.src = anime.images.jpg.image_url;
                    img.alt = anime.title;
                    img.loading = "lazy";

                    let title = document.createElement("p");
                    title.className = "anime-title";
                    title.innerText = anime.title;

                    let btnDiv = document.createElement("div");
                    let cleanTitle = anime.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                    btnDiv.innerHTML = "<button class='btnfav' data-id='" + anime.mal_id + "' onclick=\"toggleFav(" + anime.mal_id + ", '" + cleanTitle + "', '" + anime.images.jpg.image_url + "', this)\">+</button>";
                    let btn = btnDiv.firstChild;

                    card.appendChild(img);
                    card.appendChild(title);
                    card.appendChild(btn);

                    return card;
                });

                for (let j = 0; j < cards.length; j++) {
                    row.appendChild(cards[j]);
                }

                section.appendChild(row);

                checkFavs();

            })
            .catch(function (err) {
                console.error("Row Load Error:", err);
                if (section.contains(loading)) {
                    section.removeChild(loading);
                }
                let error = document.createElement("p");
                error.className = "row-error";
                error.innerText = "Network Error";
                section.appendChild(error);
            });

    }, index * 1000);
}

function toggleFav(id, title, imgUrl, buttonElement) {
    let favsString = localStorage.getItem("kamehouse-favorites");
    let favs = [];
    
    if (favsString !== null) {
        favs = JSON.parse(favsString);
    }
    
    let existingFav = null;
    for (let i = 0; i < favs.length; i++) {
        if (favs[i].mal_id === id) {
            existingFav = favs[i];
            break;
        }
    }
    
    if (!existingFav) {
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
    if (favsString === null) return;
    
    let favs = JSON.parse(favsString);
    let buttons = document.getElementsByClassName("btnfav");
    
    for (let i = 0; i < buttons.length; i++) {
        let btn = buttons[i];
        let btnId = parseInt(btn.getAttribute("data-id"));
        
        let isFav = false;
        for (let j = 0; j < favs.length; j++) {
            if (favs[j].mal_id === btnId) {
                isFav = true;
                break;
            }
        }
        
        if (isFav) {
            btn.innerText = "✓";
        }
    }
}