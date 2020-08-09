defmodule PhoenixAppWeb.Router do
  use PhoenixAppWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", PhoenixAppWeb do
    pipe_through :api

    get "/top_tags", TopTagsController, :get
  end
end
