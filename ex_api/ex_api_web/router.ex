defmodule ExApiWeb.Router do
  use ExApiWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :auth do
    plug ExApiWeb.Plugs.Auth
  end

  scope "/api", ExApiWeb do
    pipe_through :api

    get "/top_tags", TopTagsController, :get

    get "/posts/featured", PostsController, :get_featured

    post "/posts/:post_id/view_record", PostsController, :track_view
    post "/posts/:post_id/copied_code", PostsController, :copied_code

    scope "/resume" do
      post "/share", ResumeController, :share
      pipe_through :auth
      post "/upload", ResumeController, :upload
    end

    pipe_through :auth
    post "/posts/:post_id/set_as_featured", PostsController, :set_as_featured
  end
end
