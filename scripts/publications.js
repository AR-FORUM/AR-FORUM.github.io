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
            // === ADD: cutoff + year-grouping helper ================================
            const CUTOFF = 2021;
            function yearGroup(y) {
                if (!y) return 'Unknown';
                const n = parseInt(y, 10);
                if (!Number.isFinite(n)) return 'Unknown';
                return n <= CUTOFF ? `${CUTOFF} & earlier` : String(n);
            }
      // ======================================================================

            // Get all unique years
            const years = Array.from(new Set(
                publications
                    .map(pub => pub.year)
                    .filter(Boolean)
            )).sort((a, b) => b - a); // Sort years in descending order

            const buttonsContainer = document.querySelector('.category-buttons');
            const publicationsList = document.querySelector('.publications-list');

            function renderPublicationsByYear() {
                publicationsList.innerHTML = '';
                
                // Group publications by year
                const publicationsByYear = {};
                publications.forEach(pub => {
                    const key = yearGroup(pub.year);
                    (publicationsByYear[key] ||= []).push(pub);
                });
                
                // Sort years in descending order
                const sortedYears = Object.keys(publicationsByYear).sort((a, b) => {
                    if (a === 'Unknown') return 1;
                    if (b === 'Unknown') return -1;
                    return parseInt(b) - parseInt(a);
                });

                let isFirst = true;
                
                // Render each year section
                sortedYears.forEach(year => {
                    // Create year header
                    const yearHeader = document.createElement('h2');
                    yearHeader.textContent = year;
                    if(isFirst) {
                        isFirst = false;
                    }
                    else {
                        yearHeader.style.paddingTop = '0.5em';
                    }
                    // yearHeader.style.borderBottom = '2px solid #ddd';
                    yearHeader.style.marginBottom = '0.5em';
                    publicationsList.appendChild(yearHeader);
                    
                    // Render publications for this year
                    publicationsByYear[year].forEach(pub => {
                        renderSinglePublication(pub);
                    });
                });
            }
            
            function createIconLink(url, type) {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.marginLeft = '0.35em';
                link.style.verticalAlign = 'middle';
                link.style.display = 'inline-flex';
                link.style.alignItems = 'center';
                link.style.justifyContent = 'center';
                link.style.width = '1.9em';
                link.style.height = '1.9em';
                link.style.borderRadius = '999px';
                link.style.transition = 'all 0.2s ease';
                link.style.textDecoration = 'none';
                
                const palettes = {
                    website: {
                        iconClass: 'ri-earth-fill',
                        label: 'Project website',
                        color: '#1a73e8',
                        hoverColor: '#0b60cf',
                        background: 'rgba(26, 115, 232, 0.12)',
                        hoverBackground: 'rgba(26, 115, 232, 0.20)'
                    },
                    code: {
                        iconClass: 'ri-code-box-fill',
                        label: 'Source code',
                        color: '#c2185b',
                        hoverColor: '#ad1457',
                        background: 'rgba(194, 24, 91, 0.12)',
                        hoverBackground: 'rgba(194, 24, 91, 0.20)'
                    }
                };
                
                const palette = palettes[type] || {
                    iconClass: type,
                    label: 'External link',
                    color: '#374151',
                    hoverColor: '#1f2937',
                    background: 'rgba(55, 65, 81, 0.12)',
                    hoverBackground: 'rgba(55, 65, 81, 0.20)'
                };
                
                link.style.backgroundColor = palette.background;
                link.style.color = palette.color;
                link.title = palette.label;
                link.setAttribute('aria-label', palette.label);
                link.innerHTML = `<i class="${palette.iconClass}" style="font-size: 1.15em; line-height: 1;"></i>`;

                link.addEventListener('mouseenter', () => {
                    link.style.backgroundColor = palette.hoverBackground;
                    link.style.color = palette.hoverColor;
                });
                link.addEventListener('mouseleave', () => {
                    link.style.backgroundColor = palette.background;
                    link.style.color = palette.color;
                });

                return link;
            }

            function renderSinglePublication(pub) {
                    // Create a unique anchor id for each paper based on a slugified title
                    const anchorId = 'pub-' + pub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    const div = document.createElement('div');
                    div.classList.add('publication-item');
                    div.style.margin = '0.5em 0 0.5em 0';
                    div.style.padding = '1em';
                    div.style.borderRadius = '8px';
                    div.style.cursor = 'pointer';
                    div.style.transition = 'all 0.2s ease';
                    div.style.border = '1px solid transparent';
                    div.id = anchorId;
                    
                    // Add hover effect (border only, no background change)
                    div.addEventListener('mouseenter', () => {
                        div.style.border = '1px solid #aaa';
                    });
                    
                    div.addEventListener('mouseleave', () => {
                        div.style.border = '1px solid transparent';
                    });

                    // Title (with link if available)
                    const title = document.createElement('div');
                    title.classList.add('publication-title');
                    title.style.margin = '0.0em 0 0.1em 0';
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
                    
                    // Add expand/collapse arrow
                    const arrow = document.createElement('span');
                    arrow.textContent = ' ▼';
                    arrow.style.fontSize = '0.8em';
                    arrow.style.color = '#666';
                    arrow.style.marginLeft = '0.5em';
                    
                    // title.appendChild(anchorLink);
                    title.appendChild(titleText);
                    title.appendChild(arrow);

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

                    // Venue/Conference with GitHub link
                    const venue = document.createElement('div');
                    venue.classList.add('publication-venue');
                    venue.style.margin = '0 0 0.1em 0';
                    venue.style.fontStyle = 'italic';
                    venue.style.display = 'flex';
                    venue.style.alignItems = 'center';
                    
                    let venueText = '';
                    if (pub.venue) venueText += pub.venue;
                    if (pub.year) venueText += (venueText ? ' ' : '') + pub.year;
                    
                    const venueTextSpan = document.createElement('span');
                    venueTextSpan.textContent = venueText;
                    venue.appendChild(venueTextSpan);

                    // add a 0.1em extra space after the venue text
                    venueTextSpan.style.marginRight = '0.3em';

                    // Add icons after venue
                    if (pub.website) {
                        venue.appendChild(createIconLink(pub.website, 'website'));
                    }
                    if (pub.code) {
                        venue.appendChild(createIconLink(pub.code, 'code'));
                    }




                    // const awards = document.createElement('div');
                    // awards.classList.add('publication-awards');
                    // awards.style.color = '#d32f2f';
                    // awards.style.margin = '0 0 0.1em 0';
                    // awards.style.fontWeight = '500';
                    // let oralSpotlight = '';
                    // if (Array.isArray(pub.awards) && pub.awards.length > 0) {
                    //     // Only show if contains 'Oral', 'Spotlight', 'Outstanding', etc.
                    //     const keywords = ['oral', 'spotlight', 'outstanding'];
                    //     const found = pub.awards.find(a => keywords.some(k => a.toLowerCase().includes(k)));
                    //     if (found) oralSpotlight = found;
                    // }
                    //awards.textContent = oralSpotlight;


                    // Abstract (initially hidden)
                    const abstract = document.createElement('div');
                    abstract.classList.add('publication-abstract');
                    abstract.style.marginTop = '1em';
                    abstract.style.padding = '1em';
                    abstract.style.backgroundColor = '#f9f9f9';
                    abstract.style.borderRadius = '4px';
                    abstract.style.fontSize = '0.95em';
                    abstract.style.lineHeight = '1.5';
                    abstract.style.display = 'none';
                    abstract.style.overflow = 'hidden';
                    abstract.style.transition = 'all 0.3s ease';
                    
                    if (pub.abstract) {
                        // Render markdown with math support
                        const markdownText = marked.parse(pub.abstract);
                        abstract.innerHTML = `<strong>Abstract:</strong><br><div class="abstract-content">${markdownText}</div>`;
                        
                        // Process math after rendering
                        if (window.MathJax && MathJax.typesetPromise) {
                            MathJax.typesetPromise([abstract]).catch((err) => console.log('MathJax error:', err));
                        }
                    } else {
                        abstract.innerHTML = '<em>Abstract not available</em>';
                        console.log(pub.title+' has no abstract!');
                    }

                    div.appendChild(title);
                    div.appendChild(authors);
                    div.appendChild(venue);

                    // --- Awards (simple: show all, one per line) ---
                    if (pub.awards) {
                        const awards = document.createElement('div');
                        awards.classList.add('publication-awards');
                        awards.style.color = '#C41230';
                        awards.style.margin = '0 0 0.25em 0';
                        awards.style.fontWeight = '700';

                        let list = [];
                        if (Array.isArray(pub.awards)) {
                            list = pub.awards;
                        } else if (typeof pub.awards === 'string') {
                            list = pub.awards.split(/[,;|]/); // supports "A, B; C"
                        }

                        list.map(a => a.trim()).filter(Boolean).forEach(label => {
                            const line = document.createElement('div');
                            line.textContent = label;
                            awards.appendChild(line);
                        });                
                        div.appendChild(awards);      
                    }


                    //if (oralSpotlight) div.appendChild(awards);
                    div.appendChild(abstract);
                    
                    // Add click handler for expand/collapse
                    let isExpanded = false;
                    div.addEventListener('click', (e) => {
                        // Prevent expansion when clicking on links
                        if (e.target.tagName === 'A' || e.target.closest('a')) {
                            return;
                        }
                        
                        isExpanded = !isExpanded;
                        
                        if (isExpanded) {
                            abstract.style.display = 'block';
                            arrow.textContent = ' ▲';
                            
                            // Re-process math when abstract becomes visible
                            if (window.MathJax && MathJax.typesetPromise) {
                                MathJax.typesetPromise([abstract]).catch((err) => console.log('MathJax error:', err));
                            }
                        } else {
                            abstract.style.display = 'none';
                            arrow.textContent = ' ▼';
                        }
                    });

                    publicationsList.appendChild(div);
            }

            // Create year-based tabs
            function createYearTabs() {
                buttonsContainer.innerHTML = '';
                
                // Add "All" tab first
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
                    // Remove active class from all buttons
                    document.querySelectorAll('.category-tab').forEach(btn => {
                        btn.classList.remove('active');
                        btn.style.background = '#f5f5f5';
                    });
                    // Add active class to clicked button
                    allButton.classList.add('active');
                    allButton.style.background = '#e9d8fd';
                    renderPublications(publications);
                });
                buttonsContainer.appendChild(allButton);
                
                // Add year tabs
                years.forEach(year => {
                    const yearButton = document.createElement('button');
                    yearButton.textContent = year.toString();
                    yearButton.classList.add('category-tab');
                    yearButton.style.marginRight = '0.5em';
                    yearButton.style.marginBottom = '1.5em';
                    yearButton.style.background = '#f5f5f5';
                    yearButton.style.border = 'none';
                    yearButton.style.padding = '0.5em 1.5em';
                    yearButton.style.borderRadius = '8px';
                    yearButton.style.fontWeight = '500';
                    yearButton.style.cursor = 'pointer';
                    yearButton.style.fontSize = '1em';
                    yearButton.addEventListener('click', () => {
                        // Remove active class from all buttons
                        document.querySelectorAll('.category-tab').forEach(btn => {
                            btn.classList.remove('active');
                            btn.style.background = '#f5f5f5';
                        });
                        // Add active class to clicked button
                        yearButton.classList.add('active');
                        yearButton.style.background = '#e9d8fd';
                        // Filter publications by year
                        const filteredPubs = publications.filter(pub => pub.year === year);
                        renderPublications(filteredPubs);
                    });
                    buttonsContainer.appendChild(yearButton);
                });
            }

            // Hide the category buttons since we're using year headers instead
            buttonsContainer.style.display = 'none';
            renderPublicationsByYear();

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
