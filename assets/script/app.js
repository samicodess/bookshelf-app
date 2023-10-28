const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_WEB_APP";
const books = [];

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Your browser does not support web storage");
    return false;
  }
  return true;
};

Swal.fire({
  title: "BookShelf!!",
  text: "Welcome to BookShelf",
  background: "#e7e5e4",
  imageUrl: "assets/img/top-ilust.svg",
  imageWidth: 400,
  imageHeight: 200,
  imageAlt: "Custom image",
});

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById("unRead");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("isRead");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});
const searchBook = () => {
  const searchInput = document.getElementById("search2").value.toLowerCase();
  const bookItems = document.getElementsByClassName("book1");

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector(".book-title");
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
};

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const moveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
};

const deleteData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
  }
};

const addBook = () => {
  const bookTitle = document.getElementById("title");
  const bookAuthor = document.getElementById("writer");
  const bookYear = document.getElementById("year");
  const bookHasFinished = document.getElementById("isComplete");
  let bookStatus;

  if (bookHasFinished.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  books.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookAuthor.value = null;
  bookYear.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeBookElement = (bookObject) => {
  const elementBookTitle = document.createElement("p");
  elementBookTitle.classList.add("book-title");
  elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;

  const elementBookAuthor = document.createElement("p");
  elementBookAuthor.classList.add("book-writer");
  elementBookAuthor.innerText = bookObject.author;

  const descContainer = document.createElement("div");
  descContainer.classList.add("book-description");
  descContainer.append(elementBookTitle, elementBookAuthor);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("book-status");

  const container = document.createElement("div");
  container.classList.add("book1");
  container.append(descContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnBtn = document.createElement("button");
    returnBtn.classList.add("return-btn");
    returnBtn.innerHTML = `<i class='bx bx-undo'></i>`;

    returnBtn.addEventListener("click", () => {
      returnBookFromFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("wipe-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(returnBtn, deleteBtn);
    container.append(actionContainer);
  } else {
    const finishBtn = document.createElement("button");
    finishBtn.classList.add("finished-btn");
    finishBtn.innerHTML = `<i class='bx bx-check'></i>`;

    finishBtn.addEventListener("click", () => {
      addBookToFinished(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("wipe-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(finishBtn, deleteBtn);
    container.append(actionContainer);
  }

  return container;
};

const addBookToFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const returnBookFromFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const deleteBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
};
document.addEventListener(SAVED_EVENT, () => {
  Swal.fire({
    icon: "success",
    iconWitdh: 20,
    text: "Your book has been successfully added",
    showConfirmButton: false,
    timer: 1500,
  });
});

document.addEventListener(MOVED_EVENT, () => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    text: "Your book has been successfully transferred",
    showConfirmButton: false,
    timer: 1500,
  });
});

document.addEventListener(DELETED_EVENT, () => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    text: "Your book has been successfully deleted",
    showConfirmButton: false,
    timer: 1500,
  });
});

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
};

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};
document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const simpanForm = document.getElementById("AddBook");
  simpanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("FindBooks");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBook();
  });
});
