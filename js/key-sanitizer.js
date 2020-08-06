class KeySanitizer {
  map = new Map();

  constructor() {
    console.log('constructor');
    this.loadMap();
  }

  sanitize(key) {
    return this.map.get(key.toUpperCase()) ? this.map.get(key) : key;
  }

  loadMap() {
    this.map.set("OS", "META"); // firefox bug, "META" key reported as "OS". https://bugzilla.mozilla.org/show_bug.cgi?id=1232918
  }
}
