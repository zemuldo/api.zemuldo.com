defmodule PhoenixApp.Application do
  use Application

  def start(_type, _args) do
    children = [
      PhoenixAppWeb.Telemetry,
      {Phoenix.PubSub, name: PhoenixApp.PubSub},
      PhoenixAppWeb.Endpoint,
      {PhoenixApp.MongoDB, []},
      PhoenixApp.Repo,
      {PhoenixApp.TopTagsAggregator, []}
    ]

    opts = [strategy: :one_for_one, name: PhoenixApp.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    PhoenixAppWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
