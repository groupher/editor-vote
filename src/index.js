/**
 * Build styles
 */
require('./index.css').toString();

/**
 * Import Tool's icon
 */

/**
 * @class Vote
 * @classdesc Vote Tool for Editor.js
 * @property {VoteData} data - Vote Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} VoteData
 * @description Vote Tool`s input and output data
 * @property {string} title - warning`s title
 * @property {string} message - warning`s message
 *
 * @typedef {object} VoteConfig
 * @description Vote Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in warning`s title input
 * @property {string} messagePlaceholder - placeholder to show in warning`s message input
 */

class Vote {
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
    return {
      icon: `<svg width="20" t="1573717087071" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2707" width="200" height="200"><path d="M331.5 544h-208c-3.31 0-6-2.69-6-6v-52c0-3.31 2.69-6 6-6h208c3.31 0 6 2.69 6 6v52c0 3.31-2.69 6-6 6z" p-id="2708"></path><path d="M195.5 614V410c0-4.42 3.58-8 8-8h48c4.42 0 8 3.58 8 8v204c0 4.42-3.58 8-8 8h-48c-4.42 0-8-3.58-8-8zM560.58 332.5H111.5v-220h449.08c36.41 0 65.92 29.51 65.92 65.92v88.15c0 36.42-29.51 65.93-65.92 65.93zM560.58 911.5H111.5v-220h449.08c36.41 0 65.92 29.51 65.92 65.92v88.15c0 36.42-29.51 65.93-65.92 65.93zM845.5 622h-385c-35.9 0-65-29.1-65-65v-90c0-35.9 29.1-65 65-65h385c35.9 0 65 29.1 65 65v90c0 35.9-29.1 65-65 65z" p-id="2709"></path></svg>`,
      title: '投票'
    };
  }

  /**
   * Allow to press Enter inside the Vote
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for warning title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TITLE_PLACEHOLDER() {
    return 'Title';
  }

  /**
   * Default placeholder for warning message
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_MESSAGE_PLACEHOLDER() {
    return 'Message';
  }

  /**
   * Vote Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-vote',
      voteBar: 'cdx-vote-bar',
      voteBarInput: 'cdx-vote-input',
      barAdder: 'cdx-vote-bar__adder',
      barDeleter: 'cdx-vote-bar__deleter'
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {VoteData} data — previously saved data
   * @param {VoteConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    // this.titlePlaceholder = config.titlePlaceholder || Vote.DEFAULT_TITLE_PLACEHOLDER;
    // this.messagePlaceholder = config.messagePlaceholder || Vote.DEFAULT_MESSAGE_PLACEHOLDER;

    // this.data = {
    //   title: data.title || '',
    //   message: data.message || ''
    // };

    this.data = {};
    this.container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
  }

  removeAllElements(className) {
    const allAdderElements = document.querySelector(className); // .remove()

    if (allAdderElements) {
      allAdderElements.forEach ?
        allAdderElements.forEach(e => e.parentNode.removeChild(e)) :
        allAdderElements.remove();
    }
  }

  addBar() {
    const bar = this.makeBar();

    this.container.appendChild(bar);
  }

  deleteBar(curBar) {
    delete this.data[curBar.index];
    curBar.remove();
  }

  uniqNum() {
    return Math.random().toString(36).substr(2, 9);
  }
  // attr progress bar
  makeBar() {
    const totalCount = this.container.childElementCount;
    const bar = this._make('div', [this.CSS.voteBar], { index: this.uniqNum() });
    const barInput = this._make('div', [this.CSS.voteBarInput], {
      contentEditable: true,
      innerHTML: '投票选项 ' + totalCount
    });

    bar.appendChild(barInput);

    this.removeAllElements('.' + this.CSS.barAdder);
    this.removeAllElements('.' + this.CSS.barDeleter);

    // line-break is not alloed
    this.api.listeners.on(bar, 'keypress', (ev) => {
      if (ev.which === 13) ev.preventDefault()
    }, true);

    this.api.listeners.on(bar, 'input', (ev) => {
      const index = ev.target.parentNode['index'];
      const value = ev.target.innerText;

      this.data[index] = value;
    }, true);

    setTimeout(() => {
      // console.log("before loop: ", this.container.children)
      for (let i = 0; i <= totalCount; i++) {
        const curBar = this.container.children[i];
        // console.log(" makebar: ", this.container.children[i])

        if (totalCount >= 1 && i === totalCount) {
          const adder = this._make('div', [this.CSS.barAdder], {});
          // bar.appendChild(adder);

          curBar.appendChild(adder);
          this.api.listeners.on(adder, 'click', this.addBar.bind(this), true);
        }

        if (totalCount >= 2 && i >= 1 && i <= totalCount - 1) {
          const deleter = this._make('div', [this.CSS.barDeleter], {});

          curBar.appendChild(deleter);
          this.api.listeners.on(deleter, 'click', this.deleteBar.bind(this, curBar), true);
        }
      }
    }, 100);

    return bar;
  }

  /**
   * Create Vote Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    // initial two bar

    const bar = this.makeBar();

    this.container.appendChild(bar);

    const bar2 = this.makeBar();

    this.container.appendChild(bar2);

    return this.container;
  }

  /**
   * Extract Vote data from Vote Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {VoteData}
   */
  save(warningElement) {
    // const title = warningElement.querySelector(`.${this.CSS.title}`);
    // const message = warningElement.querySelector(`.${this.CSS.message}`);
    console.log('save: ', this.data);

    return Object.assign(this.data, {
      // title: "", // title.innerHTML,
      // ssage: "", // message.innerHTML
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Vote Tool saved data
   * @return {Object}
   */
  static get sanitize() {
    return {
      title: {},
      message: {}
    };
  }
}

module.exports = Vote;
