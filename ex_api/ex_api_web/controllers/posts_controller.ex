defmodule ExApiWeb.PostsController do
  use ExApiWeb, :controller

  alias ExApi.PostViewCount
  alias ExApi.CopiedCode
  alias ExApi.Repo
  alias ExApi.Posts.FeaturedPost
  alias ExApi.MongoDB

  def get_featured(conn, _) do
    post = MongoDB.get_featured_post()

    data =
      post
      |> Map.take([
        "authorId",
        "coverPhotoUrl",
        "createdAt",
        "deleted",
        "description",
        "tags",
        "title",
        "updatedAt"
      ])
      |> Map.put(:_id, BSON.ObjectId.encode!(post["_id"]))

    conn |> json(data)
  end

  def set_as_featured(conn, %{"post_id" => post_id}) do
    case FeaturedPost.set(post_id) do
      {:ok, _} ->
        conn |> json(%{status: "Success"})

      _ ->
        conn
        |> put_status(400)
        |> json(%{status: "Failed"})
    end
  end

  def track_view(conn, params) do
    case Repo.insert(%PostViewCount{post_id: params["post_id"], count: 1},
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

  def copied_code(conn, params) do
    case Repo.insert(%CopiedCode{post_id: params["post_id"], count: 1},
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
