/**
 * scenes/r5.js — Round 5 sub-scene registration.
 *
 * Brief layout 'shield-grid' + reveal type 'shield-crack'.
 * Mood: emergency merah, pandemic outbreak.
 */

(function () {
  'use strict';

  const cfg = ROUNDS.r5;

  window.scenes = window.scenes || {};
  window.scenes['r5-transition']  = createTransitionScene(cfg);
  window.scenes['r5-brief']       = createBriefScene(cfg);
  window.scenes['r5-timer']       = createTimerScene(cfg);
  window.scenes['r5-status']      = createStatusScene(cfg);
  window.scenes['r5-reveal']      = createRevealScene(cfg);
  window.scenes['r5-leaderboard'] = createLeaderboardScene(cfg);
})();
