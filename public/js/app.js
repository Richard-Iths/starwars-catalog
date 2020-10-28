async function main() {
  let pagination = 1;
  const iteratorPrev = document.querySelector(".list-iterator__prev");
  const iteratorCurrent = document.querySelector(".list-iterator__current");
  const iteratorMax = document.querySelector(".list-iterator__of");
  const iteratorNext = document.querySelector(".list-iterator__next");
  const charactersLoader = document.querySelector(".characters-loader");
  const characterInfoLoader = document.querySelector(".character-info-loader");
  const planetInfoLoader = document.querySelector(".planet-info-loader");
  const characterList = document.querySelector(".star-wars-characters");
  const characterInfo = document.querySelector(".star-wars-character-details");
  const planetInfo = document.querySelector(".star-wars-character-planet");

  let people = await getPeople(pagination);
  async function getPeople(pagination) {
    const response = await fetch(
      `https://swapi.dev/api/people/?page=${pagination}`
    );
    return await response.json();
  }

  async function getHomeworld(person) {
    const response = await fetch(person.homeworld);
    return await response.json();
  }

  function renderList(people) {
    let index = 0;
    for (person of people) {
      const listItem = document.createElement("li");
      listItem.innerText = person.name;
      listItem.id = index;
      listItem.addEventListener("click", addCharacterInfo);
      characterList.appendChild(listItem);
      index++;
    }
    charactersLoader.classList.add("hidden");
  }

  async function addCharacterInfo(e) {
    characterInfo.innerHTML = "";
    planetInfo.innerHTML = "";
    characterInfoLoader.classList.remove("hidden");
    planetInfoLoader.classList.remove("hidden");
    const person = people.results[e.target.id];
    const planet = await getHomeworld(person);
    renderCharacterInfo(person);
    renderPlanetInfo(planet);
    characterInfoLoader.classList.add("hidden");
    planetInfoLoader.classList.add("hidden");
  }
  function renderCharacterInfo(character) {
    characterInfo.innerHTML = `
    <li class="list-title">${character.name}</li>
    <li>Height: ${character.height}cm</li>
    <li>Mass: ${character.mass}kg</li>
    <li>Hair color: ${character.hair_color}</li>
    <li>Skin color: ${character.skin_color}</li>
    <li>Eye color: ${character.eye_color}</li>
    <li>Birth year: ${character.birth_year}</li>
    <li>Gender: ${character.gender}</li>
    `;
  }

  function renderPlanetInfo(planet) {
    planetInfo.innerHTML = `
    <li class="list-title">${planet.name}</li>
    <li>Rotation period: ${planet.rotation_period} hours</li>
    <li>Orbital period: ${planet.orbital_period} days</li>
    <li>Diameter: ${planet.diameter} km</li>
    <li>Climate: ${planet.climate}</li>
    <li>Gravity: ${planet.gravity[0]} ${
      planet.gravity[0] == 1 ? "G" : "Gs"
    }</li>
    <li>Terrain: ${planet.terrain}</li>
    `;
  }
  let person = people.results[0];
  let planet = await getHomeworld(person);
  renderCharacterInfo(person);
  renderPlanetInfo(planet);
  renderList(people.results);
  iteratorMax.innerText = Math.ceil(people.count / 10);

  const iteratorEventCallback = async (conditionCallback, callback) => {
    if (conditionCallback) {
      characterList.innerHTML = "";
      charactersLoader.classList.remove("hidden");
      pagination = callback();
      people = await getPeople(pagination);
      renderList(people.results);
      iteratorCurrent.innerText = pagination;
    }
  };

  iteratorPrev.addEventListener("click", async () => {
    await iteratorEventCallback(
      () => !(pagination == 1),
      () => pagination - 1
    );
  });

  iteratorNext.addEventListener("click", async () => {
    await iteratorEventCallback(
      () => !(pagination == Math.ceil(people.count / 10)),
      () => pagination + 1
    );
  });
}

main();
