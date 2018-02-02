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
        },
        {
            name: "Photos Server Test",
            script: "./photos.zemuldo.com//photos.js",
            watch: true,
            env_development: {
                "PORT": 8010,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8010,
                "NODE_ENV": "production",
            }
        }
    ]
  }