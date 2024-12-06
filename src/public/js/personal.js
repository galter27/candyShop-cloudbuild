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

function showErrorAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'jump-alert';
    alertDiv.innerHTML = `
        <span class="close-alert">&times;</span>
        ${message.replace(/\n/g, '<br>')}
    `;

    // Append the alert div to the body
    document.body.appendChild(alertDiv);

    // Calculate the duration based on the number of lines (1 second per line)
    const lineCount = message.split('\n').length;
    const displayDuration = lineCount * 1000; // Duration in milliseconds

    // Close button functionality
    const closeButton = alertDiv.querySelector('.close-alert');
    closeButton.addEventListener('click', () => {
        alertDiv.classList.add('fade-out');
    });

    // Automatically remove the alert after the calculated display duration
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
    }, displayDuration);

    // Remove the alert after fade-out transition
    alertDiv.addEventListener('transitionend', () => {
        if (alertDiv.classList.contains('fade-out')) {
            alertDiv.remove();
        }
    });
}

// *****************
// My Account      *
// *****************   

// My Deatails  

function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
async function changePassword() {
    const currentPass = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;

    // Validation
    if (!currentPass || !newPass) {
        showErrorAlert("Please fill in both fields.");
        return;
    }

    if (newPass.length < 6) {
        showErrorAlert("The new password must be at least 6 characters.");
        return;
    }

    try {
        // Send data to the server
        const response = await fetch('/personal/myAccount/updatePass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPass, newPass })
        });

        const result = await response.json();
        if (result.success) {
            showSuccessAlert("change-pass");
            closeModal();
        } else {
            showErrorAlert("Failed to change password.");
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showErrorAlert("An error occurred while changing the password.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitButton');

    submitButton.addEventListener('click', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const birthYear = parseInt(document.getElementById('year').value, 10);
        const city = document.getElementById('city').value;
        const street = document.getElementById('street').value;
        const addNumber = document.getElementById('number').value;

        let isValid = true;
        let errorMessage = '';

        // Validation - all required, string get string, number get number.
        if(!email || !name || !phone || !city || !street || !number) {
            isValid = false;
            errorMessage += 'All fields are required, please fill all!.\n';
        }

        if(!isNaN(name)) {
            isValid = false;
            errorMessage += "Name can't be number!\n";
        }

        // Validation inputs by pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailPattern.test(email)) {
            isValid = false;
            errorMessage += 'Invalid email format.\n';
        }

        const phonePattern = /^(050|055|054|058|053|052)\d{7}$/;
        if (phone && !phonePattern.test(phone)) {
            isValid = false;
            errorMessage += 'Phone number must start with 050, 055, 054, 058, 053, or 052, followed by 7 digits.\n';
        }

        if (birthYear > 2014 || isNaN(birthYear)) {
            isValid = false;
            errorMessage += 'You are too yound, you need to be at least 10.\n';
        }


        if (isValid) {
            setTimeout(() => {
                if(document.getElementById('updateForm')){
                    showSuccessAlert('myAccount-save-alert');
                    document.getElementById('updateForm').submit();
                }
            },3000);
        } else {
            showErrorAlert(errorMessage);
        }
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const openPasswordModalButton = document.getElementById('openPasswordModal');
    const passwordModal = document.getElementById('passwordModal');

    // פתיחת ה-popup כאשר לוחצים על הכפתור
    openPasswordModalButton.addEventListener('click', () => {
        passwordModal.style.display = 'block';
    });

    // סגירת ה-popup כאשר לוחצים על ה-X בתוך ה-popup
    function closeModal() {
        passwordModal.style.display = 'none';
    }

    // סגירת ה-popup כאשר לוחצים מחוץ ל-popup
    window.addEventListener('click', (event) => {
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
    });

    // הפונקציה לסגירת ה-popup כדי שנוכל לקרוא לה גם מה-HTML
    window.closeModal = closeModal;
});
//--------------
// My Favorite  |
//--------------

// Add Product To Favorite - work
function addToFavorites(productId) {
    fetch('/products/addFav', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productId }),
    })
    .then(response =>{
        if(response.ok) {
            showSuccessAlert('add-favorite-alert');
            if(document.querySelector(`#favorite-icon-${productId}`)){
                document.querySelector(`#favorite-icon-${productId}`).classList.add('favorited');
            }
        }
    })
}

