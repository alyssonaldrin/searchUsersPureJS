var allUsers = [];
var filteredUsers = [];
var tabUsers = null;
var tabStats = null;
var inputUser = null;
var inputButton = null;
var typedUser = null;
var loweredName = null;


tabUsers = document.querySelector("#resultsFound");
tabStats = document.querySelector("#resultsStats");
inputUser = document.querySelector("#inputUser");
inputButton = document.querySelector("#inputButton");

loadUsers();

async function fetchUsers() {
    const res = await fetch("https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo");
    const json = await res.json();
    return json.results.map(user => {
        const { name, picture, dob, gender} = user;
        return {
            name: name.first + " " + name.last,
            picture,
            age: dob.age,
            gender
        }
    });
}

async function loadUsers() {
    allUsers = await fetchUsers();
    submitInput();
}

function render() {
    if (filteredUsers.length > 0) {
        renderUserList();
        renderStats();
    } else {
        tabUsers.innerHTML = "Nenhum usuário filtrado";
        tabStats.innerHTML = "Nada a ser exibido";
    }
}

function submitInput() {
    function handleEnterSubmit(event) {
        if (event.key === "Enter") {
            if (event.target.value.trim() === "") {
                filteredUsers = [];
            } else {
                typedUser = event.target.value.toLowerCase().trim();
                filterUsers();
            }
            render();
        }
    }
    function handleButtonSubmit() {
        if (inputUser.value.trim() === "") {
            filteredUsers = [];
        } else {
            typedUser = inputUser.value.toLowerCase().trim();
            filterUsers();
        }
        render();
    }
    function filterUsers(){
        if (typedUser) {
            filteredUsers = allUsers.filter(({ name }) => {
                loweredName = name.toLowerCase();
                return loweredName.includes(typedUser);
            });
            filteredUsers.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
        console.log(filteredUsers);
    }
    inputUser.addEventListener("keyup", handleEnterSubmit);
    inputButton.addEventListener("click",handleButtonSubmit);
}

function renderUserList() {
    let usersHTML = `<div class="tabTitle">${filteredUsers.length} usuário(s) encontrado(s)`;
    filteredUsers.forEach(user => {
        const { name, picture, age } = user;

        const userHTML = `
            <div class="user">
                <div>
                    <img src="${picture.thumbnail}" alt="${name}"/>
                </div>
                <div>
                    ${name}, ${age}
                </div>
            </div>
        `;

        usersHTML += userHTML;
    });
    usersHTML += "</div>";
    tabUsers.innerHTML = usersHTML;
}
function renderStats() {
    let countOfMen = 0;
    let countOfWomen = 0;
    let sumOfAges = 0;
    let numberOfUsers = filteredUsers.length;
    for (let i = 0; i < numberOfUsers; i++) {
        const { age, gender } = filteredUsers[i];
        if (gender === "male") {
            countOfMen++
        } else {
            countOfWomen++
        }
        sumOfAges += age;
    }
    let averageOfAges = sumOfAges / numberOfUsers;
    let statsHTML = `<div class="tabTitle">Estatísticas
            <div class="stats">
                <div>
                    Sexo masculino: <strong>${countOfMen}</strong>
                </div>
                <div>
                    Sexo feminino: <strong>${countOfWomen}</strong>
                </div>
                <div>
                    Soma das idades: <strong>${sumOfAges}</strong>
                </div>
                <div>
                    Média das idades: <strong>${averageOfAges}</strong>
                </div>
            </div>
        </div>
    `;
    tabStats.innerHTML = statsHTML;
}