<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaginationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_pagination()
    {
        // Créer 25 projets pour tester la pagination
        Project::factory()->count(25)->create();

        $response = $this->getJson('/api/projects?per_page=10&page=1');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'created_at', 'updated_at']
                ],
                'links' => ['first', 'last', 'prev', 'next'],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                    'from',
                    'to'
                ]
            ]);

        $this->assertEquals(10, count($response->json('data')));
        $this->assertEquals(1, $response->json('meta.current_page'));
        $this->assertEquals(3, $response->json('meta.last_page'));
        $this->assertEquals(25, $response->json('meta.total'));
    }

    public function test_tasks_pagination()
    {
        $project = Project::factory()->create();
        Task::factory()->count(15)->create(['project_id' => $project->id]);

        $response = $this->getJson('/api/tasks?per_page=5&page=2');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'status', 'project_id', 'project', 'created_at', 'updated_at']
                ],
                'links',
                'meta'
            ]);

        $this->assertEquals(5, count($response->json('data')));
        $this->assertEquals(2, $response->json('meta.current_page'));
        $this->assertEquals(3, $response->json('meta.last_page'));
        $this->assertEquals(15, $response->json('meta.total'));
    }

    public function test_projects_search()
    {
        Project::factory()->create(['name' => 'E-commerce Website']);
        Project::factory()->create(['name' => 'Mobile Application']);
        Project::factory()->create(['name' => 'Web Portal']);

        $response = $this->getJson('/api/projects?search=Web');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals(2, count($data));
        $this->assertStringContainsStringIgnoringCase('Web', $data[0]['name']);
        $this->assertStringContainsStringIgnoringCase('Web', $data[1]['name']);
    }

    public function test_tasks_search()
    {
        $project = Project::factory()->create();
        Task::factory()->create(['title' => 'Create homepage', 'project_id' => $project->id]);
        Task::factory()->create(['title' => 'Setup database', 'project_id' => $project->id]);
        Task::factory()->create(['title' => 'Homepage design review', 'project_id' => $project->id]);

        $response = $this->getJson('/api/tasks?search=homepage');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals(2, count($data));
        foreach ($data as $task) {
            $this->assertStringContainsStringIgnoringCase('homepage', $task['title']);
        }
    }

    public function test_tasks_filters_with_pagination()
    {
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();

        // Créer des tâches avec différents statuts
        Task::factory()->count(5)->create(['status' => 'pending', 'project_id' => $project1->id]);
        Task::factory()->count(3)->create(['status' => 'completed', 'project_id' => $project1->id]);
        Task::factory()->count(4)->create(['status' => 'pending', 'project_id' => $project2->id]);

        $response = $this->getJson('/api/tasks?status=pending&per_page=5&page=1');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals(5, count($data));
        $this->assertEquals(9, $response->json('meta.total'));
        $this->assertEquals(2, $response->json('meta.last_page'));

        foreach ($data as $task) {
            $this->assertEquals('pending', $task['status']);
        }
    }

    public function test_combined_search_and_filters()
    {
        $project = Project::factory()->create();
        Task::factory()->create(['title' => 'Homepage design', 'status' => 'pending', 'project_id' => $project->id]);
        Task::factory()->create(['title' => 'Homepage development', 'status' => 'completed', 'project_id' => $project->id]);
        Task::factory()->create(['title' => 'About page design', 'status' => 'pending', 'project_id' => $project->id]);

        $response = $this->getJson('/api/tasks?search=homepage&status=pending');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertEquals(1, count($data));
        $this->assertStringContainsStringIgnoringCase('homepage', $data[0]['title']);
        $this->assertEquals('pending', $data[0]['status']);
    }
}
