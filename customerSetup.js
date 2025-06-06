document.addEventListener('DOMContentLoaded', function() {
    const customerForm = document.getElementById('customerForm');
    const cnicFrontInput = document.getElementById('cnicFront');
    const cnicFrontFileNameDisplay = document.getElementById('cnicFrontFileName');
    const cnicBackInput = document.getElementById('cnicBack');
    const cnicBackFileNameDisplay = document.getElementById('cnicBackFileName');
    const cnicInput = document.getElementById('cnic');
    const customersTableBody = document.querySelector('.customers-table tbody');
    const submitButton = customerForm.querySelector('button[type="submit"]');

    const customerIDInput = document.getElementById('customerID');
    const customerNameInput = document.getElementById('customerName');
    const fatherNameInput = document.getElementById('fatherName');
    const addressInput = document.getElementById('address');
    const cnicFormInput = document.getElementById('cnic');
    const primaryCellNoInput = document.getElementById('primaryCellNo');
    const secondaryCellNoInput = document.getElementById('secondaryCellNo');
    const invoiceNumberInput = document.getElementById('invoiceNumber');
    const amountOpeningInput = document.getElementById('amountOpening');
    const invoiceDateInput = document.getElementById('invoiceDate');

    const hideListBtn = document.getElementById('hideListBtn');
    const showListBtn = document.getElementById('showListBtn');
    const listContainer = document.querySelector('.list-container');
    const printSelectionDropdown = document.getElementById('printSelection');
    const customersTable = document.querySelector('.customers-table');

    let editingRow = null;

    function handleFileInputChange(inputElement, fileNameDisplayElement) {
        if (inputElement.files.length > 0) {
            fileNameDisplayElement.textContent = inputElement.files[0].name;
        } else {
            fileNameDisplayElement.textContent = 'No file chosen';
        }
    }

    if (cnicFrontInput && cnicFrontFileNameDisplay) {
        cnicFrontInput.addEventListener('change', () => {
            handleFileInputChange(cnicFrontInput, cnicFrontFileNameDisplay);
        });
    }

    if (cnicBackInput && cnicBackFileNameDisplay) {
        cnicBackInput.addEventListener('change', () => {
            handleFileInputChange(cnicBackInput, cnicBackFileNameDisplay);
        });
    }

    let relationCount = 1;

    function updateRelationButtons() {
        const relationWrappers = document.querySelectorAll('.relation-input-wrapper');
        relationWrappers.forEach((wrapper, index) => {
            const addButton = wrapper.querySelector('.add-relation-btn');
            const removeButton = wrapper.querySelector('.remove-relation-btn');

            removeButton.style.display = 'inline-block';

            if (index === relationWrappers.length - 1) {
                addButton.style.display = 'inline-block';
            } else {
                addButton.style.display = 'none';
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-relation-btn')) {
            const currentWrapper = event.target.closest('.relation-input-wrapper');
            const relationGroupContainer = currentWrapper.closest('.form-group.relation-group-container');

            relationCount++;
            const newRelationWrapper = document.createElement('div');
            newRelationWrapper.classList.add('relation-input-wrapper');
            newRelationWrapper.innerHTML = `
                <select id="relation${relationCount}" name="relation[]" class="relation-dropdown">
                    <option value="S/o">S/o</option>
                    <option value="W/o">W/o</option>
                    <option value="D/o">D/o</option>
                </select>
                <button type="button" class="add-relation-btn" title="Add another relation">+</button>
                <button type="button" class="remove-relation-btn" title="Remove relation">-</button>
            `;
            relationGroupContainer.appendChild(newRelationWrapper);
            updateRelationButtons();
        }

        if (event.target.classList.contains('remove-relation-btn')) {
            const currentWrapper = event.target.closest('.relation-input-wrapper');
            currentWrapper.remove();
            updateRelationButtons();
        }
    });

    updateRelationButtons();

    if (cnicInput) {
        cnicInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length > 0) {
                formattedValue += value.substring(0, 5);
            }
            if (value.length > 5) {
                formattedValue += '-' + value.substring(5, 12);
            }
            if (value.length > 12) {
                formattedValue += '-' + value.substring(12, 13);
            }
            e.target.value = formattedValue;
        });
    }

    if (customerForm && customersTableBody) {
        customerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(customerForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (key === 'cnicFront' || key === 'cnicBack') {
                    data[key] = value.name || 'No file selected';
                } else {
                    data[key] = value;
                }
            }

            const relationDropdowns = document.querySelectorAll('.relation-dropdown');
            data.relations = [];
            for (let i = 0; i < relationDropdowns.length; i++) {
                const relationType = relationDropdowns[i] ? relationDropdowns[i].value : '';
                if (relationType) {
                    data.relations.push({ type: relationType });
                }
            }

            if (editingRow) {
                alert('Updating customer data!');
                editingRow.cells[0].textContent = data.customerID;
                editingRow.cells[1].textContent = data.customerName;
                editingRow.cells[2].textContent = data.fatherName;
                editingRow.cells[3].textContent = data.address;
                editingRow.cells[4].textContent = data.cnic;
                editingRow.cells[5].textContent = data.primaryCellNo;

                editingRow = null;
                submitButton.textContent = 'Submit';
                customerIDInput.readOnly = false;
            } else {
                alert('Adding new customer!');
                const newRow = customersTableBody.insertRow();

                newRow.insertCell(0).textContent = data.customerID;
                newRow.insertCell(1).textContent = data.customerName;
                newRow.insertCell(2).textContent = data.fatherName;
                newRow.insertCell(3).textContent = data.address;
                newRow.insertCell(4).textContent = data.cnic;
                newRow.insertCell(5).textContent = data.primaryCellNo;

                const actionsCell = newRow.insertCell(6);
                actionsCell.classList.add('action-buttons');
                actionsCell.innerHTML = `
                    <button class="icon-btn view-btn" title="View"><i class="fas fa-eye"></i></button>
                    <button class="icon-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    <button class="icon-btn print-btn" title="Print"><i class="fas fa-print"></i></button>
                `;
            }

            customerForm.reset();
            cnicFrontFileNameDisplay.textContent = 'No file chosen';
            cnicBackFileNameDisplay.textContent = 'No file chosen';

            const initialRelationWrapper = document.querySelector('.relation-group-container .relation-input-wrapper');
            while (initialRelationWrapper && initialRelationWrapper.nextElementSibling) {
                initialRelationWrapper.nextElementSibling.remove();
            }
            if (initialRelationWrapper) {
                initialRelationWrapper.querySelector('.relation-dropdown').value = 'S/o';
            }
            relationCount = 1;
            updateRelationButtons();
        });
    }

    const printListBtn = document.getElementById('printListBtn');
    const backToDashboardBtn = document.getElementById('backToDashboardBtn');

    if (printListBtn) {
        printListBtn.addEventListener('click', function() {
            alert('Printing customer list from the main form...');
        });
    }

    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', function() {
            alert('Returning to dashboard...');
        });
    }

    if (hideListBtn && showListBtn && listContainer) {
        hideListBtn.addEventListener('click', function() {
            listContainer.style.display = 'none';
            hideListBtn.style.display = 'none';
            showListBtn.style.display = 'inline-block';
        });

        showListBtn.addEventListener('click', function() {
            listContainer.style.display = 'block'; 
            showListBtn.style.display = 'none';
            hideListBtn.style.display = 'inline-block';
        });
    }

    if (printSelectionDropdown && customersTable) {
        printSelectionDropdown.addEventListener('change', function() {
            const selectedValue = this.value;
            const headers = customersTable.querySelectorAll('th');
            const rows = customersTable.querySelectorAll('tbody tr');

            const columnIndices = {
                'customerID': 0,
                'customerName': 1,
                'fatherName': 2,
                'address': 3,
                'cnic': 4,
                'primaryCell': 5,
                'actions': 6
            };

            Object.values(columnIndices).forEach(index => {
                if (headers[index]) headers[index].style.display = 'none';
                rows.forEach(row => {
                    if (row.cells[index]) row.cells[index].style.display = 'none';
                });
            });

            if (selectedValue === 'all') {
                Object.values(columnIndices).forEach(index => {
                    if (headers[index]) headers[index].style.display = '';
                    rows.forEach(row => {
                        if (row.cells[index]) row.cells[index].style.display = '';
                    });
                });
            } else {
                const selectedColumnIndex = columnIndices[selectedValue];
                const actionsColumnIndex = columnIndices['actions'];

                if (headers[selectedColumnIndex]) headers[selectedColumnIndex].style.display = '';
                if (headers[actionsColumnIndex]) headers[actionsColumnIndex].style.display = '';

                rows.forEach(row => {
                    if (row.cells[selectedColumnIndex]) row.cells[selectedColumnIndex].style.display = '';
                    if (row.cells[actionsColumnIndex]) row.cells[actionsColumnIndex].style.display = '';
                });
            }
        });
    }


    const searchInput = document.getElementById('searchByCustomerName');

    if (searchInput && customersTableBody) {
        searchInput.addEventListener('input', function() {
            const searchText = this.value.toLowerCase().trim();
            const rows = customersTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                let rowMatches = false;
                const cells = row.children;

                const searchableColumnIndices = [0, 1, 2, 3, 4, 5];

                for (let i = 0; i < searchableColumnIndices.length; i++) {
                    const cellIndex = searchableColumnIndices[i];
                    if (cells[cellIndex]) {
                        const cellText = cells[cellIndex].textContent.toLowerCase();
                        if (cellText.includes(searchText)) {
                            rowMatches = true;
                            break;
                        }
                    }
                }

                if (rowMatches) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    if (customersTableBody) {
        customersTableBody.addEventListener('click', function(event) {
            const target = event.target.closest('button');
            if (!target) return;

            const row = target.closest('tr');
            if (!row) return;

            const customerId = row.children[0].textContent;
            const customerName = row.children[1].textContent;
            const fatherName = row.children[2].textContent;
            const address = row.children[3].textContent;
            const cnic = row.children[4].textContent;
            const primaryCell = row.children[5].textContent;

            if (target.classList.contains('view-btn')) {
                alert(`Viewing details for customer ID: ${customerId}\nName: ${customerName}\nFather Name: ${fatherName}\nAddress: ${address}\nCNIC: ${cnic}\nPrimary Cell: ${primaryCell}`);
            } else if (target.classList.contains('edit-btn')) {
                alert(`Editing customer ID: ${customerId}`);
                customerIDInput.value = customerId;
                customerNameInput.value = customerName;
                fatherNameInput.value = fatherName;
                addressInput.value = address;
                cnicFormInput.value = cnic;
                primaryCellNoInput.value = primaryCell;

                customerIDInput.readOnly = true;
                submitButton.textContent = 'Update';
                editingRow = row;
                customerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

                const relationGroupContainer = document.querySelector('.form-group.relation-group-container');
                let currentWrappers = relationGroupContainer.querySelectorAll('.relation-input-wrapper');

                for (let i = 1; i < currentWrappers.length; i++) {
                    currentWrappers[i].remove();
                }

                const firstRelationWrapper = relationGroupContainer.querySelector('.relation-input-wrapper');
                if (firstRelationWrapper) {
                    firstRelationWrapper.querySelector('.relation-dropdown').value = 'S/o';
                }
                relationCount = 1;
                updateRelationButtons();

            } else if (target.classList.contains('delete-btn')) {
                if (confirm(`Are you sure you want to delete customer ID: ${customerId} (${customerName})?`)) {
                    alert(`Deleting customer ID: ${customerId}`);
                    row.remove();
                }
            } else if (target.classList.contains('print-btn')) {
                alert(`Printing details for customer ID: ${customerId}`);
            }
        });
    }
});
