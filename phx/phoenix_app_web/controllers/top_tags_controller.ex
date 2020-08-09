defmodule PhoenixAppWeb.TopTagsController do
  use PhoenixAppWeb, :controller

  alias PhoenixApp.TopTagsAggregator

  def get(conn, _) do
    tags = TopTagsAggregator.get_tags()

    conn
    |> put_status(200)
    |> json(tags)
  end
end
