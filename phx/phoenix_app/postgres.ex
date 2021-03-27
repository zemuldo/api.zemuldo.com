defmodule PhoenixApp.Postgres do
  use Ecto.Repo,
    otp_app: :phoenix_app,
    adapter: Ecto.Adapters.Postgres
end
