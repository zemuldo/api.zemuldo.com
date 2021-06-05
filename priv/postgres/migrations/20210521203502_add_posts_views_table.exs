defmodule PhoenixApp.Postgres.Migrations.AddPostsViewsTable do
  use Ecto.Migration

  def change do
    create table(:posts_views, primary_key: false) do
      add :post_id, :string, primary_key: true
      add :count, :integer, default: 0

      timestamps()
    end
  end
end
