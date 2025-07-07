<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_project()
    {
        $project = Project::create([
            'name' => 'Test Project'
        ]);

        $this->assertInstanceOf(Project::class, $project);
        $this->assertEquals('Test Project', $project->name);
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project'
        ]);
    }

    /** @test */
    public function it_has_many_tasks()
    {
        $project = Project::factory()->create();

        $task1 = Task::factory()->create(['project_id' => $project->id]);
        $task2 = Task::factory()->create(['project_id' => $project->id]);

        $this->assertCount(2, $project->tasks);
        $this->assertTrue($project->tasks->contains($task1));
        $this->assertTrue($project->tasks->contains($task2));
    }

    /** @test */
    public function it_requires_a_name()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Project::create([]);
    }

    /** @test */
    public function it_can_be_updated()
    {
        $project = Project::factory()->create(['name' => 'Original Name']);

        $project->update(['name' => 'Updated Name']);

        $this->assertEquals('Updated Name', $project->fresh()->name);
    }

    /** @test */
    public function it_can_be_deleted()
    {
        $project = Project::factory()->create();
        $projectId = $project->id;

        $project->delete();

        $this->assertDatabaseMissing('projects', ['id' => $projectId]);
    }

    /** @test */
    public function deleting_project_deletes_associated_tasks()
    {
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $project->delete();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
