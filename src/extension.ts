// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { amperSandChain, chainAmpersand, chainAmpersandNewLine, chainOptional } from './functions';


const increment = (str: string) => str.replace(/-?\d+/g, (n) => String(Number(n) + 1));
const decrement = (str: string) => str.replace(/-?\d+/g, (n) => String(Number(n) - 1));

const commandNameFunctionMap: { [key: string]: Function } = {
	chainAmpersand: chainAmpersand,
	chainAmpersandNewLine: chainAmpersandNewLine,
	chainOptional: chainOptional
};
const numberFunctionNames = [
	"increment",
	"decrement",
	"sequence",
	"duplicateAndIncrement",
	"duplicateAndDecrement",
];
const functionNamesWithArgument = ["chop", "truncate", "prune", "repeat"];

const stringFunction = async (commandName: string, context: vscode.ExtensionContext) => {
	const editor = vscode.window.activeTextEditor;
	const selectionMap: any = {};
	if (!editor) {
		return;
	}

	editor.selections.forEach(async (selection, index) => {
		const text = editor.document.getText(selection);
		const textParts = text.split("\n");
		// let stringFunc: (arg0: any) => any, replaced;
		let replaced: string;

		if (functionNamesWithArgument.includes(commandName)) {
			const value = await vscode.window.showInputBox();
			let stringFunc = commandNameFunctionMap[commandName](value);

			replaced = textParts
				.reduce((prev: string[], curr: string): string[] => {
					prev.push(stringFunc(curr));
					return prev;
				}, [])
				.join("\n");
		} else if (numberFunctionNames.includes(commandName)) {
			replaced = commandNameFunctionMap[commandName](text);
		} else {
			let stringFunc = commandNameFunctionMap[commandName];
			replaced = textParts
				.reduce((prev: string[], curr: string): string[] => {
					prev.push(stringFunc(curr));
					return prev;
				}, [])
				.join("\n");

		}
		selectionMap[index] = { selection, replaced };
	});

	editor.edit((builder) => {
		Object.keys(selectionMap).forEach((index) => {
			const { selection, replaced } = selectionMap[index];
			builder.replace(selection, replaced);
		});
	});

	context.globalState.update('lastAction', commandName);
};

export function activate(context: vscode.ExtensionContext) {
	context.globalState.setKeysForSync(['lastAction']);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			`stringwizard.repeatLastAction`,
			() => {
				const lastAction: string | undefined = context.globalState.get('lastAction');
				if (lastAction) {
					return stringFunction(lastAction, context);
				}
			}
		)
	);

	Object.keys(commandNameFunctionMap).forEach((commandName) => {
		context.subscriptions.push(
			vscode.commands.registerCommand(
				`stringwizard.${commandName}`,
				() => stringFunction(commandName, context)
			)
		);
	});
};

