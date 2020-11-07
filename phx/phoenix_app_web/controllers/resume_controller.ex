defmodule PhoenixAppWeb.ResumeController do
  use PhoenixAppWeb, :controller

  alias PhoenixApp.Mailer
  alias PhoenixApp.Resume

  def share(conn, %{"email" => email}) do
    with {:ok, latest_resume} <- Resume.get_latest(),
    {:ok, _} <- Mailer.send(:share_resume, %{recipient: email, resume: latest_resume.file_path}) do
      conn
      |> put_status(200)
      |> json(%{message: "Resume is on the way, Check your mail."})
    else
      _ ->
        conn
        |> put_status(422)
        |> json(%{error: "Something happenned, please try again"})
    end

    conn
    |> put_status(200)
    |> json(%{})
  end

  def share(conn, _), do: conn |> put_status(400) |> json(%{error: "You missed some require items"})

  def upload(conn, _) do
    conn
    |> put_status(200)
    |> json(%{})
  end
end
