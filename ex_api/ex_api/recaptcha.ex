defmodule ExApi.Recaptcha do
  use Tesla

  @env Application.get_env(:ex_api, ExApi.Recaptcha)

  plug Tesla.Middleware.BaseUrl, "https://www.google.com/recaptcha/api"
  plug Tesla.Middleware.JSON

  def verify(value) do
    get("/siteverify?$", query: [secret: @env[:secret], response: value])
  end
end
