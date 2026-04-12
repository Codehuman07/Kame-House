function loadFavs() {
    let favsString = localStorage.getItem("kamehouse-favorites");
    let emptymsg = document.getElementById("emptymsg");
    let countObj = document.getElementById("count");
    
    if (favsString === null || favsString === "[]") {
        emptymsg.style.display = "block";
        document.getElementById("grid").innerHTML = "";
        countObj.innerText = "";
        return;
    }
    
    let favs = JSON.parse(favsString);
    if (favs.length === 0) {
        emptymsg.style.display = "block";
        document.getElementById("grid").innerHTML = "";
        countObj.innerText = "";
        return;
    }
    
    emptymsg.style.display = "none";
    countObj.innerText = favs.length + " favorites";
    
    let cards = "";
    favs.forEach(function(anime) {
      let safeTitle = anime.title.replace(/'/g, "\\'").replace(/"/g, "&quot;");
      cards += "<div class='card'>";
      cards += "<img class='poster' src='" + anime.image + "' alt='" + safeTitle + "'>";
      cards += "<div class='info'>";
      cards += "<p class='title'>" + anime.title + "</p>";
      cards += "<button class='btnremove' onclick='removeFav(" + anime.mal_id + ")'>Remove</button>";
      cards += "</div>";
      cards += "</div>";
    });
    document.getElementById("grid").innerHTML = cards;
}

function removeFav(id) {
    let favsString = localStorage.getItem("kamehouse-favorites");
    if (favsString === null) return;
    
    let favs = JSON.parse(favsString);
    let newFavs = favs.filter(function(anime) {
        return anime.mal_id !== id;
    });
    
    localStorage.setItem("kamehouse-favorites", JSON.stringify(newFavs));
    loadFavs();
}

loadFavs();
