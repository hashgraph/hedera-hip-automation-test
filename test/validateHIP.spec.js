const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const validateHIP = require("../scripts/validateHIP.js");
const hip = "hip-415.md";

describe("Header", function () {

    it("should not throw if hip headers are valid", function () {
        expect(() => validateHIP.validate(hip)).to.not.throw;
    });

    it("should throw if hip has type core, but not marked as needing council review", async function () {
        const noCouncilReveiwCore = headers.replace("needs-council-approval: Yes", "needs-council-approval: No");
        expect(() => validateHIP.validate(noCouncilReveiwCore))
            .throws(/Service and Core categories require council approval/);
    });

    it("should throw if hip has type service, but not marked as needing council review", async function () {
        const noCouncilReveiwService = headers.replace("needs-council-approval: Yes", "needs-council-approval: No")
            .replace("category: Core", "category: Service")
        expect(() => validateHIP.validate(noCouncilReveiwService))
            .throws(/Service and Core categories require council approval/);
    });

    it("should throw if hip marked as Application type and needing council review", async function () {
        const applicationWithCouncilReview = headers.replace("category: Core", "category: Application")

        expect(() => validateHIP.validate(applicationWithCouncilReview))
            .throws(/Application category HIPs do not need council approval/);
    });

    context("hipnum", function () {
        it("should throw if hip number is not a number", async function () {
            const badHipNum = headers.replace("hip: 415", "hip: title");
            expect(() => validateHIP.validate(badHipNum)).throws(/hip num/);
        });

        it("should throw if hip number is empty", async function () {
            const noHipNum = headers.replace("hip: 415", "hip:");
            expect(() => validateHIP.validate(noHipNum)).throws(/hip num/);
        });
    });

    context("title", function () {
        it("should throw if title is improperly formatted", async function () {
            const badHipNum = headers.replace("title: ", "title:");
            expect(() => validateHIP.validate(badHipNum)).throws(/title/);
        });

        it("should throw if title is empty", async function () {
            const noHipNum = headers.replace("title: Introduction Of Blocks", "title:");
            expect(() => validateHIP.validate(noHipNum)).throws(/title/);
        });
    });

    context("category", function () {
        it("should throw if hip has a misspelled category", async function () {
            const badCategory = headers.replace("category: Core", "category: Coer")

            expect(() => validateHIP.validate(badCategory))
                .throws(/category/);
        });
    });

    context("type", function () {
        it("should throw if hip has a misspelled type", async function () {
            const badType = headers.replace("type: Standards Track", "type: Standart Track")

            expect(() => validateHIP.validate(badType))
                .throws(/type/);
        });
    });

    context("needs-council-approval", function () {
        it("should throw if needs-council-approval is missing", async function () {
            const missingCouncilApproval = headers.replace("needs-council-approval: Yes", "")
            expect(() => validateHIP.validate(missingCouncilApproval)).throws(/needs-council-approval/);
        });
    });

    context("status", function () {
        it("should throw if status is missing", async function () {
            const missingStatus = headers.replace("status: Inactive", "")
            expect(() => validateHIP.validate(missingStatus)).throws(/status/);
        });
    });

    context("created", function () {
        it("should throw if hip created date is improperly formatted", async function () {
            const badDate = headers.replace("created: 2022-03-28", "created: 03-28-2022")
            expect(() => validateHIP.validate(badDate)).throws(/created date/);
        });
    });

    context("discussions-to", function () {
        it("should throw if missing discussions link", async function () {
            const missingDiscussions = headers.replace("discussions-to:", "")
            expect(() => validateHIP.validate(missingDiscussions)).throws(/discussions-to/);
        });
    });

    context("last-call-date-time", function () {
        it("should throw if last-call-date-time is improperly formatted", async function () {
            const missingDiscussions = headers.replace("2022-05-17T07:00:00Z", "2022-23-01")
            expect(() => validateHIP.validate(missingDiscussions)).throws(/last-call-date-time/);
        });
    });

    context("requires", function () {
        it("should throw if requires is not a number", async function () {
            const badHipNum = headers.replace("requires: 435", "requires: title");
            expect(() => validateHIP.validate(badHipNum)).throws(/requires/);
        });

        it("should throw if requires is a comma separated list", async function () {
            const badHipNum = headers.replace("requires: 435", "requires: 435 345");
            expect(() => validateHIP.validate(badHipNum)).throws(/requires/);
        });

    });

    context("replaces", function () {
        it("should throw if replaces is not a number", async function () {
            const badHipNum = headers.replace("requires: 435", "replaces: title");
            expect(() => validateHIP.validate(badHipNum)).throws(/replaces/);
        });

    });

    context("superseded-by", function () {
        it("should throw if superseded-by is not a number", async function () {
            const badHipNum = headers.replace("requires: 435", "superseded-by: title");
            expect(() => validateHIP.validate(badHipNum)).throws(/superseded-by/);
        });

    });

    context("updated", function () {
        it("should throw if hip updated date is improperly formatted", async function () {
            const badDate = headers.replace("updated: 2022-05-18", "updated: 05-18-2022")
            expect(() => validateHIP.validate(badDate)).throws(/updated date/);
        });
    });
});