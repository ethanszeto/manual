class Collision {
  static check(a, b) {
    if (a instanceof Box) {
      if (b instanceof Box) {
        return this.boxWithBox(a, b);
      }
      return this.boxWithCircle(a, b);
    }
    if (b instanceof Box) {
      return this.boxWithCircle(b, a);
    }
    return this.circleWithCircle(a, b);
  }

  static boxWithBox(a, b) {
    return !(a.x > b.x + b.width || a.x + a.width < b.x || a.y > b.y + b.height || a.y + a.height < b.y);
  }

  static boxWithCircle(b, c) {
    return (
      Math.hypot(c.x - Math.max(b.x, Math.min(c.x, b.x + b.width)), c.y - Math.max(b.y, Math.min(c.y, b.y + b.height))) <=
      c.radius
    );
  }

  static circleWithCircle(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y) <= a.radius + b.radius;
  }
}

/**
 * Separates an overlapping player AABB from a wall AABB using the smallest axis penetration
 * (same MTV idea as pushing out along the shallowest overlap).
 *
 * @param {Player} player
 * @param {Box} wall
 */
function separatePlayerBoxFromWall(player, wall) {
  const ol = player.x + player.width - wall.x;
  const or = wall.x + wall.width - player.x;
  const ot = player.y + player.height - wall.y;
  const ob = wall.y + wall.height - player.y;
  const m = Math.min(ol, or, ot, ob);
  if (m === ol) player.x -= ol;
  else if (m === or) player.x += or;
  else if (m === ot) player.y -= ot;
  else player.y += ob;
}

/**
 * Resolves all overlaps between the player box and static wall boxes (multiple passes for
 * stacked / adjacent solids).
 *
 * @param {Player} player
 * @param {Box[]} walls
 */
function resolvePlayerBoxAgainstWalls(player, walls) {
  const maxPasses = 10;
  for (let p = 0; p < maxPasses; p++) {
    let touched = false;
    for (const wall of walls) {
      if (Collision.boxWithBox(player, wall)) {
        separatePlayerBoxFromWall(player, wall);
        touched = true;
      }
    }
    if (!touched) break;
  }
}

/**
 * Applies velocity in small steps so fast gravity cannot tunnel through thin tiles, then
 * separates the player box from walls each step.
 *
 * @param {Player} player
 * @param {Box[]} walls
 * @param {number} dx
 * @param {number} dy
 * @param {number} maxStep max movement per substep (e.g. fraction of block size)
 */
function integratePlayerBoxWithWorldCollisions(player, walls, dx, dy, maxStep) {
  let rx = dx;
  let ry = dy;
  let guard = 0;
  while ((Math.abs(rx) > 1e-4 || Math.abs(ry) > 1e-4) && guard < 256) {
    guard++;
    const stepX = Math.abs(rx) <= maxStep ? rx : maxStep * Math.sign(rx);
    const stepY = Math.abs(ry) <= maxStep ? ry : maxStep * Math.sign(ry);
    player.x += stepX;
    player.y += stepY;
    resolvePlayerBoxAgainstWalls(player, walls);
    rx -= stepX;
    ry -= stepY;
  }
}
