defmodule ExApi.Mailer.Email do
  @moduledoc false
  import Bamboo.Email
  alias ExApi.Mailer.Templates

  def new(:share_resume, params) do
    new_email(
      to: params.recipient,
      from: "Danstan Onyango<no-reply@zemuldo.com>",
      subject: "Danstan's Resume",
      text_body: "Hi, Please find my resume attached",
      html_body: Templates.share_resume()
    )
  end
end
