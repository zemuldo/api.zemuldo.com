defmodule PhoenixApp.MongoDB do
  use GenServer

  @env Application.get_env(:phoenix_app, PhoenixApp.MongoDB)

  @uri "mongodb://#{@env[:user]}:#{@env[:password]}@#{@env[:host]}/#{@env[:database]}"

  @server __MODULE__

  def init(init_arg) do
    {:ok, init_arg}
  end

  def start_link() do
    Mongo.start_link(name: @server, url: @uri)
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
