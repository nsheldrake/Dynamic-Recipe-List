// Select the container where the cards will go
const container = document.getElementById('team-container');

fetch('data/teams.json')
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
            <p class="role">${member.role}</p>
            <p>${member.bio}</p>
            `;

            // Attach document from member to DOM
            container.appendChild(card);
        });

    })
.catch(error =>{
    console.error('Error loading team data', error);
    container.innerHTML = '<p style="color:red; text-align: center">Failed to load Team data</p>'
});