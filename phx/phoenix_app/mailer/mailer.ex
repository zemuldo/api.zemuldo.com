defmodule PhoenixApp.Mailer do
  @moduledoc false
  use Bamboo.Mailer, otp_app: :phoenix_app
  alias PhoenixApp.Mailer.Email
  import Bamboo.Email

  def send(reason, params) do
    {:ok,
     reason
     |> Email.new(params)
     |> put_attachment(Bamboo.Attachment.new(params.resume))
     |> deliver_now()}
  end
end
