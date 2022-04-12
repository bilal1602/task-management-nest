import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";
import { v4 as uuidV4 } from "uuid";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter-dto";
@Injectable()
export class TasksService {
	private tasks: Task[] = [];

	getAllTasks(): Task[] {
		return this.tasks;
	}

	getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
		let { search, status } = filterDto;
		let tasks = this.getAllTasks();
		if (status) tasks = tasks.filter((task) => task.status === status);
		if (search) {
			tasks = tasks.filter((task) => task.title.includes(search) || task.description.includes(search));
		}
		return tasks;
	}

	getTaskById(id: string): Task {
		const found = this.tasks.find((task) => task.id === id);

		if (!found) {
			throw new NotFoundException("Task not found!");
		}

		return found;
	}

	createTask(createTaskDto: CreateTaskDto): Task {
		const { title, description } = createTaskDto;

		const task: Task = {
			id: uuidV4(),
			title,
			description,
			status: TaskStatus.OPEN,
		};
		this.tasks.push(task);
		return task;
	}

	updateTask(id: string, status: TaskStatus): Task {
		const task = this.getTaskById(id);
		task.status = status;
		return task;
	}

	deleteTask(id: string): Task {
		let deletedTask = this.getTaskById(id);
		this.tasks = this.tasks.filter((task) => task.id !== deletedTask.id);
		return deletedTask;
	}
}
