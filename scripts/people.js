document.addEventListener("DOMContentLoaded", () => {
  // --- Inject CSS ---
  const css = `
    .people-grid {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      justify-items: start;
      align-items: start;
      padding: 0 4px;
    }

    .person h2 {
      font-size: 21px; /* alumni and general names */
      margin: 0 0 0.1em 0;
      line-height: 1.2;
      font-weight: 700;
    }
    /* Make alumni names a bit smaller */
    #alumni .person h2 { font-size: 19px; }
    .person p {
      font-size: 16px;
      margin: 0;
      line-height: 1.4;
    }
    .note {
      font-size: 12px;
      color: #555;
      font-style: italic;
      margin: 0 0 0.35rem 0;
    }

    /* Circular photos */
    .person-image {
      width: 144px; height: 144px; /* 20% larger */
      border-radius: 50%;
      object-fit: cover;
      display: block;
      margin-bottom: 0.5rem;
    }

    /* PhD advisee links in primary color */
    .person-info a {
      color: var(--primary, #0066cc);
      text-decoration: none;
      font-size:22px; /* PhD slightly larger */
    }
    .person-info a:hover { text-decoration: underline; }

    /* Extended group */
    .extended-names {
      color: black;
      text-align: left !important;
      margin: 0 auto;
      max-width: 800px;
      padding: 0 1rem;
      font-size: 20px; /* Extended group smallest but close */
    }
    
    @media (min-width: 768px) {
      .extended-names {
        padding-left: 3rem;
        padding-right: 3rem;
      }
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // --- Data (add optional `note` anywhere) ---
  const data = {
    phdAdvisees: [
      { name: "Jacob Springer",  photo: "images/member_photos/jacob_springer.png",  website: "https://sprin.xyz/", interests: "", note: "" },
      { name: "Gaurav Ghosal",   photo: "images/member_photos/gaurav_ghosal.png",   website: "https://grghosal.github.io", interests: "", note: "" },
      { name: "Chen Wu",         photo: "images/member_photos/chen_wu.png",         website: "https://chenwu.io/", interests: "" },
      { name: "Ziqian Zhong",    photo: "images/member_photos/ziqian_zhong.png",    website: "https://fjzzq2002.github.io/", interests: "" },
      { name: "Jingchu Gai",    photo: "images/member_photos/jingchu_gai.png",    website: "https://scholar.google.com/citations?user=Oz9rdHUAAAAJ&hl=en", interests: "", note:"co-advised with Andrej Risteski"},
      { name: "Pratyush Maini",    photo: "images/member_photos/pratyush_maini.png",    website: "https://pratyushmaini.github.io/", interests: "", note:"collaborator"},
      { name: "Xingyu Dang",     photo: "images/member_photos/xingyu_dang.jpg",     website: "https://xingyudang.com", interests: "", note:"collaborator"}
    ],
    extendedGroup: [
      { name: "Shashwat Saxena"},{ name: "Ishaan Watts"}, { name: "Bryan Wang"}, {name:"Catherine Li"}, { name: "Sophia Sandholm"}, { name: "Olina Mukherjee"} 
    ],
    alumni: [
      { name: "Christina Baek", prevPosition: "PhD at CMU", nextPosition: "OpenAI", interests: "", note: "co-advised with Zico Kolter" },
      { name: "Sachin Goyal",  prevPosition: "PhD at CMU",  nextPosition: "Anthropic", note: "advised by Zico Kolter" },
      { name: "Pratyush Maini",  prevPosition: "PhD at CMU",  nextPosition: "Founding member of DatologyAI", note: "advised by Zico Kolter" },
      { name: "Tanishq Kumar",  prevPosition: "Undergrad at Harvard",  nextPosition: "PhD at Stanford", note: "" },
      { name: "Taeyoun Kim",     prevPosition: "Masters at CMU", nextPosition: "Researcher at CMU", note: "" },
      { name: "Charles Ding",   prevPosition: "Undergrad at CMU",      nextPosition: "Masters at Stanford", note: "" },
      { name: "Suhas Kotha",    prevPosition: "Undergrad at CMU",      nextPosition: "PhD at Stanford University"},
      { name: "Janet Hsieh",    prevPosition: "Undergrad at CMU", nextPosition: "Software engineer at Syllo", note: "co-advised with Nihar Shah" },
      { name: "Aman Mehra",     prevPosition: "Masters at CMU",        nextPosition: "ML scientist at Tesla", note: "" },
      { name: "Erik Jones",     prevPosition: "Undergrad at Stanford", nextPosition: "PhD at Berkeley", note: "" }
    ]
  };

  // --- Utils ---
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // --- Render helpers ---
  function createPhdPerson(item) {
    const interests = (item.interests || "").trim();
    const note = (item.note || "").trim();
    const name = esc(item.name);
    const link = esc(item.website || "");
    const nameHtml = link
      ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${name}</a>`
      : name; // if no website, stays black

    return `
      <div class="person">
        <img src="${esc(item.photo)}" alt="${name}" class="person-image" loading="lazy">
        <div class="person-info">
          <h2>${nameHtml}</h2>
          ${note ? `<p class="note">${esc(note)}</p>` : ``}
          ${interests ? `<p>${esc(interests)}</p>` : ``}
        </div>
      </div>
    `;
  }

  function createAlum(item) {
    const note = (item.note || "").trim();
    return `
      <div class="person">
        <div class="person-info">
          <h2>${esc(item.name)}</h2>
          ${note ? `<p class="note">${esc(note)}</p>` : ``}
          <p>${esc(item.prevPosition)} → ${esc(item.nextPosition)}</p>
        </div>
      </div>
    `;
  }

  // --- Mount points ---
  const phdEl = document.getElementById("phd-advisees");
  const extEl = document.getElementById("extended-group");
  const alumEl = document.getElementById("alumni");

  if (phdEl) {
    phdEl.innerHTML = `<div class="people-grid">${data.phdAdvisees.map(createPhdPerson).join("")}</div>`;
  }

  if (extEl) {
    // Comma-separated names with inline notes in parentheses when provided
    const list = data.extendedGroup.map(p => {
      const nm = esc(p.name);
      const nt = (p.note || "").trim();
      return nt ? `${nm} (${esc(nt)})` : nm;
    }).join(", ");
    extEl.innerHTML = `<p class="extended-names">${list}</p>`;
  }

  if (alumEl) {
    alumEl.innerHTML = `<div class="people-grid">${data.alumni.map(createAlum).join("")}</div>`;
  }
});
