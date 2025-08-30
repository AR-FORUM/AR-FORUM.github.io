document.addEventListener('DOMContentLoaded', function () {
    // Fetch publications from publications.json and display with tabs
    fetch('publications.json')
        .then(response => response.json())
        .then(data => {
            // Merge preprints and publications arrays
            const publications = [
                ...(data.preprints || []),
                ...(data.publications || [])
            ];

            // Get all unique categories (if any)
            const categories = Array.from(new Set(
                publications
                    .map(pub => pub.venue ? pub.venue.trim() : null)
                    .filter(Boolean)
            ));

            const buttonsContainer = document.querySelector('.category-buttons');
            const publicationsList = document.querySelector('.publications-list');

            function renderPublications(filteredPublications) {
                publicationsList.innerHTML = '';
                filteredPublications.forEach(pub => {
                    // Create a unique anchor id for each paper based on a slugified title
                    const anchorId = 'pub-' + pub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

                    const div = document.createElement('div');
                    div.classList.add('publication-item');
                    div.style.margin = '1.1em 0 1.2em 0';
                    div.id = anchorId;

                    // Title (with link if available)
                    const title = document.createElement('div');
                    title.classList.add('publication-title');
                    title.style.margin = '0.2em 0 0.1em 0';
                    title.style.fontSize = '1.1em';
                    title.style.fontWeight = 'bold';
                    title.style.color = '#174ea6';
                    // Add anchor link icon to the left of the title
                    const anchorLink = document.createElement('a');
                    anchorLink.href = '#' + anchorId;
                    anchorLink.title = 'Link to this paper';
                    anchorLink.style.marginRight = '0.3em';
                    anchorLink.style.textDecoration = 'none';
                    anchorLink.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#174ea6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 1 7.07 0l1.41 1.41a5 5 0 0 1 0 7.07 5 5 0 0 1-7.07 0l-1.41-1.41"/><path d="M14 11a5 5 0 0 0-7.07 0l-1.41 1.41a5 5 0 0 0 0 7.07 5 5 0 0 0 7.07 0l1.41-1.41"/></svg>';

                    // Title text (with link to PDF if available)
                    let titleText;
                    if (pub.url) {
                        titleText = document.createElement('a');
                        titleText.href = pub.url;
                        titleText.target = '_blank';
                        titleText.textContent = pub.title;
                        titleText.style.color = '#174ea6';
                        titleText.style.textDecoration = 'none';
                        titleText.style.fontWeight = 'bold';
                    } else {
                        titleText = document.createElement('span');
                        titleText.textContent = pub.title;
                    }
                    title.appendChild(anchorLink);
                    title.appendChild(titleText);

                    // Authors
                    const authors = document.createElement('div');
                    authors.classList.add('publication-authors');
                    authors.style.margin = '0 0 0.1em 0';
                    authors.style.fontSize = '1em';
                    if (Array.isArray(pub.authors)) {
                        authors.textContent = pub.authors.join(', ');
                    } else {
                        authors.textContent = pub.authors || '';
                    }

                    // Venue/Conference
                    const venue = document.createElement('div');
                    venue.classList.add('publication-venue');
                    venue.style.margin = '0 0 0.1em 0';
                    venue.style.fontStyle = 'italic';
                    let venueText = '';
                    if (pub.venue) venueText += pub.venue;
                    if (pub.year) venueText += (venueText ? ' ' : '') + pub.year;
                    venue.textContent = venueText;

                    // Awards (Oral, Spotlight, etc.)
                    const awards = document.createElement('div');
                    awards.classList.add('publication-awards');
                    awards.style.color = '#d32f2f';
                    awards.style.margin = '0 0 0.1em 0';
                    awards.style.fontWeight = '500';
                    let oralSpotlight = '';
                    if (Array.isArray(pub.awards) && pub.awards.length > 0) {
                        // Only show if contains 'Oral', 'Spotlight', 'Outstanding', etc.
                        const keywords = ['oral', 'spotlight', 'outstanding'];
                        const found = pub.awards.find(a => keywords.some(k => a.toLowerCase().includes(k)));
                        if (found) oralSpotlight = found;
                    }
                    awards.textContent = oralSpotlight;

                    // GitHub icon for code link
                    let githubIcon = null;
                    if (pub.code) {
                        githubIcon = document.createElement('a');
                        githubIcon.href = pub.code;
                        githubIcon.target = '_blank';
                        githubIcon.style.marginLeft = '0.2em';
                        githubIcon.style.verticalAlign = 'middle';
                        githubIcon.innerHTML = `
                                                        <svg height="18" width="18" viewBox="0 0 16 16" fill="#24292f" style="display:inline-block;vertical-align:middle;">
                                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                                        </svg>`;
                    }

                    div.appendChild(title);
                    div.appendChild(authors);
                    div.appendChild(venue);
                    if (oralSpotlight) div.appendChild(awards);
                    if (githubIcon) div.appendChild(githubIcon);

                    publicationsList.appendChild(div);
                });
            }

            // Only show the 'All' tab for now
            function createAllTab() {
                buttonsContainer.innerHTML = '';
                const allButton = document.createElement('button');
                allButton.textContent = 'All';
                allButton.classList.add('category-tab', 'active');
                allButton.style.marginRight = '0.5em';
                allButton.style.marginBottom = '1.5em';
                allButton.style.background = '#e9d8fd';
                allButton.style.border = 'none';
                allButton.style.padding = '0.5em 1.5em';
                allButton.style.borderRadius = '8px';
                allButton.style.fontWeight = '500';
                allButton.style.cursor = 'pointer';
                allButton.style.fontSize = '1em';
                allButton.addEventListener('click', () => {
                    renderPublications(publications);
                });
                buttonsContainer.appendChild(allButton);
            }

            createAllTab();
            renderPublications(publications);

            // If there is a hash in the URL, scroll to the anchor after rendering
            if (window.location.hash) {
                const anchorId = window.location.hash.substring(1);
                // Use setTimeout to ensure DOM is updated
                setTimeout(() => {
                    const anchorElem = document.getElementById(anchorId);
                    if (anchorElem) {
                        anchorElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 0);
            }
        });
});