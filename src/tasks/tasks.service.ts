import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TasksRepository } from "./tasks.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository
    ) {}

    async getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(getTasksFilterDto, user);
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return await this.tasksRepository.createTask(createTaskDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const getTaskByID = await this.tasksRepository.getTaskById(id, user);
        return getTaskByID;
    }

    // async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
    //     const user = await this.getTaskById(id);
    //     return await this.tasksRepository.updateTaskStatus(user, updateTaskStatusDto);
    // }

    async deleteTaskById(id: string): Promise<void> {
        await this.tasksRepository.deleteTask(id);
    }
}
