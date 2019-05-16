module.exports = {
    apps : [
        {
          name: "Zemuldo API Cluster 0 8090",
          script: "./app.js",
          watch: true,
          env: {
              "PORT": 8090,
              "NODE_ENV": "development"
          },
          env_production: {
              "PORT": 8090,
              "NODE_ENV": "production",
          },
          instances:'2'
        }
    ]
  }