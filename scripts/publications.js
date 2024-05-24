document.addEventListener('DOMContentLoaded', function() {
  const publications = [
      {
          title:'Repetition Improves Language Model Embeddings', 
          authors:'Jacob Mitchell Springer, Suhas Kotha, Daniel Fried, Graham Neubig, Aditi Raghunathan',
          conference: 'ICLR 2024',
          awards: '',
          links: {pdf:'https://arxiv.org/pdf/2402.15449'},
          category: 'Feature Learning'
      },

      {
          title: 'Robust Machine Learning Models',
          authors: 'John Doe, Jane Smith',
          conference: 'ICML 2024',
          awards: 'Best Paper Award',
          links: {
              pdf: 'http://example.com/paper.pdf',
              code: 'http://example.com/code'
          },
          category: 'Machine Learning'
      },
      {
          title: 'Advances in AI',
          authors: 'Alice Johnson, Bob Brown',
          conference: 'NeurIPS 2023',
          awards: 'Outstanding Paper',
          links: {
              pdf: 'http://example.com/ai_paper.pdf',
              code: 'http://example.com/ai_code'
          },
          category: 'Artificial Intelligence'
      }
      // Add more publications as needed
  ];

  const categories = [...new Set(publications.map(pub => pub.category))];
  const buttonsContainer = document.querySelector('.category-buttons');
  const publicationsList = document.querySelector('.publications-list');

  function renderPublications(filteredPublications) {
      publicationsList.innerHTML = '';
      filteredPublications.forEach(pub => {
          const div = document.createElement('div');
          div.classList.add('publication-item');

          const title = document.createElement('h3');
          title.classList.add('publication-title');
          title.textContent = pub.title;

          const awards = document.createElement('p');
          awards.classList.add('publication-awards');
          awards.textContent = `${pub.awards}`;

          const authors = document.createElement('p');
          authors.classList.add('publication-authors');
          authors.textContent = `${pub.authors}`;

          const conference = document.createElement('p');
          conference.classList.add('publication-conference');
          conference.textContent = `${pub.conference}`;

          const links = document.createElement('p');
          links.classList.add('publication-links');
          links.innerHTML = `<a href="${pub.links.pdf}" target="_blank">PDF</a>, <a href="${pub.links.code}" target="_blank">Code</a>`;

          // const category = document.createElement('p');
          // category.classList.add('publication-category');
          // category.textContent = `Category: ${pub.category}`;

          div.appendChild(title);
          div.appendChild(awards);
          div.appendChild(authors);
          div.appendChild(conference);
          div.appendChild(links);
          // div.appendChild(category);

          publicationsList.appendChild(div);
      });
  }

  function createCategoryButtons() {
      // Add a button to show all publications
      const allButton = document.createElement('button');
      allButton.textContent = 'All';
      allButton.addEventListener('click', () => {
          renderPublications(publications);
      });
      buttonsContainer.appendChild(allButton);

      categories.forEach(category => {
          const button = document.createElement('button');
          button.textContent = category;
          button.addEventListener('click', () => {
              const filteredPublications = publications.filter(pub => pub.category === category);
              renderPublications(filteredPublications);
          });
          buttonsContainer.appendChild(button);
      });
  }

  createCategoryButtons();
  renderPublications(publications);  // Render all publications initially
});