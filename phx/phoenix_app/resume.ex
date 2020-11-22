defmodule PhoenixApp.Resume do
  def get_latest() do
    PhoenixApp.MongoDB.get_latest_resume()
  end
end
