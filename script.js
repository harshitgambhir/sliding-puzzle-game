const puzzle = document.getElementById("puzzle");
const movesCounter = document.getElementById("moves");

let moves = 0;
let emptyIndex = 8; // The last tile starts as empty.
const tiles = [];
const numberOverlays = [];

const data = {
  '2024-12-24': {
    imageURL: "https://i.imgur.com/F9U3Nua.jpeg",
    positions: [
      7, 0, 1, 5, 4,
      6, 2, 8, 3
    ]
  },
  '2024-12-25': {
    imageURL: 'https://i.imgur.com/RZfRvRr.jpeg',
    positions: [
      2, 7, 0, 4, 8,
      3, 1, 6, 5
    ]
  },
  '2024-12-26': {
    imageURL: 'https://i.imgur.com/IpzVGsZ.jpeg',
    positions: [
      1, 7, 0, 8, 6,
      5, 2, 4, 3
    ]
  },
  '2024-12-27': {
    imageURL: 'https://i.imgur.com/dCOMQEJ.jpeg',
    positions: [
      0, 1, 2, 3, 4,
      5, 6, 7, 8
    ]
  },
  '2024-12-28': {
    imageURL: 'https://i.imgur.com/SDaxSr5.png',
    positions: [
      1, 6, 0, 7, 3,
      8, 4, 5, 2
    ]
  },
  '2024-12-29': {
    imageURL: 'https://i.imgur.com/Z3VdOPf.png',
    positions: [
      2, 0, 5, 6, 8,
      4, 1, 7, 3
    ]
  },
  '2024-12-30': {
    imageURL: 'https://i.imgur.com/rM4YRKk.jpeg',
    positions: [
      4, 3, 2, 8, 6,
      1, 5, 7, 0
    ]
  }
}

const currentDate = new Date();
const currentDateString = currentDate.toISOString().split('T')[0];
const currentPositions = data[currentDateString].positions;
const currentImageURL  = data[currentDateString].imageURL;

// setting reference image;
const referenceImage = document.getElementById("referenceImage");
referenceImage.src = currentImageURL;

// Initialize the game.
function initGame() {
  currentPositions.forEach((pos, index) => {
    const parentDiv = document.createElement("div");
    const numberOverlay = document.createElement("div");
    const tileNumber = document.createElement('span');
    const tile = document.createElement("button");
    tile.classList.add("tile");
    tile.style.backgroundImage = `url(${currentImageURL})`;
    tile.style.backgroundPosition = `${-(pos % 3) * 100}px ${-Math.floor(pos / 3) * 100}px`;
    tile.style.backgroundSize = "300px 300px";

    numberOverlay.className = "number-overlay"
    numberOverlay.id = pos + 1;


    if (pos === 8) {
      tile.classList.add("empty");
      tile.style.backgroundImage = "none"; // Remove the image for the empty tile.
      numberOverlay.classList.add("empty");
      emptyIndex = index;
    } else {
      tile.addEventListener("click", () => moveTile(index));
    }


    tileNumber.innerHTML = pos + 1;
    numberOverlay.appendChild(tileNumber);
    parentDiv.appendChild(numberOverlay);
    parentDiv.appendChild(tile);

    puzzle.appendChild(parentDiv);
    tiles.push(tile);
    numberOverlays.push(numberOverlay);
  });
}

// Move a tile if it's adjacent to the empty space.
function moveTile(index) {
  // Calculate the row and column for the clicked tile and the empty tile.
  const clickedRow = Math.floor(index / 3);
  const clickedCol = index % 3;
  const emptyRow = Math.floor(emptyIndex / 3);
  const emptyCol = emptyIndex % 3;

  // Allow movement only if the clicked tile is directly adjacent to the empty tile.
  if (
    (clickedRow === emptyRow && Math.abs(clickedCol - emptyCol) === 1) || // Same row, adjacent column
    (clickedCol === emptyCol && Math.abs(clickedRow - emptyRow) === 1)    // Same column, adjacent row
  ) {

    // Swap the empty tile and the clicked tile.
    tiles[emptyIndex].classList.remove("empty");
    tiles[emptyIndex].style.backgroundImage = tiles[index].style.backgroundImage;
    tiles[emptyIndex].style.backgroundPosition = tiles[index].style.backgroundPosition;
    numberOverlays[emptyIndex].classList.remove("empty");
    numberOverlays[emptyIndex].innerHTML = numberOverlays[index].id;
    numberOverlays[emptyIndex].id = numberOverlays[index].id;

    tiles[index].classList.add("empty");
    tiles[index].style.backgroundImage = "none";
    numberOverlays[index].classList.add("empty");

    // Update the empty tile's index.
    emptyIndex = index;

    tiles.forEach((tile, index) => {
      tile.onclick = null; // Remove any existing click handler
      if (!tile.classList.contains("empty")) {
        tile.onclick = () => moveTile(index); // Assign a new listener
      }
    });

    // Increment the move counter and update the display.
    moves++;
    movesCounter.textContent = moves;

    // Check if the puzzle is solved after the move.
    checkWin();
  }
}


// Check if the puzzle is solved.
function checkWin() {
  const isSolved = tiles.every((tile, index) => {
    const pos = tile.style.backgroundPosition;
    const correctPos = `${-(index % 3) * 100}px ${-Math.floor(index / 3) * 100}px`;

    return tile.classList.contains("empty") || pos === correctPos;
  });

  if (isSolved) {
    const finalMovesCounter = document.getElementById("modal-moves");
    finalMovesCounter.textContent = movesCounter.textContent;
    setTimeout(() => openModal('solved'), 100);
  }
}

// Dark/Light Mode Toggle Logic
const modeToggle = document.getElementById('modeToggle');
const storedMode = localStorage.getItem('mode');
if (storedMode) {
  document.body.classList.add(storedMode);
}

modeToggle.addEventListener('click', () => {
  if (document.body.classList.contains('dark-mode')) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('mode', '');  // Remove mode preference
  } else {
    document.body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark-mode');  // Store mode preference
  }
});

function openModal(id) {
  document.getElementById('modal-'+id).style.display = 'block';
  document.getElementById('overlay-'+id).style.display = 'block';
}

function closeModal(id) {
  document.getElementById('modal-'+id).style.display = 'none';
  document.getElementById('overlay-'+id).style.display = 'none';
}

initGame();
