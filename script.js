const API_KEY = "83984a08245448e79cb512ce6330589f";
const url = "https://newsapi.org/v2/everything?q=";

// When the page loads, call the fetchNews function with the query "India".
window.addEventListener("load", () => fetchNews("India"));
function reload() {
    window.location.reload();
}

// Define an asynchronous function to fetch news data based on a query.
async function fetchNews(query) {
    try {
        // Use the fetch function to make a request to the news API with the given query and API key.
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);

        // Convert the response data to a JavaScript object (JSON format).
        const data = await res.json();

        // Log the retrieved data to the browser's console for debugging.
        console.log(data);

        // Call the bindData function and pass in the list of news articles.
        bindData(data.articles);
    } catch (error) {
        // If there is an error while fetching data, log the error to the console.
        console.error('Error fetching news:', error);
    }
}

// Define a function to bind (display) the news data to the HTML template.
function bindData(articles) {
    // Get a reference to the HTML element with the class "cards-container."
    const cardsContainer = document.querySelector('.cards-container');

    // Get a reference to the HTML template with the ID "template-news-card."
    const newsCardTemplate = document.getElementById('template-news-card');

    // Clear the contents of the "cards-container" element.
    cardsContainer.innerHTML = '';

    // Loop through each article in the list of articles.
    articles.forEach(article => {
        // Skip articles without an image.
        if (!article.urlToImage) return;

        // Clone the news card template to create a new card.
        const cardClone = newsCardTemplate.content.cloneNode(true);

        // Update the card's content with data from the article.
        cardClone.querySelector('.card-header img').src = article.urlToImage;
        cardClone.querySelector('#news-title').textContent = article.title;

        // Format and set the publication date with the specified timezone.
        const formattedDate = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        cardClone.querySelector('#news-source').textContent = `${article.source.name} ${formattedDate}`;

        cardClone.querySelector('#news-dec').textContent = article.description;

        // Add an event listener to open the article URL in a new tab when the card is clicked.
        cardClone.firstElementChild.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        // Append the newly created card to the "cards-container" element.
        cardsContainer.appendChild(cardClone);
    });
}

// Initialize the currently selected navigation item to null.
let curSelectedNav = null;

// Define a function to handle clicks on navigation items.
function onNavItemClick(id) {
    // Deselect the previously selected navigation item, if any.
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }

    // Fetch news based on the clicked navigation item's ID.
    fetchNews(id);

    // Highlight the clicked navigation item as the currently selected one.
    const navItem = document.getElementById(id);
    navItem.classList.add('active');

    // Update the currently selected navigation item.
    curSelectedNav = navItem;
}
const searchButton = document.getElementById('search-button');
const searchText = document.getElementById("search-text");
searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
})