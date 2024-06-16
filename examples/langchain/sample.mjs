import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { pull } from "langchain/hub";
import { LangchainToolSet } from "composio-core";

const toolset = new LangchainToolSet({ apiKey: process.env.COMPOSIO_API_KEY, baseUrl: "https://syntax-seat-surface-authors.trycloudflare.com/api" });

async function setupUserConnectionIfNotExists(entityId) {
    const entity = await toolset.client.getEntity(entityId);
    const connection = await entity.getConnection('github');
    if (!connection) {
        const connection = await entity.initiateConnection(appName);
        console.log("Log in via: ", connection.redirectUrl);
        return connection.waitUntilActive(60);
    }
    return connection;
}

async function executeAgent(entityName) {
    // Create entity and get tools
    const entity = await toolset.client.getEntity(entityName)
    await setupUserConnectionIfNotExists(entity.id);
    const tools = await toolset.get_actions({ actions: ["github_issues_create"] }, entity.id);

    const prompt = await pull("hwchase17/openai-functions-agent");
    const llm = new ChatOpenAI({
        model: "gpt-4",
        apiKey: process.env.OPEN_AI_API_KEY
    });


    const body = "TITLE: HELLO WORLD, DESCRIPTION: HELLO WORLD for the repo - himanshu-dixit/custom-repo-breaking"
    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools: tools,
        prompt,
    });

    const agentExecutor = new AgentExecutor({ agent, tools, verbose: true, });
    const result = await agentExecutor.invoke({
        input: "Please create another github issue with the summary and description with the following details of another issue:- , " + JSON.stringify(body)
    });

    console.log(result.output)
}

toolset.client.triggers.subscribe(async (data) => {
    console.log(data)
})

// executeAgent("himanshu")