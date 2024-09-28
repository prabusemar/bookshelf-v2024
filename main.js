const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];
let currentBookId = null;

// Modal toggle functionality
document.getElementById('help-icon').addEventListener('click', function () {
    document.getElementById('help-modal').classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('help-modal').classList.add('hidden');
});

// Check if localStorage is supported and load books
if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem(STORAGE_KEY)) {
        books = JSON.parse(localStorage.getItem(STORAGE_KEY));
    }
}

// Save books to localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Handle checkbox to show rating when 'Completed' is checked
const isCompleteCheckbox = document.getElementById("isComplete");
const ratingSection = document.getElementById("rating-section");

isCompleteCheckbox.addEventListener("change", () => {
    if (isCompleteCheckbox.checked) {
        ratingSection.classList.remove("hidden");
    } else {
        ratingSection.classList.add("hidden");
    }
});

// Render books to the appropriate shelf (Completed or Incomplete)
function renderBooks() {
    const incompleteBookList = document.getElementById("incomplete-book-list");
    const completedBookList = document.getElementById("completed-book-list");

    incompleteBookList.innerHTML = "";
    completedBookList.innerHTML = "";

    books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("bg-white", "rounded-lg", "shadow-md", "p-4", "relative");

        const bookTitle = document.createElement("h3");
        bookTitle.classList.add("text-lg", "font-semibold", "mb-2", "truncate");
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.classList.add("text-sm", "text-gray-700");
        bookAuthor.textContent = `Author: ${book.author}`;

        const bookYear = document.createElement("p");
        bookYear.classList.add("text-sm", "text-gray-700");
        bookYear.textContent = `Year: ${book.year}`;

        const bookStatus = document.createElement("p");
        bookStatus.classList.add("text-sm", "font-bold", book.isComplete ? "text-green-600" : "text-red-600");
        bookStatus.textContent = book.isComplete ? "Completed" : "Incomplete";

        // Display rating if completed
        if (book.isComplete && book.rating) {
            const bookRating = document.createElement("p");
            bookRating.classList.add("text-sm", "font-bold", "text-yellow-500");
            bookRating.textContent = `Rating: ${'⭐'.repeat(book.rating)}`;
            bookCard.appendChild(bookRating);
        }

        // Display category
        const bookCategory = document.createElement("p");
        bookCategory.classList.add("text-sm", "font-medium", "text-gray-700");
        bookCategory.textContent = `Category: ${book.category}`;
        bookCard.appendChild(bookCategory);

        // Create edit, delete, and toggle buttons
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("mt-4", "flex", "justify-end", "space-x-2");

        // Edit button
        const editBtn = document.createElement("a");
        editBtn.classList.add("bg-yellow-500", "text-white", "px-2", "py-1", "rounded", "hover:bg-yellow-600");
        editBtn.textContent = "Edit";
        editBtn.href = `edit-book.html?id=${book.id}`; // Redirect to edit page with book ID

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("bg-red-600", "text-white", "px-2", "py-1", "rounded", "hover:bg-red-700");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            removeBook(book.id);
        };

        const toggleBtn = document.createElement("button");
        toggleBtn.classList.add("bg-blue-600", "text-white", "px-2", "py-1", "rounded", "hover:bg-blue-700");
        toggleBtn.textContent = book.isComplete ? "Mark as Incomplete" : "Mark as Complete";
        toggleBtn.onclick = () => {
            toggleBookStatus(book.id);
        };

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);
        btnContainer.appendChild(toggleBtn);

        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookYear);
        bookCard.appendChild(bookStatus);
        bookCard.appendChild(btnContainer);

        // Append book card to either Completed or Incomplete shelf
        if (book.isComplete) {
            completedBookList.appendChild(bookCard);
        } else {
            incompleteBookList.appendChild(bookCard);
        }
    });
}

// Add new book to the list with a timestamp, category, and rating (if completed)
document.getElementById("book-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const year = document.getElementById("year").value;
    const isComplete = document.getElementById("isComplete").checked;
    const rating = isComplete ? document.getElementById("rating").value : null;
    const category = document.getElementById("category").value; // Get category

    if (!title || !author || !year || !category) {
        alert("Please fill out all fields!");
        return;
    }

    const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
        rating,
        category,
        timestamp: new Date().getTime(),
    };

    books.push(newBook);
    saveToStorage();
    renderBooks();

    // Clear form after submission
    event.target.reset();
    ratingSection.classList.add("hidden");
});

let filteredBooks = books;  // To store the current filtered books

// Filter books by category
document.getElementById("category-filter").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    filteredBooks = selectedCategory
        ? books.filter((book) => book.category === selectedCategory)
        : books;
    applySearchAndRender();  // Update the rendering logic after filtering
});

// Search books by title
document.getElementById("search-book").addEventListener("input", (event) => {
    applySearchAndRender();  // Update the rendering logic after searching
});

