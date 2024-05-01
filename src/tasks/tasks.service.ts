import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./task-status.enum";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TasksRepository } from "./tasks.repository ";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository
    ) {}

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }
    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();
    //     if (status) {
    //         tasks = tasks.filter((data) => data.status === status);
    //     }
    //     if (search) {
    //         tasks = tasks.filter((data) => {
    //             if ([data.title, data.description].includes(search)) {
    //                 return true;
    //             }
    //             throw new NotFoundException(`Task query "${search}" not found`);
    //         });
    //     }
    //     return tasks;
    // }

    async getTaskById(id: string): Promise<Task> {
        const getTask = await this.tasksRepository.findOneBy({ id });
        if (!getTask) throw new NotFoundException(`Task with ID "${id}" not found`);
        return getTask;
    }

    createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    // updateTaskStatus(id: string, status: TaskStatus): any {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }
    // deleteTaskById(id: string): void {
    //     const task = this.getTaskById(id);
    //     this.tasks = this.tasks.filter((tasks) => tasks.id !== task.id);
    // }
}
