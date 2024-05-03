import { EntityManager, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(private readonly eManager: EntityManager) {
        super(Task, eManager);
    }

    async getTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = getTasksFilterDto;
        const query = this.createQueryBuilder("task"); // "task" it is the database from the postgres
        if (status) {
            query.where("task.status = :status", { status });
        }
        if (search) {
            query.andWhere("task.title = :search", { search }).orWhere("task.description = :search", { search });
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const createTask = this.create({
            title,
            description,
            status: TaskStatus.OPEN
        });
        await this.save(createTask);
        return createTask;
    }

    async updateTaskStatus(user: Task, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
        const { status } = updateTaskStatusDto;
        user.status = status;
        await this.save(user);
        return user;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Task with ID "${id}" not found`);
    }
}
