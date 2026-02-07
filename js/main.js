// Select the container where the cards will go
const container = document.getElementById('recipe-container');

fetch('data/recipe.json')
    .then(response => {
        if(!response.ok){
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(team => {
        container.innerHTML = '';

        // Create a card for each Team member
        team.forEach(member => {
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
            <h3>${member.name} </h3>
            <p>${member.ingredients}</p>
            <p>${member.instructions}</p>
            `;

            // Attach document from member to DOM
            container.appendChild(card);
        });

    })
.catch(error =>{
    console.error('Error loading recipe data', error);
    container.innerHTML = '<p style="color:red; text-align: center">Failed to load Recipe data</p>'
});