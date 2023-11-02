import PianoRoll from "./pianoroll.js";
// import * as d3 from `./node_modules/d3`;
// import * as d3 from "d3";

class PianoRollDisplay {
  constructor(csvURL) {
    this.csvURL = csvURL;
    this.data = null;
  }

  async loadPianoRollData() {
    try {
      const response = await fetch("https://pianoroll.ai/random_notes");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      this.data = await response.json();
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  preparePianoRollCard(rollId) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("piano-roll-card");

    // Create and append other elements to the card container as needed
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("description");
    descriptionDiv.textContent = `This is a piano roll number ${rollId}`;
    cardDiv.appendChild(descriptionDiv);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("piano-roll-svg");
    svg.setAttribute("width", "80%");
    svg.setAttribute("height", "150");

    // Append the SVG to the card container
    cardDiv.appendChild(svg);

    return { cardDiv, svg };
  }

  async generateSVGs() {
    if (!this.data) await this.loadPianoRollData();
    if (!this.data) return;

    const pianoRollContainer = document.getElementById("pianoRollContainer");
    // const rollList = document.querySelector(".rollList");
    const rollList = document.getElementById("list");
    // pianoRollContainer.innerHTML = "";
    rollList.innerHTML = "";
    for (let it = 0; it < 20; it++) {
      const start = it * 60;
      const end = start + 60;
      const partData = this.data.slice(start, end);

      const { cardDiv, svg } = this.preparePianoRollCard(it);

      // pianoRollContainer.appendChild(cardDiv);
      rollList.appendChild(cardDiv);
      const roll = new PianoRoll(svg, partData);
    }
  }
}

document.getElementById("loadCSV").addEventListener("click", async () => {
  const csvToSVG = new PianoRollDisplay();

  await csvToSVG.generateSVGs();
});

// -----
const rollsList = document.querySelector(".container");
const rightRollBar = document.querySelector(".rollList");

rollsList.addEventListener("click", onClick);

function onClick(e) {
  if (!e.target.classList.contains("piano-roll-svg")) {
    return;
  }

  const selectedItem = e.target;
  const parentRoll = selectedItem.closest(".piano-roll-card");
  const pianoRollSelectedContainer = document.querySelector(".selectedRoll");

  // Clear the existing content in the selected roll container
  while (pianoRollSelectedContainer.firstChild) {
    pianoRollSelectedContainer.removeChild(
      pianoRollSelectedContainer.firstChild
    );
  }

  // Clone the selected parentRoll and add it to the container
  const clonedRoll = parentRoll.cloneNode(true);
  pianoRollSelectedContainer.appendChild(clonedRoll);

  rollsList.classList.add("play-container");
  rollsList.classList.remove("container");
  rightRollBar.classList.add("roll-list-container");
  rightRollBar.classList.remove("rollList");
}

// Function to handle drag events
function dragstarted(event, d) {
  // Get the initial mouse position
  d3.select(this).raise().attr("stroke", "black");
  d3.select(".piano-roll-svg").on("mousemove", dragged);
}

function dragged(event, d) {
  // Get the current mouse position
  // Update the selection visually as the user drags
  // For example, change the color of the selected area or extend the selection
  // This part may vary based on how you want to visually represent the selection

  // Example: changing color on drag
  d3.select(this).attr("fill", "red");
}

function dragended(event, d) {
  console.log("y");
  d3.select(this).attr("stroke", null);
  d3.select(".piano-roll-svg").on("mousemove", null);
}

// Using D3 to attach drag events to the rectangles (assuming the rectangles represent the notes)
d3.selectAll(".note-rectangle").call(
  d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
);
