import { EntityManager, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(private readonly eManager: EntityManager) {
        super(Task, eManager);
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

    deleteTask(id: string): void {
        this.delete(id);
    }
}
