import json

definedModulesJsonPath = './enem2023/definedModules/ModulesIdByHSQuestion.json'
questionsJsonPath = './enem2023/HumanScience.json'
todaTeoriaModulesKey = "todaTeoriaModules"    

def retrieveModuleJson():
    modulesFile = open(definedModulesJsonPath)
    modulesJson = json.load(modulesFile)
    modulesFile.close()

    return modulesJson

with open(questionsJsonPath, 'r+', encoding='utf-8') as questionsFile:
    questionsJson = json.load(questionsFile)

    for questionId, modules in retrieveModuleJson().items():
        newKeyValuePair = {todaTeoriaModulesKey: modules}
        questionsJson[questionId].update(newKeyValuePair)

    questionsFile.seek(0)
    json.dump(questionsJson, questionsFile, ensure_ascii=False, indent=4)