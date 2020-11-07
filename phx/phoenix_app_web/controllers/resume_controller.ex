defmodule PhoenixAppWeb.ResumeController do
  use PhoenixAppWeb, :controller

  def send(conn, _) do
    conn
    |> put_status(200)
    |> json(%{})
  end
end
