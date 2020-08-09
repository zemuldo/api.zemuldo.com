defmodule PhoenixApp.TopTagsAggregator do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    schedule_work()
    {:ok, state}
  end

  def handle_info(:work, state) do
    work()
    {:noreply, state}
  end

  defp work() do
    Process.send_after(self(), :work, 5 * 60 * 60 * 1000)
  end
end