// Remove Product From Favorite - work
async function removeFavorite(productId) {
    try {
        const response = await fetch('/personal/myAccount/favorite/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productId }),
        });

        if (response.ok) {
            showSuccessAlert('remove-favorite-alert');
            const productCard = document.querySelector(`[data-product-id="${productId}"]`).closest('.product-card');
            productCard.remove();
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorAlert('An error occurred while removing the product to favorits.')
    }
}

//--------------
// My Orders    |
//--------------

// See order details - work
async function showCustOrder(element) {
    const orderId = element.getAttribute('data-order-id');
    window.location.href = `/personal/myAccount/orders/${orderId}`;
}

const statusBar = document.getElementById('statusBar');
const statusText = document.getElementById('statusText');
const statusEl = document.getElementById('status');
if (statusEl){
    const status = statusEl.innerText;
    let progress = 0;
    if(statusBar) {
        statusBar.classList.remove('status-pending', 'status-processing', 'status-shipped', 'status-delivered');
    }

    switch (status) {
        case "Pending":
            progress = 25;
            statusBar.classList.add('status-pending');
            break;
        case "Processing":
            progress = 50;
            statusBar.classList.add('status-processing');
            break;
        case "Shipped":
            progress = 75;
            statusBar.classList.add('status-shipped');
            break;
        case "Delivered":
            progress = 100;
            statusBar.classList.add('status-delivered');
            break;
        default:
            progress = 0;
    }

    if(statusBar) {
        statusBar.style.width = progress + "%";
    }
}


// *****************
// *    Admin      *
// *****************

//---------------
// All Customers |
//---------------

// Make all inputs editable
function toggleEditMode(customerId) {
    const customerRow = document.querySelector(`tr[data-id="${customerId}"]`);
    const editButton = customerRow.querySelector('.edit-btn-cust');
    const saveButton = customerRow.querySelector('.save-btn-cust');

    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';

    const inputs = customerRow.querySelectorAll('.customer-input');
    inputs.forEach(input => {
        if (input.tagName === 'SELECT') {
            input.removeAttribute('disabled');
        } else {
            input.removeAttribute('readonly');
        }
        input.classList.add('editable');
    });

    customerRow.classList.add('edit-mode');
}

