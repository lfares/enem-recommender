const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand} = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "QuestionsEnem";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

exports.handler = async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const subject = record.messageAttributes.Subject ? record.messageAttributes.Subject.stringValue : null;
    const year = record.messageAttributes.Year ? parseInt(record.messageAttributes.Year.stringValue) : 2023;

    let currId = await getCurrId();

    for (const key in body) {
      currId = currId + 1;
      const question = body[key];
      const friendlyQuestionId = parseInt(key);

      const resources = question.extra_resources;
      const imagesPath = Array.isArray(resources) ? resources.map(res => res.content) 
                        : Array.isArray(resources.content) ? resources.content
                        : resources.content ? [resources.content] : null;
      const ImagesDescription = Array.isArray(resources) ? resources.map(res => res.description)
                                : Array.isArray(resources.description) ? resources.description
                                : resources.description ? [resources.description] : null;

      const ddbItem = {
        Id: currId,
        Text: question.text,
        Statement: question.statement,
        TypeAlternative: Object.values(question.alternatives).some(value => typeof value === 'object') ? 'image' : 'text',
        Alternatives: question.alternatives,
        CorrectAnswer: question.correct_answer,
        ImagesPath: imagesPath,
        ImagesDescription: ImagesDescription,
        FriendlyQuestionId: friendlyQuestionId,
        Subject: subject,
        Year: year
      };

      try {
        const putItemParams = {
          TableName: tableName,
          Item: ddbItem
        };
        await ddbDocClient.send(new PutCommand(putItemParams));
        console.log(`Successfully inserted item with Id: ${ddbItem.Id} and Data: ${JSON.stringify(ddbItem)}`);
      } catch (err) {
        console.log(`Error inserting item with Id: ${ddbItem.Id} - ${err.message}`);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify('Processed all records')};
};

async function getCurrId() {
  try {
    const params = {
      TableName: tableName,
      Select: `COUNT`
    };

    const data = await ddbDocClient.send(new ScanCommand(params));

    return data.Count;
  } catch (err) {
    console.error('Error retrieving item count: ', err.message);
    return 0;
  }
}
