defmodule PhoenixAppWeb.Plugs.Auth do
  alias PhoenixApp.Token

  import Plug.Conn

  def init(default), do: default

  def call(conn, _) do
    with {:ok, token} <- get_token(conn),
         {:ok, user} <- Token.verify_and_validate(token) do
      assign(conn, :user, user)
    else
      _ -> send_resp(conn, 403, "Unauthorized") |> halt()
    end
  end

  defp get_token(conn) do
    case get_req_header(conn, "authorization") do
      [token] -> {:ok, token}
      _ -> {:error, "Missing auth"}
    end
  end
end
