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

    const searchByCustomerIDInput = document.getElementById('searchByCustomerID');
    const searchByCustomerNameInput = document.getElementById('searchByCustomerName');
    const searchByFatherNameInput = document.getElementById('searchByFatherName');
    const searchByAddressInput = document.getElementById('searchByAddress');
    const searchByPrimaryCellInput = document.getElementById('searchByPrimaryCell');

    let editingRow = null;

    customerIDInput.readOnly = true;

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

            removeButton.style.display = (relationWrappers.length > 1) ? 'inline-block' : 'none';


            if (index === relationWrappers.length - 1) {
                addButton.style.display = 'inline-block';
            } else {
                addButton.style.display = 'none';
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-relation-btn')) {
            Swal.fire({
                title: 'Add another relation field?',
                text: "This will add a new field for another relation.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, add it!'
            }).then((result) => {
                if (result.isConfirmed) {
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
                    Swal.fire('Added!', 'New relation field has been added.', 'success');
                }
            });
        }

        if (event.target.classList.contains('remove-relation-btn')) {
            Swal.fire({
                title: 'Remove this relation field?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, remove it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    const currentWrapper = event.target.closest('.relation-input-wrapper');
                    currentWrapper.remove();
                    updateRelationButtons();
                    Swal.fire('Removed!', 'Relation field has been removed.', 'success');
                }
            });
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
                
                editingRow.cells[0].textContent = data.customerID;
                editingRow.cells[1].textContent = data.customerName;
                editingRow.cells[2].textContent = data.fatherName;
                editingRow.cells[3].textContent = data.address;
                editingRow.cells[4].textContent = data.cnic;
                editingRow.cells[5].textContent = data.primaryCellNo;

                editingRow = null; 
                submitButton.textContent = 'Submit'; 
                customerIDInput.readOnly = true; 
                Swal.fire('Updated!', 'Customer data updated successfully!', 'success');
            } else {
                
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
                Swal.fire('Added!', 'New customer added successfully!', 'success');
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
            
            printTableContent();
        });
    }

    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', function() {
            Swal.fire({
                title: 'Return to Dashboard?',
                text: "You will be redirected to the dashboard.",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, go to dashboard!'
            }).then((result) => {
                if (result.isConfirmed) {
                    
                    Swal.fire('Redirecting...', 'Returning to dashboard now.', 'success');
                }
            });
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

    const searchInputs = {
        customerID: searchByCustomerIDInput,
        customerName: searchByCustomerNameInput,
        fatherName: searchByFatherNameInput,
        address: searchByAddressInput,
        primaryCell: searchByPrimaryCellInput
    };

    const columnMap = {
        customerID: 0,
        customerName: 1,
        fatherName: 2,
        address: 3,
        primaryCell: 5 
    };

    function filterTable() {
        const rows = customersTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            let rowMatchesAllCriteria = true;

            for (const key in searchInputs) {
                const searchInput = searchInputs[key];
                if (searchInput && searchInput.value !== '') {
                    const searchText = searchInput.value.toLowerCase().trim();
                    const columnIndex = columnMap[key];
                    const cellText = row.cells[columnIndex].textContent.toLowerCase();

                    if (!cellText.includes(searchText)) {
                        rowMatchesAllCriteria = false;
                        break; 
                    }
                }
            }

            if (rowMatchesAllCriteria) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    
    for (const key in searchInputs) {
        if (searchInputs[key]) {
            searchInputs[key].addEventListener('input', filterTable);
        }
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

                customerIDInput.value = customerId;
                customerNameInput.value = customerName;
                fatherNameInput.value = fatherName;
                addressInput.value = address;
                cnicFormInput.value = cnic;
                primaryCellNoInput.value = primaryCell;
                secondaryCellNoInput.value = ''; 
                invoiceNumberInput.value = ''; 
                amountOpeningInput.value = '';
                invoiceDateInput.value = '';

                
                customerIDInput.readOnly = true;
                customerNameInput.readOnly = true;
                fatherNameInput.readOnly = true;
                addressInput.readOnly = true;
                cnicFormInput.readOnly = true;
                primaryCellNoInput.readOnly = true;
                secondaryCellNoInput.readOnly = true;
                invoiceNumberInput.readOnly = true;
                amountOpeningInput.readOnly = true;
                invoiceDateInput.readOnly = true;

                
                document.getElementById('cnicFront').disabled = true;
                document.getElementById('cnicBack').disabled = true;
                document.querySelector('label[for="cnicFront"]').style.display = 'none';
                document.querySelector('label[for="cnicBack"]').style.display = 'none';

                
                document.querySelectorAll('.relation-dropdown').forEach(dropdown => dropdown.disabled = true);
                document.querySelectorAll('.add-relation-btn').forEach(btn => btn.style.display = 'none');
                document.querySelectorAll('.remove-relation-btn').forEach(btn => btn.style.display = 'none');


                submitButton.style.display = 'none'; 

                customerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } else if (target.classList.contains('edit-btn')) {
                
                customerIDInput.value = customerId;
                customerNameInput.value = customerName;
                fatherNameInput.value = fatherName;
                addressInput.value = address;
                cnicFormInput.value = cnic;
                primaryCellNoInput.value = primaryCell;
                secondaryCellNoInput.value = ''; 
                invoiceNumberInput.value = ''; 
                amountOpeningInput.value = '';
                invoiceDateInput.value = '';

                
                customerIDInput.readOnly = true;
                customerNameInput.readOnly = false;
                fatherNameInput.readOnly = false;
                addressInput.readOnly = false;
                cnicFormInput.readOnly = false;
                primaryCellNoInput.readOnly = false;
                secondaryCellNoInput.readOnly = false;
                invoiceNumberInput.readOnly = false;
                amountOpeningInput.readOnly = false;
                invoiceDateInput.readOnly = false;

                
                document.getElementById('cnicFront').disabled = false;
                document.getElementById('cnicBack').disabled = false;
                document.querySelector('label[for="cnicFront"]').style.display = '';
                document.querySelector('label[for="cnicBack"]').style.display = '';

                 
                document.querySelectorAll('.relation-dropdown').forEach(dropdown => dropdown.disabled = false);
                
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


                submitButton.style.display = 'inline-block'; 
                submitButton.textContent = 'Update'; 
                editingRow = row; 
                customerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

            } else if (target.classList.contains('delete-btn')) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: `Do you want to delete customer ID: ${customerId} (${customerName})?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        row.remove();
                        Swal.fire(
                            'Deleted!',
                            'Customer has been deleted.',
                            'success'
                        );
                    }
                });
            } else if (target.classList.contains('print-btn')) {
                printRowContent(row);
            }
        });
    }

    function printRowContent(row) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Customer Details</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; margin-bottom: 20px; }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<h2>Customer Details</h2>');
        printWindow.document.write('<table class="customers-table">');
        printWindow.document.write('<thead><tr>');
        
        customersTable.querySelectorAll('thead th').forEach((header, index) => {
            if (index < 6) { 
                printWindow.document.write(`<th>${header.textContent}</th>`);
            }
        });
        printWindow.document.write('</tr></thead>');
        printWindow.document.write('<tbody><tr>');
        
        row.querySelectorAll('td').forEach((cell, index) => {
            if (index < 6) { 
                printWindow.document.write(`<td>${cell.textContent}</td>`);
            }
        });
        printWindow.document.write('</tr></tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    function printTableContent() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Customers List</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; margin-bottom: 20px; }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<h2>Customers List</h2>');
        printWindow.document.write('<table class="customers-table">');
        printWindow.document.write('<thead>' + customersTable.querySelector('thead').innerHTML + '</thead>');
        printWindow.document.write('<tbody>');
        customersTable.querySelectorAll('tbody tr').forEach(row => {
            const clonedRow = row.cloneNode(true);
            const actionsCell = clonedRow.querySelector('.action-buttons');
            if (actionsCell) {
                actionsCell.remove();
            }
            printWindow.document.write(clonedRow.outerHTML);
        });
        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
});
