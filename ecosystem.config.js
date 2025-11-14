module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'node',
      args: 'index.js',
      env_file: '.env'
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev -- --host 0.0.0.0',
      env_file: '.env'
    }
  ]
};