function saveCustomer(customerId) {
    let isValid = true;
    let errorMessage = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const year = document.getElementById('year').value;
    const phone = document.getElementById('phone').value;
    const addNumber = document.getElementById('addNumber').value;
    const city = document.getElementById('city').value;
    const street =  document.getElementById('street').value;

    if (!name || !email || !phone || !addNumber || !city || !street) {
        isValid = false;
        errorMessage += 'All fields are required, please fill all!.\n';
    } else if(!isNaN(name)) {
        isValid = false;
        errorMessage += "Name can't be a number!\n";
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(email && !emailPattern.test(email)) {
        isValid = false;
        errorMessage += "Please enter a valid email!\n";
    }
    
    if(year > 2014) {
        isValid = false;
        errorMessage += 'Age too young - year need to be 2014 and less!\n';
    }

    const phonePattern = /^(052|050|053|054|055|058)\d{7}$/;
    if(phone && !phonePattern.test(phone)) {
        isValid = false;
        errorMessage += "Please enter a valid phone!\n";
    }

    if(isValid) {
        const customerRow = document.querySelector(`tr[data-id="${customerId}"]`);
        const editButton = customerRow.querySelector('.edit-btn-cust');
        const saveButton = customerRow.querySelector('.save-btn-cust');

        editButton.style.display = 'inline-block';
        saveButton.style.display = 'none';

        const inputs = customerRow.querySelectorAll('.customer-input');
        const customerData = {};
        inputs.forEach(input => {
            customerData[input.name] = input.value;
            if (input.tagName === 'SELECT') {
                input.setAttribute('disabled', 'true');
            } else {
                input.setAttribute('readonly', 'true');
            }
            input.classList.remove('editable');
        });

        fetch(`/personal/admin/customers/update/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessAlert('save-alert');

                // Remove background color when exiting edit mode
                customerRow.classList.remove('edit-mode');
            } else {
                console.error('Error:', data.message);
                showErrorAlert('An error occurred while saving the customer details.')

            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorAlert('An error occurred while saving the customer details.')
        });
    } else {
        showErrorAlert(errorMessage);
    }
    
}
//---------------
// All Orders    |
//---------------

// make the order status editable
function enableStatusEdit(orderId) {
    const statusSelect = document.getElementById(`orderStatus-${orderId}`);
    const saveButton = document.getElementById(`saveStatusButton-${orderId}`);
    const editButton = document.getElementById(`editStatusButton-${orderId}`);

    statusSelect.disabled = false;

    saveButton.style.display = 'inline-block';
    editButton.style.display = 'none';
}

function updateOrderStatus(orderId) {
    const selectedStatus = document.getElementById(`orderStatus-${orderId}`).value;
    // Make a PUT request to update the order status
    fetch(`/personal/admin/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus: selectedStatus }) // Send the updated status
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessAlert('order-status-alert');
            // Disable the <select> dropdown after saving
            const statusSelect = document.getElementById(`orderStatus-${orderId}`);
            statusSelect.disabled = true;
            
            // Reset the buttons: Hide Save, show Edit
            document.getElementById(`saveStatusButton-${orderId}`).style.display = 'none';
            document.getElementById(`editStatusButton-${orderId}`).style.display = 'inline-block';
        } else {
            showErrorAlert('Failed to update status.')
        }
    })
}

// Delete the order
document.querySelectorAll('.remove').forEach(icon => {
    icon.addEventListener('click', async () => {
        const orderId = icon.getAttribute('data-order-id');

        try {
            const response = await fetch(`/personal/admin/orders/${orderId}/remove`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId: orderId })
            });

            const result = await response.json();
            if (response.ok) {
                showSuccessAlert('delete-order-alert');
                setTimeout(() => {
                    window.location.href = `/personal/admin/orders`;
                }, 1000 );
            } else {
                alert(result.error); // Show error message
            }
        } catch (error) {
            console.error('Error removing order:', error);
            showErrorAlert('Failed to remove order.')
        }
    });
});

// See order details - works
async function seeOrder(element) {
    const orderId = element.getAttribute('data-order-id');
    window.location.href=`/personal/admin/orders/${orderId}`;
}


//---------------
// All Products  |
//---------------


