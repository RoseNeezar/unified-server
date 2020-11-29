import { ObjectId } from "mongodb";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Stream, StreamModel } from "../entity/Stream";
import { User, UserModel } from "../entity/User";
import { isAuth } from "../middleware/isAuth";
import { ObjectIdScalar } from "../schema/object-id.scalar";
import { MyContext } from "../types/MyContext";
import { StreamInput } from "../types/SteamInput";

@Resolver(() => Stream)
export class StreamResolver {
  @Query(() => Stream, { nullable: true })
  async stream(@Arg("streamId", () => ObjectIdScalar) streamId: ObjectId) {
    return await StreamModel.findById(streamId);
  }

  @Query(() => [Stream])
  @UseMiddleware(isAuth)
  async streams(@Ctx() Ctx: MyContext) {
    return StreamModel.find({ author: Ctx.res.locals.userId });
  }

  @Mutation(() => Stream)
  @UseMiddleware(isAuth)
  async addStream(
    @Arg("input") streamInput: StreamInput,
    @Ctx() ctx: MyContext
  ): Promise<Stream> {
    const stream = new StreamModel({
      ...streamInput,
      author: ctx.res.locals.userId,
    } as Stream);
    await stream.save();
    return stream;
  }

  @Mutation(() => Stream)
  @UseMiddleware(isAuth)
  async editStream(
    @Arg("input") streamInput: StreamInput,
    @Ctx() ctx: MyContext
  ): Promise<Stream> {
    const { title, url, description, id } = streamInput;
    const stream = await StreamModel.findOneAndUpdate(
      { _id: id, author: ctx.res.locals.userId },
      { title: title, description, url },
      { runValidators: true, new: true }
    );
    if (!stream) {
      throw new Error("Steam not found");
    }
    return stream;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteStream(
    @Arg("streamId", () => ObjectIdScalar) streamId: ObjectId,
    @Ctx() ctx: MyContext
  ): Promise<Boolean | undefined> {
    const deleted = await StreamModel.findByIdAndDelete({
      _id: streamId,
      author: ctx.res.locals.userId,
    });
    if (!deleted) {
      return false;
    }
    return true;
  }

  @FieldResolver()
  async author(@Root() stream: Stream): Promise<User | null> {
    return await UserModel.findById(stream.author);
  }
}
