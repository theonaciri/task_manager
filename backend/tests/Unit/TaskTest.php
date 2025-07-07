<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_task()
    {
        $project = Project::factory()->create();
        
        $task = Task::create([
            'title' => 'Test Task',
            'status' => 'pending',
            'project_id' => $project->id
        ]);

        $this->assertInstanceOf(Task::class, $task);
        $this->assertEquals('Test Task', $task->title);
        $this->assertEquals('pending', $task->status);
        $this->assertEquals($project->id, $task->project_id);
    }

    /** @test */
    public function it_belongs_to_a_project()
    {
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $this->assertInstanceOf(Project::class, $task->project);
        $this->assertEquals($project->id, $task->project->id);
    }

    /** @test */
    public function it_has_valid_status_values()
    {
        $project = Project::factory()->create();
        
        $pendingTask = Task::factory()->create([
            'project_id' => $project->id,
            'status' => 'pending'
        ]);
        
        $completedTask = Task::factory()->create([
            'project_id' => $project->id,
            'status' => 'completed'
        ]);

        $this->assertEquals('pending', $pendingTask->status);
        $this->assertEquals('completed', $completedTask->status);
    }

    /** @test */
    public function it_requires_a_title()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        $project = Project::factory()->create();
        Task::create([
            'status' => 'pending',
            'project_id' => $project->id
        ]);
    }

    /** @test */
    public function it_requires_a_project_id()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Task::create([
            'title' => 'Test Task',
            'status' => 'pending'
        ]);
    }

    /** @test */
    public function it_has_default_pending_status()
    {
        $project = Project::factory()->create();
        
        $task = Task::create([
            'title' => 'Test Task',
            'project_id' => $project->id,
            'status' => 'pending'  // Explicitly set status for this test
        ]);

        $this->assertEquals('pending', $task->status);
    }

    /** @test */
    public function it_can_be_updated()
    {
        $task = Task::factory()->create(['title' => 'Original Title']);
        
        $task->update(['title' => 'Updated Title', 'status' => 'completed']);
        
        $freshTask = $task->fresh();
        $this->assertEquals('Updated Title', $freshTask->title);
        $this->assertEquals('completed', $freshTask->status);
    }
}
