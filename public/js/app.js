async function main() {
  const iteratorPrev = document.querySelector(".list-iterator__prev");
  const iteratorCurrent = document.querySelector(".list-iterator__current");
  const iteratorMax = document.querySelector(".list-iterator__of");
  const iteratorNext = document.querySelector(".list-iterator__next");
  const characterList = document.querySelector(".star-wars-characters");
  const characterInfo = document.querySelector(".star-wars-character-details");
  const planetInfo = document.querySelector(".star-wars-character-planet");

  let pagination = 1;
  const cache = {};
  let people = await getPeople(pagination);
  let person = people.results[0];
  // let planet = await getHomeworld(person);
  let planet = await getInfoData(person["homeworld"]);
  const maxPage = Math.ceil(people.count / 10);
  renderCharacterInfo(person);
  renderPlanetInfo(planet[0]);
  addInfoTabMenuEvents(person);
  renderList(people.results);
  iteratorMax.innerText = maxPage;
  document.querySelector(".btn-star-wars-planet").focus();

  async function isCached(url) {
    if (cache[url]) {
      return cache[url];
    } else {
      const response = await fetch(url);
      const responseJson = await response.json();
      cache[url] = responseJson;
      return responseJson;
    }
  }

  async function getPeople(pagination) {
    const url = `https://swapi.dev/api/people/?page=${pagination}`;
    return await isCached(url);
  }

  // async function getHomeworld(person) {
  //   const url = person.homeworld;
  //   return isCached(url);
  // }

  function addInfoTabMenuEvents(person) {
    const btnMenu = document.querySelectorAll(".star-wars-info-tab button");
    btnMenu.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const api = e.target.dataset.apiKey;
        let infoData;
        await renderLoader("character-info-details-loader", async () => {
          infoData = await getInfoData(person[api]);
        });
        infoTabMenu(api, infoData);
      })
    );
  }

  async function getInfoData(url) {
    const urls = url;
    let data = [];
    if (typeof urls === "object") {
      for (let url of urls) {
        data.push(await isCached(url));
      }
    } else {
      data.push(await isCached(urls));
    }
    return data;
  }
  function infoTabMenuRender(data, callback) {
    planetInfo.innerHTML = "";
    if (data.length) {
      data.forEach((item) => callback(item));
    } else {
      planetInfo.innerHTML = `<li class="list-title">No Data</li>`;
    }
  }
  function infoTabMenu(id, data) {
    switch (id) {
      case "species":
        infoTabMenuRender(data, renderSpeciesInfo);
        break;
      case "starships":
        infoTabMenuRender(data, renderStarshipsInfo);
        break;
      case "vehicles":
        infoTabMenuRender(data, renderVehiclesInfo);
        break;
      default:
        infoTabMenuRender(data, renderPlanetInfo);
    }
  }

  function renderList(people) {
    for (index in people) {
      const listItem = document.createElement("li");
      listItem.innerText = people[index].name;
      listItem.dataset.id = index;
      listItem.addEventListener("click", addCharacterInfo);
      characterList.appendChild(listItem);
    }
  }

  async function addCharacterInfo(e) {
    renderLoader("character-info-loader", async () => {
      person = people.results[e.target.dataset.id];
      // planet = await getHomeworld(person);
      planet = await getInfoData(person.homeworld);
      addInfoTabMenuEvents(person);
      renderCharacterInfo(person);
      renderPlanetInfo(planet[0]);
      document.querySelector(".btn-star-wars-planet").focus();
    });
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
  function renderStarshipsInfo(ships) {
    planetInfo.innerHTML += `
    <li class="list-title mt-2">${ships.name}</li>
    <li>Model: ${ships.model}</li>
    <li>Manufacturer: ${ships.manufacturer}</li>
    <li>Max Atmosphering Speed : ${ships.max_atmosphering_speed}</li>
    `;
  }

  function renderSpeciesInfo(species) {
    planetInfo.innerHTML += `
    <li class="list-title">${species.name}</li>
    <li>Classification: ${species.classification}</li>
    <li>Designation: ${species.designation}</li>
    <li>Average Lifespan : ${species.average_lifespan}</li>
    `;
  }

  function renderVehiclesInfo(vehicles) {
    planetInfo.innerHTML += `
    <li class="list-title mt-2">${vehicles.name}</li>
    <li>Model: ${vehicles.model}</li>
    <li>Manufacturer: ${vehicles.manufacturer}</li>
    <li>Max Atmosphering Speed : ${vehicles.max_atmosphering_speed}</li>
    `;
  }

  function toggleLoaderClasses(loaderElement, toggleClass) {
    loaderElement.forEach((loader) => loader.classList.toggle(toggleClass));
  }
  async function renderLoader(loaderClass, callback) {
    const loaders = document.querySelectorAll(`.${loaderClass}`);
    toggleLoaderClasses(loaders, "hidden");
    await callback();
    toggleLoaderClasses(loaders, "hidden");
  }

  const setPage = async () => {
    characterList.innerHTML = "";
    renderLoader("characters-loader", async () => {
      people = await getPeople(pagination);
      renderList(people.results);
      iteratorCurrent.innerText = pagination;
    });
  };
  // forward and backward button click event
  iteratorPrev.addEventListener("click", () => {
    if (pagination - 1 !== -0) {
      pagination--;
    } else {
      pagination = maxPage;
    }

    setPage();
  });

  iteratorNext.addEventListener("click", () => {
    if (pagination + 1 !== maxPage + 1) {
      pagination++;
    } else {
      pagination = 1;
    }

    setPage();
  });
}

main();
