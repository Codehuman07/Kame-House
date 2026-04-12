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
    
    let cards = favs.map(function(anime) {
      let safeTitle = "";
      if (anime.title != null) {
          safeTitle = anime.title.split("'").join("\\'").split('"').join("&quot;");
      }
      
      let cardHTML = "<div class='card'>";
      cardHTML += "<img class='poster' src='" + anime.image + "'>";
      cardHTML += "<div class='info'>";
      cardHTML += "<p class='title'>" + anime.title + "</p>";
      cardHTML += "<button class='btnremove' onclick='removeFav(" + anime.mal_id + ")'>Remove</button>";
      cardHTML += "</div>";
      cardHTML += "</div>";
      return cardHTML;
    }).join('');
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
