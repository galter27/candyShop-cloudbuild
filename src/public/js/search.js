async function showFilter() {
    const advancedSearchDiv = document.getElementById('advancedSearch');
        
    if (advancedSearchDiv) {
        // Toggle the display property between 'block' (visible) and 'none' (hidden)
        if (advancedSearchDiv.style.display === 'none' || advancedSearchDiv.style.display === '') {
            advancedSearchDiv.style.display = 'block';
        } else {
            advancedSearchDiv.style.display = 'none';
        }
    }
}

async function searchFilter() {
    // Get the selected values from the dropdowns
    const flavor = document.getElementById('flavor').value;
    const allergans = document.getElementById('allergans').value;
    const sweetType = document.getElementById('sweetType').value;
    const kosher = document.getElementById('kosher').value;

    // Create a URLSearchParams object to store the filter data
    const searchParams = new URLSearchParams();

    // Add only non-'All' values to the search parameters
    if (flavor !== 'All') searchParams.append('flavor', flavor);
    if (allergans !== 'All') searchParams.append('allergans', allergans);
    if (sweetType !== 'All') searchParams.append('sweetType', sweetType);
    if (kosher !== 'All') searchParams.append('kosher', kosher);

    // Redirect the user to the search results page with the selected filters as query parameters
    window.location.href = '/search/filter?' + searchParams.toString();
}