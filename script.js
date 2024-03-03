


// Выпадающий список
async function displayUsers() {
    const displayMode = document.getElementById('display-mode').value;
    let users = await fetchApi()

    if (displayMode === 'cards') {
        console.log(displayMode)
        displayUsersAsCards(users);
        document.getElementById('user-container').style.display = 'flex';
        document.getElementById('empty').style.display='none'
        document.getElementById('user-table').style.display = 'none';
        document.getElementById('refresh-table').disabled = true
        document.getElementById('refresh-cards').disabled = false
    } else if (displayMode === 'table') {
        console.log(displayMode)
        displayUsersAsTable(users);
        document.getElementById('user-table').style.display = 'table';
        document.getElementById('empty').style.display='none'
        document.getElementById('user-container').style.display = 'none';
        document.getElementById('refresh-cards').disabled = true
        document.getElementById('refresh-table').disabled = false
    } else if (displayMode === 'no') {
        console.log(displayMode)
        document.getElementById('user-table').style.display = 'none';
        document.getElementById('user-container').style.display = 'none';
        document.getElementById('empty').style.display='flex'
        document.getElementById('refresh-table').disabled = true
        document.getElementById('refresh-cards').disabled = true
    }
       
}


async function fetchApi() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка, попробуйте еще раз');
    }
}


async function updateTable() {
    let users = await fetchApi()
    displayUsersAsTable(users);
}

async function updateCards() {
    let users = await fetchApi()
    displayUsersAsCards(users);
}

// в виде карточек
function displayUsersAsCards(users) {
    const filterQuery = document.getElementById('filter-input').value;
    if (filterQuery) {
        users = filterUsers(users, filterQuery);
    }

    const sortParameter = document.getElementById('sort-parameter').value;
    if (sortParameter) {
        users = sortUsers(users, sortParameter);
    }

    const userContainer = document.getElementById('user-container');
    userContainer.innerHTML = '';
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
        `;
        userContainer.appendChild(userCard);
    });
}

// в виде таблицы
function displayUsersAsTable(users) {
    const filterQuery = document.getElementById('filter-input').value;
    if (filterQuery) {
        users = filterUsers(users, filterQuery);
    }

    const sortParameter = document.getElementById('sort-parameter').value;
    if (sortParameter) {
        users = sortUsers(users, sortParameter);
    }

    const tbody = document.querySelector('#user-table tbody');
    tbody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
        `;
        tbody.appendChild(row);
    });
}

//Сортировка
function sortUsers(users, parameter) {
    return users.sort((a, b) => {
        if (a[parameter] < b[parameter]) {
            return -1;
        }
        if (a[parameter] > b[parameter]) {
            return 1;
        }
        return 0;
    });
}

//фильтр
function filterUsers(users, query) {
    return users.filter(user => user.name.includes(query) || user.email.includes(query));
}

document.getElementById('filter-input').addEventListener('input', function() {
    const filterInput = document.getElementById('filter-input').value;
    const filterButton = document.getElementById('filter-button');
    if (filterInput) {
        filterButton.disabled = false;
    } else {
        filterButton.disabled = true;
    }
});

document.getElementById('filter-button').addEventListener('click', function() {
    const displayMode = document.getElementById('display-mode').value;
    if (displayMode === 'table') {
        updateTable();
    } else if (displayMode === 'cards'){
        updateCards();
    }
});


document.getElementById('display-mode').addEventListener('change', function () {
    displayUsers();
})

document.getElementById('sort-parameter').addEventListener('change', function () {
    displayUsers();
})

document.getElementById('refresh-cards').addEventListener('click', updateCards);
document.getElementById('refresh-table').addEventListener('click', updateTable);

