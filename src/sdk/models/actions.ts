import { CancelablePromise, GetActionData, GetActionResponse, GetListActionsData, GetListActionsResponse, ExecuteActionData, ExecuteActionResponse, getAction, getListActions, executeAction } from "../client";
import { Composio } from "../";

/**
 * The `Actions` class provides methods to interact with the Composio platform's actions.
 * It allows fetching details of specific actions, listing all actions, and executing actions.
 *
 * - `get` method retrieves details of a specific action.
 * - `list` method retrieves a list of all actions.
 * - `execute` method executes a specific action.
 *
 * Each method returns a `CancelablePromise` which can be canceled. If canceled, the promise
 * will reject with a `Cancellation` object.
 *
 * @typeParam Composio The client configuration object type.
 * @groupDescription Methods
 * The methods in this class are grouped under 'Actions Methods' and provide functionalities
 * to interact with actions in the Composio platform. This includes fetching, listing, and
 * executing actions.
 */
export class Actions {
    constructor(private readonly client: Composio) {
    }
    /**
     * Retrieves details of a specific action in the Composio platform by providing its action name.
     * 
     * The response includes the action's name, display name, description, input parameters, expected response, associated app information, and enabled status.
     * 
     * @param {GetActionData} data The data for the request.
     * @returns {CancelablePromise<GetActionResponse[0]>} A promise that resolves to the details of the action.
     * @throws {ApiError} If the request fails.
     */
    async get(data: GetActionData): Promise<GetActionResponse[0]> {
        const actions = await getAction(data, this.client.config);
        return actions[0]!;
    }

    /**
     * Retrieves a list of all actions in the Composio platform.
     * 
     * This method allows you to fetch a list of all the available actions. It supports pagination to handle large numbers of actions. The response includes an array of action objects, each containing information such as the action's name, display name, description, input parameters, expected response, associated app information, and enabled status.
     * 
     * @param {GetListActionsData} data The data for the request.
     * @returns {CancelablePromise<GetListActionsResponse>} A promise that resolves to the list of all actions.
     * @throws {ApiError} If the request fails.
     */
    list(data: GetListActionsData = {}): CancelablePromise<GetListActionsResponse> {
        return getListActions(data, this.client.config);
    }

    /**
     * Executes a specific action in the Composio platform.
     * 
     * This method allows you to trigger the execution of an action by providing its name and the necessary input parameters. The request includes the connected account ID to identify the app connection to use for the action, and the input parameters required by the action. The response provides details about the execution status and the response data returned by the action.
     * 
     * @param {ExecuteActionData} data The data for the request.
     * @returns {CancelablePromise<ExecuteActionResponse>} A promise that resolves to the execution status and response data.
     * @throws {ApiError} If the request fails.
     */
    execute(data: ExecuteActionData): CancelablePromise<ExecuteActionResponse> {
        return executeAction(data, this.client.config);
    }
}
