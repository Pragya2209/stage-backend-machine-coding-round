import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContentType } from 'src/constants/constants';
export type UserContentListDocument = UserContentList & Document;


@Schema()
export class UserContentList {
    @Prop({ required: true, type: Types.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId })
    contentId: Types.ObjectId;

    @Prop({ required: true, enum: ContentType })
    contentType: ContentType;
};

const UserContentListSchema = SchemaFactory.createForClass(UserContentList);
UserContentListSchema.index({ userId: 1, contentId: 1, contentType: 1 });
export default UserContentListSchema;