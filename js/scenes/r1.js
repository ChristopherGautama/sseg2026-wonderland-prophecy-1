/**
 * scenes/r1.js — Round 1 sub-scene registration.
 *
 * Tugasnya HANYA wiring: panggil factory template untuk tiap sub-scene
 * dengan config ROUNDS.r1, lalu attach ke window.scenes dengan ID yang
 * cocok dengan SCENES playlist di constants.js.
 *
 * Tambah ronde baru = bikin file r2.js dengan pola yang sama,
 * tinggal swap ROUNDS.r1 → ROUNDS.r2 (selama format-nya sudah didukung
 * templates). Format baru = tambah handler/render path di template terkait.
 */

(function () {
  'use strict';

  const cfg = ROUNDS.r1;

  window.scenes = window.scenes || {};
  window.scenes['r1-transition']  = createTransitionScene(cfg);
  window.scenes['r1-brief']       = createBriefScene(cfg);
  window.scenes['r1-timer']       = createTimerScene(cfg);
  window.scenes['r1-status']      = createStatusScene(cfg);
  window.scenes['r1-reveal']      = createRevealScene(cfg);
  window.scenes['r1-leaderboard'] = createLeaderboardScene(cfg);
})();
