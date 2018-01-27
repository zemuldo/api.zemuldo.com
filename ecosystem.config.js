module.exports = {
    apps : [
        {
          name: "Backend 0",
          script: "./app.js",
          watch: true,
          env: {
              "PORT": 8090,
              "NODE_ENV": "development"
          },
          env_production: {
              "PORT": 8090,
              "NODE_ENV": "production",
          }
        },
        {
            name: "Backend 1",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8091,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8091,
                "NODE_ENV": "production",
            }
        },
        {
            name: "Backend 2",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8092,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8092,
                "NODE_ENV": "production",
            }
        },
        {
            name: "Backend 3",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8093,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8093,
                "NODE_ENV": "production",
            }
        },
        {
            name: "Backend 4",
            script: "./app.js",
            watch: true,
            env: {
                "PORT": 8094,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8094,
                "NODE_ENV": "production",
            }
        }
    ]
  }