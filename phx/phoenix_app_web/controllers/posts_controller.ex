defmodule PhoenixAppWeb.PostsController do
  use PhoenixAppWeb, :controller

  alias PhoenixApp.PostViewCount
  alias PhoenixApp.Postgres

  def track_view(conn, params) do
    case Postgres.insert(%PostViewCount{post_id: params["post_id"], count: 1},
           conflict_target: :post_id,
           on_conflict: [inc: [count: 1]]
         ) do
      {:ok, _} ->
        conn
        |> put_status(200)
        |> json(%{status: "Success"})

      {:error, _} ->
        conn
        |> put_status(400)
        |> json(%{status: "Failed"})
    end
  end
end
