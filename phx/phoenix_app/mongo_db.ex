defmodule PhoenixApp.MongoDB do
  use GenServer

  alias PhoenixApp.Posts.FeaturedPost

  @env Application.get_env(:phoenix_app, PhoenixApp.MongoDB)

  @uri "mongodb://#{@env[:host]}:27017/#{@env[:database]}"

  @server __MODULE__

  def init(init_arg) do
    {:ok, init_arg}
  end

  def start_link(_) do
    case @env[:user] do
      nil ->
        Mongo.start_link(name: @server, url: @uri)

      _ ->
        Mongo.start_link(
          name: @server,
          url: @uri,
          username: @env[:user],
          password: @env[:password],
          auth_source: @env[:database]
        )
    end
  end

  def get_posts_tags() do
    Mongo.find(@server, "posts", %{})
    |> Enum.to_list()
  end

  def log_resume_request(email, resume) do
    Mongo.insert_one(@server, "resume_request", %{
      email: email,
      resume: resume,
      timestamp: DateTime.utc_now()
    })
  end

  def get_featured_post() do
    case FeaturedPost.get() do
      %{post_id: post_id} ->
        Mongo.find_one(@server, "posts", %{_id: BSON.ObjectId.decode!(post_id)})

      _ ->
        Mongo.find_one(@server, "posts", %{}, sort: [createdAt: -1])
    end
  end

  def new_resume(filename) do
    Mongo.insert_one(@server, "resumes", %{filename: filename, timestamp: DateTime.utc_now()})
  end

  def find_by_filename(filename) do
    Mongo.find_one(@server, "resumes", %{filename: filename})
  end

  def get_latest_resume() do
    [resume] = Mongo.find(@server, "resumes", %{}, limit: 1, sort: %{_id: -1}) |> Enum.to_list()
    {:ok, resume}
  end
end
