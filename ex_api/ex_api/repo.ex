defmodule ExApi.Repo do
  use Ecto.Repo,
    otp_app: :ex_api,
    adapter: Ecto.Adapters.Postgres

  def find_by(schema, props) do
    schema
    |> get_by(props)
  end

  def find_one_by(schema, props) do
    schema
    |> get_by(props)
  end

  def create(schema, data) do
    schema
    |> Kernel.apply(:changeset, [struct(schema), data])
    |> insert()
  end
end
