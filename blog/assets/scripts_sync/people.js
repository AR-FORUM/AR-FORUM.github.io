document.addEventListener("DOMContentLoaded", () => {
  // --- Inject CSS ---
  const css = `
    .people-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      justify-items: start;
      align-items: start;
    }

    .person h2 {
      font-size: 18px;
      margin: 0 0 0.1em 0;
      line-height: 1.2;
      font-weight: 700;
    }
    .person p {
      font-size: 15px;
      margin: 0;
      line-height: 1.4;
    }
    .note {
      font-size: 14px;
      color: #555;
      font-style: italic;
      margin: 0 0 0.35rem 0;
    }

    /* Circular photos */
    .person-image {
      width: 120px; height: 120px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      margin-bottom: 0.5rem;
    }

    /* PhD advisee links in primary color */
    .person-info a {
      color: var(--primary, #0066cc);
      text-decoration: none;
    }
    .person-info a:hover { text-decoration: underline; }

    /* Extended group */
    .extended-names {
      font-size: 16px;
      color: black;
      text-align: left !important;
      margin: 0;
      padding-left: 9rem;
      padding-right: 9rem;
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // --- Data (add optional `note` anywhere) ---
  const data = {
    phdAdvisees: [
      { name: "Christina Baek", photo: "images/member_photos/christina_baek.png", website: "https://kebaek.github.io/", interests: "", note: "co-advised with Zico Kolter" },
      { name: "Jacob Springer",  photo: "images/member_photos/jacob_springer.png",  website: "https://sprin.xyz/", interests: "", note: "" },
      { name: "Gaurav Ghosal",   photo: "images/member_photos/gaurav_ghosal.png",   website: "https://grghosal.github.io", interests: "", note: "" },
      { name: "Chen Wu",         photo: "images/member_photos/chen_wu.png",         website: "https://chenwu.io/", interests: "" },
      { name: "Ziqian Zhong",    photo: "images/member_photos/ziqian_zhong.png",    website: "https://fjzzq2002.github.io/", interests: "" },
      { name: "Sachin Goyal",    photo: "images/member_photos/sachin_goyal.png",    website: "https://saching007.github.io/", interests: "", note:"collaborator"},
      { name: "Xingyu Dang",     photo: "images/member_photos/xingyu_dang.jpg",     website: "https://xingyudang.com", interests: "", note:"collaborator"}
    ],
    extendedGroup: [
      { name: "Neil Kale"}, { name: "Manan Agarwal"}, { name: "Ashish Ramayee Asokan"}, { name: "Arnav Goel"}, { name: "Shashwat Saxena"},{ name: "Ishaan Watts"}, 
      { name: "Jerick Shi", note:"co-advised with Vince Conitzer"}, { name: "Sophia Sandholm"}, { name: "Olina Mukherjee"}, { name: "Catherline Li"}, 
    ],
    alumni: [
      { name: "Tanishq Kumar",  prevPosition: "Undergrad at Harvard",  nextPosition: "PhD at Stanford", note: "" },
      { name: "Taeyoun Kim",     prevPosition: "Masters at CMU", nextPosition: "Researcher at CMU", note: "" },
      { name: "Charles Ding",   prevPosition: "Undergrad at CMU",      nextPosition: "Masters at Stanford", note: "" },
      { name: "Suhas Kotha",    prevPosition: "Undergrad at CMU",      nextPosition: "PhD at Stanford University"},
      { name: "Janet Hsieh",    prevPosition: "Undergrad at CMU, co-advised with Nihar Shah", nextPosition: "Software engineer at Syllo", note: "co-advised with Nihar Shah" },
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
