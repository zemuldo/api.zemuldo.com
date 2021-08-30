defmodule ExApiWeb.ResumeController do
  use ExApiWeb, :controller

  alias ExApi.Mailer
  alias ExApi.Resume
  alias ExApi.MongoDB

  @resumes_path "public/resumes"

  def share(conn, %{"email" => email, "recaptchaChallengeValue" => value}) do
    with {:ok, %{body: %{"success" => true}}} <-
           ExApi.Recaptcha.verify(value),
         {:ok, latest_resume} <- Resume.get_latest(),
         {:ok, _} <-
           Mailer.send(:share_resume, %{
             recipient: email,
             resume: "#{@resumes_path}/#{latest_resume["filename"]}"
           }) do
      MongoDB.log_resume_request(email, latest_resume)

      conn
      |> put_status(200)
      |> json(%{message: "Resume is on the way, Check your mail."})
    else
      _ ->
        conn
        |> put_status(422)
        |> json(%{error: "Something happenned, please try again"})
    end
  end

  def share(conn, _),
    do: conn |> put_status(400) |> json(%{error: "You missed some require items"})

  def upload(conn, params) do
    [name] = Map.keys(params)

    %{filename: filename, path: path} = params[name]

    case MongoDB.find_by_filename(filename) do
      nil ->
        :ok = File.cp(path, "public/resumes/#{filename}")
        {:ok, _} = MongoDB.new_resume(filename)

        conn
        |> put_status(200)
        |> json(%{})

      _ ->
        conn
        |> put_status(400)
        |> json(%{error: "Resume with name #{filename} already exists"})
    end
  end
end
