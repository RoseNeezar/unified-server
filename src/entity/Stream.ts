import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
import { User } from "./User";
import { Ref } from "../types/Ref";

@ObjectType({ description: "Steam embedded post content" })
export class Stream {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  title: string;

  @Field()
  @Property({ required: true })
  description: string;

  @Field()
  @Property({ required: true })
  url: string;

  @Field(() => User)
  @Property({ ref: User, required: true })
  author: Ref<User>;
}

export const StreamModel = getModelForClass(Stream);
