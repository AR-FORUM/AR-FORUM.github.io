document.addEventListener('DOMContentLoaded', function() {
  const newsList = document.getElementById('newsList');
  
    const newsItems = [
  { date: '[Sep 2026]', content: 'Aditi is presenting <i>Disentangling memorization from generalization by design</i> at the <a href="https://kempnerinstitute.harvard.edu/learning-dynamics-workshop/ld-program-schedule/">Learning Dynamics in Natural and Artificial Intelligence</a> workshop at the Kempner Institute.'},
  { date: '[Aug 2026]', content:'Ziqian shares new work with Transluce on <a href = "https://x.com/TransluceAI/status/2085455114924638320">user awareness</a>, plus new work on <a href = "https://x.com/fjzzq2002/status/2082904767236628900">subliminal learning of model identity</a>.', highlights:['user awareness', 'subliminal learning of model identity']},
  { date: '[Jun 2026]', content: 'Aditi was named to Delta Institute\'s inaugural <a href="https://deltainstitutes.org/rising-professors-2026">Rising Professors: 2026</a> list.', highlights:['Rising Professors']},
  { date: '[Apr 2026]', content: 'Ishaan Watts is presenting <i>Sharpness-aware pretraining mitigates catastrophic forgetting</i> as an oral at the <a href="https://sites.google.com/view/icbinb-2026/home?authuser=0">ICBINB</a> workshop at ICLR 2026.', highlights:['oral']},
  { date: '[Apr 2026]', content: 'Aditi is presenting at the <a href="https://sites.google.com/view/memagent-iclr26/">MemAgents</a> and <a href="https://sites.google.com/view/icbinb-2026/home?authuser=0">I Can\'t Believe It\'s Not Better</a> workshops at ICLR 2026.'},
  { date: '[Feb 2026]', content: 'Aditi receives the Sloan Research Fellowship!'},
  { date: '[Nov 2025]', content: 'Congrats to Ziqian for Runner-Up Best Paper Award at NeurIPS 2025 workshop on reliable machine learning. Check out <a href = "https://arxiv.org/abs/2508.00161"> their work</a>.', highlights:['Runner-Up Best Paper Award']},
  { date: '[Nov 2025]', content:'Aditi is giving a talk on <i> The Missing Laws of Modern Scaling </i> at MIT.'}, 
  { date: '[Oct 2025]', content:'Ziqian releases <a href = "https://arxiv.org/abs/2510.20270">Impossible Bench</a> to identify and measure reward hacking in coding agents.'}, 
  { date: '[Oct 2025]', content:'Aditi is giving a talk on <i> The Missing Laws of Modern Scaling </i> at Cornell Tech.'}, 
  { date: '[Sep 2025]', content:'Aditi joined the <a href = "https://twimlai.com/podcast/twimlai/is-it-time-to-rethink-llm-pre-training/"> TWIML podcast </a> to talk about our research on rethinking pretraining.'}, 
  { date: '[July 2025]', content: 'Aditi receives the NSF CAREER award.'},
  { date: '[July 2025]', content: 'Congrats to Vaishnavh, Chen and Charles for an ICML 2025 Outstanding Paper Award. Check out their work on <a href = "https://arxiv.org/pdf/2504.15266"> creativity </a> of language models.', highlights:['Outstanding Paper Award']},
	{ date: '[July 2025]', content: 'Aditi is giving two ICML workshop talks at <a href = "https://dataworldicml2025.github.io/index.html"> DataWorld: Unifying Data Curation Frameworks Across Domains </a> and <a href = "https://sites.google.com/view/moss2025/"> Methods and Opportunities at Small Scale</a>.' },
	{ date: '[July 2025]', content: 'Check out our oral presentation on <a href = "https://arxiv.org/pdf/2504.15266"> creativity </a>of language models at ICML 2025.', highlights:['oral'] },
	{ date: '[May 2025]', content: 'Congrats to Jacob and Sachin for two best paper awards at ICLR workshops for their work on <a href = "https://arxiv.org/abs/2503.19206"> catastrophic overtraining</a>.', highlights:['two best paper awards']},
	{ date: '[May 2025]', content: 'Sachin and Christina presented their work on <a href = "https://arxiv.org/pdf/2410.10796"> context-parametric inversion </a> as an oral at ICLR 2025', highlights:['oral']},
	{ date: '[May 2025]', content: 'Tanishq Kumar presented our work on <a href = "https://arxiv.org/pdf/2411.04330"> scaling laws for precision </a> as an oral at ICLR 2025', highlights:['oral'] },
	{ date: '[Dec 2024]', content: 'Aditi receives the Okawa Research Grant!'},
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
