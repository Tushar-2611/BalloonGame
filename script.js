const pumpHandleImage = document.getElementById("PumpHandle");
const pumpPipeImage = document.getElementById("PumpPipe");
const pumpBox = document.getElementById("PumpBox");
const skyDiv = document.querySelector(".sky");

const balloonImages = [
  "images/Balloon1.png",
  "images/Balloon2.png",
  "images/Balloon3.png",
  "images/Balloon4.png",
  "images/Balloon5.png",
  "images/Balloon6.png",
  "images/Balloon7.png",
  "images/Balloon8.png",
  "images/Balloon9.png",
  "images/Balloon10.png",
];

let isMoving = false;
let currentTop = 480; // Pump handle initial position(top)
const moveDistance = 60; // Move distance for the pump handle and pipe
const animationDuration = 300; // Animation duration in milliseconds
let clickCount = 0; // Click counter for the pump handle
let balloonCount = 0; // Count of balloons blown

pumpHandleImage.addEventListener("click", () => {
  if (!isMoving) {
    isMoving = true;

    // Move the pump handle down
    currentTop += moveDistance;
    pumpHandleImage.style.top = `${currentTop}px`;

    // Move the pump pipe slightly up and down
    const pumpPipeTop = parseInt(pumpPipeImage.style.top, 10);
    pumpPipeImage.style.top = `${pumpPipeTop - 10}px`;

    // Make the pump box become bulge
    pumpBox.classList.add("bulge");

    setTimeout(() => {
      pumpPipeImage.style.top = `${pumpPipeTop}px`; // Reset pump pipe position
      currentTop -= moveDistance;

      pumpHandleImage.style.top = `${currentTop}px`;
      isMoving = false;

      pumpBox.classList.remove("bulge");

      inflateBalloonOnClick(); // Inflate the balloon with clicks
    }, animationDuration);
  }
});

function inflateBalloonOnClick() {
  if (balloonCount < 26) {
    let balloonImage = document.getElementById(`balloon-${balloonCount}`);
    if (!balloonImage) {
      balloonImage = createBalloon();
    }

    switch (clickCount) {
      case 0:
        balloonImage.style.transform = "scale(2, 0.5)";
        balloonImage.style.left = `${pumpPipeImage.offsetLeft + 40}px`;
        balloonImage.style.top = `${pumpPipeImage.offsetTop + 20}px`;
        break;
      case 1:
        balloonImage.style.transform = "scale(2.5, 3)";
        break;
      case 2:
        balloonImage.style.transform = "scale(6, 6)";
        break;
      case 3:
        balloonImage.style.transform = "scale(7, 7)";
        detachBalloon(balloonImage);
        clickCount = 0;
        balloonCount++;
        return;
    }

    clickCount++;
  }
}

function createBalloon() {
  const balloonContainer = document.createElement("div");
  balloonContainer.id = `balloon-${balloonCount}`;
  balloonContainer.classList.add("balloon");
  balloonContainer.style.position = "absolute";
  balloonContainer.style.left = `${pumpPipeImage.offsetLeft + 25}px`;
  balloonContainer.style.top = `${pumpPipeImage.offsetTop - 40}px`;
  balloonContainer.style.width = "50px"; // Initial deflated width
  balloonContainer.style.height = "80px"; // Initial irregular height

  // Set the background image for the balloon
  balloonContainer.style.backgroundImage = `url(${
    balloonImages[balloonCount % 10]
  })`; // Repeat images
  balloonContainer.style.backgroundSize = "contain";
  balloonContainer.style.backgroundRepeat = "no-repeat";

  // Create balloon text element
  const balloonText = document.createElement("span");
  balloonText.classList.add("balloon-text");
  balloonText.textContent = String.fromCharCode(65 + balloonCount); // Alphabet from A (65) to Z (90)

  // Add the text to the balloon container
  balloonContainer.appendChild(balloonText);
  skyDiv.appendChild(balloonContainer);

  return balloonContainer;
}
function detachBalloon(balloon) {
  // Letter on the balloon
  const balloonText = balloon.querySelector(".balloon-text").textContent;

  // Random horizontal position
  const randomX = Math.random() * window.innerWidth;

  // Hovering effect
  const hoverInterval = setInterval(() => {
    const newY = Math.sin(Date.now() / 500) * 5; // Create vertical movement
    balloon.style.transform = `translate(${
      randomX - parseInt(balloon.style.left, 10)
    }px, ${-400 + newY}px) scale(1)`; // Maintain size with scale(1)
  }, 100); // Change every 100ms

  // Balloon removed on click
  balloon.addEventListener("click", () => {
    clearInterval(hoverInterval);

    // Display the letter in the center of the screen
    displayLetter(balloonText);

    skyDiv.removeChild(balloon); // Remove balloon from DOM
  });

  // Stop hovering effect after some time
  setTimeout(() => {
    clearInterval(hoverInterval); // Stop the hovering effect
  }, 20000); // Keep hovering for 20 seconds or until clicked
}

function displayLetter(letter) {
  const letterDisplay = document.createElement("div");
  letterDisplay.classList.add("letter-display");
  letterDisplay.textContent = letter;

  document.body.appendChild(letterDisplay);

  // Fade out the letter after 2 seconds
  setTimeout(() => {
    letterDisplay.style.opacity = "0"; // Start fade out
    setTimeout(() => {
      document.body.removeChild(letterDisplay); // Remove the letter after fading out
    }, 1000); // Wait for fade out to complete
  }, 3000); // Show for 2 seconds
}
