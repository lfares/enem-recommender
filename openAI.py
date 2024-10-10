from openai import OpenAI
import json
import re

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
    questionsFile = open('./enem2023/HumanScience.json')
    questionsJson = json.load(questionsFile)
    questionsFile.close()

    extraResourcesDescription = ""
    if ('extra_resources' in questionsJson[questionId]):
        extraResourceObj = questionsJson[questionId]['extra_resources']
        if isinstance(extraResourceObj, list):
            for resource in range(0, len(extraResourceObj)):
                extraResourcesDescription = extraResourcesDescription + extraResourceObj[resource]['description']
        else:
            extraResourcesDescription = extraResourceObj['description']

    return questionsJson[questionId]['text'], questionsJson[questionId]['statement'], questionsJson[questionId]['alternatives'], extraResourcesDescription

def create_openAi_user_content(modules, questionText, questionStatement, alternatives, extraResourcesDescription):
    content = "<modules>"
    for module in modules:
        content = content + module + '; '
    
    content = content + '</modules> \n <question_text>' + questionText + '</question_text> \n'
    if extraResourcesDescription:
        content = content + '<extra_resources_description>' + extraResourcesDescription + '</extra_resources_description> \n'
    content = content + '<question_statement>' + questionStatement + '</question_statement> \n <alternatives>'

    for alternativeId in alternatives.keys():
        if isinstance(alternatives[alternativeId], dict):
            content = content + alternativeId + '.' + alternatives[alternativeId]['description'] + '; '
        else:
            content = content + alternativeId + '.' + alternatives[alternativeId] + '; '

    content = content + '</alternatives>'
    return content

def add_modules_to_json(questionId, modules):
    with open('./enem2023/definedModules/ModulesIdByHSQuestion.json', 'r+') as modulesIdFile:
        modulesIdJson = json.load(modulesIdFile)

        newQuestion = {questionId: []}
        for module in modules:
            moduleId = re.findall(r'\d+', module)[0]
            newQuestion[questionId].append(moduleId)
        newQuestion[questionId] = list(set(newQuestion[questionId]))

        modulesIdJson.update(newQuestion)
        modulesIdFile.seek(0)
        json.dump(modulesIdJson, modulesIdFile)
    

enemComponent = "humanScience" # can be also retrieved from user
for i in range(1, 46):
    questionId = str(i) # can be also retrieved from user
    todaTeoriaSubjects = retrieve_subjects(enemComponent)
    todaTeoriaModules = retrieve_modules(todaTeoriaSubjects)
    questionText, questionStatement, alternatives, extraResourcesDescription = retrieve_enem_question(questionId)
    userContent = create_openAi_user_content(todaTeoriaModules, questionText, questionStatement, alternatives, extraResourcesDescription)
    print(userContent)

    client = OpenAI()
    miniModel = "gpt-4o-mini"
    systemContent = "You are tasked with assisting a student in preparing for the ENEM exam. \n You will be provided with a set of modules from topics of high school education in Brazil, and a multiple choice question from ENEM, brazilian test to enter universities. \n The question is related with {enemComponent} subject, and it might contain an extra resource description of an image or table to help answer it. The question contains 5 alternatives to choose from, with only one correct. \n Everything will be delimited by XML tags to help identify them.  \n Your task is to identify two modules from the list that are most relevant to helping the student answer the question accurately. \n The modules chosen must be specifically related with the question's main theme, and mastering those modules must enable a person to choose the correct answer without further knowledge. \n Work out the question first, then analyze the content of each module and, finally, choose two modules that would best prepare the student to answer the question. \n The user statement will be done in portuguese \n Provide the number of each relevant module in the format *number*, ensuring that the numbers are enclosed separately in different * symbols"

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
    foundModules = re.findall(r'\*(\d+)\*', str(completion.choices[0].message))
    print(foundModules)
    add_modules_to_json(questionId, foundModules)


