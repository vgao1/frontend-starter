import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ModerationDoc extends BaseDoc {
  post: ObjectId;
  item: ObjectId;
  itemType: string;
  reports: Array<string>;
  reporters: Array<string>;
  votersToRemove: Array<string>;
  voted: Array<string>;
}

export interface ModeratorDoc extends BaseDoc {
  moderator: ObjectId;
}

export default class ModerationConcept {
  public readonly reportedItems = new DocCollection<ModerationDoc>("reportedItems");
  public readonly moderators = new DocCollection<ModeratorDoc>("moderators");

  async report(reporter: string, post: string, item: string, itemType: string, reason: string) {
    const item_id = new ObjectId(item);
    const post_id = new ObjectId(post);
    const existingReportedItem = await this.reportedItems.readOne({
      post: post_id,
      item: item_id,
      itemType: itemType,
    });
    let report_id;
    if (existingReportedItem) {
      if (existingReportedItem.reporters.includes(reporter)) {
        throw new AlreadyReportedError(itemType);
      } else {
        const item_id = new ObjectId(item);
        const reports = existingReportedItem.reports;
        reports.push(reason);
        const reporters = existingReportedItem.reporters;
        reporters.push(reporter);
        await this.reportedItems.updateOne(
          { item: item_id },
          {
            reports,
            reporters,
          },
        );
        report_id = (await this.reportedItems.readOne({ item: item_id }))?._id;
      }
    } else {
      const reports = [reason];
      const reporters = [reporter];
      report_id = await this.reportedItems.createOne({ item: item_id, post: post_id, itemType, reports, reporters });
    }
    return { msg: "Report successfully submitted!", report: await this.reportedItems.readOne({ _id: report_id }) };
  }

  async addModerator(userToAdd: string) {
    const newModeratorId = new ObjectId(userToAdd);
    const existingModerator = await this.moderators.readOne({
      moderator: newModeratorId,
    });
    if (existingModerator) {
      throw new NotAllowedError("User is already a moderator!");
    } else {
      await this.moderators.createOne({
        moderator: newModeratorId,
      });
      return { msg: "Successfully added moderator!" };
    }
  }

  async removeModerator(userToRemove: string) {
    const userToRemoveId = new ObjectId(userToRemove);
    const moderatorToRemove = await this.moderators.readOne({ moderator: userToRemoveId });
    if (!moderatorToRemove) {
      throw new ModeratorNotFoundError();
    } else {
      await this.moderators.deleteOne({ moderator: userToRemoveId });
      return { msg: "Successfully removed moderator!" };
    }
  }

  async findModerator(_id: string) {
    const moderatorObj = await this.moderators.readOne({ moderator: new ObjectId(_id) });
    if (moderatorObj) {
      return moderatorObj;
    } else {
      return;
    }
  }

  async findReportedItems() {
    const itemsWithEnoughReports = await this.reportedItems.readMany({
      $expr: { $gte: [{ $size: "$reports" }, 5] },
    });
    return itemsWithEnoughReports;
  }

  async findReport(itemId: string, itemType: string) {
    const _id = new ObjectId(itemId);
    const report = await this.reportedItems.readOne({ item: _id, itemType });
    if (report) {
      return report;
    } else {
      throw ReportNotFoundError;
    }
  }

  async submitVote(moderator: ObjectId, item: string, itemType: string, decision: string) {
    const currentModerator = await this.moderators.readOne({ moderator });
    if (!currentModerator) {
      throw new NotAModeratorError();
    } else {
      const _id = new ObjectId(item);
      let numVotesToRemove = await this.addToVoted(moderator, _id, itemType);
      const numModerators = await this.moderators.count({});
      if (decision === "yes") {
        numVotesToRemove = await this.voteToRemove(moderator, _id, itemType);
        return {
          msg: "Successfully submitted REMOVE item!",
          numVotesToRemove,
          numModerators,
        };
      } else {
        return {
          msg: "Successfully submitted DON'T Remove item!",
          numVotesToRemove,
          numModerators,
        };
      }
    }
  }

  async voteToRemove(moderator: ObjectId, item: ObjectId, itemType: string) {
    const reportedItem = await this.findReport(item.toString(), itemType);
    const existingVotersToRemove = reportedItem.votersToRemove ? reportedItem.votersToRemove : Array<string>();
    existingVotersToRemove.push(moderator.toString());
    await this.reportedItems.updateOne(
      {
        item,
        itemType,
      },
      { votersToRemove: existingVotersToRemove },
    );
    return existingVotersToRemove.length;
  }

  async addToVoted(moderator: ObjectId, item: ObjectId, itemType: string) {
    const reportedItem = await this.findReport(item.toString(), itemType);
    const existingVoters = reportedItem.voted ? reportedItem.voted : Array<string>();
    existingVoters.push(moderator.toString());
    await this.reportedItems.updateOne(
      {
        item,
        itemType,
      },
      { voted: existingVoters },
    );
    return reportedItem.votersToRemove ? reportedItem.votersToRemove.length : 0;
  }

  async deleteAllReportsByPost(post_id: ObjectId) {
    await this.reportedItems.deleteMany({ post: post_id });
    return { msg: "Successfully deleted all reported items by post!" };
  }

  async deleteReportByReaction(reaction_id: ObjectId) {
    await this.reportedItems.deleteOne({ item: reaction_id });
    return { msg: "Successfully deleted reported reaction!" };
  }
}

export class ModeratorNotFoundError extends NotFoundError {
  constructor() {
    super("Moderator not found!");
  }
}

export class ReportNotFoundError extends NotFoundError {
  constructor(public readonly item: string) {
    super("Report for item {0} not found!", item);
  }
}

export class AlreadyReportedError extends NotAllowedError {
  constructor(public readonly itemType: string) {
    super("Not submitted for this {0}, you've already submitted a report!", itemType);
  }
}

export class NotAModeratorError extends NotAllowedError {
  constructor() {
    super("You are not a moderator!");
  }
}
