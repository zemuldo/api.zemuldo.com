defmodule PhoenixApp.PostViewCount do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  schema "posts_views" do
    field(:post_id, :string)
    field(:count, :integer)

    timestamps()
  end

  def changeset(user, params \\ %{}) do
    user
    |> cast(params, [:post_id, :count])
    |> validate_required([:post_id, :count])
  end
end