// delete product
function deleteProduct(productId) {
    const imagePath = `/public/images/product_${productId}.svg`;
    
    fetch(`/personal/admin/products/${productId}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imagePath })
    })
    .then(response => {
        if (response.ok) {
            showSuccessAlert('delete-alert');
            document.querySelector(`[data-product-id="${productId}"]`).remove();
        } else {
            return response.text().then(text => {
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message);
                } catch {
                    throw new Error('Unexpected response: ' + text);
                }
            });
        }
    })
    .catch(error => {
        showErrorAlert('Error deleting product: ');

    });
}

// edit product
function editProduct(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId);
        showErrorAlert('Product card not found');
        return;
    }
    productCard.classList.add('edit-mode');

    const inputs = productCard.querySelectorAll('input');

    if (inputs.length === 0) {
        console.error('No input fields found in product card for ID:', productId);
        showErrorAlert('No input fields found in product card');
    } else {
        inputs.forEach(input => {
            input.removeAttribute('readonly');
            input.classList.add('editable');
            if (input.classList.contains('product-price-input')) {
                const originalPrice = input.getAttribute('data-original-price');
                input.value = originalPrice;
            }
        });
    }

    const dropdownContainer = productCard.querySelector('.dropdown-container');
    if (dropdownContainer) {
        dropdownContainer.style.display = 'block';
    }

    const editButton = productCard.querySelector('.edit-btn');
    if (editButton) {
        editButton.src = '/public/images/save.svg';
        editButton.onclick = () => saveProduct(productId);
    } else {
        console.error('Edit button not found in product card for ID:', productId);
        showErrorAlert('Edit btn not found');
    }
}

// save product
function saveProduct(productId) {
    let isValid = true;
    let errorMessage ='';
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);

    if (!productCard) {
        console.error('Product card not found for ID:', productId);
        showErrorAlert('Product card not found');
        return;
    }

    const name = productCard.querySelector('.product-name')?.value;
    const price = productCard.querySelector('.product-price')?.value;
    const description = productCard.querySelector('.product-description')?.value;
    const inventory = productCard.querySelector('.product-inventory')?.value;

    const flavors = Array.from(productCard.querySelectorAll('.flavor-dropdown option:checked')).map(e => e.value);
    const allergans = Array.from(productCard.querySelectorAll('.allergan-dropdown option:checked')).map(e => e.value);
    const sweetType = productCard.querySelector('.sweet-type-dropdown').value;
    const kosher = productCard.querySelector('.kosher-dropdown').value;

    if(!name || !price || !inventory || !description) {
        isValid = false;
        errorMessage += 'All fields are required, please fill all!.\n';
    } 
    if(name && !isNaN(name)) {
        isValid = false;
        errorMessage += "Name can't be a number!\n";
    }

    if (price && isNaN(price)) {
        isValid = false;
        errorMessage += 'Price must to be a number!\n';
    } 
    if (price && !(price > 0 && price <= 100)) {
        isValid = false;
        errorMessage += 'Price need to be between 1-100!\n';
    }

    if(inventory && isNaN(inventory)) {
        isValid = false;
        errorMessage += 'Inventory must to e a number!\n';
    }
    if (inventory && !(inventory >= 0 && inventory <=200)) {
        isValid = false;
        errorMessage += 'Inventory need to be between 0-200!\n';
    }

    if(description && !isNaN(description)) {
        isValid = false;
        errorMessage += "Description can't be a number!\n";
    }

    if(!flavors) {
        isValid = false;
        errorMessage += "You need to choose at least one flavor!\n";
    }

    if(!allergans) {
        isValid = false;
        errorMessage += "You need to choose at least one allergans!\n";
    }

    if(!sweetType) {
        isValid = false;
        errorMessage += "You need to choose sweet type!\n";
    }

    if(!kosher) {
        isValid = false;
        errorMessage += "You need to decide if the product kosher or not!\n";
    }

    if(isValid) {
        fetch(`/personal/admin/products/${productId}/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, price, description, inventory, flavors: JSON.stringify(flavors), allergans: JSON.stringify(allergans), sweetType, kosher }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessAlert('product-save-alert');
                    productCard.classList.remove('edit-mode');
                    const inputs = productCard.querySelectorAll('input');
                    inputs.forEach(input => {
                        input.setAttribute('readonly', 'readonly');
                        input.classList.remove('editable');
                    });
                    setTimeout (() =>{
                        window.location.reload();
                    }, 2000);
                        
                    const dropdownContainer = productCard.querySelector('.dropdown-container');
                    if (dropdownContainer) {
                        dropdownContainer.style.display = 'none';
                    }
    
                    const editButton = productCard.querySelector('.edit-btn');
                    if (editButton) {
                        editButton.src = '/public/images/edit.svg';
                        editButton.onclick = () => editProduct(productId);
                    } else {
                        console.error('Edit button not found in product card for ID:', productId);
                    }
    
                } else {
                    showErrorAlert('Failed to update product');
                }
            })
            .catch(error => {
                console.error('Error updating product:', error);
                showErrorAlert('An error occurred while updating the product. Please try again.');
            });
    } else {
        showErrorAlert(errorMessage);
    }
}


//---------------
// Add Product   |
//---------------

