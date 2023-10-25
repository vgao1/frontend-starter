import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Favorite, Moderation, Post, Reaction, User, WebSession, ZipCodeMap } from "./app";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.get("/users/getUsername/:id")
  async getUsername(id: string) {
    return await User.getUsername(id);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.get("/posts/:_id")
  async getPostById(_id: ObjectId) {
    const postObj = await Post.getPost(_id);
    return Responses.post(postObj);
  }

  @Router.get("/posts/searchByZip/:zipCode")
  async getPostsByZip(zipCode: string) {
    const posts = await Post.getPosts({ zipCode });
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, photoURL: string, zipCode: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    await ZipCodeMap.isValidZipCode(zipCode);
    const created = await Post.create(user, photoURL, zipCode, options);
    const creationMsg = created.msg;
    return { msg: creationMsg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    let msgValue = "";
    const postUpdate = await Post.update(_id, update);
    msgValue = postUpdate.msg + "\n" + msgValue;
    return { msg: msgValue };
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    const postObj = await Post.getPost(_id);
    let msgValue = "";
    if (postObj) {
      await Moderation.deleteAllReportsByPost(postObj._id);
      await Reaction.deleteAllReactions(postObj._id);
      await Favorite.unfavoriteAll(postObj._id);
    }
    const postDeletion = await Post.delete(_id);
    msgValue = postDeletion.msg + "\n" + msgValue;
    return { msg: msgValue };
  }

  @Router.post("/favorites")
  async favoriteItem(session: WebSessionDoc, item: string, itemType: string) {
    const user = WebSession.getUser(session);
    const _id = new ObjectId(item);
    if (itemType === "post") {
      await Post.getPosts({ _id });
    } else if (itemType === "user") {
      await User.getUserById(_id);
    }
    return await Favorite.favorite(user, _id, itemType);
  }

  @Router.delete("/favorites/:_id")
  async unfavoritePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Favorite.isLiker(user, _id);
    return Favorite.unfavorite(_id);
  }

  @Router.get("/favorites")
  async getFavorites(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const favorites = await Favorite.getByLiker(user);
    if (favorites) {
      return Responses.favorites(favorites);
    }
  }

  @Router.get("/favorites/findFavoritePost")
  async findFavoritePost(session: WebSessionDoc, item: string) {
    const user = WebSession.getUser(session);
    return await Favorite.findFavoritePost(user, item);
  }

  @Router.get("/favorites/findFavoriteArtist")
  async findFavoriteArtist(session: WebSessionDoc, otherUser: string) {
    const user = WebSession.getUser(session);
    const otherUserId = (await User.getUserByUsername(otherUser))._id;
    return await Favorite.findFavoriteArtist(user, otherUserId.toString());
  }

  @Router.post("/reactions")
  async postReaction(session: WebSessionDoc, post: string, content: string, reactionType: string) {
    const user = WebSession.getUser(session);
    const postId = new ObjectId(post);
    return await Reaction.postReaction(content, postId, user, reactionType);
  }

  @Router.delete("/reactions/:_id")
  async deleteReaction(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Reaction.isReacter(user, _id);
    return await Reaction.deleteReaction(_id);
  }

  @Router.post("/reactions/upvote")
  async upvoteTag(session: WebSessionDoc, reaction: string) {
    const user = WebSession.getUser(session);
    return await Reaction.upvote(user, reaction);
  }

  @Router.get("/reactions/similarPosts")
  async findSimilarPosts(reaction: string) {
    return await Reaction.findSimilarPosts(reaction);
  }

  @Router.get("/reactions")
  async getReactions(post?: string) {
    let reactions;
    if (post) {
      const id = new ObjectId(post);
      reactions = await Reaction.getByPost(id);
    } else {
      reactions = await Reaction.getReactions({});
    }
    return Responses.reactions(reactions);
  }

  @Router.get("/reactions/reaction/:_id")
  async getReaction(_id: ObjectId) {
    const reaction = await Reaction.getReactions({ _id });
    return Responses.reactions(reaction);
  }

  @Router.post("/report")
  async uploadReport(session: WebSessionDoc, post: string, item: string, itemType: string, reason: string) {
    // called when user submits a report to report item for being inappropriate. post is the post item is under
    // if item is a comment/tag or the post that is reported is item is a post
    const user = WebSession.getUser(session);
    if (itemType === "post") {
      await Post.getPosts({ _id: new ObjectId(item) });
    } else if (itemType === "reaction") {
      await Reaction.getReactions({ _id: new ObjectId(item) });
    }
    const report = await Moderation.report(user.toString(), post, item, itemType, reason);
    return { msg: report.msg, report: await Responses.report(report.report) };
  }

  @Router.post("/submitRemovalVote")
  async voteRemove(session: WebSessionDoc, item: string, itemType: string, decision: string) {
    // called when a moderator votes to remove an item that was reported to be inappropriate. post
    // is the post item is under if item is a comment/tag or the post that is reported if item is a post.
    const user = WebSession.getUser(session);
    const removeItemData = await Moderation.submitVote(user, item, itemType, decision);
    const minVotesToRemove: number = Math.ceil(removeItemData.numModerators / 2);
    if (removeItemData.numVotesToRemove >= minVotesToRemove) {
      const item_id = new ObjectId(item);
      if (itemType === "post") {
        let msgValue = "";
        const postObj = await Post.getPost(item_id);
        await Moderation.deleteAllReportsByPost(postObj._id);
        await Reaction.deleteAllReactions(postObj._id);
        await Favorite.unfavoriteAll(postObj._id);
        const postDeletion = await Post.delete(item_id);
        msgValue = postDeletion.msg + " " + msgValue;
        return { msg: msgValue };
      } else {
        await Moderation.deleteReportByReaction(item_id);
        return await Reaction.deleteReaction(item_id);
      }
    }
    return removeItemData;
  }

  @Router.post("/addModerator")
  async addModerator(userToAdd: string) {
    return Moderation.addModerator(userToAdd);
  }

  @Router.post("/removeModerator/:id")
  async removeModerator(id: string) {
    return Moderation.removeModerator(id);
  }

  @Router.get("/findModerator/:_id")
  async findModerator(_id: string) {
    return Moderation.findModerator(_id);
  }

  @Router.get("/reportedItems")
  async findReportedItems() {
    return Moderation.findReportedItems();
  }

  @Router.get("/getRecommendations")
  async getRecommendations(session: WebSessionDoc) {
    const liker = WebSession.getUser(session);
    const favoritePosts = await Favorite.getFavorites({ liker, itemType: "post" });
    const favoriteUsers = await Favorite.getFavorites({ liker, itemType: "user" });
    let similarPosts: Array<string> = [];
    if (favoritePosts) {
      for (const favorite of favoritePosts) {
        const reactions = (await Reaction.getByPost(favorite.likedItem)).slice(0, 5);
        for (const reaction of reactions) {
          const postsSimilarToFavorite = await Reaction.findSimilarPosts(reaction._id.toString());
          if (postsSimilarToFavorite) {
            similarPosts = similarPosts.concat(postsSimilarToFavorite.filter((post) => !similarPosts.includes(post.toString())).map((post) => post.toString()));
          }
        }
      }
    }
    if (favoriteUsers) {
      for (const user of favoriteUsers) {
        const userPosts = await Post.getByAuthor(user.likedItem);
        similarPosts = similarPosts.concat(userPosts.filter((post) => !similarPosts.includes(post._id.toString())).map((post) => post._id.toString()));
      }
    }
    return similarPosts;
  }
}

export default getExpressRouter(new Routes());
