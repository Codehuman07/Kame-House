var container = document.getElementById("rows-container");

var currentUrl = "https://api.jikan.moe/v4/top/anime";

// Wrap the existing fetch code inside a function called loadAnime
function loadAnime(url) {
    // Before fetching, clear the grid and put the 8 skeleton divs back so the loading state shows again
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

    // after a short delay, clear skeletons and put the actual data
    setTimeout(function() {
        container.innerHTML = "";

        var genres = [
            { name: "Top Anime", url: url }, // replace Top Anime url with the new url
            { name: "Action", url: "https://api.jikan.moe/v4/anime?genres=1" },
            { name: "Comedy", url: "https://api.jikan.moe/v4/anime?genres=4" },
            { name: "Fantasy", url: "https://api.jikan.moe/v4/anime?genres=10" }
        ];

        var sorter = document.getElementById("sorter");
        if (sorter) {
            genres[0].name = sorter.options[sorter.selectedIndex].text;
        }

        // loop through genres (simple loop, no fancy stuff)
        for (var i = 0; i < genres.length; i++) {
            loadRow(genres[i].name, genres[i].url, i);
        }
    }, 100);
}

// On page load call loadAnime(currentUrl)
loadAnime(currentUrl);

// Add an event listener on document.getElementById("sorter")
document.getElementById("sorter").addEventListener("change", function () {
    currentUrl = this.value;
    loadAnime(currentUrl);
});

function loadRow(name, url, index) {

    // delay so api doesnt break
    setTimeout(function () {

        var section = document.createElement("div");
        section.className = "row-section";

        var heading = document.createElement("h2");
        heading.className = "row-heading";
        heading.innerText = name;
        section.appendChild(heading);

        var loading = document.createElement("p");
        loading.className = "row-loading";
        loading.innerText = "Loading...";
        section.appendChild(loading);

        container.appendChild(section);

        fetch(url)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {

                // remove loading safely
                if (section.contains(loading)) {
                    section.removeChild(loading);
                }

                // Check if data.data exists (Jikan API can return errors/null)
                var list = data.data;
                if (!list || list.length === 0) {
                    var empty = document.createElement("p");
                    empty.className = "row-error";
                    empty.innerText = "Results not found";
                    section.appendChild(empty);
                    return;
                }

                // filter (remove null images)
                var newList = list.filter(function (a) {
                    return a && a.images && a.images.jpg && a.images.jpg.image_url;
                });

                var row = document.createElement("div");
                row.className = "anime-row";

                // map to create cards
                var cards = newList.map(function (anime) {

                    var card = document.createElement("div");
                    card.className = "anime-card";

                    var img = document.createElement("img");
                    img.src = anime.images.jpg.image_url;
                    img.alt = anime.title;
                    img.loading = "lazy"; // Better performance

                    var title = document.createElement("p");
                    title.className = "anime-title";
                    title.innerText = anime.title;

                    card.appendChild(img);
                    card.appendChild(title);

                    return card;
                });

                // append cards
                for (var j = 0; j < cards.length; j++) {
                    row.appendChild(cards[j]);
                }

                section.appendChild(row);

            })
            .catch(function (err) {
                console.error("Row Load Error:", err);
                if (section.contains(loading)) {
                    section.removeChild(loading);
                }
                var error = document.createElement("p");
                error.className = "row-error";
                error.innerText = "Network Error";
                section.appendChild(error);
            });

    }, index * 1000); // 1-second delay is standard for Jikan
}