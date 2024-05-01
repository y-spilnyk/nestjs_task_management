import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
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
                throw new NotFoundException(`Task query "${search}" not found`);
            });
        }
        return tasks;
    }

    getTaskById(id: string): Task {
        const getTask = this.tasks.find((task) => task.id === id);
        if (!getTask) throw new NotFoundException(`Task with ID "${id}" not found`);
        return getTask;
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

    updateTaskStatus(id: string, status: TaskStatus): any {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTaskById(id: string): void {
        const task = this.getTaskById(id);
        this.tasks = this.tasks.filter((tasks) => tasks.id !== task.id);
    }
}
