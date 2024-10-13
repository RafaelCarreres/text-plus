document.addEventListener('DOMContentLoaded', function() {
    loadStoredEntries();
    document.querySelector('.add-btn').addEventListener('click', addEntry);
    document.getElementById('description').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addEntry();
        }
    });
    document.getElementById('text').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            addEntry();
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            window.close();
        }
    });
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.entry') && !event.target.closest('.add-entry')) {
            window.close();
        }
    });
});

function addEntry() {
    const description = document.getElementById('description').value;
    const text = document.getElementById('text').value;

    if (description && text) {
        addEntryToDOM(description, text);
        saveEntry(description, text);
        document.getElementById('description').value = '';
        document.getElementById('text').value = '';
        document.getElementById('description').blur();
        document.getElementById('text').blur();
    }
}

function loadStoredEntries() {
    chrome.storage.local.get(['entries'], function(result) {
        if (result.entries) {
            result.entries.forEach(entry => {
                addEntryToDOM(entry.description, entry.text);
            });
        }
    });
}

function saveEntry(description, text) {
    chrome.storage.local.get(['entries'], function(result) {
        let entries = result.entries || [];
        entries.push({ description, text });
        chrome.storage.local.set({ entries }, function() {
            console.log('Entry saved:', { description, text });
        });
    });
}

function addEntryToDOM(description, text) {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');

    const descriptionBtn = document.createElement('button');
    descriptionBtn.classList.add('description-btn');
    descriptionBtn.textContent = description;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';

    descriptionBtn.onclick = () => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
            window.close(); // This will close the popup
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    deleteBtn.onclick = () => {
        entryDiv.remove();
        removeEntryFromStorage(description);
    };

    entryDiv.appendChild(descriptionBtn);
    entryDiv.appendChild(deleteBtn);
    document.getElementById('entries').appendChild(entryDiv);
}

function removeEntryFromStorage(description) {
    chrome.storage.local.get(['entries'], function(result) {
        let entries = result.entries || [];
        entries = entries.filter(entry => entry.description !== description);
        chrome.storage.local.set({ entries }, function() {
            console.log('Entry removed:', description);
        });
    });
}


