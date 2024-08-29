from openai import OpenAI
import json

def retrieve_subjects(enemComponent):
    subjectByEnemComponentFile = open('./todaTeoria/subjectByEnemComponent.json')
    subjectByEnemJson = json.load(subjectByEnemComponentFile)
    subjectByEnemComponentFile.close()

    return subjectByEnemJson[enemComponent]

def retrieve_modules(subjects):
    modulesFile = open('./todaTeoria/modules.json')
    modulesJson = json.load(modulesFile)

    modules = []
    for sbj in subjects:
        sbjModules = modulesJson[sbj]['modules']
        for modId in sbjModules.keys():
            modules.append(modId + '. ' + sbjModules[modId])
    
    modulesFile.close()
    
    return modules

def retrieve_enem_question(questionId):
    questionsFile = open('./enem2023/NaturalScience.json')
    questionsJson = json.load(questionsFile)
    questionsFile.close()

    return questionsJson[questionId]['text'], questionsJson[questionId]['statement'], questionsJson[questionId]['alternatives']

def create_openAi_user_content(modules, questionText, questionStatement, alternatives):
    content = "<modules>"
    for module in modules:
        content = content + module + '; '
    
    content = content + '</modules> \n <question_text>' + questionText + '</question_text> \n <question_statement>' + questionStatement + '</question_statement> \n <alternatives>'
    for alternativeId in alternatives.keys():
        content = content + alternativeId + '.' + alternatives[alternativeId] + '; '

    content = content + '</alternatives>'
    return content

enemComponent = "naturalScience" # can be also retrieved from user
questionId = "1" # can be also retrieved from user
todaTeoriaSubjects = retrieve_subjects(enemComponent)
todaTeoriaModules = retrieve_modules(todaTeoriaSubjects)
questionText, questionStatement, alternatives = retrieve_enem_question(questionId)
userContent = create_openAi_user_content(todaTeoriaModules, questionText, questionStatement, alternatives)

client = OpenAI()
miniModel = "gpt-4o-mini"
systemContent = "You will be provided with a set of modules from topics of high school education in Brazil, and a multiple choice question from ENEM, with 5 alternatives to choose from (delimited with XML tags). Please recommend, at most, the top 3 modules that students should study to answer the question. \n The modules should be specifically related with the question's theme. \n The answer should contain only the choosen modules. \n The user statement will be done in portuguese"

completion = client.chat.completions.create(
    model=miniModel,
    messages=[
        {
            "role": "system", 
            "content": systemContent
        },
        {
           "role": "user",
            "content": userContent
        }
    ]
)

print(completion.choices[0].message)


