const fs = require('fs');
const readline = require('readline');
const regexs = require('../assets/regex');

async function validate(hipPath) {
  const hip = hipPath || process.argv[2];
  console.log(`Validating ${hip}`)
  const fileStream = fs.createReadStream(hip);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let lineCount = 1;
  let headerBoundaries = [];
  let headers = '';
  for await (const line of rl) {
    if (/---$/.test(line)) {
      headerBoundaries.push(line)
    } else {
      headers += `${line}\n`;
    }
    if (headerBoundaries.length === 2) {
      validateHeaders(headers);
      console.log("Great Success")
      break
    }
    if (/author: /.test(line) || /working-group/.test(line)) {
      validateNames(line) // couldnt find an all encompassing regex to enforce <@gitname or email>, so I wrote this
    }
    
    if (lineCount ===  17) {
      throw new Error('header must be enclosed by "---"')
    }
    lineCount++;
  }
}

function validateHeaders(headers) {
  const errmsgs = [];
  try {
    if (!regexs.hipNum.test(headers)) {
      errmsgs.push('hip num must be a number use 000 if not yet assigned');
    }

    if (!regexs.title.test(headers)) {
      errmsgs.push('header must include a title');
    }

    if (!regexs.councilApproval.test(headers)) {
      errmsgs.push('header must specify "needs-council-approval: Yes/No');
    }

    if (!regexs.status.test(headers)) {
      errmsgs.push('header must include "status: Idea | Draft | Review | Deferred | Withdrawn | Rejected ' + 
      '| Last Call | Council Review | Accepted | Final | Active | Replaced');
    }

    if (!regexs.type.test(headers)) {
      errmsgs.push('header must mast one of the following types exactly ' +
      '"type: Standards Track | Informational | Process"');
    }

    if (!regexs.discussions.test(headers)) {
      errmsgs.push('header must include discussions page ' +
      '"discussions-to: https://github.com/hashgraph/hedera-improvement-proposal/discussions/xxx"');
    }

    if (/needs-council-approval: Yes/.test(headers) && /category: Application/.test(headers)) {
      errmsgs.push('Application category HIPs do not need council approval');
    }

    if (/needs-council-approval: No/.test(headers)
      && (/category: Service/.test(headers) || /category: Core/.test(headers))) {
        errmsgs.push('Service and Core categories require council approval');
    }

    if (!regexs.createdDate.test(headers)) {
      errmsgs.push('created date must be in the form "created: YYYY-MM-DD');
    }

    if (/category:/.test(headers) && !regexs.category.test(headers)) {
      errmsgs.push('header must match one of the following categories ' +
      'exactly "category: Core | Service | API | Mirror | Application"');
    }

    if (/updated:/.test(headers) && !regexs.updatedDate.test(headers)) {
      errmsgs.push('updated date must be in the form "updated: YYYY-MM-DD, YYYY-MM-DD, etc');
    }

    if(/last-call-date-time:/.test(headers) && ! regexs.lastCallDateTime.test(headers)) {
      errmsgs.push('last-call-date-time should be in the form "last-call-date-time: YYYY-MM-DDTHH:MM:SSZ"');
    }

    if (/requires:/.test(headers) && !regexs.requires.test(headers)) {
      errmsgs.push('require field must specify the hip number(s) its referring "requires: hipnum, hipnum(s)"');
    }

    if (/replaces:/.test(headers) && !regexs.replaces.test(headers)) {
      errmsgs.push('replaces field must specify the hip number(s) its referring "replaces: hipnum, hipnum(s)"');
    }

    if (/superseded-by/.test(headers) && !regexs.supersededBy.test(headers)) {
      errmsgs.push('superseded-by field must specify the hip number(s) its referring "superseded-by: hipnum, hipnum(s)"');
    }
    if (errmsgs.length > 0 ) {
      throw errmsgs
    }
  } catch (error) {
    console.log(Error(error));
    process.exit(1);
  }
}

function validateNames(line) {
  try {
      line.split(',')
              .forEach(
                element => {
                  const words = element.split(': ');
                  if (!regexs.name.test(words[words.length - 1])) {
                    throw 'name is improperly formatted, resubmit PR in the form ex: author: Firstname Lastname <@gitName or email>'
                  }
                }
              )
  } catch (error) {
    if (require.main === module) {
      console.log(Error(error));
      process.exit(1);
    }
    throw Error(error)
  }
}

if (require.main === module) {
  validate().catch(error => {
    console.log(error);
    process.exit(1);
  });
}

module.exports = {
  validateHeaders,
  validate
};

