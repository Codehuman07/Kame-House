setTimeout(async () => {
  try {
    const response = await fetch("https://api.jikan.moe/v4/top/anime?page=1");
    const data = await response.json();
    const grid = document.getElementById("grid");
    grid.innerHTML = data.data.map(anime => `
      <div>
        <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
        <h3>${anime.title}</h3>
        <p>Score: ${anime.score}</p>
        <p>Episodes: ${anime.episodes}</p>
        <p>Status: ${anime.status}</p>
      </div>
    `).join("");
    
  } catch (error) {
    console.error("Error fetching anime:", error);
  }
}, 100);