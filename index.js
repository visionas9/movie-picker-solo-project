import { moviesData } from "./data.js"; // use ./ instead of / unless you really serve from root

const preferanceRadios = document.querySelector("#preferance-radios");
const gifsOnlyOption = document.querySelector("#gifs-only-option");
const getFilmBtn = document.querySelector("#get-film-btn");
const movieModal = document.querySelector("#movie-modal");
const movieModalCloseBtn = document.querySelector("#movie-modal-close-btn");
const movieModalInner = document.querySelector("#movie-modal-inner");

preferanceRadios.addEventListener("change", highlightCheckedOption);

movieModalCloseBtn.addEventListener("click", closeModal);

getFilmBtn.addEventListener("click", renderMovie);

function highlightCheckedOption(e) {
  const radios = document.getElementsByClassName("radio");
  for (let radio of radios) {
    radio.classList.remove("highlight");
  }
  document.getElementById(e.target.id).parentElement.classList.add("highlight");
}

function closeModal() {
  movieModal.style.display = "none";
}

function renderMovie() {
  const movieObject = getSingleMovieObject();
  const isGif = gifsOnlyOption.checked;

  let imgSrc = "";

  if (isGif && movieObject.trailerGif) {
    imgSrc = movieObject.trailerGif;
  } else {
    imgSrc = movieObject.poster;
  }

  movieModalInner.innerHTML = `
  <img 
  class="movie-img"
  src="${imgSrc}"
  alt="${movieObject.title}"
  >
   <h2>${movieObject.title}</h2>
  `;
  movieModal.style.display = "flex";
}

function getSingleMovieObject() {
  const moviesArray = getMatchingMovieArray();

  if (moviesArray.length === 1) {
    return moviesArray[0];
  } else {
    const randomNumber = Math.floor(Math.random() * moviesArray.length);
    return moviesArray[randomNumber];
  }
}

function getMatchingMovieArray() {
  if (document.querySelector('input[type="radio"]:checked')) {
    const selectedMood = document.querySelector(
      'input[type="radio"]:checked'
    ).value;
    const isGif = gifsOnlyOption.checked;

    const matchingMovieArray = moviesData.filter(function (movie) {
      if (isGif) {
        // when GIFs-only is ON: mood must match AND hasGif must be true
        return movie.moods.includes(selectedMood) && movie.hasGif;
      } else {
        // when OFF: only mood must match
        return movie.moods.includes(selectedMood);
      }
    });
    return matchingMovieArray;
  }
}

function getPreferancesArray(movies) {
  const preferanceArray = [];
  for (let movie of movies) {
    for (let preferance of movie.moods) {
      if (!preferanceArray.includes(preferance)) {
        preferanceArray.push(preferance);
      }
    }
  }
  return preferanceArray;
}

function renderPreferancesRadios(movies) {
  let radioItems = ``;
  const preferances = getPreferancesArray(movies);
  for (let preferance of preferances) {
    radioItems += `
        <div class="radio">
            <label for="${preferance}">${preferance}</label>
            <input
              type="radio"
              id="${preferance}"
              value="${preferance}"
              name="moods"
            >
        </div>`;
  }
  preferanceRadios.innerHTML = radioItems;
}

renderPreferancesRadios(moviesData);
