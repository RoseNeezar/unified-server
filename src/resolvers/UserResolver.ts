import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { User, UserModel } from "../entity/User";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../schema/object-id.scalar";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/MyContext";

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Arg("userId", () => ObjectIdScalar) userId: ObjectId) {
    return await UserModel.findById(userId);
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async currentUser(@Ctx() ctx: MyContext): Promise<User | null> {
    return await UserModel.findById(ctx.res.locals.userId);
  }
}
