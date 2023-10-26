// Set variables
let song;
let fft;
let userControlledSize; 
let particles = []; // Array for the moving particles

// Load the audio file
function preload() {
  song = loadSound("audio/sample-visualisation.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a new FFT analysis object
  fft = new p5.FFT();
  // Add the audio into the FFT's input
  song.connect(fft);
  // Set the initial size of the central circle
  userControlledSize = width / 5;

  // Create the moving particles
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(230);

  // Get fresh data from the FFT analysis
  let spectrum = fft.analyze();
  // Get the energy in the bass frequency range
  let level = fft.getEnergy("bass");

  // Control the size of the centrol shape with the mouse
  userControlledSize = map(mouseX, 0, width, 20, 200);

  // Change the shape's size and color based on audio
  let shapeSize = userControlledSize * (level / 255) * 10;
  let shapeColor = color(255, map(level, 0, 255, 0, 255), map(level, 0, 255, 100, 200));

  // Set the color for the central shape
  fill(shapeColor);
  noStroke();
  // Draw the shape at the center of the canvas
  ellipse(width / 2, height / 2, shapeSize, shapeSize);

  // Update and display particles
  for (let particle of particles) {
    particle.update();
    particle.display();
  }

  // Play the audio when clicking the mouse
  if (mouseIsPressed) {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
    }
  }
}

// Define the Particle class for the moving particles
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 20);
    this.speedX = random(-2, 2);
    this.speedY = random(-2, 2);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Make the particles bounce off the edges
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }

    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }

  display() {
    // Set the color for the particles
    fill(255, 150); 
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}