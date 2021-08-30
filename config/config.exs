# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :ex_api,
  generators: [binary_id: true]

# Configures the endpoint
config :ex_api, ExApiWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "sdfxCrkDMF6QclqHW2ItwpGXEHn2GaSnJbKhAOZEDUX45ZvFwLnP3RUJIVn51XG/",
  render_errors: [view: ExApiWeb.ErrorView, accepts: ~w(json), layout: false],
  pubsub_server: ExApi.PubSub,
  live_view: [signing_salt: "WzMqgfgR"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.

config :cors_plug,
  origin: &ExApiWeb.dynamic_cors/1,
  max_age: 86400,
  credentials: true

config :ex_api,
  ecto_repos: [ExApi.Repo]

import_config "#{Mix.env()}.exs"
