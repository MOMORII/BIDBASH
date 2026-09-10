//represents a user-submitted listing report
class Report {
    constructor({
        id,
        listingId,
        reporterId,
        moderationCaseId = null,
        reason,
        description = null,
        submittedAt,
        status
    }) {
        this.id = id;
        this.listingId = listingId;
        this.reporterId = reporterId;
        this.moderationCaseId = moderationCaseId;
        this.reason = reason;
        this.description = description;
        this.submittedAt = submittedAt;
        this.status = status;
    }
}

module.exports = Report;