document.addEventListener('DOMContentLoaded', () => {
    console.log("Preview script loaded");

    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const inventoryInput = document.getElementById('inventory');
    const descriptionInput = document.getElementById('description');
    const fileInput = document.getElementById('fileInput');

    const previewName = document.getElementById('previewName');
    const previewPrice = document.getElementById('previewPrice');
    const previewInventory = document.getElementById('previewInventory');
    const previewDescription = document.getElementById('previewDescription');
    const previewImage = document.getElementById('previewImage');

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            previewName.textContent = nameInput.value || 'Product Name';
        });
    }

    if (priceInput) {
        priceInput.addEventListener('input', () => {
            previewPrice.textContent = priceInput.value ? `${priceInput.value}₪` : 'Price: $0';
        });
    }

    if (inventoryInput) {
        inventoryInput.addEventListener('input', () => {
            previewInventory.textContent = inventoryInput.value ? `${inventoryInput.value} items` : 'Inventory: 0 items';
        });
    }

    if (descriptionInput) {
        descriptionInput.addEventListener('input', () => {
            previewDescription.textContent = descriptionInput.value || 'Description';
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file && file.type === 'image/svg+xml') {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImage.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                previewImage.src = '/public/images/upload.svg';
            }
        });
    }
});

let selectedFlavors = [];

document.getElementById('FlavorDropdown').addEventListener('change', function() {
    const selectedValue = this.value;

    if (!selectedFlavors.includes(selectedValue) && selectedValue !== "") {
        selectedFlavors.push(selectedValue);
        renderSelectedFlavors();
    }
});

function renderSelectedFlavors() {
    const selectedFlavorsDiv = document.getElementById('selectedFlavors');
    selectedFlavorsDiv.innerHTML = '';
    
    selectedFlavors.forEach((flavor, index) => {
        const flavorSpan = document.createElement('span');
        flavorSpan.textContent = flavor;
        flavorSpan.classList.add('flavor-item');
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.classList.add('remove-flavor');
        removeButton.addEventListener('click', () => {
            removeFlavor(index);
        });
        
        flavorSpan.appendChild(removeButton);
        selectedFlavorsDiv.appendChild(flavorSpan);
    });
}

function removeFlavor(index) {
    selectedFlavors.splice(index, 1);
    renderSelectedFlavors();
}

let selectedAllergans = [];

document.getElementById('AllerganDropdown').addEventListener('change', function() {
    const selectedValue = this.value;

    if (!selectedAllergans.includes(selectedValue) && selectedValue !== "") {
        selectedAllergans.push(selectedValue);
        renderSelectedAllergans();
    }
});

function renderSelectedAllergans() {
    const selectedAllergansDiv = document.getElementById('selectedAllergans');
    selectedAllergansDiv.innerHTML = '';
    
    selectedAllergans.forEach((allergan, index) => {
        const allerganSpan = document.createElement('span');
        allerganSpan.textContent = allergan;
        allerganSpan.classList.add('allergan-item');
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.classList.add('remove-allergan');
        removeButton.addEventListener('click', () => {
            removeAllergan(index);
        });
        
        allerganSpan.appendChild(removeButton);
        selectedAllergansDiv.appendChild(allerganSpan);
    });
}

function removeAllergan(index) {
    selectedAllergans.splice(index, 1);
    renderSelectedAllergans();
}

let selectedSweetType = "";

document.getElementById('SweetTypeDropdown').addEventListener('change', function() {
    const selectedValue = this.value;

    if (selectedValue !== "") {
        selectedSweetType = selectedValue;
        renderSelectedSweetType();
    }
});

function renderSelectedSweetType() {
    const selectedSweetTypeDiv = document.getElementById('selectedSweetType');
    selectedSweetTypeDiv.innerHTML = '';
    
    const sweetTypeSpan = document.createElement('span');
    sweetTypeSpan.textContent = selectedSweetType;
    sweetTypeSpan.classList.add('sweet-type-item');

    selectedSweetTypeDiv.appendChild(sweetTypeSpan);
}

let selectedKosher = "";

document.getElementById('KosherDropdown').addEventListener('change', function() {
    const selectedValue = this.value;

    if (selectedValue !== "") {
        selectedKosher = selectedValue;
        renderSelectedKosher();
    }
});

