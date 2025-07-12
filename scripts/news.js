document.addEventListener('DOMContentLoaded', function() {
  const newsList = document.getElementById('newsList');
  
  // Re-enforce scrolling (in case CSS was overridden)
  newsList.style.maxHeight = '200px';
  newsList.style.overflowY  = 'scroll';

    const newsItems = [
	{ date: '[July 2025]', content: 'Check out our oral presentation on creativity of language models at ICML 2025.' },
	{ date: '[May 2025]', content: 'Congratulations to Jacob and Sachin for two best paper awards at ICLR workshops for their work on <a href = "https://arxiv.org/abs/2503.19206"> catastrophic overtraining</a>.', highlights:['two best paper awards']},
	{ date: '[May 2025]', content: 'Sachin and Christina presented their work on context-parametric inversion as an oral at ICLR 2025' },
	{ date: '[May 2025]', content: 'Tanishq Kumar presented our work on scaling laws for precision as an oral at ICLR 2025' },
    // …etc…
  ];

  newsItems.forEach(item => {
    // 1) Parse and format the date, but remember if it had brackets
    const originalDate = item.date;                                    // e.g. "[May 2025]"
    const stripped   = originalDate.replace(/[\[\]]/g, '');           // "May 2025"
    const d          = new Date(stripped);
    const monthYear  = !isNaN(d)
      ? d.toLocaleString('default', { month: 'long', year: 'numeric' })
      : stripped;
    const displayDate = originalDate.startsWith('[') && originalDate.endsWith(']')
      ? `[${monthYear}]`                                              // re-wrap brackets
      : monthYear;

    // 2) Build the container & date span
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';

    const newsDate = document.createElement('span');
    newsDate.className = 'news-date';
    newsDate.textContent = displayDate;

    // 3) Highlight logic (if you’ve defined item.highlights)
    let htmlContent = item.content;
    if (Array.isArray(item.highlights)) {
      item.highlights.forEach(word => {
        const re = new RegExp(`\\b(${word})\\b`, 'gi');
        htmlContent = htmlContent.replace(
          re,
          `<span class="highlight">$1</span>`
        );
      });
    }

    // 4) Build the event span
    const newsEvent = document.createElement('span');
    newsEvent.className = 'news-event';
    newsEvent.innerHTML = htmlContent;

    // 5) Append in order
    newsItem.appendChild(newsDate);
    newsItem.appendChild(newsEvent);
    newsList.appendChild(newsItem);
  });
});
