const postsList = document.getElementById('name');
let output = '';
const url = 'http://localhost:4000/api/v1/departments';

fetch(url)
    .then(res => res.json())
    .then(data => {
        Array.from(data).forEach(post => {
            output += `
            <p>ADMIN LOGIN</p>
            `;
        });
        postsList.innerHTML = output;
    })