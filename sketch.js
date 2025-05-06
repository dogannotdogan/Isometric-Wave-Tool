// Define the x and y components of two vectors i and j for grid transformation
const i_x = 1;
const i_y = 0.5;
const j_x = -1;
const j_y = 0.5;

// Define the size of each image
const w = 32;
const h = 32;

let tile; 
let speedSlider, intensitySlider; 
let counter = 0; // Counter for animation

// Preload image
function preload(){
  tile = loadImage("tiles.png");
}

// Set up the canvas and sliders for controlling wave speed and intensity
function setup() {
  createCanvas(600, 600); // Create a 600x600 canvas
  tile.resize(32, 32); // Resize the tile to 32x32 pixels

  // Create a speed control slider
  speedSlider = createSlider(0.01, 0.5, 0.1, 0.01); // Range 
  speedSlider.position(10, height + 10); // Position slider 

  // Create an intensity control slider
  intensitySlider = createSlider(5, 50, 10, 1); // Range
  intensitySlider.position(10, height + 40); // Position slider below the first one
}


function draw() {
  background(220); 
  translate(width / 2, height / 3); //origin

  // Get the current values of the sliders for speed and intensity
  let speed = speedSlider.value();
  let intensity = intensitySlider.value();

  // Loop through a 10x10 grid of tiles
  for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
      // Convert grid coordinates to screen coordinates
      let tsc = to_screen_coordinate({x: i, y: j});

      // Calculate wave offset for each tile based on intensity and a sinusoidal function for animation
      let waveOffset = intensity * sin(i / 5 + j / 3 + counter) + intensity * cos(i / 2 + j / 4 + counter / 2);

      // Draw the tile at the calculated screen position with the wave offset
      image(tile, tsc.x, tsc.y + waveOffset);
    }
  }

  // Update the counter for the next frame of animation
  counter += speed;
}

// Convert grid coordinates (i, j) to screen coordinates (x, y) for drawing the tiles
function to_screen_coordinate(tile) {
  return {
    x: tile.x * i_x * 0.5 * w + tile.y * j_x * 0.5 * w, // X position based on the grid's i and j values
    y: tile.x * i_y * 0.5 * h + tile.y * j_y * 0.5 * h, // Y position based on the grid's i and j values
  };
}

// Inverts a 2x2 matrix and returns the inverse
function invert_matrix(a, b, c, d) {
  const det = (1 / (a * d - b * c)); // Calculate the determinant of the matrix
  return {
    a: det * d, 
    b: det * -b, 
    c: det * -c, 
    d: det * a,  
  };
}

// Convert onscreen coordinates to grid coordinates
function to_grid_coordinate(screen) {
  // Define the matrix components for the transformation
  const a = i_x * 0.5 * w;
  const b = j_x * 0.5 * w;
  const c = i_y * 0.5 * h;
  const d = j_y * 0.5 * h;
  
  // Get the inverse of the transformation matrix
  const inv = invert_matrix(a, b, c, d);
  
  // Apply the inverse matrix to the screen coordinates to get grid coordinates
  return {
    x: screen.x * inv.a + screen.y * inv.b, // Calculate the x coordinate on the grid
    y: screen.x * inv.c + screen.y * inv.d, // Calculate the y coordinate on the grid
  };
}
