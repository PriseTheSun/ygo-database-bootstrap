fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Erro ao fazer a solicitação: ", error);
  });

const cardList = document.querySelector("#cards");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

const cardsPerPage = 20;
let currentPage = 1;
let totalCards = 0;
let cards = [];
const observer = new IntersectionObserver(handleObserver, {
  root: null,
  rootMargin: "-30px",
  threshold: 1.0,
});

function handleObserver(entries, obs) {
  entries.forEach((it) => {
    if (it.isIntersecting) {
      const img = it.target;
      const src = img.getAttribute("data-src");
      img.setAttribute("src", src);
      observer.unobserve(img);
    }
  });
}

function renderCards(cards, page) {
  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const pageCards = cards.slice(startIndex, endIndex);

  cardList.innerHTML = "";

  pageCards.forEach((card) => {
    const cardItem = document.createElement("li");
    const cardImage = document.createElement("img");
    const cardTitle = document.createElement("h5");
    const cardDescription = document.createElement("p");

    cardImage.setAttribute("data-src", card.card_images[0].image_url );
    cardImage.setAttribute(
      "src",
      "https://imgs.search.brave.com/i5tF4T07qyUQem3qjOHiLFpeWYmNvKrEbkhXdEYoy5k/rs:fit:168:250:1/g:ce/aHR0cHM6Ly93d3cu/eXVnaW9oY2FyZGd1/aWRlLmNvbS9mYWtl/LXl1Z2lvaC1jYXJk/cy9DYXJkQmFjay5q/cGc"
    );
    observer.observe(cardImage);
    cardImage.alt = card.name;
    cardTitle.textContent = card.name;
    cardDescription.textContent = card.desc;

    cardItem.appendChild(cardImage);
    cardItem.appendChild(cardTitle);
    cardItem.appendChild(cardDescription);
    cardList.appendChild(cardItem);
  });
}

fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt")
  .then((response) => response.json())
  .then((data) => {
    cards = data.data;
    totalCards = cards.length;
    renderCards(cards, currentPage);
  })
  .catch((error) => {
    console.error("Erro ao fazer a solicitação: ", error);
  });

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderCards(cards, currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(totalCards / cardsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderCards(cards, currentPage);
  }
});

//FILTRO
const form = document.querySelector("form");
const input = document.querySelector("#card-search");
const resultList = document.createElement("ul");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const resultsContainer = document.querySelector("#cards");
  const searchTerm = input.value.trim();

  if (searchTerm === "") {
    return;
  }

  try {
    const response = await fetch(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(
        searchTerm
      )}&language=pt`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const results = data.data;

    // limpando a lista de resultados
    while (resultsContainer.firstChild) {
      resultsContainer.removeChild(resultsContainer.firstChild);
    }
    renderCards(results, 1);
    // results.forEach((result) => {

    //   const cardItem = document.createElement("li");

    //   const cardName = document.createElement("h3");
    //   cardName.textContent = result.name;

    //   const cardAttack = document.createElement("p");
    //   cardAttack.textContent = `ATK: ${result.atk}`;

    //   const cardDefense = document.createElement("p");
    //   cardDefense.textContent = `DEF: ${result.def}`;

    //   const cardType = document.createElement("p");
    //   cardType.textContent = `Type: ${result.type}`;

    //   cardItem.appendChild(cardName);
    //   cardItem.appendChild(cardAttack);
    //   cardItem.appendChild(cardDefense);
    //   cardItem.appendChild(cardType);

    //   resultList.appendChild(cardItem);
    // });

    // // adicionando a lista de resultados à página

    // resultsContainer.appendChild(resultList);
  } catch (error) {
    console.error(error);
    alert("Não foi Possivel Encontrar sua carta.");
  }
});

function loadFromType(type = "") {
  if (!type) return;
  fetch(
    `https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt&type=${type}`
  )
    .then((response) => response.json())
    .then((data) => {
      cards = data.data;
      renderCards(cards, 1);
    })
    .catch((error) => {
      console.error("Erro ao fazer a solicitação: ", error);
    });
}
