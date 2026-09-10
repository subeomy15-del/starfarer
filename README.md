# STARFARER — The Six Gates

A desktop 3D exploration game with six universes, 24 planets per universe (144 total), walkable bases and landing sites, orbital combat, collectibles, five ship upgrade types, and six universe guardians.

Play at https://subeomy15-del.github.io/starfarer/ or serve this folder with `python3 -m http.server 8765`. No build step or external game assets are required. Uses the bundled Three.js under its MIT license. Requires WebGL and a keyboard/mouse.

## The expedition

Every session and rescue begins on foot at your universe's Ark station. Read the opening chapter, walk down the lit hangar path, approach the Kestrel, and press **E** to board. The ship lifts off and exits the station in a short launch animation.

Use the map to choose one of the universe's 24 planets. Defeat all orbital waves to secure a world; every fourth planet has a guardian fleet. Once the orbit is clear, approach within 650 m of the planet surface, slow below 120 m/s, and press **L** to land. Each planet has a generated, bounded landing region with terrain, vegetation or crystals, ruins, and eight collectible items. Exploration takes place on these landing sites rather than across the entire planetary sphere. Walk to glowing items and press **E** to collect alloy, crystals, and relics. They grant upgrade credits immediately; the workshop also accepts item trades. Collected items do not respawn.

Walk back to your ship and press **E** to return to orbit. **H** plots a course to the physical Ark station; **F** engages autopilot. Press **L** within 650 m of the station to dock, repair, and walk around the hangar again. Hostile fleets block landing and docking.

Secure all 24 planets in the current universe, then summon its guardian from the map while in a secured orbit. A rift arrival animation introduces the boss. Defeat it to teleport to the next universe's base with progress, inventory, and upgrades intact. The sixth guardian is the Null Sovereign: its defeat ends the story with all 144 worlds freed. A failed or interrupted boss encounter can be attempted again.

## Controls

| Key | In flight | On foot |
| --- | --- | --- |
| W / S | Forward / reverse | Forward / backward |
| A / D | Strafe | Strafe |
| Mouse / arrows | Steer | Look |
| Shift | Cruise | Run |
| Space | Fire | Jump |
| E | Nova pulse | Board ship / collect item |
| B | Brake (overrides thrust, strafe, cruise, autopilot) | — |
| Q / R | Descend / ascend | — |
| F | Toggle autopilot | — |
| H | Plot course to base | — |
| L | Land / dock | — |
| M | Map and workshop | Map and workshop |
| Escape | Pause | Pause |

Click the scene to capture the mouse. Arrow keys remain available if capture is blocked. Losing focus pauses flight and walking.

## Upgrades and saves

Plasma cannons increase damage, hull plating increases health, ion engines increase manual flight speed, rapid-fire coils increase firing rate, and nova reactors increase damage/range while shortening recharge. All five have eight levels.

Progress saves every five seconds while playing, after rewards and purchases, on pause, and when leaving the page. There is also a Save progress button. Saves include cleared worlds, defeated universe guardians, unlocked universe, credits, inventory, collected items, and upgrades. Sessions always restart at the base; unfinished encounters restart. Saves are local to the same browser/profile and site, not synced across devices.

Older 96-world saves retain their secured world IDs, credits, and upgrades, distributed over the first four universes. Universe guardians must be defeated in order to open the gates. The old single-boss victory flag does not skip this new campaign.

## Verification

Run `node tests/campaign.cjs` and `node tests/flight-save.cjs` for campaign/save and flight regression checks. `tests/browser-journey.cjs` exercises walking, boarding, combat-gated landing, loot, docking, saves, all six boss transitions, and the ending in Chrome. `tests/browser-surfaces.cjs` checks all six surface styles, pause/resume, item trading, and upgrades. Both use `playwright-core` supplied via `PLAYWRIGHT_MODULE`, an installed browser via `CHROME_PATH`, and a local server via `STARFARER_URL` (defaults documented in the script).

## Visuals

HDR bloom, soft ground shadows, detailed terrain shaders, instanced rocks and foliage, alien ruins, floating collectibles, atmospheric fog, shaded ringed sky planets, animated engines, station runway lights and architecture, procedural space nebulae, planet clouds and atmospheres, and cinematic docking/launch/gate sequences. Only the active universe's planets are rendered.
