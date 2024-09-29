const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

// Get book by ID from books array
function getBookById(bookId) {
    return books.find((book) => book.id === bookId);
}

// Save changes to book
function saveChanges(updatedBook) {
    const bookIndex = books.findIndex((book) => book.id === updatedBook.id);
    books[bookIndex] = updatedBook;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    alert("Book successfully updated!");
    window.location.href = "index.html"; // Redirect to main page
}

// Render form with current book data
function renderForm(book) {
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");
    const yearInput = document.getElementById("year");
    const ratingSection = document.getElementById("rating-section");
    const ratingInput = document.getElementById("rating");

    // Populate form with book details
    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = book.year;

    // Show rating section only for completed books
    if (book.isComplete) {
        ratingSection.classList.remove("hidden");
        ratingInput.value = book.rating || "1";
    } else {
        ratingSection.classList.add("hidden");
    }

    // Submit the form with updated data
    const form = document.getElementById("edit-book-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const updatedBook = {
            ...book, // Preserve original data like ID and timestamp
            title: titleInput.value,
            author: authorInput.value,
            year: yearInput.value,
        };

        if (book.isComplete) {
            updatedBook.rating = parseInt(ratingInput.value);
        }

        saveChanges(updatedBook);
    });
}

// Initialize the page by loading book data
function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get("id"));

    const booksData = localStorage.getItem(STORAGE_KEY);
    if (booksData) {
        books = JSON.parse(booksData);

        const book = getBookById(bookId);
        if (book) {
            renderForm(book); // Populate form with book data
        } else {
            alert("Book not found.");
            window.location.href = "index.html"; // Redirect if book not found
        }
    } else {
        alert("No book data available.");
        window.location.href = "index.html"; // Redirect to main page
    }
}

// Run initialization
init();
