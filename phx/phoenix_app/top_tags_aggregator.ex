defmodule PhoenixApp.TopTagsAggregator do
  use GenServer

  alias PhoenixApp.MongoDB

  def get_tags() do
    GenServer.call(__MODULE__, :get_tags)
  end

  def start_link(_) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  def init(state) do
    tags = aggregate()
    {:ok, state |> Map.put(:tags, tags)}
  end

  def handle_info(:aggregate, state) do
    tags = aggregate()
    {:noreply, state |> Map.put(:tags, tags)}
  end

  def handle_call(:get_tags, _from, state) do
    {:reply, state |> Map.get(:tags), state}
  end

  defp aggregate() do
    Process.send_after(self(), :aggregate, 1 * 60 * 60 * 1_000)

    MongoDB.get_posts_tags()
    |> Enum.map(&extract_tags/1)
    |> List.flatten()
    |> Enum.reduce(%{}, fn tag, acc -> Map.update(acc, tag, 1, &(&1 + 1)) end)
    |> Enum.reduce([], fn {k, v}, acc -> [%{name: k, value: v} | acc] end)
    |> Enum.sort(&(&1.value >= &2.value))
    |> Enum.take(8)
  end

  defp extract_tags(post) do
    post
    |> Map.get("tags")
    |> Enum.map(&extract_tag_value/1)
  end

  defp extract_tag_value(tag), do: tag |> Map.get("value")
end
