defmodule PhoenixAppWeb.Router do
  use PhoenixAppWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug PhoenixAppWeb.Plugs.Auth
  end

  scope "/api", PhoenixAppWeb do
    pipe_through :api

    get "/top_tags", TopTagsController, :get

    get "/posts/featured", PostsController, :get_featured

    post "/posts/:post_id/view_record", PostsController, :track_view

    scope "/resume" do
      post "/share", ResumeController, :share
      pipe_through :auth
      post "/upload", ResumeController, :upload
    end

    pipe_through :auth
    post "/posts/:post_id/set_as_featured", PostsController, :set_as_featured
  end
end
