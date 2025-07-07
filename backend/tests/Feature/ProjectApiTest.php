<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Project;
use App\Models\Task;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_all_projects()
    {
        $projects = Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'created_at', 'updated_at']
                ]
            ]);
    }

    /** @test */
    public function it_can_create_a_project()
    {
        $projectData = [
            'name' => 'New Test Project'
        ];

        $response = $this->postJson('/api/projects', $projectData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'name' => 'New Test Project'
                ]
            ]);

        $this->assertDatabaseHas('projects', $projectData);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_project()
    {
        $response = $this->postJson('/api/projects', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_can_show_a_specific_project()
    {
        $project = Project::factory()->create();
        $tasks = Task::factory()->count(2)->create(['project_id' => $project->id]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'tasks_count' => 2
                ]
            ]);
    }

    /** @test */
    public function it_can_update_a_project()
    {
        $project = Project::factory()->create();
        $updateData = ['name' => 'Updated Project Name'];

        $response = $this->putJson("/api/projects/{$project->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $project->id,
                    'name' => 'Updated Project Name'
                ]
            ]);

        $this->assertDatabaseHas('projects', $updateData);
    }

    /** @test */
    public function it_can_delete_a_project()
    {
        $project = Project::factory()->create();

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Project deleted successfully']);

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    /** @test */
    public function it_returns_404_for_non_existent_project()
    {
        $response = $this->getJson('/api/projects/999');

        $response->assertStatus(404);
    }
}