function renderSelectedKosher() {
    const selectedKosherDiv = document.getElementById('selectedKosher');
    selectedKosherDiv.innerHTML = '';
    
    const kosherSpan = document.createElement('span');
    kosherSpan.textContent = selectedKosher;
    kosherSpan.classList.add('kosher-item');

    selectedKosherDiv.appendChild(kosherSpan);
}

// Function of validate the add product form and sent the new product to the server.
async function submitProduct() {
    let isValid = true;
    let errorMessage = '';

    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const inventory = document.getElementById('inventory').value;
    const description = document.getElementById('description').value;
    const flavors = document.getElementById('FlavorDropdown').value;
    const allergans = document.getElementById('AllerganDropdown').value;
    const sweetType = document.getElementById('SweetTypeDropdown').value;
    const kosher = document.getElementById('KosherDropdown').value;

    if(!name || !price || !inventory || !description) {
        isValid = false;
        errorMessage += 'All fields are required, please fill all!.\n';
    } 
    if(name && !isNaN(name)) {
        isValid = false;
        errorMessage += "Name can't be a number!\n";
    }

    if (price && isNaN(price)) {
        isValid = false;
        errorMessage += 'Price must to be a number!\n';
    } 
    if (price && !(price > 0 && price <= 100)) {
        isValid = false;
        errorMessage += 'Price need to be between 1-100!\n';
    }

    if(inventory && isNaN(inventory)) {
        isValid = false;
        errorMessage += 'Inventory must to e a number!\n';
    }
    if (inventory && !(inventory >= 0 && inventory <=200)) {
        isValid = false;
        errorMessage += 'Inventory need to be between 0-200!\n';
    }

    if(description && !isNaN(description)) {
        isValid = false;
        errorMessage += "Description can't be a number!\n";
    }

    if(!flavors) {
        isValid = false;
        errorMessage += "You need to choose at least one flavor!\n";
    }

    if(!allergans) {
        isValid = false;
        errorMessage += "You need to choose at least one allergans!\n";
    }

    if(!sweetType) {
        isValid = false;
        errorMessage += "You need to choose sweet type!\n";
    }

    if(!kosher) {
        isValid = false;
        errorMessage += "You need to decide if the product kosher or not!\n";
    }

    if(!isValid) {
        showErrorAlert(errorMessage);
    } else  {
        const form = document.getElementById('productForm');
        const formData = new FormData(form);

        formData.append('flavors', JSON.stringify(selectedFlavors));
        formData.append('allergans', JSON.stringify(selectedAllergans));
        formData.append('sweetType', selectedSweetType);
        formData.append('kosher', selectedKosher);

        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true;

        try {
            const response = await fetch('/personal/admin/addProducts', {
                method: 'POST',
                body: formData, // Send the form data
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    showSuccessAlert('success-alert'); // Show success alert
                    setTimeout(() => {
                        window.location.href = '/personal/admin/products'; // Redirect after 2 seconds
                    }, 2000);
                } else {
                    showErrorAlert('An error occurred while adding the product.');
                    submitButton.disabled = false; // Re-enable submit button if there's an error
                }
            } else {
                throw new Error('Error submitting the product');
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            showErrorAlert('An error occurred while adding the product.')
            submitButton.disabled = false; // Re-enable the submit button on error
        }
    }
    
}

// Event listener of add product
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', submitProduct);
    }
});


//---------------
// All Stores    |
//---------------

function toggleEditModeStore(storeId) {
    const storeRow = document.querySelector(`tr[data-id="${storeId}"]`);
    const editButton = storeRow.querySelector('.edit-btn-store');
    const saveButton = storeRow.querySelector('.save-btn-store');

    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';

    const inputs = storeRow.querySelectorAll('.store-input');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.classList.add('editable');
    });

    storeRow.classList.add('edit-mode');
}

