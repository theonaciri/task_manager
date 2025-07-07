<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create sample projects
        $project1 = Project::create([
            'name' => 'Site Web E-commerce',
        ]);

        $project2 = Project::create([
            'name' => 'Application Mobile',
        ]);

        $project3 = Project::create([
            'name' => 'API REST Documentation',
        ]);

        // Create sample tasks
        Task::create([
            'title' => 'Créer la page d\'accueil',
            'status' => 'pending',
            'project_id' => $project1->id,
        ]);

        Task::create([
            'title' => 'Intégrer le système de paiement',
            'status' => 'pending',
            'project_id' => $project1->id,
        ]);

        Task::create([
            'title' => 'Tests utilisateur',
            'status' => 'completed',
            'project_id' => $project1->id,
        ]);

        // Create an old pending task for testing reminders
        Task::create([
            'title' => 'Tâche ancienne en attente',
            'status' => 'pending',
            'project_id' => $project1->id,
            'created_at' => Carbon::now()->subDays(10),
            'updated_at' => Carbon::now()->subDays(10),
        ]);

        Task::create([
            'title' => 'Conception de l\'interface',
            'status' => 'completed',
            'project_id' => $project2->id,
        ]);

        Task::create([
            'title' => 'Développement des fonctionnalités',
            'status' => 'pending',
            'project_id' => $project2->id,
        ]);

        Task::create([
            'title' => 'Rédiger la documentation',
            'status' => 'pending',
            'project_id' => $project3->id,
        ]);
    }
}
