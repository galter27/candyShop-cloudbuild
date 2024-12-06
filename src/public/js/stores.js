// Function to set small alert that show the action sccess.
function showSuccessAlert(id) {
    const successAlert = document.getElementById(id);
    if (successAlert) {
        successAlert.classList.remove('hidden');
        successAlert.classList.add('visible');
    
        setTimeout(() => {
            successAlert.classList.remove('visible');
            successAlert.classList.add('hidden');
        }, 3000);
    }
}

// Function to change to edit mode the stores table.
function toggleEditModeStore(storeId) {
    const storeRow = document.querySelector(`tr[data-id="${storeId}"]`);
    const editButton = storeRow.querySelector('.edit-btn-store');
    const saveButton = storeRow.querySelector('.save-btn-store');

    // Toggle visibility: Hide edit button, show save button
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';

    // Enable inputs
    const inputs = storeRow.querySelectorAll('.store-input');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.add('editable');
    });

    // Add background color to row in edit mode
    storeRow.classList.add('edit-mode');
}

// Function to save the new store details.
function saveStore(storeId) {
    const storeRow = document.querySelector(`tr[data-id="${storeId}"]`);
    const editButton = storeRow.querySelector('.edit-btn-store');
    const saveButton = storeRow.querySelector('.save-btn-store');

    // Toggle visibility: Show edit button, hide save button
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';

    const inputs = storeRow.querySelectorAll('.store-input');
    const storeData = {};

    inputs.forEach(input => {
        if (input.name === 'coordinates') {
            storeData[input.name] = input.value.split(',').map(Number);
        } else {
            storeData[input.name] = input.value;
        }
        input.setAttribute('readonly', 'true');
        input.classList.remove('editable');
    });

    fetch(`/personal/admin/stores/update/${storeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessAlert('save-store-alert');
            setTimeout(() =>{
                storeRow.classList.remove('edit-mode');
            },2000);
            
        } else {
            console.error('Error updating store:', data.message);
        }
    })
    .catch(error => {
        console.error('Error with the server request:', error);
    });
}

// Function to add new store.
async function submitStore() {
    // Get form data
    let name = document.getElementById('name').value.trim();
    let address = document.getElementById('address').value.trim();
    let latitudeInput = document.getElementById('latitude').value.trim();
    let longitudeInput = document.getElementById('longitude').value.trim();
    let storeId = new Date().getTime().toString();

    let isValid = true;
    let errorMessage = '';

    // Validation patterns for latitude and longitude
    const latitudePattern = /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?)$/;
    const longitudePattern = /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?|180(\.0+)?)$/;

    // Validate name
    if (!name) {
        isValid = false;
        errorMessage += 'Name cannot be empty.\n';
        document.getElementById('name').focus();
    }

    // Validate address
    if (!address) {
        isValid = false;
        if (!errorMessage) document.getElementById('address').focus();
        errorMessage += 'Address cannot be empty.\n';
    }

    // Validate latitude
    if (!latitudeInput) {  // Empty check
        isValid = false;
        if (!errorMessage) document.getElementById('latitude').focus();
        errorMessage += 'Latitude cannot be empty.\n';
    } else if (!latitudePattern.test(latitudeInput)) {  // Format check
        isValid = false;
        if (!errorMessage) document.getElementById('latitude').focus();
        errorMessage += 'Latitude must be a valid number between -90 and 90.\n';
    }

    // Validate longitude
    if (!longitudeInput) {  // Empty check
        isValid = false;
        if (!errorMessage) document.getElementById('longitude').focus();
        errorMessage += 'Longitude cannot be empty.\n';
    } else if (!longitudePattern.test(longitudeInput)) {  // Format check
        isValid = false;
        if (!errorMessage) document.getElementById('longitude').focus();
        errorMessage += 'Longitude must be a valid number between -180 and 180.\n';
    }

    if (isValid) {
        // If all inputs are valid, create the coordinates array and store object
        let coordinates = [parseFloat(latitudeInput), parseFloat(longitudeInput)];
        let store = {
            name: name,
            address: address,
            coordinates: coordinates,
            storeId: storeId
        };

        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(store),
            credentials: 'same-origin'
        };

        try {
            // Make fetch request
            const response = await fetch('/personal/admin/addStores', requestOptions);

            if (response.ok) {
                // If store creation succeeded, show success alert and redirect
                showSuccessAlert('save-store-alert');
                setTimeout(() => {
                    window.location.href = '/personal/admin/stores';
                }, 2000);
            } else {
                // Log error
                console.error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.log('Error:', error);
            alert('Error: ' + error);
            submitButton.disabled = false;  // Enable the button again
        }
    } else {
        // Show all accumulated error messages
        showAlert(errorMessage);
    }
}

// Function to delete store.
async function deleteStore(storeId) {
    fetch(`/personal/admin/stores/${storeId}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ storeId: storeId })
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (data.success) {
            showSuccessAlert('delete-store-alert'); 
            document.querySelector(`[data-id="${storeId}"]`).remove();
        } else {
            throw new Error(data.error || 'Unexpected error');
        }
    })
    .catch(error => {
        alert('Error deleting store: ' + error.message);
    });
}