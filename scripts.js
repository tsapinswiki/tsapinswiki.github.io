document.addEventListener('DOMContentLoaded', () => {
    const pinForm = document.getElementById('pinForm');
    const album = document.querySelector('.album');
    const searchButton = document.getElementById('searchButton');
    const searchQuery = document.getElementById('searchQuery');
    const openModalButton = document.getElementById('openModalButton');
    const emailModal = document.getElementById('emailModal');
    const closeModalButton = document.querySelector('.close');
    const emailForm = document.getElementById('emailForm');

    // Fetch and load pins from CSV on page load
    localStorage.clear();
    fetchCsvAndLoadPins('/data/pins.csv');

    searchButton.addEventListener('click', () => {
        const query = searchQuery.value.toLowerCase();
        const pins = getPins();
        const filteredPins = pins.filter(pin => pin.title.toLowerCase().includes(query));
        displayPins(filteredPins);
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

    // // Handle email form submission
    // emailForm.addEventListener('submit', async (event) => {
    //     event.preventDefault();

    //     const pinTitle = document.getElementById('emailPinTitle').value;
    //     const pinImageFile = document.getElementById('emailPinImageFile').files[0];

    //     if (pinImageFile) {
    //         const pinImage = pinImageFile;
    //         const emailParams = {
    //             to_email: 'tsapinswiki@gmail.com',
    //             pin_title: pinTitle,
    //             pin_image: pinImage,
    //         };

    //         emailjs.send('service_g2k16k8', 'template_zvv7so6', emailParams)
    //             .then(() => {
    //                 alert('Email sent successfully!');
    //                 emailForm.reset();
    //                 emailModal.style.display = 'none';
    //             }, (error) => {
    //                 console.error('Email sending failed:', error);
    //                 alert('Failed to send email.');
    //             });
    //     } else {
    //         alert("Please select an image file.");
    //     }
    // });

    function csvToPins(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const pins = lines.slice(1).map(line => {
            const data = line.split(',');
            const pin = {};
            headers.forEach((header, index) => {
                pin[header.trim()] = data[index].trim();
            });
            return pin;
        });
        return pins;
    }

    function addPinToAlbum(pin) {
        const pinElement = document.createElement('div');
        pinElement.className = 'pin';

        const img = document.createElement('img');
        img.src = pin.image;
        img.alt = pin.title;

        const title = document.createElement('h3');
        title.textContent = pin.title;

        const description = document.createElement('p');
        description.textContent = pin.description;

        pinElement.appendChild(img);
        pinElement.appendChild(title);
        pinElement.appendChild(description);

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

    // function convertFileToBase64(file) {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = error => reject(error);
    //     });
    // }
});
