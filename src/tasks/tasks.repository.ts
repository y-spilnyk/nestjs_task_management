import { EntityManager, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(private readonly eManager: EntityManager) {
        super(Task, eManager);
    }

    async getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = getTasksFilterDto;
        const query = this.createQueryBuilder("task"); // "task" it is the database from the postgres
        query.where({ user });

        if (status) {
            query.andWhere("task.status = :status", { status });
        }
        if (search) {
            query
                .andWhere("(task.title = :search", { search })
                .orWhere("task.description = :search)", { search });
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const userData = await this.createQueryBuilder("task")
            .where({ user })
            .andWhereInIds({ id })
            .getOne();

        if (userData === null) throw new NotFoundException();
        return userData;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const createTask = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });
        await this.save(createTask);
        return createTask;
    }

    async updateTaskStatus(
        id: string,
        updateTaskStatusDto: UpdateTaskStatusDto,
        user: User
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        const getTask = await this.getTaskById(id, user);
        getTask.status = status;
        await this.save(getTask);
        return getTask;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Task with ID "${id}" not found`);
    }
}
