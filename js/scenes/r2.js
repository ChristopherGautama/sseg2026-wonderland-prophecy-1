/**
 * scenes/r2.js — Round 2 sub-scene registration.
 *
 * Wiring murni: panggil factory template dengan ROUNDS.r2 config, attach
 * hasilnya ke window.scenes. Layout 'newspaper' + reveal handler
 * 'newspaper-stamp' di-routing otomatis oleh template Fase 3.
 */

(function () {
  'use strict';

  const cfg = ROUNDS.r2;

  window.scenes = window.scenes || {};
  window.scenes['r2-transition']  = createTransitionScene(cfg);
  window.scenes['r2-brief']       = createBriefScene(cfg);
  window.scenes['r2-timer']       = createTimerScene(cfg);
  window.scenes['r2-status']      = createStatusScene(cfg);
  window.scenes['r2-reveal']      = createRevealScene(cfg);
  window.scenes['r2-leaderboard'] = createLeaderboardScene(cfg);
})();
