const html = require('choo/html')
const Component = require('choo/component')

const {EditorState} = require('@codemirror/state')
const {defaultHighlightStyle} = require('@codemirror/highlight')
const {EditorView, keymap, KeyBinding} = require('@codemirror/view')
const {defaultKeymap} = require('@codemirror/commands')
const {javascript} = require('@codemirror/lang-javascript')

module.exports = class CodeMirror extends Component {
  constructor (id, state, emit, editable = true) {
    super(id)
    this.local = state.components[id] = {}
    this.editable = editable
  }

  evaluate () {
    const code = this.view.state.doc.toString()
    Function(code)()
    return true // super important for CM not to add "\n"
  }

  load (element) {
    const keymaps = []
    if (this.editable) {
      keymaps.push(keymap.of({key: 'Ctrl-Enter', run: () => this.evaluate(), preventDefault: true}))
      keymaps.push(keymap.of(defaultKeymap))
    }

    let theme = EditorView.theme({
      "&": {
        backgroundColor: "rgba(255,255,255,0.5)",
        minHeight: this.editable ? "8rem" : "1rem",
      },
    });
    
    const editorState = EditorState.create({
      doc: 'Hello World',
      extensions: [
        keymaps,
        theme,
        javascript(),
        defaultHighlightStyle.fallback,
        EditorView.editable.of(this.editable),
        EditorView.lineWrapping,
      ],
    })

    this.view = new EditorView({
      state: editorState,
      parent: element,
      extensions: [  ],
    })
  }

  setCode (code) {
    this.view.dispatch({
      changes: {from: 0, to: this.view.state.doc.length, insert: code}
    })
    if (this.editable) {
      this.evaluate()
    }
  }

  getLastCode () {
    return this.view.state.doc.toString()
  }

  update () {
    return false
  }

  createElement () {
    return html`<div class="w-100"></div>`
  }
}