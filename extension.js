// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// version #1
const parseDomObject = function (root) {
  if (!root) { return ''; };
  //是否有子节点
  if (root.childNodes.length <= 0) {
    if (root.classList) {
      return `.${root.classList[0]}{}`;
    } else {
      return '';
    }
  } else {
    const array = Array.from(root.childNodes);
    if (!root.classList || root.classList.length <= 0) {
      return `${array.reduce((sum, val) => {
        return sum.concat(parseDomObject(val));
      }, '')}`;
    } else {
      return `.${root.classList[0]}{${array.reduce((sum, val) => {
        return sum.concat(parseDomObject(val));
      }, '')} }`;
    }
  }
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World!');
  });

  let extractFunc = vscode.commands.registerCommand('extension.extractHtml', function () {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('Please open a vue file before operation!');
    }
    let doc = editor.document;
    if (doc.languageId === 'vue') {
      let text = doc.getText();

      if (!text) {
        vscode.window.showInformationMessage('no text found!');
        return;
      }

      let templateContext = text.match(/<template>([\s\S]*?)<\/template>/)[0];
      if (!templateContext) {
        vscode.window.showInformationMessage('parse error! #001');
        return;
      }
      let domString = templateContext.replace('<template>', '').replace('</template>', '');
      const frag = JSDOM.fragment(domString);
      // if (frag.childNodes.length !== 1) {
      //   //vue template根节点数量应该为1
      //   vscode.window.showInformationMessage('Error: root nodes length is: ' + (frag.childNodes.length));
      //   return;
      // }

      //输出为CSS对象
      // let outputSCSS = parseDomObject(frag.childNodes[0]);
      let outputSCSS = parseDomObject(frag);
      // doc.concat(`<style>${outputSCSS}</style>`);
      // var lastLine = doc.lineAt(doc.lineCount - 1);
      editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(doc.lineCount, 0), `\r\n<style lang="scss">${outputSCSS}</style>`);
        setTimeout(() => {
          vscode.commands.executeCommand('editor.action.formatDocument').then(val => {
            vscode.window.showInformationMessage('vue结构提取成功！');
          })
        }, 500);
      })

    } else {
      vscode.window.showInformationMessage(`File type ${doc.languageId} is not supported yet!`);
    }

  })

  context.subscriptions.push(disposable);
  context.subscriptions.push(extractFunc);

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;