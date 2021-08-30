defmodule ExApiWeb.TopTagsController do
  use ExApiWeb, :controller

  alias ExApi.TopTagsAggregator

  def get(conn, _) do
    tags = TopTagsAggregator.get_tags()

    conn
    |> put_status(200)
    |> json(tags)
  end
end
