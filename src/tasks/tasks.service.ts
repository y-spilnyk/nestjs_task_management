import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";
import { v4 as uuid } from "uuid";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter((data) => data.status === status);
        }
        if (search) {
            tasks = tasks.filter((data) => {
                if ([data.title, data.description].includes(search)) {
                    return true;
                }
                return false;
            });
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find((task) => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        };
        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, taskStatus: TaskStatus): any {
        const task = this.getTaskById(id);
        if (taskStatus) {
            task.status = taskStatus;
        } else {
            throw new HttpException("Please provide a status", HttpStatus.BAD_REQUEST);
        }
        return task;
    }

    deleteTaskById(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }
}
