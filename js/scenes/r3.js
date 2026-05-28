/**
 * scenes/r3.js — Round 3 sub-scene registration.
 *
 * Layout 'macro-race' + reveal handler 'sector-race' di-routing otomatis
 * oleh template Fase 3.
 */

(function () {
  'use strict';

  const cfg = ROUNDS.r3;

  window.scenes = window.scenes || {};
  window.scenes['r3-transition']  = createTransitionScene(cfg);
  window.scenes['r3-brief']       = createBriefScene(cfg);
  window.scenes['r3-timer']       = createTimerScene(cfg);
  window.scenes['r3-status']      = createStatusScene(cfg);
  window.scenes['r3-reveal']      = createRevealScene(cfg);
  window.scenes['r3-leaderboard'] = createLeaderboardScene(cfg);
})();
