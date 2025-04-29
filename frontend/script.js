document.getElementById('generate-table').addEventListener('click', function() {
    const input = document.getElementById('input-syntax').value;
    if (!input) {
        alert("Please enter a logical expression.");
        return;
    }
    fetch('http://127.0.0.1:5000/generate', {
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
    .catch(error => console.error('Error:', error));
});

document.getElementById('clear-input').addEventListener('click', function() {
    document.getElementById('input-syntax').value = '';
    document.getElementById('truth-table').innerHTML = '';
});

document.getElementById('download-table').addEventListener('click', function() {
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
    // Create table headers
    data.headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr>';

    // Create table rows
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

function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results
    results.forEach(result => {
        const resultText = result ? 'True' : 'False'; // Convert to True/False
        const resultElement = document.createElement('div');
        resultElement.textContent = resultText;
        resultsContainer.appendChild(resultElement);
    });
}
