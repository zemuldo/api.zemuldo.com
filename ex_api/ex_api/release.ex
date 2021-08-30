defmodule ExApi.ReleaseTasks do

  @app :ex_api

  @repo ExApi.Repo

  def migrate do
    IO.puts "Loading application..."
    Application.ensure_all_started(@app)

    IO.puts "Running migrations..."
    Ecto.Migrator.run(@repo, migrations_path(@app), :up, all: true)

    # Run the seed script if it exists
    seed_script = Path.join([priv_dir(@app), "repo", "seeds.exs"])
    if File.exists?(seed_script) do
      IO.puts "Running seed script.."
      Code.eval_file(seed_script)
    end

    # Signal shutdown
    IO.puts "Success!"
    :init.stop()
  end

  def priv_dir(app), do: "#{:code.priv_dir(app)}"

  defp migrations_path(app), do: Path.join([priv_dir(app), "repo", "migrations"]) |> IO.inspect()

end
