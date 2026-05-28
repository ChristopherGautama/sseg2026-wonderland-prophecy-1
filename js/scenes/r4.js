/**
 * scenes/r4.js — Round 4 sub-scene registration.
 *
 * Pola sama dengan r1/r2/r3: panggil 6 factory dengan ROUNDS.r4.
 * Brief layout 'portfolio-allocation' + reveal type 'portfolio-flip'.
 */

(function () {
  'use strict';

  const cfg = ROUNDS.r4;

  window.scenes = window.scenes || {};
  window.scenes['r4-transition']  = createTransitionScene(cfg);
  window.scenes['r4-brief']       = createBriefScene(cfg);
  window.scenes['r4-timer']       = createTimerScene(cfg);
  window.scenes['r4-status']      = createStatusScene(cfg);
  window.scenes['r4-reveal']      = createRevealScene(cfg);
  window.scenes['r4-leaderboard'] = createLeaderboardScene(cfg);
})();
