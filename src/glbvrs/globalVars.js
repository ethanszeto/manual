// Important Objects
let player;
let playerSprite;
let camera;
let canvas;
let canvasHeight;
let canvasWidth;
let halfCanvasWidth = canvasWidth / 2;
let halfCanvasHeight = canvasHeight / 2;
let world;
let ctx;
let gameSpace = [];
let tempAllObjs = {};
let UIstatistics;

// World Gen Presets
const t = 0.25;
const smootherT = t * t * t * (t * (t * 6 - 15) + 10);
const marginV = -12;
const marginH = -4;

// Gameplay Presets
let playerSpeed = 8;
const initialGravity = 0;
const gravityIncreaseRate = 0.4;
const maxGravity = 16;
let gravity = initialGravity;

// Any preset values/objs that do not change
const presets = {
  playerSpeed: 8,
  bgPhotoDimensions: { x: 1728, y: 993 },
  gravity: {
    initial: 0,
    increaseRate: 0.4,
    max: 16,
  },
  worldGen: {
    baseScale: 0.002,
    variationScale: 0.003,
    variationIntensity: 0.003,
    threshold: 0.4,
    smallCaveThreshold: 0.01,
    smallCaveScale: 0.0015,
    tunnelEffect: 0.5,
    t: 0.25,
    smootherT: t * t * t * (t * (t * 6 - 15) + 10),
    blockSize: 16,
    marginV: -12,
    marginH: -4,
    blockSizeMarginV: 16 * -12,
    blockSizeMarginH: 16 * -4,
  },
};

// Any values/objs that change based on the game
const state = {
  entities: {
    player: {
      player: undefined,
      playerSprite: undefined,
      jumpState: 0,
      jumpCounter: 0,
    },
  },
  world: {
    world: undefined,
    seed: Math.floor(Math.random() * 1000000000000),
    tempAllObjs: {},
    gravity: 0,
  },
  paused: false,
  camera: undefined,
  canvas: undefined,
  ctx: undefined,
  UIstatistics: undefined,
  lastUpdate: performance.now(),
  now: performance.now(),
  delta: 0,
  totalDelta: 0,
  gameSpace: [],
  framesPlayed: 0,
};

// Game State
let jumpState = 0;
let jumpCounter = 0;
let blockSizeMarginH;
let blockSizeMarginV;
let lastUpdate = performance.now();
let totalDelta = 0;
let framesPlayed = 0;
let paused = false;
let now;
let delta;
let bgPhotoDimensions = { x: 1728, y: 993 };

const dialogue = `
> Do you ever feel as if you're going no where?
      
>> Sometimes, I think. Routine erodes time, passing years carelessly. Monotony weathers the mind. But occasionally you find someone that breathes life into the world. Giving it colour. Giving it movement. 
      
> Like a Prometheus of life, perhaps, of love?
      
>> If only Prometheus unwittingly brought fire to the heart of man.
      
> And what do you wish?
      
>> I wish to be a bird, to simply fly away from the problems. Migrate from the monotony, the sadness, the disappointment. Build a nest somewhere safe and warm, with colour, with excitement. 
      
> But unfortunately we must live with a bleak world, as a bird that can never nestle in tranquility.
      
`;
