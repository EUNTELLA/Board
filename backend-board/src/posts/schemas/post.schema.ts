import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true })
    author: string;
    @Prop({ required: true })
    content: string;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    author: string;


    @Prop({ default: 0 })
    views: number;
    // ---

    @Prop({ type: [CommentSchema], default: [] })
    comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

