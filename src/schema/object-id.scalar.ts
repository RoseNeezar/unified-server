import { GraphQLScalarType, Kind } from "graphql";
import { ObjectId } from "mongodb";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo id scalar type",
  parseValue(value: string) {
    return new ObjectId(value); // client from input variable
  },
  serialize(value: ObjectId) {
    return value.toHexString(); // value sent to client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});
