import './style.css'
import albumForm from './view-album.html?raw';

const app = document.querySelector('#app')
const URI = "https://theaudiodb.com/api/v1/json/2/album.php?m=";
let id = "2"+randomInt(1,4)+randomInt(1,10)+randomInt(0,10)+randomInt(0,10)+randomInt(0,10)+randomInt(0,10);
let uri = randomId();
let content = null;
let artist = "";
let artistInput = null;
let form = null;
let image = null;
let next = null;
let guess = null;
let count = 0;
let wins = 0;
let loses = 0;

function randomId(){
  id = "2"+randomInt(1,4)+randomInt(1,10)+randomInt(0,10)+randomInt(0,10)+randomInt(0,10)+randomInt(0,10);
  return URI+id;
}

function randomInt(min,max){
  return Math.floor(Math.random() * (max - min) ) + min;
}

async function getAlbumAsync() {
  uri = randomId();
  const response = await fetch(uri)
  const data = await response.json()

  let json = JSON.stringify(data, null, 2);
  console.log(json);

  if(data!==null){
    content.innerHTML = loadData(data)
    form = document.getElementById("artist-form");
    image = document.getElementById("album-cover");
    artistInput = document.getElementById("artist");
    next = document.getElementById("next");
    guess = document.getElementById("guess");
    result = document.getElementById("result")
    console.log(artist)
    artistInput.placeholder=artist.replace(artist,"_".repeat(artist.length))
    
    form.addEventListener("submit", (e) => {
      e.preventDefault(); 
      console.log(artist)
      if(artistInput.value==artist){
        count = 0;
        wins++;
        result.innerHTML = "Wins: "+wins+" - Loses: "+loses;
        getAlbumAsync();
      }
      else{
        if(count<5){
          let copy = artistInput.placeholder.split("")
          for(let i = 0; i <= artist.length; i++){
            var j = Math.floor(Math.random() * (i + 1));
            if(copy[j]=="_"){
              copy[j] = artist[j]
              count++;
              break;
            }
            else
              continue
          }
          artistInput.placeholder=copy.join("")
        }
        else{
          count = 0;
          loses++;
          result.innerHTML = "Wins: "+wins+" - Loses: "+loses;
          getAlbumAsync();
        }
      }
    })

    
    next.addEventListener("click", () => {
      try {
        getAlbumAsync()
      } catch (error) {
        console.log(error)
      }
    })
  }
  else
    content.innerHTML = `<p>Error desconocido</p>`
}

function loadData(data){
  if(data.album!=null){
    artist = data.album[0].strArtist;
    let album = data.album[0].strAlbumThumb;
    if(album===null){
      getAlbumAsync()
      return `<p>Album not found</p>`;
    }
    return `<img src="${album}" alt="Album cover" id="album-cover">
    <form action="#" id="artist-form">
      <input type="text" name="artist" id="artist" value="">
      <button id="guess">Guess</button>
    </form>
    <button id="next">Next</button>`;

  }
  else{
    getAlbumAsync()
    return `<p>Album not found</p>`;
  }
}

function mainApp(){
  if(!app)
    throw new Error("error")
  app.innerHTML = `
  ${albumForm}
  <p id="result"></p>`
  content = document.querySelector("div#content");
  
  getAlbumAsync();
}

mainApp()