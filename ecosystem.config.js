module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'index.js',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0'
    }
  ]
};