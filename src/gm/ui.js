function uiStatisticsInitialize() {
  UIstatistics = {
    worldSeed: new UIText(0, 30, rgba(255, 255, 255, 1), "15px Courier New", `World Seed: ${world.perlin.seed}`),
    frames: new UIText(0, 60, rgba(255, 255, 255, 1), "15px Courier New", ""),
    frameRate: new UIText(0, 90, rgba(255, 255, 255, 1), "15px Courier New", ""),
    playerPosition: new UIText(0, 120, rgba(255, 255, 255, 1), "15px Courier New", ""),
  };
}

function printUIStatistics() {
  for (let key in UIstatistics) {
    UIstatistics[key].update();
  }
}
