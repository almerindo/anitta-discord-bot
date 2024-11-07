// ./src/services/todo/models/todo.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum ETodoStatus {
    TODO = 'todo',
    DOING = 'doing',
    DONE = 'done',
}

export interface ITodo extends Document {
    userId: string;
    username: string;
    code: string;
    description: string;
    status: ETodoStatus;
    createdAt: Date;
    finishedAt?: Date;
}

const TodoSchema = new Schema<ITodo>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(ETodoStatus), default: ETodoStatus.TODO },
    createdAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },
});

export const TodoModel = mongoose.model<ITodo>('Todo', TodoSchema);
