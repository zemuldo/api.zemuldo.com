defmodule PhoenixApp.Recaptcha do
  use Tesla

  @env Application.get_env(:phoenix_app, PhoenixApp.Recaptcha)

  plug Tesla.Middleware.BaseUrl, "https://www.google.com/recaptcha/api"
  plug Tesla.Middleware.JSON

  def verify(value) do
    get("/siteverify?$", query: [secret: @env[:secret], response: value])
  end
end
