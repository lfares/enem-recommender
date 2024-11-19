const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand} = require('@aws-sdk/lib-dynamodb');

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

let tableName = "Responses";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    for (const record of event.Records) {
        const body = JSON.parse(record.body);

        const params = {
            TableName: tableName,
            Item: {
                UserId: body.UserId,
                TestId: body.TestId,
                Responses: body.Responses,
                IsFinished: body.IsFinished
            }
        };

        try {
            await ddbDocClient.send(new PutCommand(params));
        console.log(`Successfully inserted item with Id: ${body.UserId} and Data: ${JSON.stringify(body)} into Responses DDB`);
        } catch (err) {
            console.error("Error adding item to Responses DDB: ", JSON.stringify(params), err);
        }
    }
};
