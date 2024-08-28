document.addEventListener('DOMContentLoaded', () => {
    const pinForm = document.getElementById('pinForm');
    const album = document.querySelector('.album');
    const searchButton = document.getElementById('searchButton');
    const searchQuery = document.getElementById('searchQuery');
    const sortButton = document.getElementById('sortButton');
    const openModalButton = document.getElementById('openModalButton');
    const emailModal = document.getElementById('emailModal');
    const closeModalButton = document.querySelector('.close');

    // Fetch and load pins from CSV on page load
    localStorage.clear();
    fetchCsvAndLoadPins('/data/pins.csv');

    searchButton.addEventListener('click', () => {
        const query = searchQuery.value.toLowerCase();
        const pins = getPins();
        const filteredPins = pins.filter(pin => pin.Name.toLowerCase().includes(query));
        displayPins(filteredPins);
    });

    sortButton.addEventListener('click', () => {
        const pins = getPins();
        const sortedPins = pins.sort((a, b) => a.Rank - b.Rank);
        displayPins(sortedPins);
    });

    function fetchCsvAndLoadPins(csvUrl) {
        fetch(csvUrl)
            .then(response => response.text())
            .then(text => {
                const pins = csvToPins(text);
                displayPins(pins);
                pins.forEach(savePin);
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    // Open the modal
    openModalButton.addEventListener('click', () => {
        emailModal.style.display = 'block';
    });

    // Close the modal
    closeModalButton.addEventListener('click', () => {
        emailModal.style.display = 'none';
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target == emailModal) {
            emailModal.style.display = 'none';
        }
    });

    function csvToPins(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const pins = lines.slice(1).map(line => {
            const data = line.split(',');
            const pin = {};
            headers.forEach((header, index) => {
                pin[header.trim()] = data[index].trim();
            });
            pin.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            return pin;
        });
        return pins;
    }

    function addPinToAlbum(pin) {
        const pinElement = document.createElement('div');
        pinElement.className = 'pin';
        pinElement.dataset.id = pin.id;

        const img = document.createElement('img');
        img.src = pin.Image;
        img.alt = pin.Name;

        const Name = document.createElement('h3');
        Name.textContent = pin.Name;

        const Rank = document.createElement('p');
        Rank.textContent = `Rank: #${pin.Rank}`;

        pinElement.appendChild(img);
        pinElement.appendChild(Name);
        pinElement.appendChild(Rank);

        pinElement.addEventListener('click', () => {
            window.location.href = `pin-details.html?id=${pin.id}`;
        });

        album.appendChild(pinElement);
    }

    function savePin(pin) {
        const pins = getPins();
        pins.push(pin);
        localStorage.setItem('pins', JSON.stringify(pins));
    }

    function getPins() {
        const pins = localStorage.getItem('pins');
        return pins ? JSON.parse(pins) : [];
    }

    function displayPins(pins) {
        album.innerHTML = '';
        pins.forEach(pin => addPinToAlbum(pin));
    }
});