// Apply search and render books
function applySearchAndRender() {
    const searchTerm = document.getElementById("search-book").value.toLowerCase();

    // Filter the current set of books based on the search term
    const searchedBooks = filteredBooks.filter((book) => {
        return book.title.toLowerCase().includes(searchTerm);
    });

    // Render only the filtered and searched books
    renderFilteredBooks(searchedBooks);
}

// Render filtered books
function renderFilteredBooks(filteredBooks) {
    const incompleteBookList = document.getElementById("incomplete-book-list");
    const completedBookList = document.getElementById("completed-book-list");

    incompleteBookList.innerHTML = "";
    completedBookList.innerHTML = "";

    filteredBooks.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("bg-white", "rounded-lg", "shadow-md", "p-4", "relative");

        const bookTitle = document.createElement("h3");
        bookTitle.classList.add("text-lg", "font-semibold", "mb-2");
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement("p");
        bookAuthor.classList.add("text-sm", "text-gray-700");
        bookAuthor.textContent = `Author: ${book.author}`;

        const bookYear = document.createElement("p");
        bookYear.classList.add("text-sm", "text-gray-700");
        bookYear.textContent = `Year: ${book.year}`;

        const bookStatus = document.createElement("p");
        bookStatus.classList.add("text-sm", "font-bold", book.isComplete ? "text-green-600" : "text-red-600");
        bookStatus.textContent = book.isComplete ? "Completed" : "Incomplete";

        const bookCategory = document.createElement("p");
        bookCategory.classList.add("text-sm", "font-medium", "text-gray-700");
        bookCategory.textContent = `Category: ${book.category}`;

        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookYear);
        bookCard.appendChild(bookStatus);
        bookCard.appendChild(bookCategory);

        // Add rating if the book is completed
        if (book.isComplete && book.rating) {
            const bookRating = document.createElement("p");
            bookRating.classList.add("text-sm", "font-bold", "text-yellow-500");
            bookRating.textContent = `Rating: ${'⭐'.repeat(book.rating)}`;
            bookCard.appendChild(bookRating);
        }

        // Add buttons (Edit, Delete, Toggle)
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("mt-4", "flex", "justify-end", "space-x-2");

        const editBtn = document.createElement("a");
        editBtn.classList.add("bg-yellow-500", "text-white", "px-2", "py-1", "rounded", "hover:bg-yellow-600");
        editBtn.textContent = "Edit";
        editBtn.href = `edit-book.html?id=${book.id}`;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("bg-red-600", "text-white", "px-2", "py-1", "rounded", "hover:bg-red-700");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => removeBook(book.id);

        const toggleBtn = document.createElement("button");
        toggleBtn.classList.add("bg-blue-600", "text-white", "px-2", "py-1", "rounded", "hover:bg-blue-700");
        toggleBtn.textContent = book.isComplete ? "Mark as Incomplete" : "Mark as Complete";
        toggleBtn.onclick = () => toggleBookStatus(book.id);

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(deleteBtn);
        btnContainer.appendChild(toggleBtn);

        bookCard.appendChild(btnContainer);

        if (book.isComplete) {
            completedBookList.appendChild(bookCard);
        } else {
            incompleteBookList.appendChild(bookCard);
        }
    });
}

function removeBook(id) {
    books = books.filter(book => book.id !== id);
    saveToStorage();
    renderBooks();  // Render all books

    // Re-apply filter and search if active
    const categoryFilter = document.getElementById("category-filter");
    const searchInput = document.getElementById("search-book");

    if (categoryFilter.value || searchInput.value) {
        applySearchAndRender();
    }
}

function toggleBookStatus(id) {
    const book = books.find(book => book.id === id);
    if (book) {
        if (!book.isComplete) {
            // If marking as complete, show the rating modal
            currentBookId = id;
            document.getElementById('rating-modal').classList.remove('hidden');
        } else {
            // If marking as incomplete, just toggle the status
            book.isComplete = false;
            book.rating = null; // Remove the rating when marking as incomplete
            saveToStorage();
            renderBooks();

            // Re-apply filter and search if active
            const categoryFilter = document.getElementById("category-filter");
            const searchInput = document.getElementById("search-book");

            if (categoryFilter.value || searchInput.value) {
                applySearchAndRender();
            }
        }
    }
}

// Add event listeners for the rating modal
document.getElementById('submit-rating').addEventListener('click', function () {
    const rating = document.getElementById('modal-rating').value;
    const book = books.find(book => book.id === currentBookId);
    if (book) {
        book.isComplete = true;
        book.rating = parseInt(rating);
        saveToStorage();
        renderBooks();

        // Re-apply filter and search if active
        const categoryFilter = document.getElementById("category-filter");
        const searchInput = document.getElementById("search-book");

        if (categoryFilter.value || searchInput.value) {
            applySearchAndRender();
        }
    }
    document.getElementById('rating-modal').classList.add('hidden');
});

document.getElementById('cancel-rating').addEventListener('click', function () {
    document.getElementById('rating-modal').classList.add('hidden');
});

// Initial render when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
});
