# STARFARER — The Open Universe

Open `index.html` in a desktop browser. No installation or internet needed; requires WebGL and a keyboard/mouse.

This version is a continuous 3D space game. All 96 planets have physical locations: fly around them, through the asteroid belt, and between worlds without loading screens. The map sets a destination and never teleports the ship. This is a fictional star system, not an astronomical scale simulation. Planet surfaces are solid boundaries; combat and exploration take place in space.

## Flight

- Launch or click the game to capture the mouse: move to turn, stop moving to stop turning. Escape releases the mouse and pauses. Arrow keys also steer and take priority. If capture is unavailable, screen-position steering is the fallback.
- Hold W: forward thrust. Release to slow down. S: brake quickly.
- A / D: strafe left / right. Q / R: descend / ascend relative to the ship.
- Hold Shift: fast cruise, with automatic slowdown near planets.
- F: toggle autopilot toward the selected planet. Steering keys cancel autopilot. Autopilot flies continuously, avoids intervening planets, and stops near the destination.
- M: map, destination selection, and upgrades.
- Escape: pause. Switching windows also pauses.

## Combat

Approach an unsecured planet to encounter its alien fleet. Six species have distinct movement and attacks. Every fourth world has a guardian; later worlds are harder. Aim toward enemies: the reticle glows cyan when your cannons lock onto a nearby target in front of you.

- Hold left click or Space: fire twin plasma cannons.
- E: nova pulse damages nearby enemies and clears hostile shots (14-second cooldown).

Defeat all fleets around a planet to secure it, earn crystals, and restore some hull. Purchase stronger cannons and hull in the map. Hull repairs slowly outside combat. You can leave any encounter by flying away; an unfinished wave restarts when you return. Death relaunches you from the starting point with discoveries and upgrades preserved.

Progress uses the same local browser save as the original game. Browser storage availability and using the same browser/profile affect persistence.

Captured-mouse turning is smoothed, with less sensitivity while firing at a locked target. Cannons predict target movement, and enemy brackets show health and distance.

## Graphics

HDR bloom lighting, animated detailed alien models, moving cloud layers, procedural shaded planets, atmospheres, banded gas giants, lava worlds, icy moons, rings, an instanced asteroid belt, a procedural nebula, distant stars, a detailed chase-camera ship, engine glow, cruise streaks, and a scanner. Three.js is bundled under its MIT license in `vendor/`.

The original ground-arena source remains in `game-v1.js`; the active game is `space.js`.
