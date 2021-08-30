defmodule ExApi.Posts.FeaturedPost do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, only: [from: 2]

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "featured_post" do
    field(:post_id, :string)
    field(:period, :string)

    timestamps()
  end

  @doc false
  def changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:post_id, :period])
    |> validate_required([:post_id, :period])
  end

  def set(post_id) do
    period = current_period()

    on_conflict = [set: [post_id: post_id]]

    %{post_id: post_id, period: period}
    |> changeset()
    |> ExApi.Repo.insert(on_conflict: on_conflict, conflict_target: :period)
  end

  def get() do
    period = current_period()

    from(p in "featured_post",
      where: p.period == ^period,
      select: %{post_id: p.post_id}
    )
    |> ExApi.Repo.one()
  end

  def current_period() do
    d = DateTime.utc_now()

    "#{d.month}-#{d.year}"
  end
end
