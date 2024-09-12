module.exports = {
  apps : [{
    name   : "WhispertalesService",
    script : "build/app.js",
    watch : "true",
    max_restarts : 5,
    min_uptime : 100
  }]
}
