// strguests.tools — pm2 process spec (Phase 6 Task 35)
//
// Sits at $API_ROOT/ecosystem.config.cjs on the Hostinger box. Reloaded by
// infrastructure/deploy/server-restart.sh on every deploy.

module.exports = {
  apps: [
    {
      name: 'strguests-api',
      script: 'server/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      // .env is loaded by the deploy script, not pm2 — keeps secrets out
      // of pm2's saved state.
      out_file: 'logs/api.out.log',
      error_file: 'logs/api.err.log',
      merge_logs: true,
      time: true,
    },
  ],
};
