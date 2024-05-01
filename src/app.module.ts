import { Module } from "@nestjs/common";
import { TasksModule } from "./tasks/tasks.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./tasks/task.entity";

@Module({
    imports: [
        TasksModule,
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5433,
            username: "postgres",
            password: "postgres",
            database: "task-management",
            autoLoadEntities: true,
            synchronize: true,
            entities: [Task]
        })
    ]
})
export class AppModule {}
