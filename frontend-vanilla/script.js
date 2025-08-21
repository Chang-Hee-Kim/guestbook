document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:5001/api/entries';

    const form = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const entriesContainer = document.getElementById('entries-container');
    const errorElement = document.getElementById('error');

    const showError = (message) => {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    };

    const clearError = () => {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    };

    const fetchEntries = async () => {
        try {
            const response = await axios.get(API_URL);
            const entries = response.data;
            
            // Clear existing entries
            entriesContainer.innerHTML = '<h2>Entries</h2>'; 
            
            if (entries.length > 0) {
                entries.forEach(entry => {
                    const entryDiv = document.createElement('div');
                    entryDiv.className = 'card entry';
                    
                    const messageP = document.createElement('p');
                    messageP.className = 'message';
                    messageP.textContent = `"${entry.message}"`;
                    
                    const nameP = document.createElement('p');
                    nameP.className = 'name';
                    nameP.textContent = `- ${entry.name} on ${new Date(entry.timestamp).toLocaleString()}`;
                    
                    entryDiv.appendChild(messageP);
                    entryDiv.appendChild(nameP);
                    entriesContainer.appendChild(entryDiv);
                });
            } else {
                const noEntriesP = document.createElement('p');
                noEntriesP.textContent = 'No entries yet. Be the first!';
                entriesContainer.appendChild(noEntriesP);
            }
        } catch (err) {
            showError('Failed to fetch entries. Is the backend server running?');
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        const name = nameInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !message) {
            showError('Name and message cannot be empty.');
            return;
        }

        try {
            await axios.post(API_URL, { name, message });
            nameInput.value = '';
            messageInput.value = '';
            fetchEntries(); // Refresh entries
        } catch (err) {
            showError('Failed to post message.');
            console.error(err);
        }
    };

    form.addEventListener('submit', handleSubmit);

    // Initial fetch of entries when the page loads
    fetchEntries();
});
