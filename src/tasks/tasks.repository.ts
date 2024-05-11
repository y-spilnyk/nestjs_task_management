import { EntityManager, Repository, SelectQueryBuilder } from "typeorm";
import { Task } from "./task.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "../auth/user.entity";

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(private readonly eManager: EntityManager) {
        super(Task, eManager);
    }

    async verifyIfUserHasRights(user: User): Promise<SelectQueryBuilder<Task>> {
        return this.createQueryBuilder("task").where({ user });
    }

    async getTasks(getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = getTasksFilterDto;
        const userData = await this.verifyIfUserHasRights(user);

        if (status) {
            userData.andWhere("task.status = :status", { status });
        }
        if (search) {
            userData
                .andWhere("(task.title = :search", { search })
                .orWhere("task.description = :search)", { search });
        }
        const tasks = await userData.getMany();
        return tasks;
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const userData = await (await this.verifyIfUserHasRights(user))
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

    async deleteTask(id: string, user: User): Promise<void> {
        if (await this.verifyIfUserHasRights(user)) {
            const result = await this.delete(id);
            if (result.affected === 0)
                throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }
}
