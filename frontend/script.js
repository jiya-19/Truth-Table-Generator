const BACKEND_URL = 'https://truth-table-generator.onrender.com';

document.getElementById('generate-table').addEventListener('click', function () {
    const input = document.getElementById('input-syntax').value;
    if (!input) {
        alert("Please enter a logical expression.");
        return;
    }

    // Optional: Show loading state
    const generateBtn = document.getElementById('generate-table');
    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expression: input })
    })
    .then(response => response.json())
    .then(data => {
        displayTruthTable(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Something went wrong! Please check your internet or try again later.");
    })
    .finally(() => {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate Truth Table";
    });
});

document.getElementById('clear-input').addEventListener('click', function () {
    document.getElementById('input-syntax').value = '';
    document.getElementById('truth-table').innerHTML = '';
});

document.getElementById('download-table').addEventListener('click', function () {
    const tableData = document.getElementById('truth-table').innerHTML;
    const csvData = convertTableToCSV(tableData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'truth_table.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

function displayTruthTable(data) {
    const tableDiv = document.getElementById('truth-table');
    if (data.error) {
        tableDiv.innerHTML = `<p>${data.error}</p>`;
        return;
    }

    let tableHTML = '<table><tr>';
    data.headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr>';

    data.rows.forEach(row => {
        tableHTML += '<tr>';
        row.forEach(cell => {
            tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</table>';
    
    tableDiv.innerHTML = tableHTML;
}

function appendToInput(value) {
    const inputArea = document.getElementById('input-syntax');
    inputArea.value += value;
}

function clearInput() {
    const inputArea = document.getElementById('input-syntax');
    inputArea.value = '';
}

function convertTableToCSV(tableHTML) {
    const rows = tableHTML.match(/<tr>(.*?)<\/tr>/g);
    const csvRows = [];

    rows.forEach(row => {
        const cols = row.match(/<t[hd]>(.*?)<\/t[hd]>/g);
        const csvRow = cols.map(col => col.replace(/<.*?>/g, '').trim()).join(',');
        csvRows.push(csvRow);
    });

    return csvRows.join('\n');
}
