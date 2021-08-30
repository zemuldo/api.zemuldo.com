defmodule ExApi.Repo.Migrations.AddTrackCopyCode do
  use Ecto.Migration

  def change do
    create table(:copied_code, primary_key: false) do
      add :post_id, :string, primary_key: true
      add :count, :integer

      timestamps()
    end
  end
end
