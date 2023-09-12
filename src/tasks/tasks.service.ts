import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.respository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(private taskRepo: TaskRepository) {}

  getTasks(filterDTO: GetTaskFilterDTO, user: User) {
    return this.taskRepo.getTasks(filterDTO, user);
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepo.createTask(createTaskDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepo.repo.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async deleteTask(id: number, user: User): Promise<void> {
    return this.taskRepo.deleteById(id, user);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
