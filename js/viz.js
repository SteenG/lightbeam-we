/* eslint no-unused-vars: "off" */
/* eslint no-undef: "off" */

const viz = {
  _nodes: [],

  draw(websites) {
    const svgElement = document.getElementById('canvas');

    for(const key in websites){
      if(this._nodes.indexOf(key) === -1) {
        this._nodes.push(key);
        const newDiv = document.createElement('div');
        const text = document.createTextNode(key);

        newDiv.className = 'circle';
        newDiv.appendChild(text);
        svgElement.appendChild(newDiv);
      }
    }
  }
};
