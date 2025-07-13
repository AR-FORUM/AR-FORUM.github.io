document.addEventListener("DOMContentLoaded", () => {
  const data = {
      phdAdvisees: [

      {
          name: "Christina Baek",
          photo: "images/member_photos/christina_baek.png",
          website: "https://kebaek.github.io/",
          interests: "Robustness, understanding internal state of neural networks"
      },
	  {
              name: "Jacob Springer",
              photo: "images/member_photos/jacob_springer.png",
              website: "https://sprin.xyz/",
              interests: "Robustness, understanding internal state of neural networks"
	  },
	  {
              name: "Gaurav Ghosal",
              photo: "images/member_photos/gaurav_ghosal.png",
              website: "grghosal.github.io",
              interests: "Robustness, understanding internal state of neural networks"
	  },  
	  {
              name: "Chen Wu",
              photo: "images/member_photos/chen_wu.png",
              website: "https://chenwu.io/",
              interests: "Robustness, understanding internal state of neural networks"
	  },
	  {
              name: "Ziqian Zhong",
              photo: "images/member_photos/ziqian_zhong.png",
              website: "https://fjzzq2002.github.io/",
              interests: "Interpretability and AI safety"
	  },
	  
    ],
    extendedGroup: [
      {
        name: "Janet Hsieh",
        photo: "images/member_photos/janet_hsieh.png",
        program: "MS in CS",
        advisedBy: "Co-advised by Nihar Shah"
      }
    ],
    alumni: [
      {
        name: "Alice Example",
        prevPosition: "PhD in ML",
        nextPosition: "Postdoc at MIT"
      }
    ]
  };

  function createPhdPerson(item) {
    return `
      <div class="person">
        <img src="${item.photo}" alt="${item.name}" class="person-image">
        <div class="person-info">
          <h2><a href="${item.website}" target="_blank">${item.name}</a></h2>
          <p>${item.interests}</p>
        </div>
      </div>
    `;
  }

  function createExtendedPerson(item) {
    return `
      <div class="person">
        <img src="${item.photo}" alt="${item.name}" class="person-image">
        <div class="person-info">
          <h2>${item.name}</h2>
          <p>${item.program}, ${item.advisedBy}</p>
        </div>
      </div>
    `;
  }

  function createAlum(item) {
    return `
      <div class="person">
        <div class="person-info">
          <h2>${item.name}</h2>
          <p>${item.prevPosition} → ${item.nextPosition}</p>
        </div>
      </div>
    `;
  }

  document.getElementById("phd-advisees").innerHTML = data.phdAdvisees.map(createPhdPerson).join("");
  document.getElementById("extended-group").innerHTML = data.extendedGroup.map(createExtendedPerson).join("");
  document.getElementById("alumni").innerHTML = data.alumni.map(createAlum).join("");
});
