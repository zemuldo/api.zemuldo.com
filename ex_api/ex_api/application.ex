defmodule ExApi.Application do
  use Application

  def start(_type, _args) do
    children = [
      ExApiWeb.Telemetry,
      {Phoenix.PubSub, name: ExApi.PubSub},
      ExApiWeb.Endpoint,
      {ExApi.MongoDB, []},
      ExApi.Repo,
      {ExApi.TopTagsAggregator, []}
    ]

    opts = [strategy: :one_for_one, name: ExApi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    ExApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
