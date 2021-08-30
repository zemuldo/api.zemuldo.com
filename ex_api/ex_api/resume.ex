defmodule ExApi.Resume do
  def get_latest() do
    ExApi.MongoDB.get_latest_resume()
  end
end
