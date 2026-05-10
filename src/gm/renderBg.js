const bgPatternCache = new Map();

/**
 * Parallax factors: fraction of camera position the layer’s texture follows.
 * Smaller = farther (slower). Layer 2 vs 3 differ so they drift against each other.
 * Haze sits between layer 3 and 2; its factors sit between those layers.
 */
const bgParallax = {
  layer3: { kx: 0.055, ky: 0.045 },
  haze: { kx: 0.09, ky: 0.07 },
  layer2: { kx: 0.13, ky: 0.1 },
};

function refreshBackgroundTileDimensionsFromImages() {
  const bg = document.getElementById("bg1");
  const b = document.getElementById("b1");
  if (bg?.naturalWidth) {
    bgPhotoDimensions.x = bg.naturalWidth;
    bgPhotoDimensions.y = bg.naturalHeight;
  } else if (b?.naturalWidth) {
    bgPhotoDimensions.x = b.naturalWidth;
    bgPhotoDimensions.y = b.naturalHeight;
  }
}

/**
 * Fills the current canvas with a repeating image, parallax-scrolled against the camera.
 * Only the visible screen (plus padding) is drawn — no off-screen tile objects.
 *
 * @param {string} imageId element id
 * @param {number} kx horizontal parallax factor
 * @param {number} ky vertical parallax factor
 */
function getRepeatPatternForImage(imageId) {
  const img = document.getElementById(imageId);
  if (!img || !img.complete || !img.naturalWidth) return null;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const cached = bgPatternCache.get(imageId);
  if (cached && cached.w === w && cached.h === h) {
    return { pattern: cached.pattern, w, h };
  }
  const pattern = ctx.createPattern(img, "repeat");
  if (!pattern) return null;
  bgPatternCache.set(imageId, { pattern, w, h });
  return { pattern, w, h };
}

function drawParallaxPatternLayer(imageId, kx, ky) {
  const built = getRepeatPatternForImage(imageId);
  if (!built) return;

  const w = built.w;
  const h = built.h;
  const pattern = built.pattern;

  const camX = camera.x;
  const camY = camera.y;
  const cw = canvas.width;
  const ch = canvas.height;

  const speedPad =
    Math.abs(player.speedX) * 3 +
    Math.abs(player.speedY) * 2 +
    Math.max(playerSpeed, maxGravity) * 2;
  const pad = Math.max(w, h, cw * 0.35, ch * 0.35, speedPad, 96);

  const shiftX = camX * kx;
  const shiftY = camY * ky;
  const ox = ((-shiftX % w) + w) % w;
  const oy = ((-shiftY % h) + h) % h;

  ctx.save();
  ctx.translate(ox, oy);
  ctx.fillStyle = pattern;
  ctx.fillRect(-ox - w - pad, -oy - h - pad, cw + 2 * (pad + w), ch + 2 * (pad + h));
  ctx.restore();
}

/**
 * Bottom → top before terrain: layer 3 (bg1), haze, layer 2 (b1).
 */
function renderParallaxBackgroundBehindWorld() {
  refreshBackgroundTileDimensionsFromImages();
  drawParallaxPatternLayer("bg1", bgParallax.layer3.kx, bgParallax.layer3.ky);
  drawParallaxPatternLayer("haze", bgParallax.haze.kx, bgParallax.haze.ky);
  drawParallaxPatternLayer("b1", bgParallax.layer2.kx, bgParallax.layer2.ky);
}
