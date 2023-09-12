import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TaskRepository {
  public repo: Repository<Task>; 

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
    this.repo = entityManager.getRepository(Task);
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title, desc } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.desc = desc;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await this.repo.save(task);

    delete task.user;

    return task;
  }

  async findOneById(id: number): Promise<Task> {
    return this.repo.findOne({ where: { id } });
  }

  async deleteById(id: number, user: User): Promise<void> {
    const task = await this.repo.findOne({ where: { id, userId: user.id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    await this.repo.remove(task);
  }

  async getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.repo.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere('task.title LIKE :search OR task.desc LIKE :search', {
        search: `%${search}%`,
      });
    }

    const tasks = query.getMany();
    return tasks;
  }
}
