defmodule ExApi.Mailer do
  @moduledoc false
  use Bamboo.Mailer, otp_app: :ex_api
  alias ExApi.Mailer.Email
  import Bamboo.Email

  def send(reason, params) do
    {:ok,
     reason
     |> Email.new(params)
     |> put_attachment(Bamboo.Attachment.new(params.resume))
     |> deliver_now()}
  end
end
