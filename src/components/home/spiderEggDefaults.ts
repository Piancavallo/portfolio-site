/**
 * Spider Easter Egg — drop-only (no horizontal walk).
 *
 * Tune:
 *   dropDistancePx / dropDurationMs / frameWidth / frameHeight / landingDelayMs
 *
 * Asset: spider.png (still for the silk drop)
 */
export const SPIDER_EGG_DEFAULTS = {
  frameWidth: 96,
  frameHeight: 96,
  dropDistancePx: 500,
  dropDurationMs: 2000,
  landingDelayMs: 200,
} as const;
