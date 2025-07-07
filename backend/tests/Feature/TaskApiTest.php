<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Project;
use App\Models\Task;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_all_tasks()
    {
        $project = Project::factory()->create();
        $tasks = Task::factory()->count(3)->create(['project_id' => $project->id]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'status', 'project_id', 'created_at', 'updated_at']
                ]
            ]);
    }

    /** @test */
    public function it_can_filter_tasks_by_status()
    {
        $project = Project::factory()->create();
        Task::factory()->create(['project_id' => $project->id, 'status' => 'pending']);
        Task::factory()->create(['project_id' => $project->id, 'status' => 'completed']);
        Task::factory()->create(['project_id' => $project->id, 'status' => 'pending']);

        $response = $this->getJson('/api/tasks?status=pending');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        foreach ($response->json('data') as $task) {
            $this->assertEquals('pending', $task['status']);
        }
    }

    /** @test */
    public function it_can_filter_tasks_by_project()
    {
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();

        Task::factory()->count(2)->create(['project_id' => $project1->id]);
        Task::factory()->count(3)->create(['project_id' => $project2->id]);

        $response = $this->getJson("/api/tasks?project_id={$project1->id}");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        foreach ($response->json('data') as $task) {
            $this->assertEquals($project1->id, $task['project_id']);
        }
    }

    /** @test */
    public function it_can_create_a_task()
    {
        $project = Project::factory()->create();
        $taskData = [
            'title' => 'New Test Task',
            'status' => 'pending',
            'project_id' => $project->id
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => 'New Test Task',
                    'status' => 'pending',
                    'project_id' => $project->id
                ]
            ]);

        $this->assertDatabaseHas('tasks', $taskData);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_task()
    {
        $response = $this->postJson('/api/tasks', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'status', 'project_id']);
    }

    /** @test */
    public function it_validates_status_enum_values()
    {
        $project = Project::factory()->create();

        $response = $this->postJson('/api/tasks', [
            'title' => 'Test Task',
            'status' => 'invalid_status',
            'project_id' => $project->id
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    /** @test */
    public function it_can_show_a_specific_task()
    {
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $task->id,
                    'title' => $task->title,
                    'status' => $task->status,
                    'project_id' => $project->id
                ]
            ]);
    }

    /** @test */
    public function it_can_update_a_task()
    {
        $task = Task::factory()->create();
        $updateData = [
            'title' => 'Updated Task Title',
            'status' => 'completed'
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $task->id,
                    'title' => 'Updated Task Title',
                    'status' => 'completed'
                ]
            ]);

        $this->assertDatabaseHas('tasks', $updateData);
    }

    /** @test */
    public function it_can_delete_a_task()
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Task deleted successfully']);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
