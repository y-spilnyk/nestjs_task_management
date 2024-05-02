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

    async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(getTasksFilterDto);
    }

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
