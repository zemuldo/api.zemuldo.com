defmodule PhoenixAppWeb.Router do
  use PhoenixAppWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug :accepts, ["json"]
  end

  scope "/api", PhoenixAppWeb do
    pipe_through :api

    get "/top_tags", TopTagsController, :get

    scope "/resume" do
      post "/share", ResumeController, :share
      post "/upload", ResumeController, :upload
    end
  end
end
