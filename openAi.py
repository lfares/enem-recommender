from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Dentre os módulos enumerados a seguir: \n 1- Origem da vida - biogênese e abiogênese; 2- Origem da vida - hipóteses da biogênese; 3- Evolução - teorias da evolução; 4- Evolução - neodarwinismo e evidências da evolução; 5- Biologia celular - conceitos gerais, membrana plasmática e transporte através da membrana; 6- Biologia celular - Organelas citoplasmáticas e divisão celular; 7- Genética - 1ª lei de Mendel e heredogramas; 8- Genética - probabilidades e variações da 1ª lei de Mendel; 9- Genética - 2ª lei de Mendel; 10- Genética - 3ª lei herança sexual, genes ligados e variações da 2ª lei de Mendel; 11- Biologia animal - embriologia, planos de desenvolvimento e diversidade; 12- Biologia animal - diversidade dos invertebrados e dos vertebrados; 13- Fisiologia animal - sistemas digestório e nervoso; 14- Fisiologia animal - sistema endócrino; 15- Fisiologia animal - sistema reprodutor e circulatório; 16- Fisiologia animal - sistema imunológico; 17- Parasitologia - conceitos gerais e doenças causadas por vírus e bactérias; 18- Parasitologia - doenças causadas por protozoários e vermes; 19- Biologia vegetal - diversidade e morfologia vegetal; 20- Biologia vegetal - fisiologia vegetal; 21- Ecologia - conceitos fundamentais, cadeias e teias alimentares, pirâmides ecológicas e ciclos biogeoquímicos; 22- Ecologia - estudo das populações, ecologia de comunidades e dinâmica dos ecossistemas; 23- Ecologia - ecossistemas, biomas e sua distribuição; 24- Ecologia - problemas ambientais; 25- Biotecnologia; \n Quais módulos mais se aproximam da questão apresentada abaixo: \n O número de abelhas encontra-se em declínio em várias regiões do mundo, inclusive no Brasil, sendo que vários fatores contribuem para o colapso de suas colmeias. Nos Estados Unidos, bombas de sementes de espécies vegetais nativas têm sido utilizadas para combater o desaparecimento desses insetos. Elas são pequenas bolinhas recheadas com sementes, adubo e argila. Quando são arremessadas e ficam expostas ao sol e à chuva, germinam até mesmo em solo pouco fértil. DARAYA, V. \n Disponível em: http://planetasustentavel.abril.com.br. Acesso em: 2 fev. 2015 (adaptado). \n Esse método contribui para a preservação das abelhas porque \n A reduz sua predação; B reduz o uso de pesticidas; C reduz a competição por abrigo; D aumenta a oferta de alimento; E aumenta os locais de reprodução. \n A resposta deve conter apenas os respectivos módulos"
        }
    ]
)

print(completion.choices[0].message)

### Answers from OpenAI ###
## 1. General question
# ChatCompletionMessage(content='A questão apresentada está relacionada ao declínio das populações de abelhas e à utilização de bombas de sementes para restaurar o habitat e a oferta de alimento das abelhas. Para identificar quais módulos se aproximam mais desse tema, devemos considerar os tópicos que envolvem ecologia, biótopos e interação entre organismos e seu ambiente.\n\n
# Os módulos que mais se relacionam com a questão são:\n\n- 
# **Módulo 21 - Ecologia - conceitos fundamentais, cadeias e teias alimentares, pirâmides ecológicas e ciclos biogeoquímicos**: Esse módulo abrange a interação entre organismos e o ambiente, assim como a relação entre diferentes níveis tróficos.\n\n- 
# **Módulo 22 - Ecologia - estudo das populações, ecologia de comunidades e dinâmica dos ecossistemas**: Este módulo analisa como as populações se comportam e interagem dentro do seu ecossistema, o que é relevante para entender as implicações do declínio das abelhas e a importância do habitat.\n\n- 
# **Módulo 24 - Ecologia - problemas ambientais**: Este módulo pode abordar a questão do declínio das populações de abeilha em função do desmatamento, uso de pesticidas e outras práticas humanas que impactam os ecossistemas.\n\n
# A estratégia de utilizar bombas de sementes visa aumentar a oferta de alimento para as abelhas, já que as plantas nativas fornecem néctar e pólen, ingredientes essenciais para sua sobrevivência. Portanto, a alternativa correta para a questão levantada é:\n\n**D) aumenta a oferta de alimento.** \n\nEsse aumento de alimento é importante para ajudar a reverter o declínio das populações de abelhas.', refusal=None, role='assistant', function_call=None, tool_calls=None)

## 2. General question with "\n A resposta deve conter apenas os respectivos módulos" at the end to restrict the answer to show only respective modules
# ChatCompletionMessage(content='Os módulos que mais se aproximam da questão apresentada são:\n\n21- Ecologia - conceitos fundamentais, cadeias e teias alimentares, pirâmides ecológicas e ciclos biogeoquímicos;  \n20- Biologia vegetal - fisiologia vegetal.', refusal=None, role='assistant', function_call=None, tool_calls=None)
###
