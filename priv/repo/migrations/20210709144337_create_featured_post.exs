defmodule ExApi.Repo.Migrations.CreateFeaturedPost do
  use Ecto.Migration

  def change do
    create table(:featured_post, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :post_id, :string
      add :period, :string

      timestamps()
    end

    create unique_index(:featured_post, [:period])
  end
end
