document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://guestbook-production-b667.up.railway.app/api/entries';

    const form = document.getElementById('guestbook-form');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const entriesContainer = document.getElementById('entries-container');
    const errorElement = document.getElementById('error');
    const deleteAllBtn = document.getElementById('delete-all-btn'); // Get reference to new button

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
            
            // Clear only dynamically added entries, preserve H2 and Delete All button
            // Remove all existing entry cards
            const existingEntries = entriesContainer.querySelectorAll('.card.entry');
            existingEntries.forEach(entry => entry.remove());

            // Remove any existing "No entries yet" message
            const existingNoEntries = entriesContainer.querySelector('.no-entries-message');
            if (existingNoEntries) {
                existingNoEntries.remove();
            }
            
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
                    
                    // Add delete button for individual entry
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-entry-btn';
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.dataset.id = entry.id; // Store entry ID
                    deleteBtn.addEventListener('click', handleDeleteEntry); // Add event listener
                    
                    entryDiv.appendChild(messageP);
                    entryDiv.appendChild(nameP);
                    entryDiv.appendChild(deleteBtn); // Append delete button
                    entriesContainer.appendChild(entryDiv);
                });
            } else {
                const noEntriesP = document.createElement('p');
                noEntriesP.textContent = 'No entries yet. Be the first!';
                noEntriesP.className = 'no-entries-message'; // Add a class for easy selection
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

    // New function to handle individual entry deletion
    const handleDeleteEntry = async (e) => {
        clearError();
        const entryId = e.target.dataset.id;
        if (confirm('Are you sure you want to delete this entry?')) {
            try {
                await axios.delete(`${API_URL}/${entryId}`);
                fetchEntries(); // Refresh entries
            } catch (err) {
                showError('Failed to delete entry.');
                console.error(err);
            }
        }
    };

    // New function to handle deleting all entries
    const handleDeleteAllEntries = async () => {
        clearError();
        if (confirm('Are you sure you want to delete ALL entries? This cannot be undone.')) {
            try {
                await axios.delete(API_URL);
                fetchEntries(); // Refresh entries
            } catch (err) {
                showError('Failed to delete all entries.');
                console.error(err);
            }
        }
    };

    form.addEventListener('submit', handleSubmit);
    deleteAllBtn.addEventListener('click', handleDeleteAllEntries); // Add event listener for delete all button

    // Initial fetch of entries when the page loads
    fetchEntries();
});