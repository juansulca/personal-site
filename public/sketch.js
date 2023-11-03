/**
 *  Sound recorder sketch for Experiment 2
 E1, E2, E3
G1, G2, G3
A1, A2, A3,
B1, B2, B3
 **/

const threshold = 12;

let soundLoop;
let synth;
let osc;
let note;
let soundLoopIntervalSec;
let started = false;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  userStartAudio();

  synth = new p5.MonoSynth();

  note = getNote();

  soundLoopIntervalSec = getRandomLoopInterval();
  console.log(soundLoopIntervalSec);
  soundLoop = setupSoundLoop(note, soundLoopIntervalSec);

  // const playButton = createButton("play");
  // playButton.position(40, 0);

  cnv.mouseClicked(() => {
    if (!started) {
      synth.play(note, 1, 0, 1);
      soundLoop.start();
      started = true;
    }
  });

  mic = new p5.AudioIn();

  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  let spectrum = fft.analyze();

  const y = fft.getEnergy("mid", "midHigh");
  const mappedValue = map(y, 0, 60, 0, 255);
  background(mappedValue);
  // showMicLevel(y);

  if (y > threshold) {
    drawRandomLine();
  }
  // printDebugText()
}

function getNote() {
  const note = random(["E", "G", "A", "B", "D"]);
  const oct = random([4, 5, 6]);
  return `${note}${oct}`;
}

function getRandomLoopInterval() {
  const r = random(0, 100);
  if (r > 90) return 4;
  if (r > 70) return 6;
  if (r > 40) return 8;

  return 16;
}

function setupSoundLoop(note, interval) {
  return new p5.SoundLoop((timeFromNow) => {
    synth.play(note, 1, timeFromNow, 1);
  }, interval);
}

function drawRandomLine() {
  stroke(121, 255, 123);
  const weight = random(0.1, 2);
  strokeWeight(weight);

  const x1 = random(width);
  const y1 = random(height);
  const x2 = x1 + random(-width - 100, width + 100);
  const y2 = y1 + random(-height - 100, height + 100);
  line(x1, y1, x2, y2);
}

function printDebugText() {
  strokeWeight(1);
  fill(121, 255, 123);
  stroke(121, 255, 123);
  text(note, 10, 20);
  text(soundLoopIntervalSec, 10, 40);
}

function showMicLevel(y) {
  noFill();
  strokeWeight(1);
  stroke(121, 255, 123);
  text(`Mic Level: ${round(y)}`, 10, 50);
}
