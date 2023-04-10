// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "stringwizard" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('stringwizard.chainAmpersand', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document;
		const selection = editor.selection;
		const selectedText = editor.document.getText(editor.selection);
		const modifiedText = amperSandChain(selectedText);
		editor.edit((editBuilder) => {
			editBuilder.replace(selection, modifiedText);
		});

		console.log(`Selected text is ${selectedText}!`);
		console.log(`Selected text is ${selectedText}!`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }

function amperSandChain(text: string) {
	// If Text is anything but a javascript path with dots, return the text
	if (
		text.includes(' ')
	) {
		vscode.window.showInformationMessage(`Its not a valid AmpersandChainner Target. Selection Includes Space Character.`);
		return text;
	}

	// const arr = text.match(/(\w+|\[\'.+?\'\]|\[".+?"\]|\[[\w-]+\])/g) || [];

		const arr = text.match(/(\w+|\[[^\]]+\])/g) || [];
		let result = '';
		let current = '';
		for (let i = 0; i < arr.length; i++) {
			const prop = arr[i];

			let conditionalDelimiter = '.';
			if (current.startsWith('[')) {
				conditionalDelimiter  = '';
			}
			current += (current ? conditionalDelimiter : '') + prop;
			result += `${current} && `;
		}
		return result.slice(0, -4);
}
function convertToSafeAccess(text: string) {
  const properties = text.split(/\.|\[(['"]?)([^'"]+)\1\]/);

  let current = '';
  let output = '';

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];

    if (prop === '') {
      continue;
    }

    if (prop.startsWith('[')) {
      const match = prop.match(/^\[(['"]?)([^'"]+)\1]$/);
      if (match) {
        current += `['${match[2]}']`;
      } else {
        current += `[${prop.slice(1)}`;
      }
    } else {
      current += (current ? '.' : '') + prop;
    }

    output += (output ? ' && ' : '') + current;
  }

  return output;
}