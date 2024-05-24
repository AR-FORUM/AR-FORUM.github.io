document.addEventListener('DOMContentLoaded', function() {
  const newsList = document.getElementById('newsList');

  const newsItems = [
      { date: '2024-05-01', content: 'We published a new paper on AI in healthcare.' },
      { date: '2024-04-20', content: 'Our lab received a new grant for robotics research.' },
      { date: '2024-04-10', content: 'Welcome to our new lab members!' },
      { date: '2024-03-30', content: 'Our research was featured in a major science magazine.' },
      { date: '2024-05-01', content: 'We published a new paper on AI in healthcare.' },
      { date: '2024-04-20', content: 'Our lab received a new grant for robotics research.' },
      { date: '2024-05-01', content: 'We published a new paper on AI in healthcare.' },
      { date: '2024-04-20', content: 'Our lab received a new grant for robotics research.' },
      { date: '2024-04-10', content: 'Welcome to our new lab members!' },
      { date: '2024-03-30', content: 'Our research was featured in a major science magazine.' },
      { date: '2024-05-01', content: 'We published a new paper on AI in healthcare.' },
      { date: '2024-04-20', content: 'Our lab received a new grant for robotics research.' },
  ];

  newsItems.forEach(item => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';

      const newsDate = document.createElement('div');
      newsDate.className = 'news-date';
      newsDate.textContent = item.date;

      const newsContent = document.createElement('div');
      newsContent.className = 'news-content';
      newsContent.textContent = item.content;

      newsItem.appendChild(newsDate);
      newsItem.appendChild(newsContent);

      newsList.appendChild(newsItem);
  });
});