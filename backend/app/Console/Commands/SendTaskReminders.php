<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendTaskReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders for pending tasks older than 7 days';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $sevenDaysAgo = Carbon::now()->subDays(7);
        
        $oldPendingTasks = Task::where('status', 'pending')
            ->where('created_at', '<', $sevenDaysAgo)
            ->with('project')
            ->get();

        if ($oldPendingTasks->isEmpty()) {
            $this->info('No pending tasks older than 7 days found.');
            Log::info('Task reminder check completed: No old pending tasks found.');
            return Command::SUCCESS;
        }

        foreach ($oldPendingTasks as $task) {
            // Simulate sending email with Log::info
            Log::info('Task reminder sent', [
                'task_id' => $task->id,
                'task_title' => $task->title,
                'project_name' => $task->project->name,
                'days_old' => Carbon::now()->diffInDays($task->created_at),
                'created_at' => $task->created_at->format('Y-m-d H:i:s')
            ]);
        }

        $count = $oldPendingTasks->count();
        $this->info("Sent reminders for {$count} pending tasks older than 7 days.");
        Log::info("Task reminders sent for {$count} old pending tasks.");

        return Command::SUCCESS;
    }
}