function saveStore(storeId) {
    const storeRow = document.querySelector(`tr[data-id="${storeId}"]`);
    const editButton = storeRow.querySelector('.edit-btn-store');
    const saveButton = storeRow.querySelector('.save-btn-store');

    const name = storeRow.querySelector('.name').value;
    const city = storeRow.querySelector('.city').value;
    const street = storeRow.querySelector('.street').value;
    const number = storeRow.querySelector('.number').value;
    const latitude = storeRow.querySelector('.latitude').value.trim();
    const longitude = storeRow.querySelector('.longitude').value.trim();

    let isValid = true;
    let errorMessage = '';

    if(!name) {
        isValid = false;
        errorMessage += 'Name is required\n';
    } else if(!isNaN(name)) {
        isValid = false;
        errorMessage += "Name can't be a number!\n";
    }

    if(!city || !street || !number) {
        isValid = false;
        errorMessage += 'City, Street and Number are required!\n';
    } if (!isNaN(city) || !isNaN(street) || isNaN(number)) {
        isValid = false;
        errorMessage += "City and Street - String, Number - number!\n";
    }

    const coordinatePatern = /^(\+|-)?((([1-8]?[0-9])(\.\d+)?)|(90(\.0+)?))$/;
    if(!latitude || !longitude) {
        isValid = false;
        errorMessage += 'Coordinates are required!\n';
    } else if(!coordinatePatern.test(latitude) || !coordinatePatern.test(longitude)) {
        isValid = false;
        errorMessage += 'The coordinate you enter are invalid! (ex 34.0000,34.0000)\n';
    }

    if(isValid) {
        const storeData = {
            name: name,
            address: {
                city: city,
                street: street,
                number: number,
            },
            coordinates: [parseFloat(latitude), parseFloat(longitude)],
        };

        editButton.style.display = 'inline-block';
        saveButton.style.display = 'none';

        const inputs = storeRow.querySelectorAll('.store-input');
        inputs.forEach(input => {
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
                setTimeout(() => {
                    storeRow.classList.remove('edit-mode');
                }, 2000);
            } else {
                console.error('Error updating store:', data.message);
                showErrorAlert('An error occurred while updating the store details.');
            }
        })
        .catch(error => {
            console.error('Error with the server request:', error);
            showErrorAlert('An error occurred while updating the store details.');
        });
    } else {
        showErrorAlert(errorMessage);
    }
    
}


async function submitStore() {
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const latitude = document.getElementById('latitude').value.trim();
    const longitude = document.getElementById('longitude').value.trim();

    let isValid = true;
    let errorMessage = '';

    // Validation - all required, string get string, number get number.
    if (!name) {
        isValid = false;
        errorMessage += 'Name is required!\n';
    } else if (!isNaN(name)) {
        isValid = false;
        errorMessage += "Name can't be a number!\n";
    }

    if (!city || !street || !number) {
        isValid = false;
        errorMessage += 'Address is required!\n';
    }

    // Validation inputs by pattern.
    const coordinatePattern = /^(\+|-)?((([1-8]?[0-9])(\.\d+)?)|(90(\.0+)?))$/;
    if (!latitude || !longitude) {
        isValid = false;
        errorMessage += 'Coordinates are required!\n';
    } else if (!coordinatePattern.test(latitude) || !coordinatePattern.test(longitude)) {
        isValid = false;
        errorMessage += 'Invalid coordinates! (example: 34.0000, 34.0000)\n';
    }

    if (isValid) {
        let address = {
            city: city,
            street: street,
            number: number,
        };
        let coordinates = [parseFloat(latitude), parseFloat(longitude)];
        let storeId = new Date().getTime().toString();

        let store = {
            name: name,
            address: address,
            coordinates: coordinates,
            storeId: storeId,
        };

        const submitButton = document.getElementById('submitButton');
        submitButton.disabled = true;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(store),
        };

        try {
            const response = await fetch('/personal/admin/addStores', requestOptions);

            if (response.ok) {
                showSuccessAlert('save-store-alert');
                setTimeout(() => {
                    window.location.href = '/personal/admin/stores';
                }, 2000);
            } else {
                console.error(`Error ${response.status}: ${response.statusText}`);
                showErrorAlert('Failed to save the store. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showErrorAlert('An error occurred while saving the store. Please try again.');
            submitButton.disabled = false; // Enable the button again
        }
    } else {
        showErrorAlert(errorMessage);
    }
}

// Delete store
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
        showErrorAlert('An error occurred while deleting the store.');
    });
}



