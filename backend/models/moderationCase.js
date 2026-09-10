//represents a moderation case linked to a listing
class ModerationCase {
    constructor({
        id,
        listingId,
        moderatorId = null,
        flagReason,
        riskLevel,
        evidence = null,
        status,
        createdAt,
        reviewedAt = null,
        decisionNotes = null
    }) {
        this.id = id;
        this.listingId = listingId;
        this.moderatorId = moderatorId;
        this.flagReason = flagReason;
        this.riskLevel = riskLevel;
        this.evidence = evidence;
        this.status = status;
        this.createdAt = createdAt;
        this.reviewedAt = reviewedAt;
        this.decisionNotes = decisionNotes;
    }
}

module.exports = ModerationCase;