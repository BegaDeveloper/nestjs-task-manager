import { IsIn, IsOptional, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
