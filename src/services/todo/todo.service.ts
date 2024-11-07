// ./src/services/todo/todo.service.ts
import { TodoModel, ITodo, ETodoStatus } from './models/todo.model';

export class TodoService {
  async addTodo(
    userId: string,
    username: string,
    code: string,
    description: string,
  ): Promise<ITodo> {
    const todo = new TodoModel({
      userId: `<@${userId}>`,
      username, // Armazenando o username
      code,
      description,
      status: ETodoStatus.TODO,
    });
    return await todo.save();
  }

  async getTodos(userId: string): Promise<ITodo[]> {
    return await TodoModel.find({ userId: `<@${userId}>` });
  }

  async updateTodoStatus(
    userId: string,
    code: string,
    status: ETodoStatus,
  ): Promise<ITodo | null> {
    const update: Partial<ITodo> = { status };

    if (status === ETodoStatus.DONE) {
      update.finishedAt = new Date();
    }

    return await TodoModel.findOneAndUpdate(
      { userId: `<@${userId}>`, code },
      update,
      { new: true },
    );
  }

  async getTodoByCode(userId: string, code: string): Promise<ITodo | null> {
    return await TodoModel.findOne({ userId: `<@${userId}>`, code });
  }

  async deleteTodo(userId: string, code: string): Promise<ITodo | null> {
    return await TodoModel.findOneAndDelete({ userId: `<@${userId}>`, code });
  }

  async deleteAllTodos(userId: string): Promise<void> {
    await TodoModel.deleteMany({ userId: `<@${userId}>` });
  }

  async getTaskStatistics(userId?: string): Promise<any> {
    const pipeline = [];

    if (userId) {
      pipeline.push({ $match: { userId: `<@${userId}>` } });
    }

    pipeline.push(
      {
        $group: {
          _id: { username: '$username', status: '$status' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.username',
          statusCounts: {
            $push: { status: '$_id.status', count: '$count' },
          },
        },
      },
    );

    return await TodoModel.aggregate(pipeline);
  }

  async updateTodoText(
    userId: string,
    code: string,
    newDescription: string,
  ): Promise<ITodo | null> {
    return await TodoModel.findOneAndUpdate(
      { userId: `<@${userId}>`, code },
      { description: newDescription },
      { new: true },
    );
  }

  // Novo método: Retorna todas as tarefas agrupadas por usuário
  async getTodosGroupedByUser(): Promise<any> {
    return await TodoModel.aggregate([
      {
        $group: {
          _id: '$userId',
          tasks: {
            $push: {
              code: '$code',
              description: '$description',
              status: '$status',
            },
          },
        },
      }
    ]);
  }
}
