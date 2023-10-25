import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ReactionDoc extends BaseDoc {
  content: string;
  post: ObjectId;
  reacter: ObjectId;
  voters: Array<string>;
  reactionType: string;
  numVotes: number;
}

export default class ReactionConcept {
  public readonly reactions = new DocCollection<ReactionDoc>("reactions");
  async postReaction(content: string, post: ObjectId, reacter: ObjectId, reactionType: string) {
    if (reactionType === "tag") {
      try {
        const existingReaction = await this.getReactions({ post: new ObjectId(post), content, reactionType: "tag" });
        if (existingReaction.length > 0) {
          throw new NotAllowedError('Tag "' + content + '" already exists for this post! Please upvote tag instead.');
        }
      } catch {
        /* empty */
      }
    }
    const voters = Array<string>();
    voters.push(reacter.toString());
    const _id = await this.reactions.createOne({ content, post, reacter, voters, reactionType, numVotes: 0 });
    return { msg: "Reaction successfully posted!", reaction: await this.reactions.readOne({ _id }) };
  }

  async deleteReaction(_id: ObjectId) {
    await this.reactions.deleteOne({ _id: new ObjectId(_id) });
    return { msg: "Reaction deleted successfully!" };
  }

  async deleteAllReactions(_id: ObjectId) {
    await this.reactions.deleteMany({ post: _id });
    return { msg: "Successfully deleted all reactions of deleted post!" };
  }

  async getVoters(id: string) {
    const reaction = await this.reactions.readOne({ _id: new ObjectId(id) });
    if (!reaction) {
      throw new ReactionNotFoundError();
    }
    return reaction.voters;
  }

  async findSimilarPosts(id: string) {
    const reaction = await this.reactions.readOne({ _id: new ObjectId(id) });
    if (!reaction) {
      throw new ReactionNotFoundError();
    } else if (reaction.reactionType === "tag") {
      const tag = reaction.content;
      const query: Filter<ReactionDoc> = {
        content: tag,
        reactionType: "tag",
      };
      const posts = await this.reactions.readMany(query, {
        sort: { dateUpdated: -1 },
      });
      return posts.map((post) => post.post);
    }
  }

  async upvote(user: ObjectId, reaction_id: string) {
    const existingVoters = await this.getVoters(reaction_id);
    const userIdString = user.toString();
    if (existingVoters.includes(userIdString)) {
      throw new AlreadyUpvotedError();
    } else {
      const _id = new ObjectId(reaction_id);
      existingVoters.push(userIdString);
      await this.reactions.updateOne({ _id }, { voters: existingVoters, numVotes: existingVoters.length });
      return { msg: "Reaction successfully upvoted!" };
    }
  }

  async isReacter(user: ObjectId, _id: ObjectId) {
    const reaction = await this.reactions.readOne({ _id });
    if (!reaction) {
      throw new ReactionNotFoundError();
    }
    if (reaction.reacter.toString() !== user.toString()) {
      throw new ReacterNotMatchError();
    }
  }

  async getReactions(query: Filter<ReactionDoc>) {
    const reactions = await this.reactions.readMany(query, {
      sort: { numVotes: -1, dateUpdated: -1 },
    });
    if (reactions.length == 0) {
      throw new ReactionNotFoundError();
    }
    return reactions;
  }

  async getByPost(post: ObjectId) {
    try {
      const postReactions = await this.getReactions({ post });
      return postReactions;
    } catch {
      return [];
    }
  }
}

export class ReacterNotMatchError extends NotAllowedError {
  constructor() {
    super("Reaction not found!");
  }
}

export class ReactionNotFoundError extends NotFoundError {
  constructor() {
    super("Reaction not found!");
  }
}

export class AlreadyUpvotedError extends NotAllowedError {
  constructor() {
    super("Already upvoted this reaction!");
  }
}
