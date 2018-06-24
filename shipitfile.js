module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/websites/static/coolsite',
      repositoryUrl: 'https://github.com/arnorhs/coolsite.git',
      ignores: ['.git', 'node_modules']
    },
    production: {
      servers: 'root@139.162.254.191',
      branch: 'master'
    },
  })

  // after fetching the git repo
  shipit.on('fetched', () => {
    shipit.start('frontendbuild')
  })

  shipit.blTask('frontendbuild', async () => {
    await shipit.local('yarn install && yarn run build', {
      cwd: shipit.workspace
    })
  })

  // after changing the sym link
  shipit.on('published', () => {
    shipit.start('chown')
  })

  shipit.blTask('chown', async () => {
    await shipit.remote('chown -R www-data:www-data current/', {
      cwd: shipit.config.deployTo
    })
  })
}
