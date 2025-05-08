let a: number, f: number;

export function setup() {
  createCanvas(windowWidth, windowHeight);
  background(34);
  a = random(2, 10);
  f = random(0.05);
}

export function draw() {
  stroke(238, 10);
  const amplitude = a;
  const frequency = f;
  beginShape();
  noFill();
  for (let x = 0; x < width; x += 2) {
    let y = sin(x * frequency);
    const t = -frameCount / 500.0;
    y += sin(x * frequency * 2.1 + t) * 4.5;
    y += sin(x * frequency * 1.72 + t * 1.121) * 4.0;
    y += sin(x * frequency * 2.221 + t * 0.437) * 5.0;
    y += sin(x * frequency * 3.1122 + t * 4.269) * 2.5;
    y *= amplitude;
    vertex(x, height / 2 + y);
  }
  endShape();

  if (frameCount % 1000 === 0) {
    background(34);
    a = random(2, 10);
    f = random(0.05);
  }
}

export function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

export function mouseReleased() {
  background(34);
  a = random(2, 10);
  f = random(0.05);
}
