import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TasksRepository } from "./tasks.repository ";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";

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

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return await this.tasksRepository.createTask(createTaskDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const getTask = await this.tasksRepository.findOneBy({ id });
        if (!getTask) throw new NotFoundException(`Task with ID "${id}" not found`);
        return getTask;
    }

    async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
        const user = await this.getTaskById(id);
        return await this.tasksRepository.updateTaskStatus(user, updateTaskStatusDto);
    }

    async deleteTaskById(id: string): Promise<void> {
        await this.tasksRepository.deleteTask(id);
    }
}
