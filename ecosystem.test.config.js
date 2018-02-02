module.exports = {
    apps : [
        {
          name: "Zemuldo API Dev",
          script: "./app.js",
          watch: true,
          env_development: {
              "PORT": 8090,
              "NODE_ENV": "development"
          },
          env_production: {
              "PORT": 8090,
              "NODE_ENV": "production",
          }
        }
    ]
  }