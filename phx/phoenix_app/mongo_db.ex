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
end
