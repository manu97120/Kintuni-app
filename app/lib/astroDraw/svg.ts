import type { Settings } from "./settings";

/**
 * SVG tools.
 *
 * @class
 * @public
 * @constructor
 * @param {String} elementId - root DOM Element
 * @param {int} width
 * @param {int} height
 */
class SVG {
  settings: Settings;
  _paperElementId: string;
  DOMElement: SVGSVGElement;
  root: Element;
  width: number;
  height: number;
  context: this;
  constructor(
    elementId: string,
    width: number,
    height: number,
    settings: Settings,
  ) {
    this.settings = settings;
    const rootElement = document.getElementById(elementId);
    if (rootElement == null) throw new Error("Root element not found");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS(
      "http://www.w3.org/2000/xmlns/",
      "xmlns:xlink",
      "http://www.w3.org/1999/xlink",
    );
    svg.setAttribute("style", "position: relative; overflow: hidden;");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", width.toString());
    svg.setAttribute("height", height.toString());
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    rootElement.appendChild(svg);

    this._paperElementId = elementId + "-" + this.settings.ID_CHART;

    const wrapper = document.createElementNS(svg.namespaceURI, "g");
    wrapper.setAttribute("id", this._paperElementId);
    svg.appendChild(wrapper);

    this.DOMElement = svg;
    this.root = wrapper;
    this.width = width;
    this.height = height;

    this.context = this;
  }

  _getSymbol(name: string, x: number, y: number): Element {
    switch (name) {
      case this.settings.SYMBOL_SIRIUS:
        return this.sirius(x, y);
      case this.settings.SYMBOL_SUN:
        return this.sun(x, y);
      case this.settings.SYMBOL_MOON:
        return this.moon(x, y);
      case this.settings.SYMBOL_MERCURY:
        return this.mercury(x, y);
      case this.settings.SYMBOL_VENUS:
        return this.venus(x, y);
      case this.settings.SYMBOL_MARS:
        return this.mars(x, y);
      case this.settings.SYMBOL_JUPITER:
        return this.jupiter(x, y);
      case this.settings.SYMBOL_SATURN:
        return this.saturn(x, y);
      case this.settings.SYMBOL_URANUS:
        return this.uranus(x, y);
      case this.settings.SYMBOL_NEPTUNE:
        return this.neptune(x, y);
      case this.settings.SYMBOL_PLUTO:
        return this.pluto(x, y);
      case this.settings.SYMBOL_CHIRON:
        return this.chiron(x, y);
      case this.settings.SYMBOL_LILITH:
        return this.lilith(x, y);
      case this.settings.SYMBOL_NNODE:
        return this.nnode(x, y);
      case this.settings.SYMBOL_SNODE:
        return this.snode(x, y);
      case this.settings.SYMBOL_FORTUNE:
        return this.fortune(x, y);
      case this.settings.SYMBOL_ARIES:
        return this.aries(x, y);
      case this.settings.SYMBOL_TAURUS:
        return this.taurus(x, y);
      case this.settings.SYMBOL_GEMINI:
        return this.gemini(x, y);
      case this.settings.SYMBOL_CANCER:
        return this.cancer(x, y);
      case this.settings.SYMBOL_LEO:
        return this.leo(x, y);
      case this.settings.SYMBOL_VIRGO:
        return this.virgo(x, y);
      case this.settings.SYMBOL_LIBRA:
        return this.libra(x, y);
      case this.settings.SYMBOL_SCORPIO:
        return this.scorpio(x, y);
      case this.settings.SYMBOL_SAGITTARIUS:
        return this.sagittarius(x, y);
      case this.settings.SYMBOL_CAPRICORN:
        return this.capricorn(x, y);
      case this.settings.SYMBOL_AQUARIUS:
        return this.aquarius(x, y);
      case this.settings.SYMBOL_PISCES:
        return this.pisces(x, y);
      case this.settings.SYMBOL_AS:
        return this.ascendant(x, y);
      case this.settings.SYMBOL_DS:
        return this.descendant(x, y);
      case this.settings.SYMBOL_MC:
        return this.mediumCoeli(x, y);
      case this.settings.SYMBOL_IC:
        return this.immumCoeli(x, y);
      case this.settings.SYMBOL_CUSP_1:
        return this.number1(x, y);
      case this.settings.SYMBOL_CUSP_2:
        return this.number2(x, y);
      case this.settings.SYMBOL_CUSP_3:
        return this.number3(x, y);
      case this.settings.SYMBOL_CUSP_4:
        return this.number4(x, y);
      case this.settings.SYMBOL_CUSP_5:
        return this.number5(x, y);
      case this.settings.SYMBOL_CUSP_6:
        return this.number6(x, y);
      case this.settings.SYMBOL_CUSP_7:
        return this.number7(x, y);
      case this.settings.SYMBOL_CUSP_8:
        return this.number8(x, y);
      case this.settings.SYMBOL_CUSP_9:
        return this.number9(x, y);
      case this.settings.SYMBOL_CUSP_10:
        return this.number10(x, y);
      case this.settings.SYMBOL_CUSP_11:
        return this.number11(x, y);
      case this.settings.SYMBOL_CUSP_12:
        return this.number12(x, y);
      default: {
        const unknownPoint = this.circle(x, y, 8);
        unknownPoint.setAttribute("stroke", "#ffff00");
        unknownPoint.setAttribute("stroke-width", "1");
        unknownPoint.setAttribute("fill", "#ff0000");
        return unknownPoint;
      }
    }
  }

  /**
   * Get a required symbol.
   *
   * @param {String} name
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGElement g}
   */
  getSymbol(name: string, x: number, y: number): Element {
    if (this.settings.CUSTOM_SYMBOL_FN == null)
      return this._getSymbol(name, x, y);

    const symbol = this.settings.CUSTOM_SYMBOL_FN(name, x, y, this.context);
    if (symbol == null || symbol === undefined)
      return this._getSymbol(name, x, y);

    return symbol;
  }

  /**
   * Create transparent rectangle.
   *
   * Used to improve area click, @see this.settings.ADD_CLICK_AREA
   *
   * @param {Number} x
   * @param {Number} y
   *
   * @return {Element} rect
   */
  createRectForClick(x: number, y: number): Element {
    const rect = document.createElementNS(
      this.context.root.namespaceURI,
      "rect",
    );
    rect.setAttribute("x", (x - this.settings.SIGNS_STROKE).toString());
    rect.setAttribute("y", (y - this.settings.SIGNS_STROKE).toString());
    rect.setAttribute("width", "20px");
    rect.setAttribute("height", "20px");
    rect.setAttribute("fill", "transparent");
    return rect;
  }

  /**
   * Get ID for sign wrapper.
   *
   * @param {String} sign
   *
   * @return {String id}
   */
  getSignWrapperId(sign: string): string {
    return (
      this._paperElementId +
      "-" +
      this.settings.ID_RADIX +
      "-" +
      this.settings.ID_SIGNS +
      "-" +
      sign
    );
  }

  /**
   * Get ID for house wrapper.
   *
   * @param {String} house
   *
   * @return {String id}
   */
  getHouseIdWrapper(house: string): string {
    return (
      this._paperElementId +
      "-" +
      this.settings.ID_RADIX +
      "-" +
      this.settings.ID_CUSPS +
      "-" +
      house
    );
  }
  //Test Sirius Blank
  sirius(x: number, y: number): Element {
    // center symbol
    const xShift = -1; // px
    const yShift = -8; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        "m 464.54558,557.3108 q 0,2.23419 -1.06287,3.9261 -1.04118,1.67022 -2.81985,2.7114 -1.62684,0.95441 -3.73088,1.4533 -2.10405,0.47721 -4.6636,0.47721 -1.38824,0 -2.88493,-0.0868 -1.475,-0.0868 -1.7136,-0.10846 l -0.17353,-3.12353 q 0.30368,0.0434 1.69191,0.17353 1.38824,0.10846 3.27537,0.10846 1.14963,0 2.97169,-0.30368 1.82205,-0.30368 2.79816,-0.78088 1.27978,-0.62904 1.9522,-1.51838 0.69412,-0.88934 0.69412,-2.25588 0,-1.45331 -0.69412,-2.4511 -0.67242,-1.01949 -2.25588,-1.95221 -1.01948,-0.60735 -2.64632,-1.36654 -1.62684,-0.75919 -2.92831,-1.56177 -2.2125,-1.34485 -3.16691,-2.9283 -0.93272,-1.60515 -0.93272,-3.55735 0,-1.99559 0.84596,-3.4489 0.86764,-1.475 2.23419,-2.51617 1.38823,-1.04118 3.38382,-1.56177 2.01728,-0.52058 4.46838,-0.52058 1.34485,0 2.71139,0.0868 1.38824,0.0651 1.58346,0.0868 l 0.30367,3.14522 q -0.19522,-0.0217 -1.58345,-0.15183 -1.38823,-0.13015 -3.4272,-0.13015 -1.21471,0 -2.51618,0.28198 -1.27978,0.2603 -2.25588,0.82427 -0.86765,0.49889 -1.475,1.38823 -0.60735,0.88934 -0.60735,2.08235 0,1.06287 0.62904,2.06066 0.65074,0.97611 2.40772,2.01728 0.88934,0.54228 2.34265,1.25809 1.475,0.69412 2.88492,1.51838 2.16912,1.27978 3.25368,2.95 1.10625,1.64853 1.10625,3.77426 z m 10.08639,-17.98197 h -3.81765 v -3.73088 h 3.81765 z m -0.19522,26.15954 h -3.42721 q 0.0217,-0.34706 0.0434,-4.27316 0.0434,-3.9261 0.0434,-6.48566 0,-2.23419 -0.0217,-4.9022 0,-2.6897 -0.0651,-6.29044 h 3.42721 q -0.0434,3.12353 -0.0868,5.85662 -0.0217,2.71139 -0.0217,4.83713 0,5.05404 0.0434,8.11249 0.0651,3.05845 0.0651,3.14522 z m 20.30293,-19.3919 q -1.19302,0.28199 -3.66581,1.19301 -2.4511,0.91103 -5.66139,2.42941 0,0.23861 -0.0217,2.19081 -0.0217,1.93052 -0.0217,3.60073 0,2.55956 0.0434,6.07353 0.0651,3.51397 0.0651,3.90441 h -3.4272 q 0,-0.36875 0.0434,-2.42941 0.0434,-2.06066 0.0434,-7.04963 0,-2.01728 -0.0217,-5.6397 -0.0217,-3.62242 -0.0651,-6.83272 h 3.36213 v 3.29706 l 0.0217,0.0217 q 2.4511,-1.38823 4.83713,-2.40772 2.38602,-1.01948 3.81764,-1.38823 z m 7.72205,-6.76764 h -3.81765 v -3.73088 h 3.81765 z m -0.19522,26.15954 h -3.42721 q 0.0217,-0.34706 0.0434,-4.27316 0.0434,-3.9261 0.0434,-6.48566 0,-2.23419 -0.0217,-4.9022 0,-2.6897 -0.0651,-6.29044 h 3.42721 q -0.0434,3.12353 -0.0868,5.85662 -0.0217,2.71139 -0.0217,4.83713 0,5.05404 0.0434,8.11249 0.0651,3.05845 0.0651,3.14522 z m 25.48711,0 h -3.31875 v -2.51618 l -0.0217,-0.0217 q -1.51838,0.9978 -3.79595,2.06066 -2.25588,1.04118 -4.44669,1.04118 -2.99338,0 -4.68529,-1.77868 -1.69191,-1.77867 -1.69191,-4.98896 0,-1.7353 0.0217,-4.12132 0.0434,-2.40772 0.0434,-3.49228 0,-1.9739 -0.0651,-4.85882 -0.0434,-2.90662 -0.0434,-3.27537 h 3.4272 q 0,0.28199 -0.0434,3.12353 -0.0434,2.84154 -0.0434,4.53345 0,1.49669 0.0217,3.73088 0.0217,2.23419 0.0217,3.16691 0.0434,2.55956 0.88934,3.75257 0.84595,1.19302 2.73308,1.19302 1.93052,0 4.22978,-1.04118 2.32095,-1.04117 3.40551,-1.82206 0,-0.26029 0.0217,-2.38602 0.0217,-2.14743 0.0217,-5.33603 0,-2.27757 -0.0651,-5.44448 -0.0434,-3.1886 -0.0434,-3.47059 h 3.4272 q 0,0.36875 -0.0434,2.4511 -0.0434,2.06066 -0.0434,7.04963 0,2.79816 0.0217,4.9239 0.0217,2.10404 0.0651,7.52683 z m 19.32683,-6.35551 q 0,1.60514 -0.78089,2.86323 -0.78088,1.25809 -2.03896,2.03897 -1.32317,0.82427 -3.14522,1.25809 -1.80037,0.41213 -3.99118,0.41213 -1.06286,0 -2.2125,-0.10845 -1.12794,-0.0868 -1.27977,-0.10846 l -0.13015,-2.84154 q 0.19522,0.0217 1.49669,0.13014 1.32316,0.0868 2.62463,0.0868 0.75919,0 1.9522,-0.13015 1.19302,-0.13015 1.9739,-0.4772 1.08456,-0.47721 1.60515,-1.17133 0.52058,-0.69411 0.52058,-1.67022 0,-0.88933 -0.45551,-1.43161 -0.45552,-0.56397 -1.25809,-1.08456 -0.86764,-0.58566 -2.38603,-1.2364 -1.49669,-0.67242 -2.51617,-1.27978 -1.45331,-0.88933 -2.23419,-2.10404 -0.75919,-1.2147 -0.75919,-2.81985 0,-1.60515 0.86765,-2.88492 0.88933,-1.27978 2.36433,-2.06066 1.27978,-0.69412 2.81985,-0.91103 1.56177,-0.23861 3.01507,-0.23861 1.32317,0 2.16912,0.0434 0.84596,0.0434 0.9761,0.0434 l 0.23861,2.88492 q -0.15184,0 -1.34486,-0.0868 -1.17132,-0.0868 -2.58124,-0.0868 -0.9978,0 -1.90883,0.17353 -0.88933,0.17353 -1.51838,0.4989 -0.93272,0.47721 -1.34485,1.14963 -0.39044,0.67243 -0.39044,1.30147 0,0.86765 0.56397,1.49669 0.56397,0.62904 1.32316,1.06287 0.88934,0.52059 2.42941,1.23639 1.54007,0.71581 2.23419,1.14964 1.51838,0.95441 2.29926,2.12573 0.80258,1.17132 0.80258,2.77647 z",
    );
    node.setAttribute("stroke", "none");
    node.setAttribute("stroke-width", "none");
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Sun path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVG g}
   */
  sun(x: number, y: number): Element {
    // center symbol
    const xShift = -1; // px
    const yShift = -8; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.18182,0.727268 -2.181819,1.454543 -1.454552,2.18182 -0.727268,2.181819 0,2.181819 0.727268,2.181819 1.454552,2.18182 2.181819,1.454544 2.18182,0.727276 2.18181,0 2.18182,-0.727276 2.181819,-1.454544 1.454552,-2.18182 0.727268,-2.181819 0,-2.181819 -0.727268,-2.181819 -1.454552,-2.18182 -2.181819,-1.454543 -2.18182,-0.727268 -2.18181,0 m 0.727267,6.54545 -0.727267,0.727276 0,0.727275 0.727267,0.727268 0.727276,0 0.727267,-0.727268 0,-0.727275 -0.727267,-0.727276 -0.727276,0 m 0,0.727276 0,0.727275 0.727276,0 0,-0.727275 -0.727276,0",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Moon path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  moon(x: number, y: number): Element {
    // center symbol
    const xShift = -2; // px
    const yShift = -7; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " a 7.4969283,7.4969283 0 0 1 0,14.327462 7.4969283,7.4969283 0 1 0 0,-14.327462 z",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Mercury path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  mercury(x: number, y: number): Element {
    // center symbol
    const xShift = -2; // px
    const yShift = 7; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const body = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    body.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " 4.26011,0 m -2.13005,-2.98207 0,5.11213 m 4.70312,-9.7983 a 4.70315,4.70315 0 0 1 -4.70315,4.70314 4.70315,4.70315 0 0 1 -4.70314,-4.70314 4.70315,4.70315 0 0 1 4.70314,-4.70315 4.70315,4.70315 0 0 1 4.70315,4.70315 z",
    );
    body.setAttribute("stroke", this.settings.POINTS_COLOR);
    body.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    body.setAttribute("fill", "none");
    wrapper.appendChild(body);

    const crownXShift = 6; // px
    const crownYShift = -16; // px
    const crown = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    crown.setAttribute(
      "d",
      "m" +
        (x + crownXShift) +
        ", " +
        (y + crownYShift) +
        " a 3.9717855,3.9717855 0 0 1 -3.95541,3.59054 3.9717855,3.9717855 0 0 1 -3.95185,-3.59445",
    );
    crown.setAttribute("stroke", this.settings.POINTS_COLOR);
    crown.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    crown.setAttribute("fill", "none");
    wrapper.appendChild(crown);

    return wrapper;
  }

  /*
   * Venus path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  venus(x: number, y: number): Element {
    // center symbol
    const xShift = 2; // px
    const yShift = 7; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -4.937669,0.03973 m 2.448972,2.364607 0,-5.79014 c -3.109546,-0.0085 -5.624617,-2.534212 -5.620187,-5.64208 0.0044,-3.107706 2.526514,-5.621689 5.635582,-5.621689 3.109068,0 5.631152,2.513983 5.635582,5.621689 0.0044,3.107868 -2.510641,5.633586 -5.620187,5.64208",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Mars path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  mars(x: number, y: number): Element {
    // center symbol
    const xShift = 2; // px
    const yShift = -2; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " c -5.247438,-4.150623 -11.6993,3.205518 -7.018807,7.886007 4.680494,4.680488 12.036628,-1.771382 7.885999,-7.018816 z m 0,0 0.433597,0.433595 3.996566,-4.217419 m -3.239802,-0.05521 3.295015,0 0.110427,3.681507",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Jupiter path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  jupiter(x: number, y: number): Element {
    // center symbol
    const xShift = -5; // px
    const yShift = -2; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " c -0.43473,0 -1.30422,-0.40572 -1.30422,-2.02857 0,-1.62285 1.73897,-3.2457 3.47792,-3.2457 1.73897,0 3.47792,1.21715 3.47792,4.05713 0,2.83999 -2.1737,7.30283 -6.52108,7.30283 m 12.17269,0 -12.60745,0 m 9.99902,-11.76567 0,15.82279",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y - 3));

    return wrapper;
  }

  /*
   * Saturn path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  saturn(x: number, y: number): Element {
    // center symbol
    const xShift = 5; // px
    const yShift = 10; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " c -0.52222,0.52221 -1.04445,1.04444 -1.56666,1.04444 -0.52222,0 -1.56667,-0.52223 -1.56667,-1.56667 0,-1.04443 0.52223,-2.08887 1.56667,-3.13332 1.04444,-1.04443 2.08888,-3.13331 2.08888,-5.22219 0,-2.08888 -1.04444,-4.17776 -3.13332,-4.17776 -1.97566,0 -3.65555,1.04444 -4.69998,3.13333 m -2.55515,-5.87499 6.26664,0 m -3.71149,-2.48054 0,15.14438",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Uranus path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  uranus(x: number, y: number): Element {
    // center symbol
    const xShift = -5; // px
    const yShift = -7; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const horns = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    horns.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        "  0,10.23824 m 10.23633,-10.32764 0,10.23824 m -10.26606,-4.6394 10.23085,0 m -5.06415,-5.51532 0,11.94985",
    );
    horns.setAttribute("stroke", this.settings.POINTS_COLOR);
    horns.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    horns.setAttribute("fill", "none");
    wrapper.appendChild(horns);

    const bodyXShift = 7; // px
    const bodyYShift = 14.5; // px
    const body = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    body.setAttribute(
      "d",
      "m" +
        (x + bodyXShift) +
        ", " +
        (y + bodyYShift) +
        " a 1.8384377,1.8384377 0 0 1 -1.83844,1.83843 1.8384377,1.8384377 0 0 1 -1.83842,-1.83843 1.8384377,1.8384377 0 0 1 1.83842,-1.83844 1.8384377,1.8384377 0 0 1 1.83844,1.83844 z",
    );
    body.setAttribute("stroke", this.settings.POINTS_COLOR);
    body.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    body.setAttribute("fill", "none");
    wrapper.appendChild(body);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));

    return wrapper;
  }

  /*
   * Neptune path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  neptune(x: number, y: number): Element {
    // center symbol
    const xShift = 3; // px
    const yShift = -5; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " 1.77059,-2.36312 2.31872,1.8045 m -14.44264,-0.20006 2.34113,-1.77418 1.74085,2.38595 m -1.80013,-1.77265 c -1.23776,8.40975 0.82518,9.67121 4.95106,9.67121 4.12589,0 6.18883,-1.26146 4.95107,-9.67121 m -7.05334,3.17005 2.03997,-2.12559 2.08565,2.07903 m -5.32406,9.91162 6.60142,0 m -3.30071,-12.19414 0,15.55803",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Pluto path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  pluto(x: number, y: number): Element {
    // center symbol
    const xShift = 5; // px
    const yShift = -5; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const body = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    body.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " a 5.7676856,5.7676856 0 0 1 -2.88385,4.99496 5.7676856,5.7676856 0 0 1 -5.76768,0 5.7676856,5.7676856 0 0 1 -2.88385,-4.99496 m 5.76771,13.93858 0,-8.17088 m -3.84512,4.32576 7.69024,0",
    );
    body.setAttribute("stroke", this.settings.POINTS_COLOR);
    body.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    body.setAttribute("fill", "none");
    wrapper.appendChild(body);

    const headXShift = -2.3; // px
    const headYShift = 0; // px
    const head = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    head.setAttribute(
      "d",
      "m" +
        (x + headXShift) +
        ", " +
        (y + headYShift) +
        " a 3.3644834,3.3644834 0 0 1 -3.36448,3.36449 3.3644834,3.3644834 0 0 1 -3.36448,-3.36449 3.3644834,3.3644834 0 0 1 3.36448,-3.36448 3.3644834,3.3644834 0 0 1 3.36448,3.36448 z",
    );
    head.setAttribute("stroke", this.settings.POINTS_COLOR);
    head.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    head.setAttribute("fill", "none");
    wrapper.appendChild(head);

    return wrapper;
  }

  /*
   * Chiron path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  chiron(x: number, y: number): Element {
    // center symbol
    const xShift = 3; // px
    const yShift = 5; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const body = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    body.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " a 3.8764725,3.0675249 0 0 1 -3.876473,3.067525 3.8764725,3.0675249 0 0 1 -3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876473,3.067525 z",
    );
    body.setAttribute("stroke", this.settings.POINTS_COLOR);
    body.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    body.setAttribute("fill", "none");
    wrapper.appendChild(body);

    const headXShift = 0; // px
    const headYShift = -13; // px
    const head = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    head.setAttribute(
      "d",
      "m" +
        (x + headXShift) +
        ", " +
        (y + headYShift) +
        "   -3.942997,4.243844 4.110849,3.656151 m -4.867569,-9.009468 0,11.727251",
    );
    head.setAttribute("stroke", this.settings.POINTS_COLOR);
    head.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    head.setAttribute("fill", "none");
    wrapper.appendChild(head);

    return wrapper;
  }

  /*
   * Lilith path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  lilith(x: number, y: number): Element {
    // center symbol
    const xShift = 2; // px
    const yShift = 4; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.525435,-1.12853 -1.464752,-1.79539 -0.808138,-2.20576 0.151526,-2.05188 0.909156,-1.5389 1.010173,-1.02593 0.909157,-0.56427 1.363735,-0.61556 m 2.315327,-0.39055 -1.716301,0.54716 -1.7163,1.09431 -1.1442,1.64146 -0.572102,1.64146 0,1.64146 0.572102,1.64147 1.1442,1.64145 1.7163,1.09432 1.716301,0.54715 m 0,-11.49024 -2.2884,0 -2.288401,0.54716 -1.716302,1.09431 -1.144201,1.64146 -0.5721,1.64146 0,1.64146 0.5721,1.64147 1.144201,1.64145 1.716302,1.09432 2.288401,0.54715 2.2884,0 m -4.36712,-0.4752 0,6.44307 m -2.709107,-3.41101 5.616025,0",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * NNode path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  nnode(x: number, y: number): Element {
    // center symbol
    const xShift = -2; // px
    const yShift = 3; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 -0.6666667,1.3333333 0,0.6666667 0.6666667,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666666,-1.3333333 0,-0.6666667 -0.6666666,-1.3333333 -2,-2.66666665 -0.6666667,-1.99999995 0,-1.3333334 0.6666667,-2 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,2 0,1.3333334 -0.6666667,1.99999995 -2,2.66666665 -0.6666666,1.3333333 0,0.6666667 0.6666666,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666667,-1.3333333 0,-0.6666667 -0.6666667,-1.3333333 -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 m -7.9999999,-6 0.6666667,-1.3333333 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,1.3333333",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * SNode path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  snode(x: number, y: number): Element {
    // center symbol
    const xShift = 0;
    const yShift = -5;

    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " l1.3333282470703125,0.666656494140625l0.6666717529296875,0l1.3333282470703125,-0.666656494140625l0.6666717529296875,-1.333343505859375l0,-0.666656494140625l-0.6666717529296875,-1.333343505859375l-1.3333282470703125,-0.666656494140625l-0.6666717529296875,0l-1.3333282470703125,0.666656494140625l-0.6666717529296875,1.333343505859375l0,0.666656494140625l0.6666717529296875,1.333343505859375l2,2.666656494140625l0.6666717529296875,2l0,1.333343505859375l-0.6666717529296875,2l-1.3333282470703125,1.333343505859375l-2,0.666656494140625l-2.6666717529296875,0l-2,-0.666656494140625l-1.3333282470703125,-1.333343505859375l-0.6666717529296875,-2l0,-1.333343505859375l0.6666717529296875,-2l2,-2.666656494140625l0.666656494140625,-1.333343505859375l0,-0.666656494140625l-0.666656494140625,-1.333343505859375l-1.333343505859375,-0.666656494140625l-0.666656494140625,0l-1.333343505859375,0.666656494140625l-0.666656494140625,1.333343505859375l0,0.666656494140625l0.666656494140625,1.333343505859375l1.333343505859375,0.666656494140625l0.666656494140625,0l1.333343505859375,-0.666656494140625m8,6l-0.6666717529296875,1.333343505859375l-1.3333282470703125,1.33331298828125l-2,0.66668701171875l-2.6666717529296875,0l-2,-0.66668701171875l-1.3333282470703125,-1.33331298828125l-0.6666717529296875,-1.333343505859375",
    );
    node.setAttribute("stroke", this.settings.POINTS_COLOR);
    node.setAttribute("stroke-width", this.settings.POINTS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /*
   * Fortune path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  fortune(x: number, y: number): Element {
    // center symbol
    const xShift = -10;
    const yShift = -8;
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );

    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const path1 = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    path1.setAttribute(
      "d",
      "M15.971322059631348,8.000000953674316A7.971322252863855,7.971322252863855,0,0,1,8,15.97132396697998A7.971322252863855,7.971322252863855,0,0,1,0.028678132221102715,8.000000953674316A7.971322252863855,7.971322252863855,0,0,1,8,0.028677448630332947A7.971322252863855,7.971322252863855,0,0,1,15.971322059631348,8.000000953674316Z",
    );
    const path2 = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    path2.setAttribute(
      "d",
      "M2.668839454650879,2.043858766555786C6.304587364196777,5.906839370727539,9.94033432006836,9.769822120666504,13.576082229614258,13.632804870605469",
    );
    const path3 = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    path3.setAttribute(
      "d",
      "m2.5541272163391113,13.747519493103027c3.635746955871582,-3.8629846572875977,7.271494388580322,-7.72596549987793,10.90724229812622,-11.588947772979736",
    );
    const fortuneGroup = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    fortuneGroup.setAttribute("transform", "translate(" + x + "," + y + ")");
    fortuneGroup.appendChild(path1);
    fortuneGroup.appendChild(path2);
    fortuneGroup.appendChild(path3);

    wrapper.setAttribute("stroke", this.settings.POINTS_COLOR);
    wrapper.setAttribute(
      "stroke-width",
      this.settings.POINTS_STROKE.toString(),
    );
    wrapper.setAttribute("fill", "none");
    wrapper.appendChild(fortuneGroup);

    return wrapper;
  }

  /*
   * Aries symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  aries(x: number, y: number): Element {
    // center symbol
    const xShift = -105; // px
    const yShift = -150; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_ARIES),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        //" -0.9,-0.9 0,-1.8 0.9,-1.8 1.8,-0.8999998 1.8,0 1.8,0.8999998 0.9,0.9 0.9,1.8 0.9,4.5 m -9,-5.4 1.8,-1.8 1.8,0 1.8,0.9 0.9,0.9 0.9,1.8 0.9,3.6 0,9.9 m 8.1,-12.6 0.9,-0.9 0,-1.8 -0.9,-1.8 -1.8,-0.8999998 -1.8,0 -1.8,0.8999998 -0.9,0.9 -0.9,1.8 -0.9,4.5 m 9,-5.4 -1.8,-1.8 -1.8,0 -1.8,0.9 -0.9,0.9 -0.9,1.8 -0.9,3.6 0,9.9",
        //"m 102.35416,160.65105 c -0.29104,-0.0573 -1.18401,-0.23445 -1.98437,-0.39364 -3.429037,-0.68204 -6.997098,-3.51034 -8.539838,-6.7693 -0.773248,-1.63344 -0.85194,-2.03166 -0.852328,-4.31314 -3.88e-4,-2.28078 0.07818,-2.6795 0.84846,-4.30578 1.567842,-3.31016 4.675005,-5.74534 8.659686,-6.78688 2.64856,-0.6923 4.26323,-0.6923 6.91179,0 5.15413,1.34721 8.64185,4.8377 9.39584,9.4033 0.79071,4.78789 -1.59661,9.17829 -6.37591,11.72563 -2.16674,1.15486 -6.01807,1.84257 -8.06333,1.43981 z m 1.86159,-3.34014 c -0.44254,-1.4278 -0.43029,-1.65737 0.10591,-1.98544 0.48752,-0.29829 0.6712,-0.19807 1.81845,0.99219 1.10974,1.15133 1.41282,1.32398 2.32425,1.32398 1.92253,0 2.96035,-1.28082 2.4322,-3.00168 -0.23661,-0.77094 -0.209,-1.05846 0.15502,-1.61401 0.364,-0.55555 0.65051,-0.67598 1.60823,-0.67598 1.61929,0 2.26206,-0.82548 2.26206,-2.90509 0,-1.17479 -0.11769,-1.61732 -0.52916,-1.9897 -0.29105,-0.26339 -0.52917,-0.6016 -0.52917,-0.75158 0,-0.14998 -0.47625,-0.8375 -1.05833,-1.52782 -0.58209,-0.69031 -1.05834,-1.36814 -1.05834,-1.50628 0,-0.13814 0.35719,-0.39911 0.79375,-0.57994 0.43657,-0.18083 0.79375,-0.42638 0.79375,-0.54565 0,-0.46767 -0.5497,-0.51121 -1.49063,-0.11806 -0.96874,0.40477 -2.51203,0.32833 -6.11614,-0.30291 -0.66145,-0.11585 -0.85989,-0.0571 -0.85989,0.25469 0,0.44718 0.41883,0.56074 3.57187,0.96838 1.43948,0.18611 2.20132,0.4104 2.38125,0.70106 0.14552,0.23507 0.71107,0.97682 1.25677,1.64832 0.54571,0.67151 0.99219,1.3592 0.99219,1.5282 0,0.169 0.16097,0.36904 0.35771,0.44454 0.19675,0.0755 0.43536,0.7037 0.53025,1.39602 0.24064,1.7557 -0.22698,2.42422 -1.71005,2.44469 -1.72815,0.0239 -2.22062,0.68352 -2.22062,2.97456 0,2.0197 -0.21445,2.35315 -1.51809,2.36044 -0.53725,0.003 -1.04978,-0.35067 -1.98437,-1.36933 -2.36624,-2.5791 -3.33285,-3.49708 -4.88732,-4.64141 -1.782622,-1.31229 -2.005674,-1.69927 -1.51158,-2.6225 0.60773,-1.13556 1.21357,-1.27541 1.97341,-0.45553 0.50178,0.54144 0.74058,0.64332 0.97003,0.41387 0.22945,-0.22945 0.17891,-0.4432 -0.20531,-0.86832 -0.28033,-0.31017 -0.47244,-0.78923 -0.42691,-1.06459 0.10049,-0.60779 -0.14677,-0.62614 -1.22032,-0.0906 -0.95604,0.47694 -2.1558,1.81483 -2.201095,2.45452 -0.0834,1.17779 0.152321,1.48553 2.412595,3.1497 1.74449,1.28441 2.64584,2.12067 2.64584,2.45478 0,0.1355 -0.33958,0.49742 -0.75462,0.80427 -0.74385,0.54995 -0.74847,0.56987 -0.32408,1.39698 0.65756,1.28156 0.82176,1.50053 1.12517,1.50053 0.16847,0 0.2064,-0.23689 0.0953,-0.59531 z m -10.80653,-8.56216 c -0.04946,-1.44297 -0.01865,-1.51319 1.100096,-2.50686 0.633042,-0.56228 1.818778,-1.33823 2.63497,-1.72435 l 1.483984,-0.70204 0.373865,0.56307 c 0.430324,0.6481 1.419535,0.74129 1.887205,0.17779 0.44869,-0.54065 0.10611,-1.0079 -0.50082,-0.68308 -0.606704,0.3247 -0.81248,0.11504 -0.81248,-0.82782 0,-0.9375 0.333989,-0.94987 2.38125,-0.0882 1.79024,0.7535 2.38125,0.8241 2.38125,0.28448 0,-0.21845 -0.52848,-0.54139 -1.25677,-0.76798 -0.69123,-0.21506 -1.62273,-0.53985 -2.07001,-0.72176 -1.157335,-0.47069 -2.22947,-0.14997 -2.22947,0.66692 0,0.54492 -0.242896,0.73077 -1.603543,1.22688 -1.886668,0.68792 -3.789295,2.06444 -4.348711,3.14623 -0.653168,1.26309 -0.477989,3.44127 0.276762,3.44127 0.258759,0 0.339692,-0.39729 0.302422,-1.48456 z",
        "m 104.07793,162.47585 c -0.50713,-0.14622 -1.20889,-0.30306 -1.55946,-0.34855 -0.56166,-0.0729 -0.69373,-0.14951 -1.11154,-0.64497 -0.26078,-0.30925 -0.77576,-0.86072 -1.14441,-1.22548 -0.515616,-0.51018 -0.690426,-0.78146 -0.757615,-1.17568 -0.103892,-0.60959 -0.160519,-0.62293 -0.640041,-0.15073 -0.581029,0.57214 -1.393642,0.008 -2.223907,-1.54355 -0.502917,-0.9399 -0.585549,-0.97611 -1.117551,-0.48978 -0.53611,0.49009 -0.58983,0.44432 -1.505584,-1.28271 -1.774178,-3.34595 -2.086509,-7.02038 -0.952954,-11.21109 0.260084,-0.96151 0.260084,-0.96151 -0.161105,-1.70522 -0.421188,-0.74371 -0.421188,-0.74371 -0.201751,-1.40045 0.29669,-0.88795 0.313913,-0.80618 -0.51432,-2.44204 -2.036527,-4.02238 1.211791,-6.05564 5.27571,-3.30229 0.569871,0.38609 0.569871,0.38609 1.688651,-0.1085 3.738907,-1.65292 8.642777,-1.61477 11.907647,0.0926 0.85222,0.44568 0.77733,0.44858 1.52615,-0.059 3.96531,-2.68761 7.32684,-0.52626 5.21155,3.35085 -0.65842,1.2068 -0.74117,1.43443 -0.67104,1.84582 0.25712,1.50816 0.25475,1.54437 -0.1398,2.14241 -0.37586,0.56971 -0.37586,0.56971 -0.0837,1.60178 1.22513,4.32827 0.70852,8.79186 -1.38863,11.99811 -0.62741,0.95922 -0.59582,0.94731 -1.09374,0.4123 -0.44876,-0.48219 -0.58282,-0.40227 -1.16984,0.69746 -0.77609,1.45395 -1.47587,1.91683 -2.10722,1.39387 -0.52979,-0.43884 -0.71124,-0.37976 -0.71124,0.23159 0,0.38569 -0.10049,0.54237 -0.71088,1.10828 -0.39099,0.3625 -0.9155,0.9107 -1.16559,1.21823 -0.40459,0.49753 -0.52515,0.56796 -1.09398,0.63915 -0.3516,0.044 -1.04932,0.20226 -1.55048,0.35167 -0.91122,0.27167 -0.91122,0.27167 -1.83329,0.006 z m 2.26413,-1.28985 c 3.01626,-0.69643 2.84878,-2.82237 -0.18724,-2.3768 -0.99237,0.14564 -1.35405,0.13679 -3.03135,-0.0742 -2.22266,-0.27956 -2.10199,1.93716 0.12925,2.37416 0.38228,0.0749 0.90305,0.20836 1.15726,0.29664 0.25421,0.0883 0.54848,0.13138 0.65393,0.0958 0.10545,-0.0356 0.68062,-0.17763 1.27815,-0.3156 z m -2.7833,-3.68843 c 1.6346,-0.92182 1.34503,-2.23008 -0.73672,-3.32838 -0.95176,-0.50214 -1.30738,-1.10573 -0.95829,-1.6265 0.10061,-0.15009 0.16872,-0.13376 0.43822,0.1051 0.67232,0.59587 4.49628,0.60471 5.34555,0.0124 0.31333,-0.21855 0.40734,-0.23834 0.49713,-0.10463 0.33418,0.49766 -0.01,0.99588 -1.1665,1.68858 -2.27533,1.36283 -1.97612,3.13387 0.64948,3.84427 0.75391,0.20398 1.93618,-0.20364 2.4095,-0.83075 0.30157,-0.39955 0.20811,-0.48742 -0.54209,-0.50969 -1.07697,-0.032 -1.09249,-0.16827 -0.0607,-0.53347 0.78094,-0.27642 0.99922,-0.40792 1.06069,-0.639 0.10165,-0.3821 0.0705,-0.39839 -0.48487,-0.25372 -1.30889,0.34095 -2.2297,0.07 -1.16609,-0.34309 1.9915,-0.77351 2.10466,-1.29554 0.88164,-4.06698 -0.0677,-0.15337 0.012,-0.10947 0.21897,0.12058 0.3685,0.40968 0.88849,1.34792 1.11846,2.01809 0.19106,0.55679 0.3425,0.65372 0.63336,0.40539 0.55498,-0.47383 0.67596,-0.13046 0.20825,0.5911 -0.65002,1.00282 -0.68153,1.26146 -0.15492,1.27141 0.15403,0.003 0.49615,0.078 0.76029,0.16697 0.47994,0.16158 0.48048,0.16139 0.87349,-0.30675 0.46801,-0.55748 0.54564,-0.56865 0.95077,-0.13682 0.38055,0.40562 0.37658,0.41021 1.06781,-1.23506 1.20071,-2.85795 1.25907,-5.77984 0.19199,-9.61223 -0.32591,-1.17049 -0.32591,-1.17049 0.0836,-1.65118 0.34375,-0.40354 0.39572,-0.54469 0.3238,-0.87942 -0.0471,-0.21931 -0.12788,-0.64292 -0.17946,-0.94136 -0.0938,-0.54262 -0.0938,-0.54262 -0.37074,0.0316 -0.45759,0.94873 -1.15759,0.88879 -1.00477,-0.086 0.0765,-0.48815 0.0765,-0.48815 -0.31642,-0.0848 -0.21613,0.22188 -0.4107,0.38466 -0.43239,0.36175 -1.2523,-1.32301 -0.16486,-2.67878 2.56056,-3.19237 0.66816,-0.12591 -0.13705,-0.26137 -1.67213,-0.2813 -1.5059,-0.0195 -0.10398,-1.01809 1.92642,-1.37212 0.88552,-0.1544 0.88552,-0.1544 0.50716,-0.38825 -1.0773,-0.66584 -2.56645,-0.24819 -4.58825,1.28683 -1.19424,0.9067 -1.69829,1.09746 -2.04231,0.77291 -0.29406,-0.27742 -0.26969,-0.37755 0.16578,-0.68129 0.9857,-0.68752 -4.10061,-2.22554 -5.24707,-1.58662 -0.35156,0.19591 -0.39208,0.19588 -0.74474,-6.6e-4 -0.6092,-0.3395 -2.87778,0.0439 -4.627783,0.78211 -0.979748,0.41329 -1.013758,0.46189 -0.559232,0.79919 0.389716,0.28921 0.409207,0.5707 0.052,0.75106 -0.405062,0.20451 -0.724482,0.0687 -1.841418,-0.78324 -1.882376,-1.4357 -3.331863,-1.91207 -4.415389,-1.45111 -0.675368,0.28731 -0.638113,0.37617 0.199096,0.47485 0.757289,0.0893 2.297581,0.7493 2.680741,1.14873 0.231791,0.24163 0.227391,0.24305 -0.777269,0.24996 -1.666677,0.0115 -2.204883,0.14093 -1.355705,0.32613 2.594774,0.56589 3.480732,1.70175 2.366843,3.03445 -0.02367,0.0283 -0.222794,-0.10733 -0.442487,-0.30145 -0.399443,-0.35296 -0.399443,-0.35296 -0.317997,-0.0297 0.250353,0.99358 -0.441055,1.19176 -0.970462,0.27818 -0.348507,-0.60141 -0.348507,-0.60141 -0.351493,-0.20564 -0.0016,0.21767 -0.08926,0.59057 -0.194708,0.82866 -0.255867,0.57772 -0.256098,0.57669 0.245679,1.10067 0.437403,0.45676 0.437403,0.45676 0.132274,1.56506 -1.16114,4.21757 -0.981813,7.6675 0.549938,10.57981 0.41579,0.79055 0.390712,0.77825 0.741837,0.36371 0.304753,-0.35979 0.304753,-0.35979 0.851297,0.13674 0.535914,0.48687 0.555244,0.49346 0.993897,0.33882 0.246045,-0.0867 0.576767,-0.16184 0.734939,-0.16688 0.394204,-0.0126 0.38521,-0.52304 -0.01917,-1.08794 -0.600042,-0.83824 -0.556657,-1.20689 0.08591,-0.73005 0.3249,0.24111 0.3249,0.24111 0.549039,-0.43116 0.219081,-0.65711 0.916984,-1.87144 1.270872,-2.21129 0.10329,-0.0992 0.0507,0.12785 -0.12566,0.54262 -0.975518,2.29412 -0.888118,2.70201 0.73377,3.42442 1.61971,0.72144 0.91177,0.98473 -1.098416,0.4085 -0.895212,-0.25661 -0.105636,0.63334 0.869186,0.97968 1.01934,0.36216 1.01934,0.36216 0.44735,0.46024 -1.421628,0.24374 -1.385449,0.21377 -0.88271,0.73132 0.89899,0.92545 1.94039,0.95219 3.47084,0.0891 z m -7.032918,-3.46132 c -1.014066,-0.47673 -1.215664,-0.78542 -1.143925,-1.75159 0.08123,-1.09405 0.187053,-1.20451 0.560192,-0.58476 0.168668,0.28015 0.541303,0.77374 0.828078,1.09688 0.3529,0.39765 0.543555,0.7433 0.589934,1.06951 0.08082,0.56851 0.03383,0.57808 -0.834279,0.16996 z m 16.079178,-0.0925 c 0,-0.30018 0.12756,-0.57038 0.44502,-0.94265 0.24476,-0.28702 0.63151,-0.8191 0.85945,-1.18241 0.41442,-0.66055 0.41442,-0.66055 0.56767,-0.18087 0.35215,1.10222 0.17702,1.65025 -0.69967,2.18947 -0.97474,0.59952 -1.17247,0.61916 -1.17247,0.11646 z m -15.637577,-1.98648 c -0.532254,-0.55485 -0.264265,-0.99727 0.422309,-0.69717 0.946136,0.41355 1.108618,0.56369 0.823147,0.76062 -0.330542,0.22802 -0.998504,0.19399 -1.245456,-0.0635 z m 14.768427,0.0758 c -0.25153,-0.2373 -0.18584,-0.31608 0.52999,-0.63556 0.8407,-0.37521 0.97823,-0.37948 0.97823,-0.0304 0,0.67018 -1.02432,1.12244 -1.50822,0.66592 z m -17.065918,-1.33631 c -0.540584,-0.38468 -0.829355,-2.06036 -0.382916,-2.22198 0.641707,-0.23231 1.678063,1.53483 1.158767,1.97587 -0.435028,0.36947 -0.550865,0.40622 -0.775851,0.24611 z m 20.168528,0.009 c -0.75596,-0.37554 -0.74953,-0.89118 0.0208,-1.66812 0.78941,-0.79618 1.06894,-0.76634 1.06894,0.11413 0,0.95828 -0.59135,1.80157 -1.08973,1.55399 z m -16.590633,-0.43412 c -0.194049,-0.20229 -0.197566,-0.24733 -0.02958,-0.37886 0.271315,-0.21243 0.902229,0.001 0.902229,0.30562 0,0.32393 -0.585066,0.37303 -0.872647,0.0732 z m 12.606883,0.0199 c -0.0923,-0.22699 0.26445,-0.52518 0.62839,-0.52518 0.34132,0 0.44486,0.36328 0.15962,0.56006 -0.3219,0.22205 -0.69013,0.20576 -0.78801,-0.0349 z m -14.16925,-0.34044 c -0.382012,-0.86255 -0.247236,-1.17278 0.338544,-0.77927 0.559453,0.37582 0.695383,0.6847 0.425248,0.96631 -0.325967,0.33981 -0.555336,0.28364 -0.763792,-0.18704 z m 15.74911,0.2172 c -0.26056,-0.24582 0.49541,-1.24602 0.94176,-1.24602 0.16492,0 0.15637,0.47762 -0.017,0.94667 -0.13614,0.36843 -0.66882,0.54086 -0.92481,0.29935 z m -10.84618,-0.5868 c -0.0406,-0.0641 -0.11407,-0.34595 -0.16323,-0.62627 -0.13638,-0.77769 -0.55112,-1.27175 -1.22208,-1.45583 -1.514868,-0.41563 -1.681171,-0.52161 -2.390762,-1.5236 -0.843217,-1.19068 -0.874167,-1.1196 0.440207,-1.01088 2.946485,0.24372 3.747035,0.8252 3.741325,2.71751 -0.003,0.83907 -0.27337,2.10763 -0.40546,1.89907 z m -1.05131,-3.00702 c 0.39809,-0.15692 0.43364,-0.20574 0.30934,-0.42485 -0.12924,-0.22783 -0.16259,-0.23292 -0.41842,-0.0639 -0.39214,0.25913 -0.642376,0.2293 -0.987987,-0.11777 -0.504636,-0.50677 -0.930123,-0.40742 -0.556857,0.13002 0.414004,0.5961 0.955033,0.75196 1.653924,0.47647 z m 7.61686,2.49259 c -0.68295,-2.90364 0.2545,-3.86951 4.03566,-4.15802 0.80565,-0.0615 0.79662,-0.12941 0.11393,0.85695 -0.76893,1.11098 -1.03288,1.30527 -2.19778,1.61778 -1.12723,0.3024 -1.27206,0.45512 -1.63055,1.71937 -0.17097,0.60292 -0.17097,0.60292 -0.32126,-0.0361 z m 2.40857,-2.49741 c 0.36168,-0.17645 0.63652,-0.51092 0.63652,-0.77462 0,-0.22682 -0.3299,-0.13754 -0.63908,0.17295 -0.34561,0.34707 -0.59585,0.3769 -0.98799,0.11777 -0.25444,-0.16813 -0.28909,-0.1641 -0.4092,0.0476 -0.14578,0.25697 -0.004,0.42846 0.43857,0.53113 0.44886,0.10409 0.57987,0.0912 0.96118,-0.0949 z m 3.26981,1.18419 c -0.23098,-1.04542 -0.45805,-3.05462 -0.35855,-3.17257 0.0834,-0.0989 0.78179,0.74649 1.05251,1.27405 0.4232,0.8247 0.29965,2.02673 -0.28191,2.7426 -0.15869,0.19535 -0.20198,0.10666 -0.41205,-0.84408 z m -18.345667,0.46142 c -0.516508,-0.95516 -0.285103,-2.30002 0.557852,-3.24209 0.352656,-0.39413 0.625809,-0.52152 0.5171,-0.24117 -0.03215,0.0829 -0.08442,0.5577 -0.116173,1.0551 -0.05701,0.89311 -0.439107,2.67668 -0.607461,2.83551 -0.04772,0.045 -0.205817,-0.13829 -0.351318,-0.40735 z m -1.278333,-0.84517 c -0.197253,-0.34772 0.241817,-1.55412 0.508937,-1.39837 0.134134,0.0782 0.166354,1.13214 0.04382,1.43339 -0.105354,0.25902 -0.396415,0.24057 -0.552757,-0.035 z m 21.04261,0.14954 c -0.14016,-0.13223 -0.10502,-1.46815 0.0409,-1.55321 0.18582,-0.10835 0.53027,0.73787 0.48376,1.18849 -0.0373,0.36127 -0.31998,0.55779 -0.52463,0.36472 z m -11.32049,-1.82333 c -0.24202,-0.42664 0.24054,-1.71794 0.642,-1.71794 0.15974,0 0.11279,0.96168 -0.0703,1.43971 -0.18785,0.49049 -0.39429,0.59096 -0.5717,0.27823 z m 1.6021,-0.71308 c -0.19791,-0.18672 -0.0949,-1.04198 0.10652,-0.88428 0.10545,0.0826 0.19172,0.33339 0.19172,0.55739 0,0.38595 -0.10899,0.50542 -0.29824,0.32689 z m -2.76933,-0.38326 c 0,-0.35871 0.4359,-0.67169 0.6293,-0.45184 0.12434,0.14133 0.10285,0.22477 -0.10948,0.42508 -0.32718,0.30867 -0.51982,0.31858 -0.51982,0.0268 z m 3.87739,-0.0871 c -0.0922,-0.22679 0.13394,-0.4741 0.32938,-0.36014 0.21068,0.12284 0.1666,0.54912 -0.0568,0.54912 -0.10765,0 -0.23033,-0.085 -0.2726,-0.18898 z m -11.80194,-0.36692 c 0,-0.37978 0.629346,-1.5151 1.162413,-2.09693 0.503931,-0.55004 0.428017,-0.26007 -0.339366,1.29626 -0.552931,1.12141 -0.823047,1.38418 -0.823047,0.80067 z m 5.54719,-0.0952 c -0.526702,-0.4969 -0.555504,-0.88293 -0.10368,-1.38952 0.66352,-0.74392 1.20289,-0.40459 1.20289,0.75675 0,1.16829 -0.33013,1.35833 -1.09921,0.63277 z m 8.21426,0.32959 c -0.18105,-0.17081 -0.0905,-1.82669 0.11022,-2.01608 0.30943,-0.29193 0.99443,0.0578 1.22437,0.62509 0.27294,0.67337 -0.85221,1.84607 -1.33459,1.39099 z m 5.66111,-1.15559 c -0.72109,-1.41462 -0.79975,-1.77275 -0.25723,-1.17113 0.46359,0.51409 1.15731,1.80321 1.15731,2.15059 0,0.53262 -0.29039,0.21661 -0.90008,-0.97946 z m -17.183969,0.51526 c -0.113853,-0.17379 0.157571,-1.02364 0.427291,-1.33789 0.586205,-0.68297 0.89889,0.36325 0.346341,1.15883 -0.207818,0.29922 -0.630781,0.39712 -0.773632,0.17906 z m 15.015169,-0.0646 c -0.32016,-0.36394 -0.33313,-1.5058 -0.0171,-1.5058 0.33297,0 0.81875,0.83341 0.76091,1.30543 -0.0468,0.38223 -0.48094,0.49917 -0.7438,0.20037 z m -6.2058,-0.35496 c -0.21804,-0.31393 -0.15871,-0.54793 0.13893,-0.54793 0.22622,0 0.48693,0.44479 0.39425,0.67263 -0.10364,0.2548 -0.3018,0.20846 -0.53318,-0.1247 z m -2.35652,-0.12967 c 0,-0.33771 0.32124,-0.52518 0.5424,-0.31653 0.10381,0.0979 0.0791,0.19907 -0.0923,0.37776 -0.31288,0.32617 -0.45009,0.3075 -0.45009,-0.0612 z m -1.26059,-0.14614 c -0.22127,-0.39004 -0.17636,-0.60915 0.16854,-0.82235 0.60141,-0.37176 0.80402,0.17137 0.27881,0.74741 -0.30077,0.32988 -0.30256,0.33018 -0.44735,0.0749 z m 4.99028,0.0555 c -0.46035,-0.5233 -0.39018,-1.08762 0.1196,-0.96185 0.36133,0.0891 0.52125,0.43633 0.3718,0.80717 -0.13788,0.34215 -0.28558,0.38864 -0.4914,0.15468 z m -3.19791,-1.2377 c -0.20413,-0.42267 -0.18574,-0.77214 0.045,-0.85569 0.31891,-0.11545 0.57354,0.19321 0.57354,0.69525 0,0.56277 -0.37702,0.66056 -0.61856,0.16044 z m 1.20393,0.10785 c -0.13495,-0.33178 0.16744,-1.00655 0.45108,-1.00655 0.33896,0 0.42245,0.26711 0.24345,0.77882 -0.16056,0.45896 -0.54871,0.58624 -0.69453,0.22773 z m -6.43292,-0.008 c -0.289375,-0.0979 -0.166883,-0.58892 0.264304,-1.0595 0.632555,-0.69036 0.958266,-0.37651 0.517881,0.49902 -0.22013,0.43764 -0.516831,0.65024 -0.782185,0.56048 z m 11.8272,-0.12438 c -0.69434,-0.75097 -0.61386,-1.74063 0.0908,-1.11612 0.44188,0.39164 0.64803,0.91907 0.44807,1.14637 -0.20504,0.23308 -0.30031,0.22773 -0.53884,-0.0302 z m -9.81411,-0.24449 c 0,-0.22201 0.41846,-0.62974 0.64633,-0.62974 0.31298,0 0.32033,0.26294 0.0146,0.52393 -0.24039,0.20524 -0.66097,0.27257 -0.66097,0.10581 z m 1.6616,-0.12329 c 0,-0.27781 0.24236,-0.50645 0.53683,-0.50645 0.31034,0 0.28946,0.14649 -0.0658,0.46131 -0.35991,0.31898 -0.47107,0.32964 -0.47107,0.0451 z m 4.50029,0.0282 c -0.36932,-0.24405 -0.37423,-0.56434 -0.008,-0.51291 0.34464,0.0484 0.60369,0.40377 0.42037,0.57672 -0.0883,0.0833 -0.2209,0.0628 -0.41252,-0.0638 z m 1.40033,-0.0914 c -0.29481,-0.29605 -0.25471,-0.44324 0.12076,-0.44324 0.21111,0 0.62502,0.41704 0.62502,0.62974 0,0.20007 -0.48049,0.0799 -0.74578,-0.1865 z m -11.141049,-0.0443 c 0,-0.34732 1.380251,-1.99389 2.057498,-2.45449 0.33199,-0.22579 0.33199,-0.22579 0.01176,0.62179 -0.328539,0.86959 -0.503621,1.05299 -1.589953,1.66548 -0.263619,0.14863 -0.479308,0.22388 -0.479308,0.16722 z m 14.630589,-0.38783 c -0.94764,-0.57279 -0.98287,-0.61444 -1.31273,-1.55199 -0.26636,-0.75704 -0.26636,-0.75704 0.11008,-0.50415 0.60674,0.40758 2.30837,2.54677 2.00836,2.52479 -0.019,-0.001 -0.38157,-0.21229 -0.80571,-0.46865 z m -8.53806,-0.45329 c -0.3624,-0.34189 0.60245,-1.55825 0.9933,-1.25223 0.22904,0.17933 0.10751,0.47244 -0.41505,1.00101 -0.34114,0.34507 -0.43538,0.38601 -0.57825,0.25122 z m 2.7043,-0.2493 c -0.60626,-0.61314 -0.74787,-1.11731 -0.31383,-1.11731 0.32147,0 0.98992,0.75025 0.94981,1.06603 -0.0538,0.42358 -0.25205,0.43956 -0.63598,0.0513 z m -5.52701,-0.0702 c -0.48946,-0.33765 0.31829,-1.22661 1.24324,-1.36821 0.7787,-0.11922 0.77523,0.23563 -0.009,0.94158 -0.68896,0.62003 -0.86531,0.681 -1.23405,0.42663 z m 7.89628,-0.18536 c -1.39842,-0.95569 -0.9424,-1.72979 0.50786,-0.86211 0.74732,0.44712 0.86353,0.68748 0.47566,0.98379 -0.37516,0.28659 -0.38854,0.28493 -0.98352,-0.12168 z m -5.24156,-1.45931 c -0.57823,-0.22972 -0.54614,-0.78124 0.0653,-1.12198 0.65508,-0.36507 1.16975,-0.14781 1.16587,0.49216 -0.004,0.59124 -0.58262,0.88746 -1.23116,0.62982 z m 2.5903,-0.0403 c -0.29083,-0.20062 -0.24037,-1.02859 0.074,-1.21433 0.46299,-0.27353 1.50141,0.45061 1.31243,0.91522 -0.14917,0.36673 -1.01701,0.55395 -1.38643,0.29911 z m -5.50745,-0.44169 c -0.11867,-0.18114 0.23047,-0.546 0.6969,-0.72827 0.37492,-0.14651 0.89706,-0.006 0.89706,0.24171 0,0.33711 -1.40992,0.7675 -1.59396,0.48656 z m 8.54402,-0.0161 c -0.57216,-0.1565 -0.78704,-0.42934 -0.52949,-0.67231 0.24157,-0.2279 0.95099,-0.0557 1.30933,0.31789 0.40461,0.4218 0.0521,0.58199 -0.77984,0.35442 z m -4.95756,-1.56644 c -0.4153,-0.46564 -0.4165,-0.59366 -0.006,-0.59366 0.40008,0 0.9802,0.51583 0.87394,0.77709 -0.122,0.29992 -0.51047,0.21786 -0.86839,-0.18343 z m 1.3692,0.17112 c -0.0982,-0.24139 0.49265,-0.76478 0.86334,-0.76478 0.34262,0 0.31211,0.3127 -0.0652,0.66868 -0.36369,0.34312 -0.68205,0.38146 -0.79811,0.0961 z m -4.00077,-0.0202 c 0,-0.28848 0.97936,-0.67761 1.27361,-0.50605 0.0866,0.0505 0.13693,0.19386 0.11178,0.31856 -0.0489,0.24247 -1.38539,0.42334 -1.38539,0.18749 z m 6.22035,0.0191 c -0.25236,-0.23808 -0.0707,-0.52253 0.3337,-0.52253 0.42311,0 0.98705,0.27948 0.98705,0.48917 0,0.12807 -1.18855,0.15809 -1.32075,0.0334 z m -8.708255,20.86711 c 0.605469,-0.37427 0.193363,-0.73394 -0.461878,-0.40311 -0.199901,0.10093 -0.222506,0.17209 -0.114916,0.36175 0.162012,0.28559 0.179647,0.28686 0.576794,0.0414 z m 13.077615,-0.0626 c 0.19688,-0.29742 0.0373,-0.4611 -0.4528,-0.46433 -0.42251,-0.003 -0.49919,0.24378 -0.15374,0.49435 0.38685,0.28061 0.40139,0.27989 0.60654,-0.03 z M 98.179004,156.3791 c 0.729375,-0.20616 0.667439,-0.51304 -0.08735,-0.43277 -0.673494,0.0716 -0.731117,0.10629 -0.622097,0.37431 0.096,0.23602 0.08459,0.23508 0.709443,0.0585 z m 14.300756,-0.0441 c 0.20783,-0.23625 0.13642,-0.29472 -0.5334,-0.4367 -0.52622,-0.11154 -0.66262,-0.0625 -0.62717,0.22558 0.01,0.0795 0.67181,0.35751 0.91868,0.38574 0.0441,0.005 0.15297,-0.0735 0.24189,-0.17462 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "none");

    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y - 4));

    return wrapper;
  }

  /*
   * Taurus symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  taurus(x: number, y: number): Element {
    // center symbol
    const xShift = -90; // px
    const yShift = -120; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_TAURUS),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        //  " 1,4 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-4 m -18,0 1,3 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-3 m -11,8 -2,1 -1,1 -1,2 0,3 1,2 2,2 2,1 2,0 2,-1 2,-2 1,-2 0,-3 -1,-2 -1,-1 -2,-1 m -4,1 -2,1 -1,2 0,3 1,3 m 8,0 1,-3 0,-3 -1,-2 -2,-1",
        // "m 102.22187,160.5363 c -0.80036,-0.11869 -1.86149,-0.3873 -2.358053,-0.59689 -0.885332,-0.3737 -0.89149,-0.38717 -0.317417,-0.69441 1.80603,-0.96655 4.83451,-1.7996 8.21849,-2.26066 2.9762,-0.40551 3.76269,-0.78205 4.59234,-2.19868 0.43208,-0.73778 0.44039,-0.88913 0.0864,-1.57361 -0.21539,-0.41653 -1.30154,-1.50998 -2.41366,-2.4299 l -2.02204,-1.67257 1.91101,-0.95949 c 1.94635,-0.97724 4.24428,-2.81634 4.79161,-3.83489 0.16675,-0.3103 0.38036,-0.92137 0.4747,-1.35793 l 0.17151,-0.79375 0.83235,1.29513 c 2.79035,4.34176 2.24103,9.49872 -1.41488,13.28278 -3.13093,3.24069 -7.46138,4.54988 -12.55239,3.79487 z m -5.839352,-2.55523 c -1.746453,-1.46542 -2.222742,-2.013 -3.097798,-3.56144 -1.955163,-3.45974 -1.783675,-7.75277 0.439997,-11.01486 0.564566,-0.82821 1.367932,-1.806 1.785258,-2.17287 4.443639,-3.90638 11.411675,-4.56971 16.631485,-1.58324 0.74817,0.42806 1.56846,1.00831 1.82288,1.28943 0.42469,0.46929 0.42756,0.5404 0.035,0.86829 -0.23514,0.19642 -0.87398,0.78911 -1.41963,1.31707 -0.54566,0.52796 -1.4623,1.19879 -2.03698,1.49073 -1.11323,0.56553 -4.03273,1.26425 -4.27407,1.02291 -0.13385,-0.13385 0.95605,-1.16438 2.07481,-1.96179 0.81962,-0.5842 1.14865,-2.20704 0.73294,-3.61497 -0.24757,-0.83846 -0.48612,-1.1951 -0.7631,-1.14086 -0.22162,0.0434 -0.40295,0.31481 -0.40295,0.60314 0,1.00633 -1.22616,2.23405 -3.65011,3.65475 -3.96595,2.32448 -5.770592,3.23399 -7.660823,3.86092 -1.087094,0.36055 -1.785937,0.7392 -1.785937,0.96764 0,0.476 -0.04457,0.48003 2.061343,-0.18668 2.862058,-0.9061 9.924637,-4.88213 11.127757,-6.26461 l 0.6214,-0.71403 -0.17965,0.79227 c -0.22852,1.00781 -0.43621,1.24874 -2.33809,2.7122 -1.13831,0.87591 -1.81925,1.21059 -2.50369,1.23058 -1.21425,0.0354 -1.39361,0.56727 -0.26729,0.79253 0.52312,0.10463 1.23873,0.57713 1.79627,1.18605 0.50971,0.55668 2.20666,2.11047 3.77101,3.45287 1.58898,1.36354 2.84427,2.64371 2.84427,2.90064 0,0.25294 -0.34907,0.79433 -0.77572,1.20309 -0.80278,0.76911 -2.20822,1.17571 -4.13538,1.19637 -1.3992,0.015 -4.53097,0.84281 -7.009482,1.85277 -1.083522,0.44153 -2.037906,0.80318 -2.120853,0.80368 -0.08295,5e-4 -0.678259,-0.44166 -1.322917,-0.98258 z m 9.570932,-10.79968 c -0.95383,-1.08634 -1.02596,-1.30964 -0.29707,-0.91955 0.68752,0.36795 3.26631,-0.0418 4.95776,-0.78766 0.69577,-0.30682 1.76854,-1.05075 2.38396,-1.65317 1.24182,-1.21562 1.76316,-1.19843 0.88893,0.0293 -1.3983,1.96374 -4.8514,4.26632 -6.39803,4.26632 -0.48653,0 -0.97631,-0.29831 -1.53555,-0.93525 z m 14.40796,-11.37629 c -0.50192,-0.37963 -0.50041,-0.38846 0.0661,-0.38846 0.33894,0 0.57974,0.16485 0.57974,0.39688 0,0.47877 -0.002,0.47875 -0.64588,-0.008 z",
        "m88.085 139.14c-0.33007-0.38785-0.4985-0.90853-0.4985-1.5411 0-0.52546-0.31338-2.4524-0.69641-4.2822-0.53542-2.5578-0.83036-3.4811-1.2759-3.9945-0.31874-0.36725-0.77912-1.3757-1.0231-2.241s-0.44612-2.2179-0.44924-3.0059l-0.0061-1.4327-2.6882-1.4314c-1.7821-0.94892-3.3408-2.0152-4.6243-3.1635-1.0648-0.95269-2.4891-2.5294-3.165-3.5037-0.6759-0.97437-1.6359-2.691-2.1334-3.8147-0.49745-1.1237-0.90446-2.1397-0.90446-2.2577s0.38844 0.3992 0.86319 1.1494c0.47475 0.75014 1.4763 1.9092 2.2258 2.5756s2.2712 1.7298 3.3817 2.3629c1.1105 0.63313 3.2574 1.6 4.7708 2.1486 1.5134 0.5486 4.0129 1.2799 5.5543 1.6252l2.8026 0.62771 2.8034-0.6266c1.5419-0.34462 4.0431-1.0759 5.5582-1.6251 1.5151-0.54922 3.6634-1.5166 4.7739-2.1497 1.1105-0.63314 2.6322-1.6964 3.3816-2.3629s1.751-1.8255 2.2258-2.5756c0.47476-0.75015 0.8632-1.2674 0.8632-1.1494s-0.40701 1.134-0.90446 2.2577c-0.49746 1.1237-1.4575 2.8404-2.1334 3.8147-0.6759 0.97436-2.1002 2.551-3.165 3.5037-1.2835 1.1483-2.8422 2.2146-4.6243 3.1635l-2.6882 1.4314-0.0061 1.4327c-0.0035 0.78797-0.20566 2.142-0.45007 3.0088-0.25401 0.90091-0.73616 1.9135-1.1254 2.3636l-0.68104 0.78739-0.59406 3.2672c-0.32674 1.797-0.59406 3.6847-0.59406 4.195 0 0.64257-0.16312 1.097-0.53063 1.4781l-0.53062 0.55028h-3.2149z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "#020202");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /*
   * Gemini symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  gemini(x: number, y: number): Element {
    // center symbol
    const xShift = -105; // px
    const yShift = -100; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_GEMINI),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        //" 0,11.546414 m 0.9622011,-10.5842129 0,9.6220117 m 7.6976097,-9.6220117 0,9.6220117 m 0.962201,-10.5842128 0,11.546414 m -13.4708165,-14.4330172 1.9244023,1.924402 1.9244024,0.9622012 2.8866038,0.9622011 3.848804,0 2.886604,-0.9622011 1.924402,-0.9622012 1.924403,-1.924402 m -17.3196215,17.3196207 1.9244023,-1.9244024 1.9244024,-0.9622011 2.8866038,-0.9622012 3.848804,0 2.886604,0.9622012 1.924402,0.9622011 1.924403,1.9244024",
        //"m 100.19394,160.17566 c -1.962665,-0.47599 -4.112234,-1.63663 -5.626351,-3.03788 -1.281284,-1.18578 -1.31786,-1.26186 -1.474947,-3.06801 l -0.161082,-1.85209 1.330357,-1.7561 c 0.731696,-0.96585 1.682165,-2.05212 2.112154,-2.41394 0.51735,-0.43532 0.692957,-0.74668 0.519154,-0.92048 -0.173803,-0.1738 0.191311,-0.59588 1.079401,-1.24779 0.738124,-0.54184 1.506894,-1.22051 1.708378,-1.50817 0.21103,-0.30129 1.023566,-0.69462 1.916626,-0.92779 0.85265,-0.22263 1.6246,-0.52494 1.71544,-0.67181 0.10312,-0.16673 0.42534,-0.0966 0.85785,0.18685 0.66313,0.4345 1.49054,0.39328 1.49054,-0.0743 0,-0.2696 -1.86242,-1.11756 -2.45454,-1.11756 -0.23356,0 -0.49261,0.10996 -0.57567,0.24435 -0.0831,0.1344 -0.7747,0.44857 -1.53697,0.69816 -0.79873,0.26153 -1.895188,0.91469 -2.587863,1.54159 -0.661052,0.59828 -1.554021,1.35001 -1.984375,1.67053 -0.621469,0.46285 -0.707059,0.63392 -0.415986,0.83145 0.29782,0.20212 0.267139,0.30187 -0.163774,0.53249 -0.291636,0.15608 -1.32809,1.32974 -2.303231,2.60813 -1.576416,2.06665 -1.757328,2.42448 -1.63177,3.22755 0.202664,1.29625 -0.243072,0.68475 -0.741595,-1.01737 -1.141806,-3.89852 0.06872,-8.08653 3.150979,-10.90127 1.834873,-1.67563 3.402436,-2.52125 5.819805,-3.13951 4.98893,-1.27596 9.8554,-0.0571 13.24346,3.31709 3.14402,3.13109 4.32519,7.38801 3.00719,10.83785 -0.58612,1.53418 -0.61231,1.56084 -0.77973,0.79375 -0.21759,-0.99699 -2.63095,-6.03622 -3.69243,-7.71 -0.62898,-0.9918 -0.79725,-1.55401 -0.79725,-2.66367 v -1.40654 l -1.12448,0.16761 c -0.61847,0.0922 -1.59941,0.4226 -2.17987,0.73427 -1.08263,0.58128 -1.57941,1.48562 -0.8161,1.48562 0.22896,0 0.41628,-0.097 0.41628,-0.21557 0,-0.29972 1.75468,-1.10734 2.40584,-1.10734 0.29469,0 0.46392,0.11631 0.37606,0.25848 -0.28331,0.4584 0.41146,2.4355 1.34082,3.81551 0.4974,0.73859 0.90436,1.45031 0.90436,1.58159 0,0.13128 0.55929,1.36552 1.24285,2.74276 1.17664,2.37066 1.22201,2.54138 0.85147,3.20442 -0.31107,0.55666 -0.62038,0.71706 -1.50743,0.78172 -0.61383,0.0447 -1.1162,-0.0148 -1.11638,-0.13229 -7.4e-4,-0.49337 -1.25928,-1.61095 -2.13884,-1.8993 -1.06381,-0.34874 -2.50493,-1.70023 -2.25105,-2.11103 0.40236,-0.65103 -0.49036,-0.55539 -1.21115,0.12976 -1.74433,1.65805 -2.05185,3.69707 -0.82466,5.4679 0.57327,0.82722 0.70639,1.29605 0.66144,2.32933 -0.0416,0.95634 0.0398,1.29365 0.3123,1.29365 0.47216,0 0.68979,-0.57968 0.68979,-1.83734 0,-0.71312 -0.2279,-1.28708 -0.79375,-1.99912 -1.0587,-1.33219 -1.10598,-2.92173 -0.11461,-3.85307 l 0.67915,-0.63803 0.44533,0.56691 c 0.43708,0.55638 2.29435,1.66537 2.82267,1.68542 0.14767,0.006 0.51081,0.39256 0.80697,0.8599 0.51182,0.80765 0.61956,0.84959 2.17691,0.84736 l 1.63844,-0.002 -1.36072,1.37784 c -2.49377,2.52514 -5.81639,3.80405 -9.77817,3.76373 -1.21592,-0.0124 -2.82568,-0.17163 -3.57724,-0.3539 z",
        "m 106.92002,115.71054 c -0.002,-0.0836 0.0865,-0.51872 0.19644,-0.96692 0.10999,-0.4482 0.33674,-1.13842 0.50391,-1.53384 0.16717,-0.39541 0.53884,-1.08937 0.82594,-1.54212 0.31586,-0.49811 0.97445,-1.23847 1.66777,-1.87481 0.72011,-0.66093 1.42643,-1.18654 1.90116,-1.41476 0.41546,-0.19972 1.08911,-0.45808 1.497,-0.57412 0.55581,-0.15815 0.90503,-0.35922 1.39381,-0.80254 0.37568,-0.34075 0.8239,-0.91557 1.05723,-1.35588 0.25058,-0.47283 0.44116,-1.05143 0.49973,-1.51708 l 0.0947,-0.75275 0.0869,0.75855 c 0.0477,0.4172 0.0349,1.09194 -0.0288,1.49945 -0.0636,0.4075 -0.21281,1.02713 -0.33152,1.37696 -0.11871,0.34983 -0.39131,0.90735 -0.6058,1.23894 -0.21449,0.33158 -0.66997,0.79866 -1.01219,1.03794 -0.34221,0.2393 -1.32661,0.70221 -2.18755,1.0287 -0.86095,0.3265 -1.8683,0.78003 -2.23857,1.00785 -0.37028,0.22782 -0.89377,0.65948 -1.16334,0.95924 -0.26956,0.29976 -0.69713,0.84616 -0.95014,1.21423 -0.25302,0.36807 -0.62724,1.05076 -0.83159,1.5171 -0.20437,0.46632 -0.37315,0.77946 -0.37507,0.69586 z m -1.15861,-1.54013 c -0.116,-0.22465 -0.2791,-0.66002 -0.36244,-0.9675 -0.0841,-0.31042 -0.1254,-0.93321 -0.0928,-1.40039 0.0354,-0.50642 0.1687,-1.07124 0.33495,-1.41884 0.15191,-0.31763 0.50737,-0.85527 0.78991,-1.19474 0.28254,-0.33948 0.70255,-0.72542 0.93333,-0.85764 0.2308,-0.13222 0.98632,-0.41731 1.67895,-0.63353 0.69264,-0.21621 1.53136,-0.56421 1.86384,-0.77332 0.33248,-0.20912 1.00106,-0.75177 1.48575,-1.20592 0.48469,-0.45414 1.06047,-1.14081 1.27948,-1.52591 0.21902,-0.38511 0.45699,-0.99779 0.52884,-1.36149 0.0719,-0.36372 0.10162,-0.86261 0.0662,-1.10865 -0.0355,-0.24604 -0.29481,-1.34009 -0.57633,-2.431234 -0.28154,-1.091138 -0.6403,-2.377481 -0.79724,-2.858537 l -0.28535,-0.874648 0.48933,-0.388259 c 0.35858,-0.284511 0.54201,-0.556213 0.68645,-1.016785 0.14719,-0.469315 0.16592,-0.733234 0.0739,-1.041902 l -0.12313,-0.41338 h 0.17912 c 0.0985,0 0.46218,0.252919 0.80816,0.562043 l 0.62905,0.562045 v 0.433649 c 0,0.238504 -0.0878,0.628893 -0.19522,0.867524 -0.10738,0.238627 -0.37343,0.604546 -0.59122,0.813145 -0.21779,0.208598 -0.33673,0.379275 -0.2643,0.379275 0.0724,0 0.35791,-0.151896 0.63438,-0.337537 0.27647,-0.185645 0.6211,-0.477112 0.76586,-0.647704 0.14477,-0.170592 0.28889,-0.373175 0.32028,-0.450185 0.034,-0.08334 0.20824,0.0232 0.43049,0.263171 0.21187,0.228775 0.34873,0.490632 0.31637,0.605324 -0.0313,0.111171 -0.24834,0.409315 -0.48216,0.662541 -0.23383,0.253226 -0.65735,0.546532 -0.94116,0.651797 -0.2838,0.105262 -0.49468,0.229598 -0.46861,0.276307 0.026,0.0467 0.20281,0.393628 0.3928,0.77093 0.18997,0.377299 0.43577,1.033732 0.54621,1.45874 0.11045,0.425005 0.20221,1.27163 0.20388,1.88138 0.002,0.79436 -0.0762,1.37331 -0.27643,2.04224 -0.15374,0.51348 -0.45312,1.22243 -0.6653,1.57544 -0.21217,0.35302 -0.58065,0.86463 -0.81883,1.13694 -0.23818,0.27228 -0.69872,0.73632 -1.02342,1.03119 -0.32469,0.29487 -0.84873,0.65873 -1.16453,0.80856 -0.31579,0.14985 -1.05227,0.40129 -1.63662,0.55878 -0.58435,0.15748 -1.26073,0.36373 -1.50308,0.45834 -0.24235,0.0946 -0.6346,0.32359 -0.87167,0.50886 -0.23706,0.18528 -0.64593,0.64509 -0.9086,1.02179 -0.26265,0.3767 -0.59789,0.98141 -0.74496,1.34378 -0.14708,0.36237 -0.30473,1.10523 -0.35034,1.65082 l -0.083,0.99194 z m -12.334384,-4.34044 c -0.190789,-0.0605 -0.384196,-0.2406 -0.451919,-0.42086 -0.06511,-0.17332 -0.21727,-0.5777 -0.338129,-0.89862 -0.120854,-0.32092 -0.304274,-0.79296 -0.407599,-1.04896 -0.10332,-0.25601 -0.155351,-0.61612 -0.11562,-0.80026 0.03973,-0.18414 0.549308,-1.23782 1.132394,-2.34151 0.583091,-1.1037 1.321028,-2.31901 1.639857,-2.70072 0.318833,-0.3817 0.742253,-0.90524 0.940937,-1.16343 0.198683,-0.25819 0.455165,-0.678302 0.569966,-0.933593 l 0.208725,-0.464171 -0.554532,0.503691 c -0.304992,0.27703 -0.761014,0.827243 -1.013381,1.222683 -0.276862,0.43383 -0.458316,0.62749 -0.457493,0.48826 9.01e-4,-0.12691 0.08434,-0.48425 0.185757,-0.79411 0.101416,-0.30985 0.362371,-0.898489 0.579902,-1.308079 0.217526,-0.409589 0.699438,-1.056032 1.070907,-1.436541 0.37147,-0.380505 0.726323,-0.815985 0.788565,-0.967731 0.07193,-0.175364 0.06129,-0.420686 -0.02922,-0.673246 -0.07829,-0.218541 -0.290946,-0.499431 -0.472552,-0.624199 -0.181611,-0.124774 -0.517871,-0.26244 -0.747244,-0.305926 -0.313395,-0.05942 -0.439831,-0.158026 -0.508706,-0.396745 -0.07204,-0.249671 -0.04682,-0.321446 0.117775,-0.335277 0.115182,-0.0097 0.379382,-0.0051 0.587107,0.01023 0.207729,0.01531 0.557206,0.15392 0.776621,0.30806 0.219411,0.154135 0.466814,0.470914 0.549783,0.703949 0.110315,0.309842 0.180203,0.380748 0.260084,0.26386 0.06008,-0.08791 0.110101,-0.333117 0.111162,-0.544905 9e-4,-0.211787 -0.08192,-0.535368 -0.184399,-0.719064 -0.102479,-0.1837 -0.334837,-0.442286 -0.516348,-0.574637 -0.181516,-0.132347 -0.523189,-0.274225 -0.759274,-0.31528 -0.236087,-0.04107 -0.458496,-0.118515 -0.494244,-0.172131 -0.03573,-0.05362 3.47e-4,-0.338027 0.0802,-0.632024 0.07986,-0.293997 0.314747,-0.702782 0.521967,-0.908411 l 0.376765,-0.373871 0.2581,0.50833 c 0.160761,0.316634 0.482721,0.657922 0.853752,0.905012 0.389755,0.259559 0.665279,0.557967 0.797053,0.863253 0.110766,0.256618 0.201396,0.610619 0.201396,0.786672 0,0.176057 -0.285178,0.949584 -0.633732,1.718952 l -0.633733,1.398853 0.02365,0.846639 0.02365,0.84664 -0.748686,0.728797 c -0.411777,0.40085 -0.882907,0.90644 -1.04696,1.12353 -0.164054,0.21709 -0.657324,0.9982 -1.096155,1.73578 -0.438831,0.73758 -0.797876,1.39901 -0.797876,1.46982 0,0.0708 0.209471,-0.19948 0.465487,-0.60064 0.256015,-0.40117 0.781318,-1.0361 1.167337,-1.41098 0.386019,-0.37489 0.939105,-0.7938 1.229075,-0.93093 0.371817,-0.17583 0.760629,-0.24964 1.319077,-0.25043 l 0.791852,-6.9e-4 0.635532,-0.33791 c 0.349541,-0.18585 0.785701,-0.53983 0.969231,-0.78662 0.18353,-0.246798 0.3868,-0.670122 0.45169,-0.940718 0.0745,-0.310687 0.073,-0.687792 -0.004,-1.02333 -0.08,-0.347602 -0.27716,-0.681901 -0.57023,-0.966746 -0.29588,-0.287578 -0.46764,-0.383487 -0.5059,-0.282478 -0.03183,0.08411 0.007,0.392458 0.0867,0.685212 0.0795,0.292759 0.11948,0.555569 0.0888,0.584023 -0.0307,0.02846 -0.387324,0.123556 -0.792509,0.211342 -0.405182,0.08778 -0.84289,0.197528 -0.97268,0.243876 l -0.235984,0.08427 0.222547,-0.314839 c 0.122401,-0.173163 0.358759,-0.380999 0.52524,-0.461855 l 0.302699,-0.147017 0.0383,-1.335868 c 0.02484,-0.866461 0.105499,-1.479392 0.229564,-1.744315 0.10521,-0.224645 0.342254,-0.53753 0.526773,-0.6953 l 0.33548,-0.286848 -0.19336,0.428973 c -0.10635,0.235941 -0.192124,0.548821 -0.190601,0.6953 0.0014,0.146479 0.113241,0.491972 0.248281,0.767764 0.13502,0.275791 0.54452,0.820108 0.90997,1.20959 l 0.66445,0.708147 v 0.832649 c 0,0.645496 -0.0661,0.950683 -0.29454,1.357794 -0.162,0.288834 -0.44525,0.673444 -0.62947,0.854704 -0.18422,0.18126 -0.65393,0.50948 -1.043821,0.72938 l -0.708889,0.3998 h -0.679411 c -0.42035,0 -0.7981,0.0732 -0.990689,0.19192 -0.1712,0.10556 -0.641359,0.4863 -1.044794,0.84608 -0.403435,0.35977 -0.853205,0.81169 -0.999482,1.00424 l -0.265965,0.3501 0.307066,-0.22983 c 0.168883,-0.1264 0.517142,-0.43259 0.773904,-0.68043 l 0.466843,-0.4506 0.288524,0.0878 c 0.158691,0.0483 0.401832,0.0814 0.540315,0.0735 0.138483,-0.008 0.399466,-0.16681 0.579955,-0.35322 l 0.328168,-0.33895 0.873457,-0.058 c 0.570761,-0.0378 1.139259,-0.1685 1.640459,-0.37699 0.42185,-0.17549 0.94045,-0.48523 1.15244,-0.68832 0.212,-0.20309 0.50622,-0.6227 0.65382,-0.93247 0.17767,-0.372861 0.26717,-0.796847 0.26481,-1.254517 l -0.004,-0.691304 h 0.22116 c 0.12164,0 0.31797,0.06564 0.43629,0.145875 0.13097,0.0888 0.24498,0.379588 0.29144,0.743284 0.0536,0.419522 0.0103,0.781647 -0.14541,1.216152 -0.1288,0.35947 -0.43552,0.83377 -0.73199,1.1319 -0.28065,0.28225 -0.88383,0.71888 -1.34039,0.9703 -0.6159,0.33919 -1.18634,0.53025 -2.210642,0.74046 -0.759291,0.15582 -1.692121,0.39664 -2.072948,0.53514 -0.380834,0.13851 -0.973755,0.41838 -1.317613,0.62193 -0.411162,0.24341 -0.554921,0.38265 -0.419931,0.40675 0.112894,0.0202 0.520972,-0.12853 0.906835,-0.33038 l 0.701575,-0.36704 1.280769,-0.10311 c 0.704419,-0.0568 1.646555,-0.21596 2.093625,-0.35387 0.44707,-0.13791 1.1603,-0.43221 1.58495,-0.65401 0.42466,-0.2218 0.89905,-0.51302 1.05424,-0.64715 0.15518,-0.13415 0.39596,-0.46182 0.53505,-0.72817 0.13909,-0.26634 0.25517,-0.71713 0.25795,-1.00174 l 0.005,-0.517483 0.16722,0.291743 c 0.092,0.16047 0.20542,0.48791 0.25211,0.72765 0.0467,0.23974 0.0269,0.63545 -0.044,0.87934 -0.0708,0.2439 -0.31402,0.60456 -0.5404,0.80146 -0.22637,0.19691 -0.90217,0.62896 -1.50176,0.96012 -0.59958,0.33116 -1.33607,0.68564 -1.63662,0.78774 -0.388,0.1318 -1.046585,0.19059 -2.271149,0.20277 -1.178748,0.0117 -1.773924,0.0628 -1.880247,0.16129 -0.08556,0.0793 -0.180222,0.46013 -0.21036,0.84634 -0.0315,0.40362 0.0097,0.8467 0.09705,1.04202 0.08382,0.18758 0.316222,0.40293 0.518732,0.48068 0.279511,0.10732 0.450161,0.10889 0.716583,0.006 0.192331,-0.0739 0.419422,-0.23777 0.504642,-0.36426 l 0.154946,-0.22999 h -0.545648 c -0.40758,0 -0.61491,-0.0683 -0.819379,-0.2701 -0.150555,-0.14855 -0.273736,-0.37482 -0.273736,-0.50284 0,-0.128 0.07082,-0.31738 0.157369,-0.42083 0.08655,-0.10344 0.383979,-0.24448 0.660944,-0.3134 0.276971,-0.0689 0.64521,-0.12542 0.818318,-0.12553 l 0.314732,-2.2e-4 -0.416729,0.23552 c -0.229204,0.12954 -0.498304,0.41648 -0.597998,0.63766 -0.0997,0.22118 -0.181269,0.4362 -0.181269,0.47782 0,0.0416 0.222666,-0.11079 0.494816,-0.3387 0.340184,-0.28489 0.814317,-0.50795 1.517229,-0.71378 0.562324,-0.16467 1.073024,-0.29939 1.134874,-0.29939 0.0619,0 -0.026,0.29033 -0.19533,0.64517 -0.16929,0.35485 -0.30781,0.74871 -0.30781,0.87526 0,0.12652 -0.1133,0.33509 -0.251782,0.46345 -0.138487,0.12838 -0.373877,0.23342 -0.523093,0.23342 h -0.2713 l 0.219386,-0.22474 c 0.120669,-0.12358 0.199612,-0.31991 0.175436,-0.43627 -0.02418,-0.11635 -0.137602,-0.22828 -0.252067,-0.24872 -0.128237,-0.0229 -0.241955,0.0662 -0.296284,0.23206 -0.0485,0.14806 -0.189967,0.37425 -0.314385,0.50261 -0.130736,0.13489 -0.265046,0.52742 -0.318224,0.93004 -0.06936,0.52508 -0.173343,0.77203 -0.422235,1.00274 -0.235921,0.2187 -0.569895,0.34803 -1.169578,0.45292 -0.461647,0.0808 -0.898604,0.11287 -0.971018,0.0714 -0.07241,-0.0415 -0.298473,0.039 -0.502363,0.17862 -0.254921,0.1747 -0.47988,0.23472 -0.720218,0.19213 -0.192232,-0.034 -0.465681,-0.0222 -0.607671,0.0263 -0.14199,0.0485 -0.40825,0.0406 -0.591693,-0.0176 z m 1.175632,-1.55372 c -0.03174,-0.25188 0.02641,-0.5196 0.151173,-0.69609 0.111499,-0.15773 0.202724,-0.41612 0.202724,-0.57418 0,-0.17147 -0.133796,-0.38494 -0.331714,-0.52926 -0.182444,-0.13303 -0.441106,-0.24186 -0.574802,-0.24186 -0.133701,0 -0.356328,0.0562 -0.494731,0.12484 l -0.251638,0.12483 0.149436,0.16692 c 0.08219,0.0918 0.244977,0.1669 0.361749,0.1669 0.116771,0 0.318139,0.0717 0.447481,0.1594 l 0.235171,0.15941 -0.177687,0.39492 c -0.09773,0.2172 -0.159285,0.47368 -0.136799,0.56996 0.0225,0.0963 0.129538,0.26695 0.237883,0.37928 0.108345,0.11233 0.205159,0.20422 0.215147,0.20422 0.01,0 -0.005,-0.18418 -0.0334,-0.40929 z m 10.258232,1.12225 c -0.0466,-0.21562 -0.0846,-0.66646 -0.0846,-1.00188 0,-0.33541 0.0644,-0.78835 0.14303,-1.00653 0.0786,-0.21818 0.28307,-0.53678 0.45425,-0.708 0.17119,-0.17123 0.8096,-0.55667 1.41873,-0.85652 0.60914,-0.29986 1.37214,-0.78994 1.69559,-1.08908 0.32343,-0.29913 0.80658,-0.84659 1.07366,-1.21658 0.26707,-0.36998 0.60717,-0.97391 0.75579,-1.34204 0.14861,-0.36814 0.3286,-0.95817 0.39998,-1.31119 0.0713,-0.35301 0.099,-0.983185 0.0615,-1.400384 -0.0431,-0.478197 -0.29924,-1.362379 -0.69314,-2.392336 -0.34366,-0.898584 -0.80405,-2.0499 -1.02311,-2.558474 l -0.39828,-0.924686 0.32212,-0.665347 c 0.1967,-0.406292 0.32211,-0.876957 0.32211,-1.208827 0,-0.298913 -0.0849,-0.732006 -0.18883,-0.962429 -0.10387,-0.230423 -0.18884,-0.438581 -0.18884,-0.462574 0,-0.02399 0.29742,0.06088 0.66094,0.188601 0.36352,0.127721 0.73176,0.321347 0.81832,0.430276 0.0866,0.10893 0.15612,0.489977 0.1546,0.84677 -0.002,0.386529 -0.10092,0.849171 -0.24563,1.144689 -0.13359,0.272784 -0.21961,0.495972 -0.19118,0.495972 0.0285,0 0.20137,-0.144415 0.3843,-0.320923 0.18293,-0.176507 0.43892,-0.530982 0.56886,-0.78772 0.12993,-0.256739 0.23749,-0.584955 0.23901,-0.729371 0.002,-0.144415 0.0319,-0.262574 0.0675,-0.262574 0.0356,0 0.26696,0.118159 0.51415,0.262574 l 0.44941,0.262573 -0.0642,0.851169 c -0.0462,0.612719 -0.17123,1.063157 -0.44622,1.607881 l -0.38201,0.756714 0.56734,2.301547 c 0.31203,1.265848 0.6272,2.590371 0.70037,2.943389 0.0731,0.35301 0.0984,0.91758 0.056,1.25458 -0.0423,0.33701 -0.21692,0.95737 -0.38796,1.3786 -0.17104,0.42122 -0.58108,1.13902 -0.9112,1.59512 -0.33012,0.4561 -0.85397,0.99997 -1.16412,1.20861 -0.31014,0.20863 -1.13872,0.59746 -1.8413,0.86406 -0.70257,0.26661 -1.56832,0.66633 -1.92387,0.88829 -0.35555,0.22196 -0.77877,0.59883 -0.94048,0.8375 -0.16172,0.23866 -0.37817,0.66943 -0.48102,0.95726 l -0.18699,0.52332 z m -0.56293,-2.70374 c -0.0696,-0.16425 -0.19501,-0.51028 -0.27862,-0.76895 l -0.15201,-0.47032 0.67825,-0.59463 c 0.37304,-0.32703 0.89066,-0.92626 1.15025,-1.33162 0.2596,-0.40535 0.59033,-1.07836 0.73498,-1.49556 0.1859,-0.53619 0.26381,-1.06921 0.26577,-1.81839 0.002,-0.778859 -0.0688,-1.258405 -0.26743,-1.808836 -0.16807,-0.465909 -0.58082,-1.145966 -1.09201,-1.799294 -0.45201,-0.577658 -1.12819,-1.627952 -1.50264,-2.333983 -0.37445,-0.706031 -0.69433,-1.362465 -0.71083,-1.458743 -0.0165,-0.09628 0.0392,-0.468899 0.1238,-0.828049 0.11521,-0.489222 0.11917,-0.796549 0.0158,-1.225342 -0.0759,-0.314789 -0.27241,-0.79553 -0.43667,-1.068314 l -0.29861,-0.495973 h 0.43884 0.43885 l 0.25638,0.537249 c 0.141,0.295487 0.29747,0.886277 0.34769,1.312868 l 0.0913,0.775617 0.10162,-0.563421 c 0.0559,-0.309882 0.0673,-0.795606 0.0253,-1.079388 -0.042,-0.283782 -0.10979,-0.639636 -0.15071,-0.790788 l -0.0744,-0.27482 0.48114,0.07365 0.48115,0.07365 -0.002,0.98881 -0.002,0.988813 -0.34654,0.573745 -0.34654,0.573744 0.14578,0.418198 c 0.0802,0.230011 0.25914,0.628261 0.39771,0.884998 0.13856,0.256736 0.58464,0.892294 0.99129,1.412344 0.46325,0.592412 0.85313,1.255567 1.04397,1.775661 0.16752,0.456567 0.36799,1.322402 0.4455,1.924077 0.10209,0.792701 0.10354,1.372687 0.005,2.106117 -0.0747,0.5567 -0.19224,1.15006 -0.26136,1.31857 -0.0692,0.16852 -0.0999,0.33028 -0.0684,0.35948 0.0315,0.0292 0.20928,-0.38507 0.39507,-0.92059 0.25557,-0.73668 0.35334,-1.30039 0.40166,-2.315745 0.0467,-0.982197 0.007,-1.622883 -0.14914,-2.38946 -0.11714,-0.576083 -0.37917,-1.446849 -0.58226,-1.935041 -0.2031,-0.488192 -0.58733,-1.2219 -0.85384,-1.630472 l -0.48457,-0.742852 0.24779,-0.519227 c 0.16109,-0.337595 0.24609,-0.768402 0.24299,-1.231535 -0.003,-0.391768 -0.0656,-0.860141 -0.13994,-1.040827 -0.0743,-0.180685 -0.13514,-0.370983 -0.13514,-0.422883 0,-0.0519 0.18396,-0.05949 0.4088,-0.01686 0.32247,0.06113 0.42567,0.150444 0.48868,0.422883 0.044,0.18996 0.0863,0.660469 0.0941,1.045577 0.008,0.385109 -0.0463,0.902051 -0.12018,1.148761 -0.0739,0.246711 -0.10588,0.474974 -0.0711,0.50725 0.0349,0.03228 0.18057,-0.293268 0.3239,-0.723432 0.14334,-0.430163 0.26061,-1.065414 0.26061,-1.411669 0,-0.361759 0.0562,-0.629553 0.13215,-0.629553 0.0727,0 0.29929,0.08012 0.50358,0.178046 l 0.37143,0.178046 v 0.446385 c 0,0.245513 -0.0656,0.624896 -0.14587,0.843073 -0.0803,0.218178 -0.31249,0.623846 -0.51617,0.901485 l -0.37031,0.504797 0.39493,0.818754 c 0.21722,0.450313 0.50816,1.24719 0.64654,1.770835 0.13836,0.523649 0.28587,1.507444 0.32777,2.186213 0.0462,0.748426 0.016,1.615835 -0.0768,2.204026 -0.0841,0.533455 -0.26639,1.310265 -0.40501,1.726255 -0.13861,0.41598 -0.28114,0.84206 -0.31674,0.94685 -0.0356,0.10479 0.12022,-0.0721 0.34626,-0.39298 0.22603,-0.32092 0.55419,-0.95109 0.72923,-1.40039 l 0.31826,-0.816905 0.006,-1.424363 0.006,-1.424364 0.17032,0.432419 c 0.0937,0.237833 0.19889,0.931307 0.23383,1.541062 0.0463,0.807715 0.008,1.305101 -0.14071,1.832401 -0.11233,0.39807 -0.31654,0.9666 -0.45379,1.26342 -0.13726,0.29681 -0.45101,0.821 -0.69724,1.16486 -0.29048,0.40567 -0.87638,0.93119 -1.66846,1.49658 -0.67143,0.47924 -1.40178,1.04725 -1.623,1.26225 -0.22123,0.215 -0.45617,0.5222 -0.52209,0.68265 l -0.11986,0.29175 z m -3.43041,-0.7435 c 0.21105,-0.28435 0.38372,-0.57557 0.38372,-0.64716 0,-0.0716 0.13906,-0.25905 0.30902,-0.41659 0.23842,-0.22102 0.44117,-0.28645 0.88751,-0.28645 0.31818,0 0.73148,-0.0743 0.91845,-0.16509 0.18698,-0.0908 0.52015,-0.34025 0.74039,-0.55432 0.22023,-0.21407 0.55432,-0.6748 0.74239,-1.02382 0.23038,-0.42752 0.36078,-0.88447 0.3996,-1.40039 0.0377,-0.5006 -0.0157,-1.02849 -0.15416,-1.524348 -0.11647,-0.417202 -0.3905,-1.099892 -0.60894,-1.517089 -0.27157,-0.518674 -0.68712,-1.022961 -1.31408,-1.594696 -0.5043,-0.459884 -1.00102,-1.022726 -1.10381,-1.250768 -0.10279,-0.228041 -0.1889,-0.665753 -0.19135,-0.972692 l -0.005,-0.55807 -0.17999,0.291749 c -0.099,0.160461 -0.24067,0.455844 -0.31483,0.656406 l -0.13485,0.364657 0.49036,0.685637 c 0.26969,0.377101 0.61166,0.90673 0.75993,1.17696 0.14825,0.270224 0.26925,0.664085 0.26887,0.875242 -3.9e-4,0.211158 -0.0576,0.567727 -0.12718,0.792371 -0.0695,0.224645 -0.23981,0.539735 -0.37836,0.700196 l -0.25188,0.291749 0.2504,-0.52515 c 0.13772,-0.288828 0.25109,-0.735204 0.25194,-0.991945 7.1e-4,-0.256737 -0.13247,-0.733549 -0.29624,-1.059578 -0.16379,-0.326033 -0.45018,-0.734047 -0.63643,-0.9067 -0.18625,-0.172651 -0.46945,-0.393357 -0.62932,-0.490463 -0.19658,-0.119397 -0.33001,-0.360921 -0.41217,-0.746102 l -0.12149,-0.569551 0.28148,-0.118881 c 0.15481,-0.06539 0.44311,-0.315448 0.64066,-0.555694 l 0.35919,-0.436812 -0.006,-0.594732 c -0.004,-0.415949 -0.12701,-0.834212 -0.40828,-1.39137 -0.22119,-0.43815 -0.54419,-0.953099 -0.71778,-1.144329 -0.17359,-0.191231 -0.31562,-0.387367 -0.31562,-0.435858 0,-0.04849 0.19627,-0.144001 0.43614,-0.212244 0.3256,-0.09263 0.468,-0.0885 0.56183,0.01631 0.0692,0.07721 0.23987,0.373684 0.37941,0.658821 0.13954,0.285136 0.25497,0.434875 0.25649,0.332753 0.002,-0.102123 -0.0777,-0.433441 -0.176,-0.736263 l -0.17875,-0.550586 0.27317,0.03607 c 0.21153,0.02793 0.33744,0.207258 0.55793,0.794611 0.20628,0.549486 0.27824,0.983687 0.26115,1.575441 -0.0183,0.632786 0.0395,0.941852 0.25625,1.371333 0.15392,0.304939 0.31271,0.830088 0.3529,1.166993 0.0489,0.410026 0.20812,0.805475 0.48157,1.196049 0.2247,0.320926 0.59355,0.924607 0.81969,1.341523 0.22612,0.416911 0.51943,1.047087 0.65179,1.400391 0.13235,0.353301 0.32601,1.009972 0.43034,1.459261 0.10432,0.449298 0.18854,1.190548 0.18714,1.647248 -0.002,0.55157 -0.0909,1.0492 -0.26567,1.48226 -0.14675,0.36356 -0.51718,0.91387 -0.83747,1.24407 -0.31589,0.32568 -0.80855,0.7167 -1.09481,0.86894 -0.28626,0.15224 -0.83207,0.35882 -1.21289,0.45908 -0.47244,0.12438 -0.82566,0.31357 -1.11181,0.59546 -0.23066,0.22723 -0.50248,0.41316 -0.60405,0.41316 -0.13232,0 -0.0759,-0.14652 0.19907,-0.517 z m 15.92504,-4.76365 c -0.004,-0.72739 -0.0849,-1.447705 -0.20655,-1.838016 -0.10995,-0.353013 -0.2912,-0.837368 -0.4028,-1.076338 l -0.20288,-0.434492 0.38353,-0.183842 c 0.21094,-0.101115 0.49411,-0.351968 0.62928,-0.557453 0.13516,-0.205484 0.24704,-0.531152 0.24859,-0.723704 l 0.003,-0.350099 0.35281,0.520386 c 0.22323,0.329266 0.33164,0.623031 0.29517,0.799873 -0.0317,0.153716 -0.23937,0.439781 -0.4615,0.635699 l -0.40387,0.356206 0.24509,0.594406 c 0.19238,0.466588 0.23346,0.795166 0.19099,1.527994 -0.038,0.65588 -0.13621,1.08115 -0.33016,1.42957 -0.15185,0.27279 -0.2891,0.49598 -0.305,0.49598 -0.016,0 -0.0319,-0.53827 -0.0355,-1.19617 z m -22.339616,0.43762 c 0,-0.032 0.02831,-0.0583 0.06296,-0.0583 0.03464,0 0.06295,0.0263 0.06295,0.0583 0,0.0321 -0.02831,0.0584 -0.06295,0.0584 -0.03464,0 -0.06296,-0.0263 -0.06296,-0.0584 z m 2.999778,-0.84607 c 0.06218,-0.11232 0.150464,-0.4311 0.196177,-0.70841 0.04573,-0.277304 0.170519,-0.627848 0.277356,-0.778989 0.106832,-0.151141 0.368918,-0.331242 0.582406,-0.400229 0.213491,-0.06899 0.707017,-0.125432 1.09673,-0.125432 0.437559,0 0.815589,-0.06948 0.988369,-0.181666 l 0.2798,-0.181668 v 0.362021 c 0,0.230554 -0.11429,0.467963 -0.31473,0.653769 -0.17311,0.16046 -0.31474,0.344262 -0.31474,0.408446 0,0.06419 -0.13906,0.245598 -0.309012,0.403148 -0.169959,0.15754 -0.380848,0.28644 -0.468647,0.28644 -0.08779,0 -0.03373,-0.0817 0.120175,-0.18167 0.15389,-0.0999 0.279801,-0.23165 0.279801,-0.29273 0,-0.06109 -0.113307,-0.04548 -0.25179,0.0347 l -0.251791,0.14576 -0.264047,-0.15286 c -0.145225,-0.08406 -0.301018,-0.118437 -0.346207,-0.07637 -0.04521,0.04208 0.05158,0.17699 0.215046,0.29983 l 0.297208,0.22337 h -0.25032 c -0.137674,0 -0.318315,-0.076 -0.401422,-0.16877 l -0.151102,-0.16878 -0.380933,0.40217 c -0.209513,0.2212 -0.462037,0.40218 -0.56116,0.40218 -0.130789,0 -0.149213,-0.0561 -0.06716,-0.20423 z m 1.244911,-7.782101 c -0.256696,-0.284664 -0.690036,-0.849197 -0.962967,-1.254518 -0.272937,-0.40532 -0.638548,-1.132095 -0.812465,-1.615055 -0.173923,-0.482959 -0.355021,-1.229133 -0.402436,-1.658163 l -0.08622,-0.780054 0.488958,0.06988 c 0.268931,0.03843 0.830176,0.194626 1.247219,0.347098 0.417038,0.152473 1.023335,0.473343 1.347327,0.713044 0.323986,0.239701 0.591791,0.495033 0.595111,0.567404 0.003,0.07237 -0.0703,0.190311 -0.163603,0.262087 l -0.169635,0.130503 0.349378,0.642064 c 0.19216,0.353135 0.38784,0.92736 0.43485,1.276058 0.047,0.348695 0.0596,0.703291 0.0281,0.787988 -0.0315,0.0847 -0.12222,-0.122837 -0.20151,-0.461187 -0.0793,-0.338351 -0.283,-0.869148 -0.45269,-1.179551 -0.169668,-0.310402 -0.588805,-0.797976 -0.931397,-1.083499 -0.342596,-0.285523 -0.862726,-0.606461 -1.155851,-0.713194 l -0.532958,-0.19406 0.07182,0.41025 c 0.0395,0.225639 0.200373,0.788542 0.357494,1.250897 0.157121,0.462355 0.552201,1.326407 0.877953,1.920115 0.325747,0.593708 0.580568,1.07947 0.56626,1.07947 -0.01432,0 -0.236035,-0.232909 -0.492736,-0.517573 z m -3.916439,-0.154473 c -0.32845,-0.304314 -0.761533,-0.819425 -0.962401,-1.144691 -0.200868,-0.325268 -0.448738,-0.923274 -0.550821,-1.328906 l -0.185608,-0.73751 1.0315,0.06221 c 0.604469,0.03645 1.334774,0.16859 1.764061,0.319177 0.402906,0.141333 0.761461,0.326788 0.796791,0.412123 0.0353,0.08534 -0.05037,0.395297 -0.190433,0.688805 -0.140063,0.293508 -0.285407,0.533651 -0.322992,0.533651 -0.03759,0 -0.15067,-0.182652 -0.251296,-0.405893 -0.100622,-0.22324 -0.370484,-0.511874 -0.599688,-0.641409 -0.229203,-0.129535 -0.544201,-0.235714 -0.699995,-0.235954 -0.170653,-2.63e-4 -0.283261,0.07061 -0.283261,0.178293 0,0.0983 0.116995,0.500656 0.259985,0.89412 0.142993,0.393464 0.40174,0.974691 0.574991,1.291614 0.173252,0.316925 0.292806,0.596802 0.265679,0.621949 -0.02712,0.02514 -0.318057,-0.203262 -0.646512,-0.507576 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /*
   * Cancer symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  cancer(x: number, y: number): Element {
    // center symbol
    const xShift = -100; // px
    const yShift = -95; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_CANCER),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        //" -15,0 -2,1 -1,2 0,2 1,2 2,1 2,0 2,-1 1,-2 0,-2 -1,-2 11,0 m -18,3 1,2 1,1 2,1 m 4,-4 -1,-2 -1,-1 -2,-1 m -4,15 15,0 2,-1 1,-2 0,-2 -1,-2 -2,-1 -2,0 -2,1 -1,2 0,2 1,2 -11,0 m 18,-3 -1,-2 -1,-1 -2,-1 m -4,4 1,2 1,1 2,1",
        // "m 102.35416,159.52644 c -3.928737,-0.84644 -7.246906,-3.29967 -8.888723,-6.57173 -0.853906,-1.70179 -0.900856,-1.94044 -0.900856,-4.57905 0,-2.59822 0.05653,-2.89852 0.8485,-4.50723 0.466674,-0.94796 1.139148,-1.9966 1.494384,-2.33033 l 0.645886,-0.60678 3.268115,0.42258 c 1.797464,0.23242 4.448364,0.77756 5.890884,1.21141 2.90784,0.87457 3.06577,0.90176 3.06577,0.5278 0,-0.3181 -1.48086,-0.96033 -3.43958,-1.49169 -1.26038,-0.34191 -7.327623,-1.40914 -8.06626,-1.41885 -0.143579,-0.002 0.389359,-0.44144 1.184306,-0.97679 6.812764,-4.58798 16.470954,-2.35164 19.896714,4.60706 0.82353,1.67283 0.87586,1.94579 0.87586,4.56838 0,2.60863 -0.0551,2.90027 -0.8505,4.50349 -1.7413,3.50964 -5.07835,5.92106 -9.29904,6.71964 -2.67703,0.50652 -3.03544,0.50164 -5.72546,-0.0779 z m 8.79071,-2.78827 c 1.56468,-0.41655 3.16049,-1.29621 3.83727,-2.1152 0.7672,-0.92843 0.57178,-1.78739 -0.7615,-3.34714 -2.81963,-3.29857 -3.38083,-4.20443 -3.29982,-5.32641 0.0838,-1.1609 -0.42875,-1.77813 -1.48905,-1.79311 -0.51674,-0.007 -0.59531,-0.1481 -0.59531,-1.06675 0,-0.76435 -0.11025,-1.05834 -0.39688,-1.05834 -0.29966,0 -0.39687,0.32282 -0.39687,1.31788 0,1.22264 0.0526,1.3294 0.7276,1.47731 1.36085,0.29818 1.38019,0.32066 1.327,1.54268 -0.032,0.73613 0.10005,1.36514 0.34942,1.66397 0.22051,0.26425 1.25809,1.50708 2.30574,2.76184 1.04765,1.25477 1.90482,2.4544 1.90482,2.66586 0,0.48875 -0.92516,1.33828 -2.11667,1.94364 -1.18859,0.60388 -4.36889,0.82068 -5.68192,0.38734 -0.54552,-0.18003 -1.59648,-0.91938 -2.33548,-1.64298 -1.22252,-1.19706 -1.41659,-1.2962 -2.15321,-1.09988 -0.44528,0.11867 -1.61327,0.20595 -2.595533,0.19397 -1.306095,-0.016 -1.785937,0.0712 -1.785937,0.32442 0,0.52523 1.75232,0.74324 3.41355,0.42469 1.43197,-0.27459 1.50388,-0.26042 2.1617,0.42605 1.28959,1.34575 1.83617,1.71852 3.22153,2.19711 1.68128,0.58082 2.54817,0.60529 4.35955,0.12305 z",
        "m 98.352147,104.5878 c -0.157567,-0.10954 -0.42424,-0.38326 -0.592607,-0.60827 -0.168366,-0.225 -0.805592,-0.68958 -1.416058,-1.0324 -0.610466,-0.34282 -1.454449,-0.74933 -1.875518,-0.90335 -0.42107,-0.15403 -1.518498,-0.3425 -2.438729,-0.41883 -1.125125,-0.0933 -1.96036,-0.25655 -2.550023,-0.49834 l -0.876874,-0.35956 -0.05747,-0.57741 c -0.03448,-0.346458 0.05843,-0.723668 0.232304,-0.943118 0.159374,-0.20114 0.431579,-0.36675 0.604901,-0.36802 0.173321,-10e-4 0.424612,-0.0597 0.558423,-0.12984 l 0.243293,-0.12754 -0.380152,-1.01779 c -0.209083,-0.55979 -0.380151,-1.23999 -0.380151,-1.51157 0,-0.27158 0.110708,-0.56975 0.246018,-0.66262 0.186636,-0.12809 0.313203,-0.10523 0.524364,0.0947 0.15309,0.14495 0.377418,0.5187 0.498508,0.83057 0.121089,0.31187 0.371866,0.63417 0.557283,0.71623 0.260312,0.1152 0.456379,0.0662 0.86056,-0.21503 0.287891,-0.20032 0.741303,-0.69524 1.007581,-1.09981 0.266279,-0.40458 0.953165,-2.15874 1.526415,-3.89814 0.573249,-1.73939 1.166878,-3.66524 1.319176,-4.27964 l 0.276906,-1.1171 -0.443137,-0.683 c -0.243726,-0.37565 -0.66598,-0.81806 -0.938343,-0.98314 l -0.495205,-0.30015 -0.726708,0.27099 c -0.39969,0.14904 -0.854298,0.2305 -1.010239,0.18102 -0.155942,-0.0495 -0.28353,-0.2285 -0.28353,-0.39782 0,-0.16931 0.242589,-0.58477 0.539087,-0.92324 l 0.539092,-0.615402 -0.110518,-0.978697 -0.110518,-0.978696 1.209447,-0.932155 c 0.66621,-0.513467 1.301524,-1.152842 1.414445,-1.423487 0.133608,-0.320226 0.360508,-0.523607 0.651547,-0.584012 0.32175,-0.06678 0.711889,0.04565 1.395971,0.402302 0.522182,0.272242 1.181218,0.593416 1.464525,0.713722 l 0.515104,0.218737 0.835463,-0.193435 0.83547,-0.193435 0.33304,0.340117 c 0.18318,0.187064 0.38784,0.681673 0.4548,1.099131 0.0834,0.519939 0.3109,0.963917 0.72223,1.409534 0.33025,0.357785 0.71791,0.842518 0.86146,1.077183 0.14354,0.234665 0.40517,0.791333 0.58139,1.237043 0.19635,0.49664 0.58448,1.02877 1.00253,1.37447 0.44201,0.36552 1.15692,0.71256 2.03092,0.98588 0.89106,0.27866 1.56552,0.60859 1.98746,0.97224 0.35127,0.30275 0.83179,0.87381 1.06783,1.26903 0.23604,0.39521 0.60556,0.77795 0.82115,0.85052 0.2156,0.0726 0.74597,0.33067 1.17862,0.57355 0.43265,0.24287 0.90946,0.58661 1.0596,0.76386 0.16271,0.1921 0.47148,0.32311 0.76443,0.32434 0.27031,10e-4 0.67623,0.043 0.90204,0.093 0.31133,0.069 0.41334,0.20529 0.42201,0.56381 l 0.0114,0.47282 1.30829,0.52815 c 0.83041,0.33523 1.71396,0.85886 2.41889,1.43354 0.61083,0.49796 1.28215,1.21096 1.49181,1.58444 0.20966,0.37347 0.43539,0.84881 0.50162,1.05629 0.0723,0.22636 -0.0717,0.10565 -0.35995,-0.3018 -0.26421,-0.37347 -0.82402,-0.97107 -1.24402,-1.328 -0.42001,-0.35693 -1.13979,-0.84894 -1.59953,-1.09336 -0.45973,-0.24442 -1.30443,-0.57771 -1.8771,-0.74064 l -1.04122,-0.29623 -0.34027,0.24093 -0.34027,0.24093 0.34629,0.46962 c 0.19962,0.27072 0.33961,0.72526 0.33051,1.07321 l -0.0158,0.6036 -0.16828,-0.48098 c -0.0925,-0.26453 -0.47337,-0.68894 -0.84627,-0.94312 -0.37289,-0.25417 -0.8851,-0.46593 -1.13823,-0.47057 l -0.46024,-0.008 0.80209,-0.26906 c 0.44115,-0.14797 0.99968,-0.42631 1.24118,-0.61852 0.31541,-0.25104 0.42358,-0.48104 0.38402,-0.81654 l -0.0551,-0.46706 -0.97461,-0.0461 c -0.65989,-0.0312 -1.11656,0.0308 -1.4142,0.1921 -0.24178,0.131 -0.4396,0.19007 -0.4396,0.13126 0,-0.0588 0.17126,-0.25768 0.38059,-0.44194 0.29291,-0.25783 0.33825,-0.39913 0.19683,-0.61332 -0.10107,-0.15307 -0.69309,-0.50364 -1.31561,-0.77904 l -1.13185,-0.50072 -0.47919,0.36911 c -0.26355,0.20301 -0.66394,0.4477 -0.88976,0.54376 -0.22581,0.0961 -0.41057,0.1347 -0.41057,0.0859 0,-0.0488 0.20528,-0.33859 0.45619,-0.64393 0.25091,-0.30535 0.4537,-0.7601 0.45065,-1.01057 l -0.006,-0.45539 -0.20696,0.3018 c -0.11382,0.16599 -0.29608,0.35169 -0.40502,0.41266 -0.10894,0.061 -0.40747,0.1119 -0.66339,0.11318 -0.25593,10e-4 -0.56155,-0.0773 -0.67916,-0.17452 -0.16346,-0.13517 -0.1187,-0.21605 0.18999,-0.34332 0.2221,-0.0916 0.43185,-0.28687 0.46612,-0.43401 0.0343,-0.14715 -0.0414,-0.37085 -0.16811,-0.49713 -0.12673,-0.12627 -0.38455,-0.19626 -0.57293,-0.15552 l -0.34252,0.0741 0.21525,-0.21448 c 0.16941,-0.16879 0.15822,-0.21447 -0.0525,-0.21447 -0.14728,0 -0.40368,0.12418 -0.56978,0.27595 -0.1661,0.15178 -0.302,0.46181 -0.302,0.68897 0,0.22716 0.0926,0.55611 0.20581,0.73102 l 0.2058,0.318 -0.50413,-0.32792 c -0.27727,-0.18036 -0.70162,-0.32793 -0.94299,-0.32793 -0.24137,0 -0.76774,0.13875 -1.16972,0.30833 -0.40198,0.16959 -1.05563,0.55096 -1.45255,0.84751 -0.39693,0.29654 -0.72169,0.46357 -0.72169,0.37116 0,-0.0924 0.56354,-0.66051 1.25232,-1.26247 0.68878,-0.60196 1.38676,-1.31179 1.55106,-1.5774 0.16431,-0.26562 0.29772,-0.707 0.29646,-0.98085 -0.001,-0.28986 -0.2659,-0.87624 -0.63315,-1.40331 l -0.63086,-0.90539 -0.006,0.51557 c -0.003,0.28356 -0.0493,0.47941 -0.10269,0.43521 -0.0534,-0.0442 -0.33045,-0.75524 -0.61556,-1.58011 -0.28511,-0.824873 -0.65626,-1.720236 -0.82476,-1.9897 -0.16851,-0.269463 -0.44578,-0.526149 -0.61617,-0.570413 -0.17039,-0.04426 -0.62114,-0.188163 -1.00167,-0.319778 -0.45844,-0.158564 -0.65853,-0.311143 -0.59305,-0.452246 0.0543,-0.11712 0.0988,-0.241345 0.0988,-0.276055 0,-0.03471 0.11372,-0.06311 0.25273,-0.06311 0.139,0 0.39299,0.177021 0.56442,0.39338 0.19548,0.246714 0.37592,0.340266 0.48396,0.250921 0.10804,-0.08934 0.10591,-0.286806 -0.006,-0.52962 -0.0979,-0.212939 -0.25575,-0.426898 -0.35078,-0.475463 -0.095,-0.04856 -0.43724,-0.01206 -0.76048,0.08112 l -0.587717,0.169422 -0.625546,-0.246679 c -0.34405,-0.135673 -1.02799,-0.246679 -1.519866,-0.246679 -0.491876,0 -1.125483,0.07223 -1.408014,0.160499 -0.282532,0.08827 -0.739511,0.338645 -1.015509,0.556379 -0.275998,0.217734 -0.501815,0.434593 -0.501815,0.481909 0,0.04732 0.358327,0.06246 0.796282,0.03366 0.556337,-0.03659 1.031346,0.0468 1.576374,0.276731 0.429051,0.181006 1.15915,0.645464 1.622442,1.032128 0.463292,0.386665 1.109724,1.121357 1.436519,1.632651 0.38438,0.6014 0.98002,1.20605 1.68703,1.71254 0.60108,0.43061 1.09287,0.83644 1.09287,0.90184 0,0.0654 -0.27917,0.44914 -0.62037,0.85274 -0.3412,0.4036 -1.265,1.77616 -2.05288,3.05012 -0.78788,1.27396 -1.458457,2.21024 -1.490169,2.08062 -0.03171,-0.12962 0.268994,-0.81211 0.668237,-1.51663 0.409883,-0.7233 0.939532,-2.04065 1.216622,-3.026 0.2699,-0.95977 0.44393,-1.84588 0.38674,-1.96913 -0.0572,-0.12325 -0.26074,-0.22409 -0.45233,-0.22409 -0.19159,0 -0.44997,0.10127 -0.5742,0.22505 -0.12422,0.12377 -0.30298,0.80545 -0.397242,1.51483 -0.121436,0.91389 -0.360476,1.65091 -0.820197,2.52886 -0.356846,0.68149 -0.979049,1.98603 -1.382674,2.89897 l -0.733862,1.65989 -0.06462,1.72423 -0.06462,1.72423 -0.707281,0.69015 c -0.389004,0.37959 -0.985503,0.77128 -1.325554,0.87043 -0.340051,0.0991 -1.316254,0.35741 -2.169338,0.57392 -0.853085,0.216501 -1.941111,0.433431 -2.417835,0.482071 -0.476724,0.0486 -0.866771,0.13597 -0.866771,0.19408 0,0.0581 0.209152,0.18446 0.464782,0.28078 0.255629,0.0963 0.892022,0.17363 1.414205,0.17181 0.54993,-0.002 1.286044,-0.12962 1.749426,-0.30348 0.626172,-0.23495 0.856435,-0.26144 1.059714,-0.12193 0.172066,0.11809 1.256877,0.18763 3.214515,0.20605 l 2.954803,0.0278 -0.91239,-0.34449 c -0.501815,-0.18948 -1.343495,-0.42806 -1.8704,-0.530181 -0.526906,-0.10213 -0.95801,-0.20744 -0.95801,-0.23402 0,-0.0266 0.379201,-0.33737 0.842669,-0.69065 0.463467,-0.35328 1.194324,-1.0507 1.624126,-1.54983 0.474958,-0.55156 0.961585,-1.38097 1.240713,-2.11469 l 0.459251,-1.20719 0.0151,1.21804 c 0.008,0.66992 0.14058,1.52253 0.29392,1.89469 0.15335,0.37216 0.53117,0.92983 0.83962,1.23927 0.30844,0.30943 0.97901,0.73786 1.49015,0.95205 l 0.92935,0.38944 1.47002,-0.0657 1.47002,-0.0656 1.64231,-0.66087 c 0.90326,-0.36347 1.71119,-0.68895 1.79539,-0.72328 0.0842,-0.0343 -0.0717,0.21851 -0.34649,0.56187 -0.27477,0.34335 -0.88787,0.85998 -1.36245,1.148061 -0.47457,0.28808 -1.4272,0.7448 -2.11696,1.01493 l -1.2541,0.49116 -1.32962,-0.0156 -1.32961,-0.0156 0.41722,0.37502 c 0.22948,0.20625 0.74569,0.50037 1.14714,0.65358 0.40146,0.15322 1.06344,0.28007 1.47108,0.2819 0.40764,0.002 1.39302,-0.1345 2.18974,-0.30293 0.79671,-0.16844 2.04031,-0.54415 2.76355,-0.83493 0.87291,-0.35095 1.73834,-0.86942 2.57434,-1.54227 0.69264,-0.557471 1.51662,-1.387061 1.83105,-1.843531 0.31443,-0.45647 0.57247,-0.71717 0.57341,-0.57932 9.4e-4,0.13785 -0.15299,0.66168 -0.34208,1.16407 -0.18908,0.50239 -0.56325,1.223111 -0.83148,1.601611 -0.26824,0.3785 -1.02685,1.05593 -1.6858,1.50541 -0.65895,0.44947 -1.74232,1.05239 -2.4075,1.33982 -0.66517,0.28743 -1.65541,0.63099 -2.20053,0.76348 -0.54512,0.13249 -1.6392,0.24089 -2.43128,0.24089 -1.05992,0 -1.80998,-0.10216 -2.84091,-0.38693 -0.77042,-0.2128 -1.67336,-0.51888 -2.00654,-0.68016 l -0.60578,-0.29324 0.12555,0.34064 c 0.069,0.18736 0.24592,0.45417 0.39305,0.59291 l 0.2675,0.25227 -0.42594,0.23053 c -0.23427,0.12679 -0.754401,0.27266 -1.155853,0.32415 -0.485379,0.0623 -0.82589,0.0269 -1.016397,-0.10555 z m -3.511182,-5.881478 c 0.146008,-0.1002 0.165209,-0.25946 0.05767,-0.47829 -0.08868,-0.18043 -0.211271,-0.64506 -0.272435,-1.03249 -0.06116,-0.38744 -0.226758,-0.78374 -0.367987,-0.88067 -0.141229,-0.0969 -0.342492,-0.13242 -0.447252,-0.0789 -0.109605,0.056 -0.190471,0.6771 -0.190471,1.46289 v 1.36555 l 0.500794,-0.10394 c 0.275436,-0.0572 0.599295,-0.17154 0.719686,-0.25417 z m 3.033092,-15.23558 1.060197,-0.621952 -0.407717,-0.35889 c -0.224245,-0.197389 -0.50534,-0.35889 -0.624655,-0.35889 -0.119316,0 -0.597693,0.336614 -1.06306,0.748031 -0.465367,0.411417 -0.846122,0.807531 -0.846122,0.880241 0,0.0727 0.05474,0.17749 0.121652,0.23282 0.06691,0.0553 0.25167,0.1006 0.41058,0.1006 0.15891,0 0.766017,-0.27988 1.349125,-0.62196 z m 14.350933,9.59223 -0.23542,-0.23458 0.38873,-0.32146 c 0.28354,-0.23447 0.62513,-0.32412 1.26233,-0.33129 l 0.87359,-0.01 v 0.37279 c 0,0.24615 -0.15497,0.43763 -0.45619,0.56365 -0.25091,0.10497 -0.71302,0.19186 -1.02691,0.19308 -0.31389,10e-4 -0.67665,-0.10334 -0.80613,-0.23235 z m -13.677597,-0.44447 c 0,-0.0415 0.04106,-0.0755 0.09124,-0.0755 0.05018,0 0.09124,0.034 0.09124,0.0755 0,0.0415 -0.04106,0.0754 -0.09124,0.0754 -0.05018,0 -0.09124,-0.0339 -0.09124,-0.0754 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "#000000");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x - 18, y));
    return wrapper;
  }

  /*
   * Leo symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  leo(x: number, y: number): Element {
    // center symbol
    const xShift = -105; // px
    const yShift = -100; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute("id", this.getSignWrapperId(this.settings.SYMBOL_LEO));
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        // "m 102.19369,159.62485 c -1.92661,-0.38392 -4.06855,-1.36761 -5.594213,-2.56918 -1.169243,-0.92085 -1.21773,-1.22657 -0.327225,-2.06315 0.813991,-0.76471 0.446912,-1.42496 -0.377455,-0.67892 -0.28531,0.25821 -0.645311,0.39124 -0.800002,0.29564 -0.389305,-0.24061 -0.352859,-1.35396 0.05818,-1.77735 0.910452,-0.93778 1.56447,-2.12342 1.311085,-2.37681 -0.179111,-0.17911 -0.551699,0.0881 -1.135147,0.81414 -0.868622,1.08088 -1.573709,1.40204 -1.573709,0.7168 0,-0.20017 0.288512,-1.01633 0.641137,-1.81367 0.602531,-1.36243 0.745915,-1.49426 2.38125,-2.18929 0.957062,-0.40675 1.740113,-0.84075 1.740113,-0.96444 0,-0.38772 -1.14292,-0.23492 -2.354499,0.31478 -0.640131,0.29044 -1.221189,0.47075 -1.29124,0.4007 -0.400966,-0.40097 3.996164,-4.82357 5.022377,-5.05147 0.393346,-0.0873 1.031036,-0.40728 1.417086,-0.71095 l 0.70191,-0.55212 2.15479,0.5983 c 1.18513,0.32907 2.36445,0.65372 2.62071,0.72146 0.25625,0.0677 0.64016,0.46009 0.85311,0.8719 0.34765,0.67227 2.26362,2.44712 3.73576,3.46059 0.30628,0.21086 1.46581,1.07169 2.57673,1.91296 l 2.01986,1.52958 -1.17288,1.64542 c -0.64509,0.90498 -1.37176,1.924 -1.61483,2.26449 -0.44846,0.62821 -0.56214,0.63646 -2.63034,0.19095 -0.29104,-0.0627 -0.91612,-0.19619 -1.38906,-0.29665 -0.97559,-0.20722 -1.18614,0.21945 -0.33347,0.67578 0.51595,0.27613 1.32565,1.55968 1.32565,2.10144 0,0.1508 -0.41839,0.44899 -0.92976,0.66266 -0.91163,0.3809 -1.42645,1.05477 -1.07461,1.40661 0.0977,0.0977 0.38032,0.0363 0.628,-0.13639 0.24768,-0.17273 0.84822,-0.5147 1.33452,-0.75992 1.11288,-0.56118 1.24314,-0.9061 0.72246,-1.913 -0.22882,-0.44247 -0.41602,-0.86424 -0.41602,-0.93726 0,-0.073 0.5561,0.0346 1.23579,0.23914 0.67969,0.20456 1.32335,0.31781 1.43037,0.25167 0.26123,-0.16145 3.94842,-5.29871 3.94842,-5.50123 0,-0.0877 -1.16086,-1.02201 -2.57969,-2.07624 -1.41883,-1.05422 -2.63922,-1.98433 -2.71198,-2.06689 -0.0728,-0.0826 -0.75618,-0.60195 -1.51871,-1.15418 -0.76253,-0.55223 -1.57456,-1.40052 -1.8045,-1.88509 -0.44304,-0.93362 -0.88731,-1.17657 -3.42366,-1.87219 -2.68915,-0.73752 -3.20311,-0.75538 -4.06559,-0.14124 -0.43157,0.3073 -1.132147,0.62823 -1.556841,0.71317 -0.492183,0.0984 -1.387676,0.80261 -2.469662,1.94203 -2.419405,2.54782 -3.152701,3.64446 -3.152701,4.71485 0,0.9509 -0.695937,2.70936 -1.072268,2.70936 -0.329848,0 -0.595367,-2.22621 -0.451077,-3.782 0.41238,-4.44643 3.953509,-8.4815 8.768079,-9.9911 2.29054,-0.71819 6.12114,-0.69906 8.53625,0.0426 2.09307,0.6428 5.00988,2.47754 6.18634,3.89136 0.44648,0.53656 1.19268,1.74948 1.65823,2.69536 0.77264,1.56984 0.84653,1.94002 0.84743,4.24552 9.2e-4,2.38882 -0.0531,2.6353 -0.99751,4.54756 -1.73744,3.51814 -4.99148,5.91573 -9.09435,6.70074 -2.36925,0.45331 -3.60069,0.44982 -5.94264,-0.0169 z m 0.52957,-15.08008 c 0.30781,-0.65485 0.67505,-1.19063 0.81609,-1.19063 0.14104,0 0.43368,0.34276 0.65032,0.76169 0.4312,0.83384 1.15869,1.24475 1.53591,0.86752 0.14391,-0.14391 -0.17293,-0.68768 -0.79027,-1.35625 -1.07485,-1.16406 -2.03227,-1.37232 -2.4712,-0.53754 -0.66102,1.25715 -1.00981,2.20955 -0.88383,2.41339 0.28769,0.46549 0.59478,0.20806 1.14298,-0.95818 z m -9.347918,8.67651 c -0.143585,-0.37708 -0.113194,-0.40747 0.148113,-0.14811 0.180821,0.17947 0.262115,0.39297 0.180653,0.47443 -0.08146,0.0815 -0.229406,-0.0654 -0.328766,-0.32632 z",
        "m 104.66648,113.0017 c -0.16165,-0.28183 -0.5949,-0.81638 -0.96279,-1.18789 -0.78633,-0.79408 -1.5465,-1.96119 -1.79787,-2.76033 l -0.17885,-0.56859 -0.22519,0.46937 c -0.12385,0.25816 -0.15722,0.68459 -0.0742,0.94765 l 0.151,0.4783 -0.59182,-0.44154 c -0.72339,-0.5397 -1.841561,-2.46837 -2.010241,-3.46741 -0.1513,-0.896 -0.4551,-0.94549 -0.72808,-0.11861 l -0.20335,0.61597 -0.54585,-1.13719 c -0.34859,-0.72622 -0.59128,-1.7365 -0.6716,-2.79559 -0.0691,-0.91212 -0.22186,-1.6584 -0.3393,-1.6584 -0.11747,0 -0.44562,0.31248 -0.72928,0.69441 -0.28366,0.38191 -0.56064,0.5874 -0.61553,0.4566 -0.13829,-0.3296 0.0861,-2.30066 0.31426,-2.762019 0.15432,-0.31188 0.13059,-0.33707 -0.13384,-0.14214 -0.42291,0.31171 -1.29216,0.30229 -1.6264,-0.0176 -0.20638,-0.19754 -0.13277,-0.30276 0.32865,-0.46977 0.72417,-0.262101 0.73798,-0.552076 0.11698,-2.455347 -0.50823,-1.55762 -0.41036,-2.400131 0.35713,-3.073816 0.33233,-0.291741 0.33311,-0.350852 0.008,-0.565693 -0.20014,-0.131954 -0.36388,-0.437643 -0.36388,-0.679301 0,-0.418885 0.0305,-0.426704 0.6561,-0.167496 0.61167,0.253486 1.49114,0.370513 1.49114,0.198415 0,-0.0417 -0.37576,-0.374326 -0.83503,-0.73917 -0.45927,-0.364845 -0.83503,-0.752422 -0.83503,-0.861277 0,-0.108855 0.25908,-0.437219 0.57573,-0.729701 0.50097,-0.46272 0.74603,-0.531775 1.8872,-0.531775 1.02151,0 1.25701,-0.05238 1.06513,-0.236915 -0.13547,-0.13031 -0.39422,-0.236916 -0.57499,-0.236916 -0.55227,0 -0.36962,-0.309266 0.49046,-0.830404 0.93739,-0.567979 1.40662,-0.609736 2.369401,-0.210856 0.91463,0.378946 0.93519,0.368423 0.52157,-0.266985 -0.32072,-0.492693 -0.31931,-0.561941 0.0132,-0.66336 0.69481,-0.211802 1.03243,-0.114028 1.40871,0.407962 l 0.37572,0.521217 -0.0859,-0.602958 c -0.10192,-0.716219 0.1766,-0.813356 2.3319,-0.813356 2.15531,0 2.4338,0.09713 2.3319,0.813356 l -0.0857,0.602958 0.37571,-0.521217 c 0.37628,-0.52199 0.71391,-0.619764 1.4087,-0.407962 0.33271,0.101417 0.3341,0.170667 0.0133,0.66336 -0.41363,0.635408 -0.39307,0.645931 0.52157,0.266985 0.96276,-0.39888 1.432,-0.357123 2.36938,0.210856 0.97597,0.591362 1.01493,0.750267 0.22266,0.908235 -1.01707,0.202781 -0.6574,0.396 0.7372,0.396 1.15263,0 1.40717,0.0692 1.88816,0.513494 0.67332,0.621906 0.56429,1.114776 -0.38737,1.750896 -0.37794,0.252638 -0.68717,0.514279 -0.68717,0.581405 0,0.168567 1.48277,-0.09785 1.84902,-0.33221 0.22312,-0.142789 0.29824,-0.07146 0.29824,0.28297 0,0.260607 -0.16375,0.581796 -0.36389,0.71375 -0.3249,0.214204 -0.32523,0.27387 -0.002,0.556726 0.80933,0.710446 0.89591,1.394453 0.37968,3.000593 -0.63579,1.978168 -0.62359,2.273957 0.10467,2.537537 0.46142,0.16701 0.53503,0.27223 0.32866,0.46977 -0.33424,0.31993 -1.20349,0.32936 -1.62641,0.0176 -0.26442,-0.19493 -0.28816,-0.16974 -0.13383,0.14214 0.2283,0.461359 0.45256,2.432419 0.31424,2.762019 -0.0549,0.1308 -0.33184,-0.0746 -0.6155,-0.4566 -0.28367,-0.38193 -0.61184,-0.69441 -0.72929,-0.69441 -0.11747,0 -0.27013,0.74628 -0.33929,1.6584 -0.0804,1.05909 -0.32303,2.06937 -0.67162,2.79559 l -0.54586,1.13719 -0.20333,-0.61597 c -0.28075,-0.85039 -0.58354,-0.77049 -0.7672,0.20247 -0.19262,1.02038 -1.32779,2.94336 -2.03123,3.44087 l -0.52867,0.37392 0.1495,-0.47315 c 0.0823,-0.26021 0.0569,-0.67189 -0.0561,-0.91483 -0.18966,-0.40729 -0.2299,-0.37744 -0.51667,0.38352 -0.17101,0.45387 -0.70134,1.27676 -1.17846,1.82866 -0.47714,0.55188 -1.09098,1.29965 -1.36413,1.66171 l -0.49661,0.65829 z m 1.32755,-9.23272 c 0.15539,-0.36285 0.18484,-0.34693 0.30634,0.16556 l 0.13438,0.56699 0.50567,-0.40169 c 0.51525,-0.40932 1.67251,-2.85262 1.43898,-3.03813 -0.0706,-0.0561 -0.37395,0.0346 -0.67407,0.20162 -0.6897,0.38378 -1.24916,0.38622 -1.64515,0.007 -0.19298,-0.18471 -0.5133,-0.25591 -0.84964,-0.18884 -0.29696,0.0592 -0.61137,0.0157 -0.69873,-0.0965 -0.0998,-0.12827 -0.28765,-0.058 -0.50533,0.18883 -0.41536,0.47109 -0.97475,0.50028 -1.71327,0.0894 -0.30012,-0.167 -0.60347,-0.25773 -0.67408,-0.20165 -0.21915,0.1741 0.90837,2.61663 1.38133,2.99235 0.62682,0.49794 0.87597,0.44363 0.75829,-0.16531 -0.0926,-0.47884 -0.0774,-0.4904 0.18578,-0.14214 0.15757,0.20849 0.44993,0.52901 0.64968,0.71227 0.33717,0.30932 0.39423,0.31093 0.79557,0.0224 0.2378,-0.17095 0.50972,-0.49147 0.60425,-0.71228 z m -1.66625,-3.37223 c 0.35345,-0.26378 0.5522,-0.629769 0.5522,-1.016869 0,-0.626027 -0.83821,-1.682924 -1.19554,-1.507482 -0.11172,0.05485 -0.26348,0.02198 -0.3374,-0.07313 -0.19775,-0.254181 0.4687,-0.403801 1.73138,-0.388692 1.11667,0.01335 2.43534,0.302382 1.71022,0.374866 -0.19682,0.01961 -0.43222,0.02722 -0.52308,0.01695 -0.36403,-0.0415 -1.14699,1.007348 -1.14699,1.536378 0,1.207169 1.58553,1.808529 3.11344,1.180869 0.82543,-0.33908 0.87929,-0.711939 0.22583,-1.563359 -0.46398,-0.604536 -0.63053,-0.986633 -0.32387,-0.743022 0.0838,0.06655 0.46784,-0.08978 0.85335,-0.347473 0.78134,-0.522278 1.05164,-0.558371 2.01135,-0.268498 0.36428,0.110025 0.90905,0.150842 1.21062,0.0907 0.50411,-0.100555 0.52107,-0.143365 0.21039,-0.531727 -0.18584,-0.232324 -0.50678,-1.084366 -0.71321,-1.893445 -0.5961,-2.336481 -1.25063,-3.015336 -2.59162,-2.687898 l -0.53683,0.1311 0.54053,-0.465348 c 0.53714,-0.462421 0.53757,-0.467439 0.0691,-0.804134 -0.69399,-0.498921 -1.51097,-0.25045 -2.94914,0.896945 l -1.2394,0.988797 -1.24524,-0.989959 c -1.4447,-1.148555 -2.25054,-1.393808 -2.94329,-0.895783 -0.46832,0.336695 -0.4679,0.341713 0.0691,0.804134 l 0.5405,0.465348 -0.53681,-0.1311 c -1.341001,-0.327438 -1.995531,0.351417 -2.591621,2.687898 -0.20642,0.809079 -0.52735,1.661121 -0.71321,1.893445 -0.31069,0.388362 -0.29372,0.431224 0.21038,0.531727 0.30157,0.06009 0.84635,0.01921 1.21062,-0.0907 0.96545,-0.291598 1.229631,-0.254046 2.044461,0.290632 0.40375,0.269874 0.73407,0.426243 0.73407,0.347474 0,-0.07878 0.0596,-0.09604 0.13214,-0.03821 0.0727,0.05783 -0.0879,0.391778 -0.35698,0.742317 -0.65702,0.85613 -0.61729,1.234139 0.16519,1.571389 0.94828,0.40866 1.96827,0.36404 2.60906,-0.11416 z m -2.64145,-5.256251 c -0.84606,-0.08155 -1.2629,-0.229303 -1.52026,-0.538814 -0.347021,-0.417368 -0.334871,-0.426448 0.57149,-0.426448 0.66764,0 1.00919,0.105772 1.22404,0.379056 0.16389,0.208494 0.45812,0.379068 0.65384,0.379068 0.19573,0 0.35587,0.08525 0.35587,0.189534 0,0.104262 -0.0268,0.176129 -0.0596,0.159767 -0.0329,-0.01643 -0.58419,-0.08042 -1.22532,-0.142163 z m 5.3409,-0.05968 c 0,-0.08115 0.16014,-0.147412 0.35586,-0.147412 0.19571,0 0.48996,-0.170573 0.65385,-0.379067 0.21485,-0.273295 0.55638,-0.379057 1.22404,-0.379057 0.90649,0 0.91854,0.0082 0.57102,0.426438 -0.26672,0.320388 -0.65969,0.451324 -1.57989,0.526478 -0.67369,0.05505 -1.22488,0.03369 -1.22488,-0.04735 z m -8.716361,-5.050041 c -0.24797,-0.196987 -2.1397,-0.01124 -2.45761,0.241264 -0.3267,0.259537 -0.27867,0.278376 0.46527,0.182472 0.60442,-0.07792 0.9191,-0.02127 1.15937,0.208714 0.30307,0.290104 0.35372,0.280117 0.62551,-0.123325 0.16267,-0.241443 0.25601,-0.47055 0.20746,-0.509125 z m 15.446711,0.428143 c 0.68178,0.108318 0.73453,0.08968 0.424,-0.149752 -0.32556,-0.251005 -1.16204,-0.374152 -2.19861,-0.323671 -0.35241,0.01719 -0.37275,0.08921 -0.13989,0.495213 0.25498,0.444569 0.30029,0.45517 0.70418,0.164816 0.30836,-0.221701 0.65403,-0.27499 1.21032,-0.186606 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "#000000");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x - 6, y - 13));
    return wrapper;
  }

  /*
   * Virgo symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  virgo(x: number, y: number): Element {
    // center symbol
    const xShift = -100; // px
    const yShift = -135; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_VIRGO),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        // " 2.5894868,-2.5894868 1.7263245,2.5894868 0,9.4947847 m -2.5894868,-11.2211092 1.7263245,2.5894867 0,8.6316225 m 0.8631623,-9.4947847 2.5894867,-2.5894868 1.72632451,2.5894868 0,8.6316224 m -2.58948671,-10.3579469 1.72632447,2.5894867 0,7.7684602 m 0.86316224,-8.6316224 2.58948679,-2.5894868 1.7263244,2.5894868 0,13.8105959 m -2.5894867,-15.5369204 1.7263245,2.5894867 0,12.9474337 m 0.8631622,-13.8105959 2.5894868,-2.5894868 0.8631622,1.7263245 0.8631623,2.5894868 0,2.5894867 -0.8631623,2.58948673 -0.8631622,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -4.3158113,1.7263245 m 7.7684602,-15.5369204 0.8631623,0.8631622 0.8631622,2.5894868 0,2.5894867 -0.8631622,2.58948673 -0.8631623,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -3.452649,1.7263245",
        //"m 102.84383,159.63186 c -4.740236,-0.86025 -9.107864,-4.92584 -9.775217,-9.09923 -0.154167,-0.96411 -0.114492,-1.09307 0.336292,-1.09307 0.831397,0 2.09851,1.57301 3.090402,3.83646 0.563672,1.28627 1.105271,2.15308 1.38053,2.2095 0.346856,0.0711 0.418541,-0.0388 0.306024,-0.46906 -0.138652,-0.53021 -0.07626,-0.55252 1.106447,-0.39562 1.032232,0.13693 1.490372,0.0462 2.596542,-0.51436 0.73873,-0.37435 1.60713,-1.012 1.92978,-1.41701 0.54415,-0.68306 0.57548,-0.92465 0.43276,-3.33704 -0.22539,-3.80985 -1.2789,-5.81427 -3.48073,-6.62247 -0.50482,-0.18531 0.14204,-0.52601 1.65458,-0.87147 0.83623,-0.191 2.37824,-0.58071 3.42668,-0.86603 1.89298,-0.51514 1.92699,-0.51515 4.88206,-8.5e-4 3.76012,0.65441 4.82469,1.14218 4.93358,2.2605 0.0719,0.73801 -0.008,0.84155 -0.76067,0.99218 -0.4625,0.0925 -1.24657,0.16818 -1.74238,0.16818 -1.04132,0 -2.56684,0.57679 -2.90269,1.09749 -0.12691,0.19675 -0.23916,2.08413 -0.24946,4.19418 -0.0156,3.19515 -0.11453,4.12395 -0.5919,5.55625 -0.67162,2.01518 -0.7057,2.38125 -0.22167,2.38125 0.21604,0 0.61004,-0.81426 0.99219,-2.05052 0.5427,-1.75564 0.63386,-2.59082 0.63393,-5.80768 5e-5,-2.48742 0.10332,-3.86041 0.30558,-4.06267 0.16803,-0.16803 1.23956,-0.42387 2.38118,-0.56854 2.48129,-0.31444 2.79419,-0.45117 3.11911,-1.36301 0.19762,-0.55456 0.13747,-0.85238 -0.28838,-1.4278 -0.73138,-0.98827 -1.65723,-1.39544 -4.45841,-1.96071 -3.30434,-0.66681 -5.19471,-0.62287 -7.54145,0.17531 -1.06962,0.3638 -2.17876,0.66145 -2.46476,0.66145 -0.73304,0 -2.826907,1.0881 -2.826907,1.46904 0,0.1743 0.340564,0.38501 0.756808,0.46826 0.931549,0.18631 2.306159,1.31192 2.823229,2.31183 0.21232,0.41058 0.52967,1.88371 0.70522,3.27363 0.30312,2.39991 0.29197,2.56386 -0.22143,3.25687 -1.04886,1.41582 -2.16924,1.95523 -3.884529,1.87022 l -1.55462,-0.077 -0.724276,-1.59005 c -1.027378,-2.25547 -1.964673,-3.27655 -3.187116,-3.47203 -1.002641,-0.16033 -1.004798,-0.16341 -0.878489,-1.25604 0.296019,-2.56069 1.207924,-4.47774 3.063037,-6.43925 2.58006,-2.72803 5.832683,-4.04563 9.981333,-4.04333 5.45011,0.003 9.74347,2.51025 12.03854,7.03027 0.73259,1.4428 0.79375,1.77773 0.79375,4.34694 0,2.6177 -0.0524,2.89004 -0.87807,4.5673 -1.67912,3.41079 -5.16188,6.00446 -8.9758,6.68443 -2.48373,0.44281 -3.59055,0.4416 -6.06063,-0.007 z",
        "m 102.4366,139.82533 c -0.10161,-1.4748 -0.28253,-2.76805 -0.40555,-2.8989 -0.16786,-0.17855 -0.18132,-0.0656 -0.0551,0.46264 0.0918,0.38438 0.21634,1.59679 0.27669,2.69424 0.10391,1.88934 0.0896,1.99537 -0.2699,1.99537 -0.43149,0 -0.41213,0.16283 -0.4502,-3.78608 -0.0272,-2.82306 0.17857,-5.16369 0.2609,-2.96747 0.0331,0.88262 0.11863,0.49049 0.39629,-1.81656 l 0.3541,-2.94215 -0.45833,-1.45789 -0.45832,-1.45789 -0.0109,0.92094 c -0.006,0.50651 0.12033,1.18851 0.28067,1.51555 l 0.29152,0.59462 -2.512189,-0.12782 c -2.605733,-0.13258 -3.520252,-0.39366 -4.815633,-1.3748 l -0.568732,-0.43077 v 0.80544 c 0,0.443 -0.256971,1.6349 -0.571048,2.64866 -0.868249,2.80251 -0.87933,3.12075 -0.197814,5.68083 0.629961,2.36642 0.991432,3.17213 1.423134,3.17213 0.143332,0 0.368385,0.13814 0.500119,0.30697 0.205913,0.26392 0.134993,0.30676 -0.505538,0.30539 -0.846831,-0.002 -0.66962,0.27103 -2.308875,-3.5549 l -1.041544,-2.43091 0.213285,-1.25111 c 0.123851,-0.7265 0.481546,-1.72383 0.853039,-2.37845 0.351864,-0.62003 0.696726,-1.35756 0.76636,-1.63896 0.07935,-0.32066 -0.06843,-0.16789 -0.39594,0.40931 -0.287401,0.50652 -0.688508,1.11712 -0.891349,1.35691 -0.579389,0.6849 -0.927763,2.23827 -1.049667,4.68036 -0.127183,2.54784 0.07652,3.69034 0.807549,4.52938 0.590538,0.67779 0.605788,0.97914 0.04141,0.81826 -0.238093,-0.0679 -0.519986,-0.12466 -0.626428,-0.12619 -0.282413,-0.004 -0.629502,-0.97841 -0.766489,-2.15166 -0.06571,-0.56279 -0.296061,-1.85211 -0.511888,-2.86514 l -0.392412,-1.84188 0.422213,-1.33024 c 0.36379,-1.14617 0.415039,-1.6984 0.370362,-3.99074 -0.09195,-4.71821 -0.122127,-4.46751 0.688317,-5.71919 1.03037,-1.59134 1.244653,-1.75148 2.698115,-2.0163 1.114017,-0.20298 1.357881,-0.32882 1.781202,-0.91918 0.765732,-1.06787 1.70771,-1.47566 3.408729,-1.47566 1.594883,0 1.935943,0.20509 2.624123,1.57796 0.22195,0.44278 0.50914,0.67241 0.96199,0.76918 1.60213,0.34237 1.84847,0.51393 2.67471,1.86287 1.30496,2.13051 2.58991,2.97605 3.82604,2.51769 0.91483,-0.33923 1.90709,-2.26318 2.44064,-4.73233 0.12486,-0.57783 0.34445,-0.71966 0.55451,-0.35814 0.0654,0.11256 0.40622,0.20465 0.75739,0.20465 0.35116,0 0.74533,0.13694 0.87592,0.30432 0.13059,0.16737 0.75117,0.50356 1.37907,0.74709 1.09626,0.42518 1.65658,0.98483 1.41032,1.40866 -0.0641,0.11023 -0.63651,0.20042 -1.27213,0.20042 -0.63563,0 -1.32154,0.0944 -1.52425,0.20981 -0.20271,0.1154 -0.65838,0.87703 -1.01259,1.69251 -0.76446,1.75997 -1.6335,2.87218 -2.7119,3.47074 -0.67206,0.37302 -1.12577,0.4389 -3.08803,0.44841 l -2.30023,0.0111 -0.42702,0.67261 c -0.23486,0.36993 -0.51432,1.10668 -0.62102,1.63722 -0.38792,1.92879 -0.64524,5.4737 -0.51509,7.0959 0.11791,1.46963 0.19622,1.71664 0.73247,2.31066 l 0.60044,0.66513 h -0.87605 -0.87604 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "#000000");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /*
   * Libra symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  libra(x: number, y: number): Element {
    // center symbol
    const xShift = -100; // px
    const yShift = -130; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_LIBRA),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        // " c 0.7519,1e-5 1.3924,0.12227 1.9316,0.35156 0.6619,0.28495 1.2134,0.63854 1.666,1.0625 0.4838,0.45481 0.853,0.97255 1.1172,1.56641 0.2467,0.56612 0.3711,1.17397 0.3711,1.83789 0,0.64113 -0.1244,1.23948 -0.373,1.80859 -0.1624,0.36305 -0.3631,0.69725 -0.6055,1.00586 l -0.6367,0.8086 4.3789,0 0,0.67187 -5.4024,0 0,-0.91797 c 0.2173,-0.1385 0.4379,-0.27244 0.6367,-0.44726 0.4215,-0.36876 0.7529,-0.82784 0.9883,-1.35547 0.2215,-0.50074 0.334,-1.0358 0.334,-1.58594 0,-0.55653 -0.1122,-1.09434 -0.334,-1.5957 l -0,-0.002 0,-0.004 c -0.2292,-0.49901 -0.5581,-0.94778 -0.9746,-1.33789 l -0,-0.002 -0,-0.002 c -0.3967,-0.36155 -0.8679,-0.65723 -1.4062,-0.88476 l -0,0 c -0.4984,-0.20903 -1.0622,-0.30663 -1.6817,-0.30664 -0.5926,1e-5 -1.1526,0.10008 -1.6699,0.30273 l -0,0 c -0.5261,0.20799 -1.0032,0.5067 -1.4199,0.88867 l -0,0.002 -0,0.002 c -0.4166,0.39011 -0.7454,0.83887 -0.9746,1.33789 l 0,0.004 -0,0.002 c -0.2218,0.50136 -0.334,1.03915 -0.334,1.5957 0,0.55015 0.1125,1.08519 0.334,1.58594 l 0,0.002 0,0.004 c 0.229,0.49855 0.5574,0.94911 0.9746,1.33984 0.1876,0.17482 0.4143,0.31484 0.6367,0.45703 l 0,0.91797 -5.3906,0 0,-0.67187 4.3789,0 -0.6367,-0.8086 c -0.2428,-0.30904 -0.443,-0.64418 -0.6055,-1.00781 -0.2487,-0.56911 -0.3731,-1.16552 -0.3731,-1.80664 0,-0.66391 0.1244,-1.27178 0.3711,-1.83789 l 0,-0.002 c 3e-4,-5.8e-4 -2e-4,-10e-4 0,-0.002 0.2641,-0.59218 0.6326,-1.10871 1.1153,-1.5625 0.4847,-0.45571 1.0332,-0.80585 1.6562,-1.05859 0.5861,-0.23488 1.2294,-0.35546 1.9414,-0.35547 z m -7.8496,13.45899 15.6992,0 0,0.67187 -15.6992,0 z",
        //"m 101.56041,159.64309 c -1.868819,-0.51943 -3.083217,-1.00002 -3.931658,-1.55594 -0.632631,-0.41452 -0.708376,-0.59558 -0.553363,-1.32278 0.20894,-0.98019 1.726152,-5.41895 2.342521,-6.85329 0.232492,-0.54103 0.422713,-1.40898 0.422713,-1.92877 0,-0.98647 -0.728206,-2.67274 -1.478001,-3.42254 -0.240393,-0.24039 -0.393139,-0.47597 -0.339434,-0.52352 0.0537,-0.0475 0.752487,0.0148 1.552852,0.13849 3.69531,0.57115 4.23333,0.5943 4.23333,0.18216 0,-0.21681 -0.35793,-0.88831 -0.79541,-1.49223 l -0.79541,-1.09803 h 1.01567 c 0.88355,0 1.09886,0.12906 1.6553,0.99219 0.87639,1.35941 2.99272,2.30643 8.18027,3.6605 2.3594,0.61585 3.67526,2.07466 2.4474,2.71325 -0.25467,0.13245 -1.29646,0.38014 -2.31511,0.55043 -3.69903,0.61837 -7.48446,1.63719 -7.93573,2.13585 -0.5556,0.61393 -2.04805,6.39587 -1.7324,6.71152 0.39889,0.3989 0.75251,-0.0604 0.93997,-1.22085 0.34585,-2.14092 1.18909,-4.82878 1.61325,-5.14229 0.41779,-0.30879 1.52887,-0.58105 6.85033,-1.67862 1.4552,-0.30014 2.91372,-0.72124 3.24114,-0.93578 0.72539,-0.47529 0.75825,-1.29806 0.0952,-2.3853 -0.42237,-0.69265 -0.79423,-0.88834 -2.4464,-1.2874 -2.38673,-0.57649 -6.65865,-2.07969 -7.5268,-2.64852 -0.78662,-0.51542 -0.82206,-1.22351 -0.0843,-1.68425 0.70485,-0.44019 0.90145,-0.25184 0.4656,0.44606 -0.18647,0.29859 -0.25498,0.62696 -0.15224,0.7297 0.31253,0.31253 1.24837,-0.73276 1.24837,-1.39437 0,-0.54592 -0.12525,-0.62045 -1.04272,-0.62045 -0.57349,0 -1.11642,0.11926 -1.20651,0.26503 -0.0983,0.15899 -0.73654,0.19771 -1.59535,0.0968 -1.10728,-0.13014 -1.58574,-0.0672 -2.11224,0.27775 l -0.68067,0.44599 0.84247,1.06371 0.84247,1.06371 -0.89716,-0.1515 c -3.329238,-0.5622 -4.307499,-0.64368 -4.768107,-0.39717 -0.272074,0.14561 -0.49468,0.33654 -0.49468,0.42428 0,0.0877 0.46885,0.66818 1.041888,1.28986 0.635309,0.68923 1.113634,1.51275 1.225741,2.11033 0.188759,1.00618 0.114956,1.31433 -1.075685,4.49145 -0.381743,1.01864 -0.944679,2.65933 -1.250968,3.64596 l -0.556889,1.79389 -0.768226,-0.73555 c -1.107796,-1.06068 -2.436975,-3.17762 -2.94178,-4.68529 -0.541078,-1.616 -0.560536,-4.61865 -0.04103,-6.33101 1.011689,-3.33466 3.588789,-5.93323 7.435492,-7.49746 1.664941,-0.67704 2.118921,-0.74263 5.139871,-0.74263 3.03123,0 3.47381,0.0645 5.19337,0.75673 6.14033,2.4719 9.15547,8.26987 7.24286,13.92765 -1.10801,3.27767 -4.09823,6.16147 -7.68006,7.40673 -2.15951,0.75077 -6.12839,0.95515 -8.0698,0.41555 z m 12.56771,-1.73687 c 0,-0.14552 0.12609,-0.26458 0.2802,-0.26458 0.15411,0 0.20661,0.11906 0.11668,0.26458 -0.0899,0.14553 -0.21603,0.26459 -0.2802,0.26459 -0.0642,0 -0.11668,-0.11906 -0.11668,-0.26459 z",
        "m 100.74642,139.91108 c -0.13005,-0.1945 -0.38449,-0.7955 -0.56542,-1.33557 -0.18093,-0.54007 -0.454034,-1.15457 -0.606892,-1.36555 -0.247445,-0.34154 -0.942814,-3.17328 -0.934372,-3.80503 0.0018,-0.13538 0.176391,0.23522 0.38796,0.82356 0.21157,0.58834 0.596063,1.36398 0.854431,1.72364 0.258373,0.35967 0.469763,0.79729 0.469763,0.9725 0,0.1752 0.13112,0.5686 0.29137,0.87422 0.28585,0.5451 0.64432,1.7907 0.64432,2.23882 0,0.33836 -0.27296,0.27451 -0.54116,-0.12659 z m 0.62197,-0.53932 c -0.12616,-1.06516 0.0583,-1.55039 0.99178,-2.60894 0.84124,-0.95396 1.05,-0.81624 1.17958,0.77812 0.0569,0.69961 0.14063,1.46225 0.18615,1.69475 0.0719,0.36704 0.0143,0.45036 -0.43702,0.63237 -0.28588,0.1153 -0.81057,0.25652 -1.16599,0.31382 l -0.6462,0.10419 z m -1.424265,0.62317 c -0.09561,-0.0618 -0.22259,-0.52487 -0.282176,-1.02916 -0.05959,-0.50429 -0.142608,-1.05443 -0.184494,-1.22252 -0.167721,-0.67311 0.281485,0.25583 0.634715,1.31255 0.33702,1.00825 0.29579,1.23869 -0.168045,0.93913 z m 4.255475,-2.3663 c -0.15123,-0.86149 -0.28673,-1.9199 -0.3011,-2.35201 -0.0415,-1.2481 0.57456,-1.71072 1.02886,-0.7726 1.0915,2.25396 1.20824,2.59911 1.03947,3.0735 -0.15137,0.42552 -1.18451,1.61747 -1.40196,1.61747 -0.0497,0 -0.21403,-0.70486 -0.36527,-1.56636 z m 4.17527,-0.28074 c -0.0576,-0.0914 -0.23327,-0.1332 -0.39031,-0.093 -0.3454,0.0885 -0.90533,-1.16815 -3.18691,-7.15246 -0.83316,-2.18526 -1.82806,-4.7207 -2.21089,-5.63432 -0.42644,-1.0177 -0.68012,-1.84639 -0.65493,-2.13942 0.0417,-0.48559 -0.23178,-1.16263 -0.40223,-0.99561 -0.0513,0.0503 -0.11951,0.45178 -0.15159,0.89225 -0.0321,0.44047 -0.12981,0.8709 -0.21717,0.95651 -0.10783,0.10567 -0.13693,-0.15676 -0.0906,-0.81711 0.051,-0.72756 0.0293,-0.8861 -0.0861,-0.62894 -0.22918,0.51054 -0.29069,0.42043 -0.20863,-0.30563 0.0498,-0.44056 -0.0309,-0.90752 -0.25081,-1.45175 -0.17831,-0.44125 -0.25919,-0.80228 -0.17973,-0.80228 0.0795,0 0.19162,0.0748 0.24925,0.16613 0.0576,0.0914 0.23397,0.13302 0.39188,0.0926 0.24689,-0.0633 0.27405,-0.006 0.19392,0.40693 -0.0512,0.26427 -0.0504,0.44275 0.002,0.39662 0.093,-0.0821 0.1774,-0.51524 0.40065,-2.05554 0.1337,-0.92245 0.35116,-1.27967 1.07485,-1.76558 0.48146,-0.32327 0.72853,-0.37021 1.96863,-0.37399 0.77994,-0.002 1.50579,0.0212 1.61301,0.0525 0.52706,0.15355 -0.0246,1.85038 -1.04205,3.20512 -0.36713,0.48884 -0.76556,0.77837 -1.53925,1.11852 -0.57414,0.25243 -1.16684,0.56799 -1.31712,0.70125 -0.29664,0.26306 -0.38159,0.73704 -0.10171,0.56754 0.11548,-0.0699 0.11135,0.006 -0.0126,0.2333 -0.25356,0.46426 -0.0962,0.55515 0.29598,0.1709 0.38447,-0.37674 0.44019,-0.23805 0.0668,0.16625 -0.36103,0.39092 -0.0306,0.34906 0.5082,-0.0644 l 0.44811,-0.34384 -0.34183,0.47202 c -0.188,0.25961 -0.4496,0.55966 -0.58131,0.66678 -0.36151,0.294 -0.15,0.45364 0.50069,0.37791 0.32008,-0.0373 0.4938,-0.0269 0.38605,0.0231 -0.10775,0.05 -0.15937,0.14879 -0.1147,0.21961 0.0447,0.0708 -0.0602,0.17273 -0.23295,0.22647 -0.4979,0.15485 -0.36545,0.38274 0.22245,0.38274 0.29514,0 0.57999,0.0688 0.633,0.15282 0.053,0.084 -0.044,0.15281 -0.21551,0.15281 -0.17155,0 -0.3527,0.0647 -0.40258,0.14376 -0.0535,0.0848 0.1506,0.11274 0.49764,0.0681 l 0.5883,-0.0757 -0.46785,0.27286 -0.46784,0.27286 0.62379,0.0958 c 0.40855,0.0627 0.4861,0.10328 0.22474,0.11748 -0.21947,0.0119 -0.52577,0.11248 -0.68065,0.22346 -0.25622,0.18359 -0.21674,0.22604 0.43804,0.47108 0.80646,0.3018 0.90742,0.49766 0.32977,0.63973 -0.51794,0.12738 -0.49844,0.36838 0.0298,0.36838 0.38439,0 0.39616,0.0169 0.14005,0.20036 -0.24579,0.17612 -0.21097,0.1925 0.28783,0.13544 l 0.56745,-0.0649 -0.47358,0.46407 c -0.63705,0.62424 -0.59732,0.79207 0.1892,0.79933 l 0.66278,0.006 -0.42886,0.22799 c -0.57569,0.30604 -0.54042,0.36728 0.15595,0.2708 l 0.58481,-0.081 -0.46785,0.33431 -0.46784,0.33431 0.54582,-0.0861 0.54582,-0.0861 -0.59005,0.30711 c -0.66646,0.34688 -0.63662,0.60017 0.0707,0.60017 h 0.47592 l -0.36816,0.30055 c -0.44314,0.36175 -0.28872,0.39684 0.34135,0.0776 0.54445,-0.27589 0.55809,-0.23736 0.14879,0.42047 -0.17123,0.27519 -0.31158,0.62814 -0.3119,0.78434 -4.8e-4,0.23215 0.0761,0.26513 0.41964,0.18064 l 0.42023,-0.10335 -0.38124,0.32402 -0.38124,0.32401 0.58481,-0.0537 c 0.65908,-0.0606 0.69079,-0.0247 0.32672,0.36952 -0.28083,0.30407 -0.0769,0.39375 0.2243,0.0986 0.1015,-0.0994 0.22484,-0.14134 0.27409,-0.0931 0.0493,0.0483 -0.12502,0.23747 -0.38727,0.42046 -0.60579,0.42269 -0.60948,0.63588 -0.009,0.51819 0.25732,-0.0504 0.46785,-0.0451 0.46785,0.0118 0,0.0569 -0.21053,0.17538 -0.46785,0.26328 -0.80789,0.27597 -0.58589,0.58677 0.42886,0.60042 l 0.89671,0.0121 -0.66279,0.22989 c -0.36453,0.12644 -0.66278,0.29562 -0.66278,0.37594 0,0.0803 0.5068,0.38405 1.12623,0.67494 1.11456,0.5234 1.12003,0.52888 0.52789,0.52888 h -0.59835 l 0.25546,0.38204 c 0.1405,0.21012 0.1878,0.38204 0.10511,0.38204 -0.0827,0 -0.19749,-0.0748 -0.25512,-0.16613 z m -6.10964,-16.89662 c -0.10558,-0.0419 -0.31611,-0.0444 -0.46785,-0.006 -0.15173,0.0387 -0.0653,0.073 0.19197,0.0761 0.25732,0.003 0.38147,-0.0286 0.27588,-0.0705 z m 1.49802,-0.42472 c 0.23806,-0.12063 0.69754,-0.50645 1.02107,-0.85736 0.58507,-0.63459 1.38179,-2.0917 1.25426,-2.2939 -0.0367,-0.0583 -0.61944,-0.19017 -1.29488,-0.29313 -1.30917,-0.19957 -1.84989,-0.0766 -2.37163,0.53945 -0.1201,0.14181 0.0605,0.0718 0.40123,-0.15556 0.4883,-0.3258 0.73526,-0.39485 1.16542,-0.32584 0.3002,0.0482 0.72126,0.0884 0.93569,0.0894 0.32942,0.002 0.2861,0.0521 -0.27939,0.32643 -0.76552,0.37131 -0.7664,0.55553 -0.001,0.30788 0.48862,-0.15819 0.47117,-0.12734 -0.34292,0.60646 l -0.85772,0.77313 0.49859,-0.0616 c 0.63201,-0.0781 0.54673,0.0594 -0.25714,0.4146 -0.75263,0.33257 -0.83748,0.57479 -0.13189,0.37649 0.45188,-0.12699 0.47634,-0.11772 0.25685,0.0974 -0.13343,0.13075 -0.51608,0.33323 -0.85033,0.44995 l -0.60773,0.21223 0.51458,0.007 c 0.28302,0.004 0.70936,-0.092 0.94742,-0.21262 z m -2.70635,17.03417 c -0.40258,-0.6383 -0.4023,-3.67271 3.4e-4,-3.67271 0.25829,0 1.47794,1.56405 1.47794,1.89528 0,0.31693 -0.925,1.73556 -1.19877,1.83851 -0.10713,0.0403 -0.23291,0.0128 -0.27951,-0.0611 z m 4.99611,-1.06153 c -0.15244,-0.28684 -0.40193,-0.87684 -0.5544,-1.31111 -0.26632,-0.75852 -0.26619,-0.79633 0.003,-0.96122 0.31226,-0.1911 0.29214,-0.22055 0.78083,1.14294 0.1898,0.52958 0.24512,0.93685 0.16605,1.22253 l -0.11857,0.42839 z m -6.558306,-1.28106 c -0.349409,-0.69277 -0.596509,-1.43949 -0.652609,-1.97213 l -0.09029,-0.85721 0.683078,-0.41494 c 0.375693,-0.22822 0.876064,-0.59143 1.111934,-0.80714 l 0.42886,-0.39219 v 0.9493 c 0,0.55756 -0.1287,1.30813 -0.31189,1.81887 -0.18468,0.51489 -0.3119,1.26131 -0.3119,1.82997 0,0.52822 -0.0663,0.96039 -0.14743,0.96039 -0.0811,0 -0.400479,-0.50171 -0.709756,-1.11492 z m 2.696586,-1.02972 -0.71957,-0.92075 0.0336,-1.36656 c 0.0185,-0.75161 0.0806,-1.41265 0.13808,-1.46898 0.2131,-0.20882 0.55799,0.28551 0.73719,1.05661 0.10158,0.43709 0.32255,1.3716 0.49106,2.07668 0.17004,0.71148 0.24694,1.34022 0.1728,1.41286 -0.0741,0.0726 -0.45378,-0.27886 -0.85313,-0.78986 z m 1.20601,-0.5016 c -0.29875,-0.44679 -0.81692,-2.95035 -0.64542,-3.1184 0.0664,-0.0651 0.21469,0.008 0.32958,0.16166 0.35313,0.47322 1.1992,2.663 1.14178,2.95514 -0.0825,0.41957 -0.54586,0.42047 -0.82594,0.002 z m 0.77233,-1.5385 c -0.80573,-1.55916 -1.12074,-2.99758 -0.65648,-2.99758 0.3136,0 1.67316,3.16259 1.67316,3.89208 0,0.29676 -0.062,0.53956 -0.1378,0.53956 -0.0758,0 -0.47129,-0.64532 -0.87888,-1.43406 z m -5.9083,-0.0177 c -0.159055,-0.67239 -0.326007,-1.28473 -0.371005,-1.36075 -0.045,-0.076 -0.0062,-0.0924 0.08631,-0.0364 0.269277,0.16307 0.685439,1.56747 0.627219,2.11663 -0.04334,0.40879 -0.107515,0.27398 -0.34252,-0.71948 z m -7.431428,0.30998 c -0.219427,-0.11695 -0.47315,-0.37207 -0.563829,-0.56694 -0.162639,-0.34951 -0.151963,-0.35431 0.788832,-0.35447 0.524536,-9e-5 1.304588,-0.0581 1.733448,-0.12896 l 0.779746,-0.12878 -0.617751,0.42382 c -0.727233,0.49894 -0.479879,0.69065 0.305352,0.23666 0.52382,-0.30285 0.534365,-0.30326 0.349723,-0.0135 -0.436442,0.68481 -1.946067,0.97429 -2.775521,0.53221 z m 7.645028,-1.12518 c -0.429302,-0.79643 -0.233803,-0.75658 -2.590328,-0.52806 l -1.270328,0.12318 0.280399,-0.38326 c 0.403995,-0.5522 0.930408,-0.97099 1.582184,-1.25873 0.542702,-0.23958 0.582486,-0.23738 0.844862,0.0467 0.212076,0.22963 0.394752,0.27618 0.795035,0.2026 0.76279,-0.14022 0.641006,0.15262 -0.221066,0.53158 -0.537765,0.23639 -0.612552,0.30117 -0.272911,0.23639 0.257316,-0.0491 0.71227,-0.23692 1.011008,-0.41742 0.298738,-0.1805 0.702589,-0.30771 0.897446,-0.28269 0.226178,0.0291 0.518369,-0.11529 0.808059,-0.39916 0.45019,-0.44114 0.4543,-0.44193 0.52094,-0.10034 0.12777,0.65496 -0.68457,2.02362 -1.56621,2.63878 l -0.434784,0.30337 z m -1.697047,-0.95158 c 0.135712,-0.0697 0.337292,-0.23363 0.447955,-0.36429 0.171407,-0.20239 0.151418,-0.23757 -0.134972,-0.23757 -0.344938,0 -1.885301,0.69979 -1.885301,0.85649 0,0.11308 1.250744,-0.0895 1.572318,-0.25463 z m -6.757628,0.83889 c -0.538231,-0.28613 -0.567388,-0.86528 -0.08885,-1.76492 0.187004,-0.35156 0.347165,-0.79944 0.355914,-0.99529 0.0087,-0.19585 0.109956,-0.44326 0.224905,-0.54982 0.173747,-0.16105 0.178838,-0.13627 0.03018,0.14697 -0.09835,0.18738 -0.136339,0.50653 -0.08443,0.7092 0.05191,0.20268 0.01852,0.41445 -0.0742,0.4706 -0.209735,0.12702 -0.221258,0.38969 -0.01709,0.38969 0.2325,0 0.454194,-0.97164 0.251526,-1.10238 -0.114114,-0.0736 -0.08522,-0.19129 0.08885,-0.36192 0.347185,-0.3403 0.62638,-0.14453 0.499628,0.35035 -0.07101,0.27725 -0.04787,0.36311 0.0774,0.28724 0.244843,-0.14828 0.225297,-0.77893 -0.03059,-0.98703 -0.115107,-0.0936 -0.239262,-0.15361 -0.275901,-0.13333 -0.03664,0.0203 0.08185,-0.11083 0.263308,-0.29138 0.447531,-0.44526 1.583696,-3.01745 2.112135,-4.78169 0.512067,-1.70959 0.842189,-2.20722 1.507456,-2.27237 0.578686,-0.0567 0.917881,0.35551 1.031545,1.2535 0.08311,0.65662 -0.337897,1.92619 -0.535076,1.61356 -0.199258,-0.31593 -0.408756,-0.0402 -0.927518,1.22091 -0.275565,0.66987 -0.599643,1.29815 -0.720175,1.39617 -0.2785,0.22649 -0.272053,0.0212 0.01477,-0.47046 0.308441,-0.52872 0.297222,-0.95144 -0.02362,-0.88989 -0.238244,0.0457 -1.295881,1.69732 -1.30009,2.03024 -0.001,0.0809 0.205819,-0.0911 0.45965,-0.38204 0.563343,-0.64583 0.622262,-0.34437 0.08431,0.43139 -0.21443,0.30922 -0.389873,0.70975 -0.389873,0.89007 0,0.18032 -0.118405,0.42223 -0.263122,0.53759 -0.230418,0.18366 -0.25041,0.17649 -0.160844,-0.0577 0.05625,-0.14708 0.0409,-0.26743 -0.03412,-0.26743 -0.07502,0 -0.246616,0.31698 -0.381329,0.7044 -0.250175,0.71947 -0.14204,1.2822 0.246388,1.2822 0.315659,0 1.518949,-0.76628 1.687286,-1.0745 0.179569,-0.32878 -0.0016,-0.82491 -0.351717,-0.96312 -0.111655,-0.0441 -0.12288,-0.0829 -0.02596,-0.0897 0.349429,-0.0247 0.709379,0.56562 0.658935,1.08064 -0.04285,0.4375 -0.190201,0.59978 -1.03617,1.14115 -0.977317,0.62542 -1.613684,1.14286 -1.119099,0.90995 0.128658,-0.0606 0.0977,-0.002 -0.06879,0.1304 -0.298126,0.2369 -0.297816,0.24055 0.02042,0.24055 0.177726,0 0.789246,-0.17191 1.358934,-0.38204 1.037025,-0.38249 1.85232,-0.5097 1.566702,-0.24445 -0.253678,0.23559 -3.166105,1.08526 -3.69786,1.07882 -0.277734,-0.003 -0.697957,-0.10871 -0.933831,-0.2341 z m 11.930115,-1.39848 c -0.4176,-0.0508 -0.50684,-0.1279 -0.50684,-0.43801 0,-0.57006 0.36872,-2.35494 0.48648,-2.35494 0.0569,0 0.22302,0.29226 0.36916,0.64947 0.30254,0.73952 0.50581,2.2664 0.29681,2.22957 -0.0763,-0.0135 -0.36685,-0.0522 -0.64561,-0.0861 z m -6.588856,-0.39136 c 0,-0.10795 0.228076,-0.32456 0.506835,-0.48135 l 0.506835,-0.28507 -0.458037,0.48135 c -0.514498,0.54068 -0.555633,0.56178 -0.555633,0.28507 z m 4.210754,0.0106 c 6.9e-4,-0.23655 0.604712,-1.51389 0.714022,-1.50997 0.22668,0.008 0.2645,0.77309 0.0507,1.02553 -0.1794,0.21182 -0.765008,0.5828 -0.764722,0.48444 z m -7.797584,-0.41315 c 0,-0.16802 0.224215,-0.42896 0.525242,-0.61127 1.037093,-0.62808 1.45229,-0.20837 0.498832,0.50426 -0.634118,0.47394 -1.024074,0.51469 -1.024074,0.10701 z m 2.507498,0.0512 c 0.0075,-0.17803 0.04444,-0.21424 0.09422,-0.0923 0.04505,0.11031 0.03951,0.24212 -0.01231,0.2929 -0.05182,0.0508 -0.08868,-0.0395 -0.08191,-0.20057 z m 4.510214,-0.0331 c 0,-0.19244 0.353279,-0.48901 0.582498,-0.48901 0.159896,0 0.169481,0.0709 0.0413,0.30563 -0.161508,0.29571 -0.623796,0.43161 -0.623796,0.18338 z m -1.311574,-0.27916 c -0.140357,-0.35841 0.187414,-0.6683 0.706872,-0.6683 0.328166,0 0.448753,0.0739 0.448753,0.27507 0,0.58969 -0.951851,0.91358 -1.155625,0.39323 z m -2.431206,-0.026 c 0,-0.067 0.283577,-0.39314 0.630172,-0.72478 0.506662,-0.4848 0.657471,-0.5597 0.769456,-0.38214 0.182135,0.28878 0.09811,0.40255 -0.629892,0.85288 -0.654236,0.4047 -0.769736,0.44282 -0.769736,0.25404 z m 1.637466,-0.33664 c 0.05301,-0.0841 0.166559,-0.15282 0.252331,-0.15282 0.08577,0 0.112577,0.0688 0.05957,0.15282 -0.05301,0.084 -0.166559,0.15282 -0.252331,0.15282 -0.08577,0 -0.112577,-0.0688 -0.05957,-0.15282 z m 5.999298,-0.85447 c -0.24487,-0.72102 -0.30074,-1.09807 -0.19661,-1.32674 0.1267,-0.27823 0.19938,-0.18749 0.56328,0.70326 0.46679,1.14258 0.52564,1.63077 0.19661,1.63077 -0.13401,0 -0.35605,-0.39708 -0.56328,-1.00729 z m -8.260561,0.71108 c 0,-0.20378 1.263828,-1.57261 1.362609,-1.47581 0.03818,0.0374 0.0241,0.20791 -0.03128,0.3789 -0.11446,0.35339 -1.331325,1.35599 -1.331325,1.09691 z m 6.549861,-0.26316 c 0,-0.83938 0.19491,-1.88568 0.35127,-1.88568 0.21527,0 0.0688,1.94176 -0.16369,2.16955 -0.14613,0.1432 -0.18758,0.0805 -0.18758,-0.28387 z m -2.079318,-9.6e-4 c -0.193218,-0.18933 -0.105596,-0.61338 0.178871,-0.86565 0.218177,-0.19348 0.325134,-0.20937 0.467848,-0.0695 0.252102,0.24704 0.232249,0.51049 -0.06005,0.79692 -0.265415,0.26008 -0.424167,0.2975 -0.586666,0.13826 z m -4.626492,-0.19473 c 0,-0.0791 0.06937,-0.18581 0.154163,-0.23716 0.0884,-0.0535 0.114546,0.008 0.06129,0.14379 -0.103674,0.26474 -0.215453,0.31318 -0.215453,0.0934 z m 6.44065,-0.62028 c 0,-0.46227 0.0292,-0.65138 0.065,-0.42025 0.0357,0.23114 0.0357,0.60936 0,0.84049 -0.0357,0.23113 -0.065,0.042 -0.065,-0.42024 z m -3.889068,0.38204 c -0.04937,-0.12608 -0.04339,-0.34764 0.01328,-0.49237 0.08827,-0.22542 0.12386,-0.2309 0.24822,-0.0382 0.195115,0.30233 0.188555,0.7598 -0.0109,0.7598 -0.08846,0 -0.201237,-0.10315 -0.250608,-0.22922 z m 0.59534,-0.42025 c -0.167353,-0.607 -0.163606,-0.61224 0.347646,-0.48651 0.512683,0.12609 0.847743,0.65463 0.537224,0.84744 -0.433481,0.26917 -0.746333,0.14156 -0.88487,-0.36093 z m -3.447768,-0.0382 c 0,-0.0841 0.100292,-0.32473 0.222871,-0.53485 0.12258,-0.21013 0.222872,-0.31328 0.222872,-0.22923 0,0.0841 -0.100292,0.32473 -0.222872,0.53486 -0.122579,0.21012 -0.222871,0.31327 -0.222871,0.22922 z m 5.853301,-0.40567 c -0.173355,-0.24252 -0.193359,-0.40614 -0.07594,-0.62112 0.220847,-0.40437 0.605507,-0.08 0.605507,0.51065 0,0.52232 -0.20466,0.56501 -0.529565,0.11047 z m -4.772709,0.0924 c 0,-0.18947 0.496735,-1.00834 0.56882,-0.93771 0.08368,0.082 -0.371452,1.02171 -0.49485,1.02171 -0.04068,0 -0.07397,-0.0378 -0.07397,-0.084 z m 0.876191,-0.30598 c -0.05108,-0.13044 -0.02745,-0.19754 0.0525,-0.14912 0.07996,0.0484 0.331442,-0.22307 0.558854,-0.60332 0.227412,-0.38025 0.42997,-0.69137 0.450128,-0.69137 0.02016,0 0.02822,0.24899 0.01791,0.55332 -0.02608,0.77011 -0.857831,1.45629 -1.079402,0.89049 z m 2.427117,-0.14488 c -0.144817,-0.31145 -0.136048,-0.38204 0.04745,-0.38204 0.196967,0 0.547966,0.43405 0.547966,0.67763 0,0.25263 -0.442704,0.0328 -0.595421,-0.29559 z m -0.736559,-0.3922 c -0.05654,-0.0896 -0.06935,-0.19576 -0.02847,-0.23582 0.04088,-0.0401 0.115881,0.0333 0.166671,0.16299 0.10545,0.26927 0.01557,0.31664 -0.138201,0.0728 z m 4.081405,-0.33367 c -0.0517,-0.18911 -0.0913,-0.65329 -0.088,-1.03151 l 0.006,-0.68766 0.31753,0.80977 c 0.30443,0.7764 0.30489,1.25323 0.001,1.25323 -0.0785,0 -0.18497,-0.15472 -0.23669,-0.34383 z m -0.87804,-0.47861 c 0,-0.29417 0.0702,-0.57736 0.15595,-0.6293 0.0926,-0.0561 0.15595,0.12275 0.15595,0.44041 0,0.29417 -0.0702,0.57735 -0.15595,0.62929 -0.0926,0.0561 -0.15595,-0.12275 -0.15595,-0.4404 z m -4.674132,0.27602 c 0.0064,-0.20863 0.931357,-1.37137 0.931357,-1.17079 0,0.0941 -0.07132,0.21422 -0.158493,0.26701 -0.08717,0.0528 -0.124423,0.15 -0.08278,0.21603 0.04164,0.066 -0.09757,0.27956 -0.309355,0.47452 -0.211786,0.19497 -0.383114,0.29092 -0.380728,0.21323 z m 2.02345,-0.77029 c -0.343335,-0.30395 -0.624246,-0.64778 -0.624246,-0.76408 0,-0.11629 -0.106447,-0.21144 -0.23655,-0.21144 -0.19052,0 -0.160214,-0.14761 0.155738,-0.75859 0.374662,-0.7245 0.764057,-1.07519 1.193854,-1.07519 0.108818,0 -0.06201,0.26077 -0.379621,0.5795 -0.69173,0.69416 -0.751726,0.93823 -0.122748,0.49936 0.709557,-0.49509 1.290075,-0.55233 1.649939,-0.16268 l 0.304076,0.32926 -0.413325,-0.10166 c -0.227331,-0.0559 -0.541222,-0.0288 -0.697536,0.0603 -0.23675,0.13491 -0.185738,0.16273 0.305496,0.1666 0.386198,0.003 0.621802,0.0866 0.682715,0.24216 0.07898,0.20169 0.14881,0.18615 0.46295,-0.10305 0.46395,-0.42709 0.46202,-0.35862 -0.0184,0.65264 -0.35722,0.75191 -0.38946,0.7807 -0.40219,0.35901 -0.008,-0.25214 -0.05254,-0.35529 -0.09985,-0.22922 -0.157123,0.41873 -0.557314,0.76405 -0.888216,0.76642 -0.268092,0.002 -0.284742,0.0289 -0.09279,0.15047 0.155231,0.0983 0.168497,0.14892 0.03944,0.15048 -0.106968,0.001 -0.475397,-0.24635 -0.818733,-0.5503 z m 1.410243,-0.14347 c 0.178884,-0.21122 0.155683,-0.21731 -0.20844,-0.0547 -0.338712,0.15123 -0.478413,0.13884 -0.805991,-0.0715 -0.445379,-0.28596 -0.545707,-0.16302 -0.12335,0.15115 0.370004,0.27523 0.893269,0.26376 1.137781,-0.0249 z m -0.0071,-0.98486 c 0,-0.0841 -0.03095,-0.15282 -0.06877,-0.15282 -0.03782,0 -0.112143,0.0688 -0.165153,0.15282 -0.05301,0.084 -0.02206,0.15281 0.06877,0.15281 0.09083,0 0.165152,-0.0688 0.165152,-0.15281 z m -7.553466,0.84505 c -0.163664,-0.41994 -0.416071,-0.769 -0.612132,-0.84655 -0.29182,-0.11541 -0.297182,-0.13316 -0.04278,-0.14163 0.273164,-0.009 0.275534,-0.0326 0.03899,-0.38635 -0.433128,-0.64775 -0.275594,-0.71394 0.281496,-0.11826 0.293345,0.31366 0.588586,0.51617 0.656092,0.45002 0.171352,-0.16791 -0.309495,-0.91716 -0.705462,-1.09925 -0.407927,-0.18758 -0.408935,-0.26489 -0.0081,-0.62036 0.314042,-0.2785 0.32689,-0.27541 0.696163,0.16733 0.219308,0.26294 0.378555,0.36048 0.381824,0.23388 0.0031,-0.11946 -0.107516,-0.33968 -0.245778,-0.48939 -0.233486,-0.25282 -0.216828,-0.31328 0.233924,-0.84913 0.426529,-0.50706 0.48531,-0.69062 0.48531,-1.51551 0,-0.5178 0.139829,-1.36749 0.311898,-1.89529 0.374388,-1.14838 0.384905,-1.46375 0.06864,-2.05809 -0.217816,-0.40933 -0.187791,-1.31873 0.03629,-1.09915 0.04936,0.0484 0.217751,-0.0639 0.374203,-0.2494 l 0.284457,-0.33733 -0.08147,0.38204 c -0.07973,0.3739 -0.0761,0.37553 0.170703,0.0764 0.269942,-0.32717 1.033461,-0.44506 0.914467,-0.14119 -0.03837,0.098 0.03596,0.21792 0.165174,0.26651 0.170194,0.064 0.207462,0.0182 0.135226,-0.1663 -0.08584,-0.2192 -0.0675,-0.22515 0.13178,-0.0427 0.274921,0.25165 0.282291,0.72007 0.01859,1.18158 -0.281171,0.49209 -0.232128,1.43219 0.108908,2.08767 0.40972,0.7875 0.03077,0.62941 -0.428274,-0.17866 -0.41313,-0.72724 -0.705147,-0.84142 -0.557543,-0.218 0.20203,0.8533 0.481659,1.10714 1.195812,1.08554 0.842002,-0.0255 1.449359,-0.3683 1.74912,-0.9873 0.323131,-0.66727 0.296665,-1.22741 -0.08671,-1.83526 -0.313596,-0.49721 -0.297636,-1.23893 0.02249,-1.04506 0.0796,0.0482 0.149654,-0.002 0.155683,-0.11239 0.006,-0.11002 0.07127,-0.0625 0.144988,0.10559 0.103861,0.23684 0.136494,0.2494 0.144988,0.0558 0.006,-0.13742 0.195044,-0.36804 0.420035,-0.5125 0.224991,-0.14446 0.365748,-0.19395 0.312794,-0.11 -0.05295,0.084 0.01223,0.19346 0.144848,0.24333 0.155834,0.0586 0.202157,0.0289 0.130958,-0.084 -0.07535,-0.11947 -0.04095,-0.13173 0.108862,-0.0388 0.120468,0.0747 0.289209,0.14006 0.374981,0.14517 0.08577,0.005 0.136642,0.0973 0.113044,0.20487 -0.0302,0.1377 0.06175,0.16304 0.31068,0.0856 0.31458,-0.0978 0.3301,-0.0823 0.14077,0.1413 -0.20212,0.23864 -0.12998,0.3247 0.21525,0.25677 0.0858,-0.0169 -0.0191,0.152 -0.233,0.37529 -0.286421,0.29896 -0.41146,0.63464 -0.474309,1.27332 l -0.08535,0.86734 -0.214665,-0.65437 c -0.118065,-0.35991 -0.272668,-0.59754 -0.343561,-0.52807 -0.116462,0.11412 -0.18499,1.16537 -0.126886,1.94651 0.0125,0.1681 -0.04273,0.64947 -0.122751,1.06971 l -0.145484,0.76408 -0.268296,-0.59317 c -0.280702,-0.6206 -0.510104,-0.59682 -0.562708,0.0583 -0.05111,0.6365 -0.01455,0.73292 0.49245,1.29875 0.268731,0.29992 0.443025,0.58996 0.387321,0.64455 -0.169202,0.1658 -0.94054,-0.49448 -1.034819,-0.88582 -0.103936,-0.43144 -0.255186,-0.25195 -0.332253,0.39427 -0.04531,0.37993 0.006,0.46688 0.299554,0.50771 l 0.354227,0.0493 -0.354227,0.28142 c -0.450191,0.35766 -0.260601,0.57417 0.216211,0.24691 0.196175,-0.13465 0.521124,-0.24481 0.722108,-0.24481 0.427443,0 0.968717,0.25519 0.968717,0.45671 0,0.0772 -0.209714,0.0232 -0.466031,-0.11999 -0.420317,-0.23478 -0.508279,-0.23779 -0.896708,-0.0307 -0.236872,0.1263 -0.611273,0.57329 -0.832002,0.9933 -0.493629,0.93928 -1.148193,1.93616 -1.01704,1.54891 0.07378,-0.21784 0.03708,-0.26216 -0.15672,-0.18929 -0.193952,0.0729 -0.227434,0.0323 -0.143354,-0.174 0.06034,-0.14804 0.176675,-0.73058 0.25853,-1.29453 0.118189,-0.81429 0.102467,-1.11322 -0.07637,-1.45211 -0.382074,-0.724 -0.788283,-0.98614 -1.445423,-0.93278 -0.782471,0.0635 -1.158229,0.61041 -1.596821,2.32399 -0.182874,0.71449 -0.460866,1.6193 -0.617759,2.0107 l -0.285261,0.71162 z m 6.617772,-6.45338 c 0,-0.2838 -0.05028,-0.36333 -0.161062,-0.25478 -0.08858,0.0868 -0.116164,0.27248 -0.06129,0.41261 0.144455,0.36887 0.222352,0.31358 0.222352,-0.15783 z m -2.712159,6.91907 c 0.04683,-0.11957 0.198588,-0.26006 0.337248,-0.3122 0.207119,-0.0779 0.200654,-0.0391 -0.03623,0.2174 -0.339689,0.36781 -0.417532,0.39233 -0.30102,0.0948 z m -0.78566,-0.39385 c 0.05917,-0.29417 0.244244,-0.70565 0.411274,-0.91439 l 0.30369,-0.37954 -0.109308,0.45595 c -0.06012,0.25077 -0.245193,0.66224 -0.411274,0.91439 l -0.301966,0.45844 z m -4.289009,-3.15696 c -1.36914,-0.58464 -1.809943,-1.04039 -2.643259,-2.73287 -0.439039,-0.89169 -0.798253,-1.79657 -0.798253,-2.01084 0,-0.36054 0.03777,-0.38125 0.506835,-0.27792 0.278759,0.0614 0.998074,0.1591 1.598479,0.21708 0.600404,0.058 1.32372,0.22644 1.607368,0.37433 0.558045,0.29096 1.274436,1.28507 1.684746,2.33786 0.256134,0.65721 0.255348,0.66282 -0.169336,1.20842 -0.559875,0.71928 -0.752035,0.77332 -1.532686,0.43104 -0.711615,-0.31202 -1.824016,-1.21547 -1.824016,-1.48139 0,-0.10904 0.06391,-0.10297 0.187139,0.0178 0.212707,0.20843 0.84615,0.24671 0.964973,0.0583 0.04338,-0.0688 -0.156117,-0.20833 -0.44333,-0.3101 -0.287214,-0.10177 -0.616819,-0.29744 -0.732456,-0.43481 -0.190105,-0.22585 -0.175351,-0.23156 0.153992,-0.0596 0.600933,0.31382 0.534536,0.0961 -0.130378,-0.42749 -0.343055,-0.27014 -0.623737,-0.56512 -0.623737,-0.6555 0,-0.10051 0.09779,-0.0848 0.251826,0.0405 0.138505,0.11264 0.489475,0.21253 0.779935,0.22197 0.512364,0.0167 0.519978,0.008 0.255377,-0.27814 -0.361501,-0.39142 -0.920375,-0.65803 -1.651582,-0.78786 -0.572154,-0.1016 -0.593463,-0.0908 -0.486388,0.247 0.563537,1.77771 2.175669,3.77169 3.321371,4.10805 0.351027,0.10306 0.601299,0.24593 0.556159,0.3175 -0.104628,0.16589 -0.182429,0.15437 -0.832779,-0.12334 z m 8.667299,-0.64116 c -0.298536,-0.65186 -0.406502,-1.12807 -0.390483,-1.72234 l 0.02214,-0.82138 0.107081,0.9933 c 0.0589,0.54631 0.264359,1.29222 0.456586,1.65757 0.192228,0.36535 0.319757,0.69343 0.283402,0.72905 -0.03636,0.0356 -0.251784,-0.34066 -0.478727,-0.8362 z m 0.620312,0.0482 c -0.150488,-0.38428 -0.10609,-0.48344 0.0777,-0.17365 0.091,0.15339 0.13265,0.31108 0.0925,0.35043 -0.0401,0.0393 -0.11676,-0.0402 -0.17024,-0.17678 z m -1.149098,-0.1087 c -0.296742,-0.36723 -0.546367,-0.92018 -0.366135,-0.81103 0.09494,0.0575 0.279186,0.30648 0.409436,0.55329 0.245613,0.46542 0.224768,0.58949 -0.0433,0.25774 z m 0.687976,-1.13338 c -0.159359,-0.15616 -0.118826,-1.62573 0.05198,-1.88472 0.105302,-0.15967 0.151897,0.10695 0.153561,0.87868 0.0024,1.11303 -0.01407,1.19366 -0.205544,1.00604 z m -10.260554,-1.99934 c -0.193981,-0.24237 -0.188465,-0.24778 0.05888,-0.0577 0.259772,0.19963 0.342384,0.32512 0.214032,0.32512 -0.03238,0 -0.155194,-0.12034 -0.272911,-0.26743 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x - 6, y));
    return wrapper;
  }

  /*
   * Scorpio symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  scorpio(x: number, y: number): Element {
    // center symbol
    const xShift = -100; // px
    const yShift = -130; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_SCORPIO),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        //" 2.3781101,-2.3781101 2.3781101,2.3781101 0,9.5124404 m -3.1708135,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.7927034,-9.5124404 2.3781101,-2.3781101 2.37811007,2.3781101 0,9.5124404 m -3.17081347,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.79270337,-9.5124404 2.37811013,-2.3781101 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854068 m -4.7562202,-11.8905505 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854067 2.3781101,-2.3781101",
        //"m 102.54265,141.32853 c -1.22558,-0.25522 -1.41154,-0.32289 -3.448084,-1.25477 -1.834498,-0.83942 -4.051325,-2.97431 -5.175115,-4.98383 -0.92776,-1.65899 -1.001862,-1.95637 -1.11361,-4.46897 -0.1107,-2.48906 -0.07978,-2.71309 0.410726,-2.9756 0.467445,-0.25016 0.63944,-0.11986 1.448271,1.09726 0.504807,0.75963 1.918281,2.39317 3.141053,3.6301 l 2.223219,2.24896 -0.510265,1.04547 c -0.612072,1.25405 -0.724931,3.18786 -0.186046,3.18786 0.226556,0 0.383223,-0.34652 0.418683,-0.92604 0.03116,-0.50932 0.268778,-1.37253 0.528018,-1.91823 0.40441,-0.85124 0.59556,-0.99219 1.34562,-0.99219 1.13667,0 1.71128,0.23161 1.71128,0.68977 0,0.72371 0.50155,0.34953 1.07763,-0.80396 0.50823,-1.01761 0.78159,-1.24251 2.06909,-1.70228 3.13783,-1.12053 4.97761,-0.97168 5.56665,0.45037 0.66644,1.60895 -0.0818,2.46931 -0.87179,1.0024 -0.65886,-1.22343 -1.53518,-1.67401 -2.44738,-1.25838 -0.65367,0.29783 -0.68843,0.40514 -0.5749,1.77427 0.22006,2.65361 1.44539,3.64097 4.29905,3.46414 l 1.84231,-0.11416 -0.64916,0.52566 c -2.62732,2.12747 -7.2682,3.08118 -11.10525,2.28215 z m 8.25816,-3.43424 c -1.08328,-0.31162 -1.90583,-1.5888 -1.90717,-2.96128 -0.001,-1.34669 0.63885,-1.23652 1.66132,0.2859 0.82646,1.23057 1.44326,1.40102 2.16878,0.59933 0.6678,-0.73792 0.4033,-2.50683 -0.51136,-3.41975 -0.60531,-0.60416 -0.88754,-0.68249 -2.33486,-0.64803 -0.90548,0.0216 -2.34957,0.28945 -3.2091,0.59531 -0.85953,0.30586 -1.6632,0.55612 -1.78594,0.55612 -0.12274,0 -0.22419,-0.38696 -0.22546,-0.8599 -0.005,-1.89854 -0.33787,-3.63802 -0.69601,-3.63802 -0.4286,0 -0.46256,1.20137 -0.10407,3.68148 0.35371,2.44703 0.16044,2.69584 -1.74921,2.25193 -1.30839,-0.30415 -1.75368,-0.59091 -3.338497,-2.15 -2.741319,-2.6968 -4.269912,-4.7703 -4.269912,-5.79202 0,-1.40025 1.213692,-2.86863 2.792524,-3.37854 2.918875,-0.94269 8.971935,-0.0988 12.500015,1.74272 2.17711,1.13636 5.28821,4.31164 6.28136,6.41094 0.9266,1.95864 0.93755,2.4509 0.0916,4.12024 -1.06848,2.10855 -3.3073,3.19522 -5.36404,2.60357 z m 6.65251,-4.69701 c -0.0575,-1.89358 -1.15392,-3.77685 -3.62818,-6.2319 -2.48475,-2.46545 -4.62651,-3.65111 -7.97519,-4.41499 -2.70999,-0.61818 -7.903632,-0.67549 -9.335065,-0.10301 l -0.983689,0.39341 1.151111,-1.04831 c 1.26006,-1.14752 3.887123,-2.49628 5.657873,-2.9048 0.62069,-0.1432 2.1487,-0.26327 3.3956,-0.26683 8.03414,-0.0229 14.26906,6.49293 12.68183,13.25323 -0.18397,0.78358 -0.46759,1.68566 -0.63025,2.00464 -0.26031,0.51046 -0.30034,0.4288 -0.33404,-0.68144 z m -24.435666,-6.61416 c 0,-0.14553 0.119062,-0.33817 0.264583,-0.42811 0.145521,-0.0899 0.264584,-0.0445 0.264584,0.10106 0,0.14552 -0.119063,0.33817 -0.264584,0.42811 -0.145521,0.0899 -0.264583,0.0445 -0.264583,-0.10106 z",
        "m 86.054786,142.98725 c 2.794419,-1.75732 4.133303,-2.78195 5.881004,-4.50066 2.135177,-2.09976 4.744254,-5.69448 5.889948,-8.11501 0.575665,-1.21621 0.964112,-1.45758 2.530272,-1.57222 1.10915,-0.0812 1.84168,0.0979 1.97548,0.48309 0.24617,0.70857 -1.85675,3.79105 -4.077832,5.97734 -2.517514,2.47807 -6.331323,5.4563 -8.552169,6.67844 -1.526,0.83976 -3.963196,1.9176 -5.333754,2.35882 -0.700431,0.22549 -0.470769,0.0472 1.687051,-1.3098 z m 11.801513,-2.34958 c -1.213161,-0.18488 -3.413618,-0.82515 -3.613494,-1.05143 -0.162465,-0.18392 2.108108,-2.17601 2.476853,-2.17307 0.166025,0.001 0.547998,0.24173 0.848828,0.53423 1.257036,1.22223 3.649164,1.51434 5.022924,0.61336 0.50027,-0.32811 0.71146,-0.83875 0.34843,-0.84248 -0.0984,-0.001 -0.18048,0.0713 -0.18249,0.16079 -0.0106,0.46885 -1.37848,0.78397 -2.38164,0.54864 -1.008703,-0.23663 -1.595789,-0.76649 -1.668791,-1.50612 -0.08392,-0.85028 0.350464,-1.22353 1.719381,-1.47739 1.24213,-0.23036 2.18373,-0.13558 3.37141,0.33936 1.19805,0.47908 1.88057,1.18188 1.96473,2.02311 0.2135,2.13411 -3.57572,3.49095 -7.906141,2.831 z m -7.408024,-3.40647 c -0.874374,-0.87061 -1.45875,-1.77015 -1.967666,-3.02884 -0.331258,-0.81929 -0.368853,-1.20296 -0.316207,-3.22704 0.05504,-2.1162 0.100015,-2.39006 0.570791,-3.47574 0.281073,-0.64821 1.380819,-2.56888 2.44388,-4.26817 1.063062,-1.69929 2.241236,-3.68509 2.618167,-4.41289 0.778239,-1.50266 1.135011,-1.93262 2.032253,-2.44913 0.896569,-0.51612 1.577031,-0.71947 5.051317,-1.50956 4.20331,-0.95588 7.06931,-1.32399 9.55987,-1.22787 1.67001,0.0644 2.03329,0.1201 3.0786,0.47158 4.19423,1.41027 6.30043,5.83763 4.66293,9.80176 -1.12543,2.72449 -4.85234,6.05458 -7.92971,7.08541 -2.36369,0.79176 -4.48382,0.24716 -4.45254,-1.14372 0.005,-0.22797 -0.34511,-0.99652 -0.77831,-1.7079 -0.97107,-1.59469 -1.36961,-2.89113 -1.09152,-3.55076 l 0.19533,-0.46334 -0.43368,0.32418 c -0.62018,0.46359 -0.77315,1.40702 -0.4835,2.98205 0.1297,0.70532 0.21124,1.30244 0.18119,1.32693 -0.0301,0.0245 -0.57524,-0.0565 -1.21154,-0.18 -1.25488,-0.24356 -2.25272,-0.2116 -3.184079,0.10199 -1.11393,0.37506 -3.562204,1.59569 -4.110398,2.04931 -1.345465,1.11335 -1.80028,2.52751 -1.267877,3.94223 0.24523,0.65163 0.258309,0.85099 0.07318,1.11546 -0.413565,0.59081 -2.092443,2.17736 -2.301797,2.17521 -0.113581,-0.001 -0.53599,-0.33018 -0.938685,-0.73115 z m 4.984142,-11.68383 c 0.181018,-0.13118 0.240924,-0.2394 0.133126,-0.24051 -0.107798,-0.001 -0.246957,0.0519 -0.309241,0.11776 -0.06229,0.0659 -0.314433,0.1177 -0.56033,0.11518 -0.252518,-0.003 -0.400169,0.0485 -0.339278,0.11745 0.177271,0.20068 0.724241,0.14481 1.075723,-0.10988 z m -0.460994,-0.29052 c 0.165834,-0.13099 0.124884,-0.1531 -0.210022,-0.11337 -0.462395,0.0549 -0.928527,-0.24071 -0.778439,-0.49359 0.05192,-0.0875 0.446475,-0.22982 0.876782,-0.3163 0.87387,-0.17562 0.543855,-0.3134 -0.468777,-0.1957 -0.754478,0.0877 -1.06344,0.33065 -0.925475,0.72777 0.156569,0.45067 1.115332,0.69973 1.505931,0.39119 z m -0.08024,-1.49352 c -0.220659,-0.0311 -0.582798,-0.0348 -0.804753,-0.008 -0.221956,0.0265 -0.04142,0.052 0.401198,0.0565 0.442615,0.005 0.624215,-0.0172 0.403555,-0.0483 z",
    );

    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /*
   * Sagittarius symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  sagittarius(x: number, y: number): Element {
    // center symbol
    const xShift = -100; // px
    const yShift = -120; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_SAGITTARIUS),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        // " -17.11444,17.11444 m 17.11444,-17.11444 -3.2089575,1.0696525 -6.417915,0 m 7.4875675,1.0696525 -3.2089575,0 -4.27861,-1.0696525 m 9.6268725,-1.0696525 -1.0696525,3.2089575 0,6.41791504 m -1.0696525,-7.48756754 0,3.2089575 1.0696525,4.27861004 m -8.55722,0 -7.4875675,0 m 6.417915,1.06965246 -3.2089575,0 -3.2089575,-1.06965246 m 7.4875675,0 0,7.48756746 m -1.0696525,-6.417915 0,3.2089575 1.0696525,3.2089575",
        //"m 102.35416,160.28474 c -4.258502,-1.14356 -7.74326,-4.13525 -9.02599,-7.7489 -2.470051,-6.95851 3.098083,-14.34405 11.23761,-14.90552 2.98247,-0.20573 4.96194,0.18049 7.61458,1.48569 4.3061,2.11876 6.92483,6.21233 6.65581,10.40427 -0.31523,4.91193 -4.51185,9.5409 -9.74249,10.74619 -1.37629,0.31713 -5.5841,0.32854 -6.73952,0.0183 z m 9.25005,-2.54344 c 0.23638,-0.0907 0.65806,-0.61238 0.93707,-1.15928 0.32159,-0.63037 0.75864,-1.05744 1.19396,-1.1667 0.67363,-0.16907 3.56788,-2.75091 3.56788,-3.18276 0,-0.12086 -0.64492,-0.97523 -1.43316,-1.89859 -0.78824,-0.92336 -1.51017,-2.02947 -1.6043,-2.45803 -0.17731,-0.80727 -1.88542,-2.30177 -3.974,-3.47701 -1.62966,-0.91702 -5.48462,-2.80252 -6.16451,-3.01513 -0.88814,-0.27773 -1.90528,0.4691 -1.90528,1.39896 0,0.66222 -0.14854,0.78615 -1.42435,1.18831 -0.78339,0.24695 -1.750845,0.70582 -2.149902,1.01971 -1.387982,1.09179 -2.395555,4.62242 -1.254391,4.39551 0.303921,-0.0604 0.435412,-0.28946 0.382671,-0.66653 -0.194789,-1.39265 1.35499,-3.32315 3.145102,-3.91773 1.22127,-0.40564 1.28943,-0.401 1.81408,0.12365 0.59167,0.59167 1.60349,0.70533 2.4146,0.27124 0.89894,-0.4811 0.59528,-0.84507 -0.5444,-0.65252 -0.95648,0.1616 -1.07959,0.11686 -1.3042,-0.47391 -0.34101,-0.89692 -0.19255,-1.62495 0.35309,-1.73145 0.6276,-0.1225 6.60696,2.87099 8.20506,4.10776 0.73905,0.57195 1.41458,1.35192 1.56082,1.80213 0.1418,0.43657 0.84208,1.49679 1.55617,2.35607 l 1.29835,1.56231 -1.12492,1.14621 c -0.6187,0.63041 -1.52113,1.27697 -2.00538,1.43679 -0.61386,0.20259 -1.04048,0.60422 -1.4089,1.32637 -0.29063,0.56969 -0.65097,1.03579 -0.80076,1.03579 -0.53151,0 -1.71344,-0.76125 -2.57646,-1.65943 -0.51749,-0.53858 -1.46368,-1.11088 -2.31511,-1.40029 -0.79195,-0.26919 -1.43992,-0.64338 -1.43992,-0.83152 0,-0.18815 -0.21883,-0.34209 -0.48629,-0.34209 -0.96641,0 -0.58058,2.60407 0.60552,4.08682 0.73195,0.91502 0.9925,0.12404 0.37215,-1.1298 -0.30666,-0.61982 -0.49304,-1.19147 -0.41417,-1.27034 0.25845,-0.25845 2.6072,0.93683 3.11872,1.58713 0.4924,0.62598 2.46307,1.75266 3.06629,1.75307 0.17,1.1e-4 0.50249,-0.074 0.73887,-0.16472 z",
        "m 106.58015,136.99291 c 0.62271,-0.30137 0.9957,-0.51043 0.82885,-0.46457 -0.96434,0.26513 -3.22389,0.54992 -4.28704,0.54034 l -1.2323,-0.011 1.40956,-0.28994 c 1.98164,-0.40761 2.89454,-0.72061 4.66096,-1.59812 2.52431,-1.254 4.59309,-3.13408 5.7471,-5.22283 0.30154,-0.5458 0.54992,-0.9111 0.55193,-0.81176 0.009,0.45521 -0.67962,2.25972 -1.12271,2.94095 -0.27007,0.4152 -0.48995,0.80569 -0.48862,0.86776 0.005,0.20855 1.13997,-1.13896 1.93799,-2.29977 2.68806,-3.9101 2.81336,-8.93014 0.32374,-12.9709 -0.78418,-1.27278 -1.88981,-2.6818 -2.10432,-2.6818 -0.23632,0 -0.64504,1.27022 -0.64504,2.00463 0,0.45507 0.25798,1.46266 0.67584,2.63955 0.62715,1.76639 0.67898,2.03991 0.71942,3.79682 0.039,1.69133 0.0256,1.80074 -0.1249,1.02555 -0.23684,-1.21987 -0.40067,-1.27714 -0.50305,-0.17587 -0.17609,1.89448 -1.29547,3.49568 -3.38052,4.83563 -0.61669,0.39631 -1.20247,0.89447 -1.30176,1.10703 -0.21801,0.46676 -0.31427,0.48016 -0.57082,0.0794 -0.28379,-0.44327 -1.20218,-0.639 -2.95433,-0.62964 l -1.53656,0.008 0.82724,0.367 c 0.86505,0.38376 1.56331,1.09513 1.94569,1.98223 0.2162,0.5016 0.1901,0.48916 -0.60922,-0.29057 -0.96298,-0.93936 -1.2695,-1.05449 -0.72548,-0.27249 0.69113,0.99346 0.67072,2.44879 -0.0468,3.33863 -0.28734,0.35633 -1.27062,1.16806 -1.41491,1.16806 -0.0229,0 0.0989,-0.30175 0.27048,-0.67055 0.35692,-0.76704 0.3883,-1.2101 0.14598,-2.06133 -0.21971,-0.77182 -1.24841,-1.77604 -2.03686,-1.9884 l -0.61362,-0.16528 -0.93317,1.0086 c -1.14544,1.23802 -2.10985,1.73987 -3.12829,1.62789 -0.737403,-0.0811 -0.860116,-0.005 -0.522677,0.3242 0.380458,0.37114 -0.147542,0.18793 -0.812397,-0.28188 -0.772493,-0.54588 -1.322594,-1.48982 -1.322594,-2.2695 0,-0.48768 -0.07451,-0.57961 -0.71485,-0.88199 -1.332196,-0.6291 -1.834468,-1.60394 -1.890936,-3.67008 -0.03985,-1.45815 -0.0282,-1.51078 0.562624,-2.54136 0.331825,-0.57882 0.632799,-1.05239 0.668832,-1.05239 0.03604,0 -0.112387,0.37275 -0.329823,0.82833 -0.550752,1.15395 -0.428984,1.21875 2.201693,1.17178 1.13999,-0.0204 2.124394,-0.0874 2.187561,-0.14906 0.06317,-0.0616 0.167936,-0.37906 0.23282,-0.70542 0.105882,-0.5326 0.119878,-0.49454 0.136571,0.37141 0.02214,1.14826 -0.305199,1.66847 -1.237427,1.96653 -0.974811,0.31168 -1.315064,0.60907 -1.603609,1.40156 l -0.271885,0.74674 -1.056497,-1.17698 c -0.581073,-0.64734 -1.084172,-1.09598 -1.117999,-0.99699 -0.03383,0.099 0.02402,0.52772 0.128539,0.95274 0.32573,1.32449 1.476792,2.73111 1.794459,2.19284 0.487194,-0.82552 0.461599,-0.82281 1.849309,-0.19547 0.987778,0.44655 1.561384,0.60093 2.441586,0.65715 1.4497,0.0926 2.10079,-0.11447 3.17656,-1.01022 0.46462,-0.38686 0.9912,-0.73212 1.1702,-0.76726 0.179,-0.0351 1.34442,-0.0986 2.58983,-0.14101 1.24541,-0.0425 2.48274,-0.14667 2.74961,-0.23169 0.26687,-0.085 0.37605,-0.16224 0.24261,-0.1716 -0.13344,-0.009 -0.57014,-0.17151 -0.97044,-0.3603 l -0.72784,-0.34327 1.33013,-0.0927 c 0.97441,-0.0679 1.45022,-0.17865 1.77916,-0.41406 0.70823,-0.50686 1.46101,-1.72046 1.6667,-2.68697 0.19247,-0.90436 0.14902,-3.19513 -0.0714,-3.76493 -0.10041,-0.25957 0.4455,0.5076 1.1789,1.65665 0.25449,0.39873 0.006,-1.10462 -0.32659,-1.9722 -0.1661,-0.43389 -0.72014,-1.26462 -1.23118,-1.84607 -2.33584,-2.65768 -2.4498,-2.81399 -1.15592,-1.58555 1.07567,1.02126 1.64124,1.43166 1.35894,0.9861 -0.26314,-0.41534 0.0793,-0.0816 0.56477,0.55048 0.29921,0.38954 0.56877,0.68411 0.59903,0.65459 0.0303,-0.0296 -0.0902,-0.36598 -0.26779,-0.7477 -0.42661,-0.91722 -0.41152,-1.4705 0.0745,-2.72993 0.32579,-0.84431 0.40135,-1.31551 0.38883,-2.42487 -0.008,-0.75732 -0.11141,-1.73194 -0.22861,-2.16582 l -0.21309,-0.78887 0.0776,1.2622 0.0776,1.2622 -0.33361,-0.37173 -0.3336,-0.37174 0.12069,0.52951 c 0.33496,1.46952 -0.0583,2.59357 -0.99248,2.83731 -0.34999,0.0913 -0.63951,7.5e-4 -1.36385,-0.425 -0.50575,-0.29748 -1.01944,-0.54107 -1.14153,-0.5413 -0.16848,-3.1e-4 -0.17811,-0.0519 -0.04,-0.21432 0.14691,-0.17267 -0.0859,-0.31495 -1.20726,-0.73784 l -1.38926,-0.52393 1.18797,-0.40904 c 1.19574,-0.41171 2.21329,-0.94204 2.53657,-1.32202 0.109,-0.12811 -0.2541,-0.065 -0.96662,0.16817 -0.62765,0.20535 -1.21481,0.34942 -1.30479,0.32016 -0.23621,-0.0768 0.81483,-1.04312 1.52022,-1.39767 0.33004,-0.1659 0.87593,-0.30272 1.21307,-0.30404 0.45532,-0.002 0.55057,-0.0418 0.37036,-0.15537 -0.46862,-0.29541 -1.54958,-0.16873 -2.48421,0.29115 -0.95057,0.46773 -1.15289,0.44313 -0.57143,-0.0694 0.18752,-0.16531 0.49071,-0.51356 0.67377,-0.77389 l 0.33283,-0.47333 -0.55247,0.48851 c -0.85328,0.75451 -1.76553,1.37999 -1.76553,1.21053 0,-0.25293 0.87497,-1.34929 1.51099,-1.89331 0.8759,-0.7492 1.54667,-1.04121 2.42431,-1.05535 0.68595,-0.011 0.83897,0.0503 1.2535,0.50268 0.25969,0.28339 0.47218,0.43478 0.47218,0.33643 0,-0.0984 -0.28258,-0.45447 -0.62796,-0.79137 -0.74994,-0.73156 -1.19288,-0.77418 -2.39084,-0.23008 -1.06164,0.48218 -1.97411,1.37251 -2.74281,2.67626 -0.33289,0.5646 -0.65975,0.99369 -0.72636,0.95353 -0.0666,-0.0402 -0.16657,-9e-4 -0.22216,0.0865 -0.0556,0.0877 -0.24152,0.23284 -0.41322,0.32248 -0.20698,0.10806 -0.0751,-0.17077 0.39139,-0.82747 0.38696,-0.54475 0.78802,-1.14877 0.89123,-1.34228 0.17922,-0.33598 0.16383,-0.34765 -0.34195,-0.25921 -4.66532,0.8158 -9.128806,3.90591 -11.599719,8.03059 -0.360887,0.60243 -0.656159,1.05069 -0.656159,0.99611 0,-0.40849 0.729061,-2.2487 1.143094,-2.88524 l 0.507731,-0.78061 -0.360397,-0.71827 c -0.65896,-1.31328 -0.966945,-2.40424 -0.966945,-3.42513 v -1.00085 h 0.530224 c 0.47797,0 2.418042,0.80979 3.028094,1.26393 0.372995,0.27767 -1.390915,0.039 -2.006629,-0.27148 -0.479331,-0.24172 -0.490168,-0.24031 -0.257755,0.0337 0.304453,0.35897 1.406204,0.85552 1.940901,0.87477 0.371408,0.0134 0.377997,0.0256 0.08087,0.15015 -0.177915,0.0746 -0.541835,0.1462 -0.808708,0.15914 l -0.485226,0.0235 0.441583,0.15743 c 0.324621,0.11572 0.675872,0.091 1.326137,-0.0934 1.520654,-0.43122 1.429814,-0.5797 -1.123438,-1.8362 -0.891056,-0.4385 -1.921051,-0.83665 -2.288875,-0.88478 -0.90361,-0.11823 -1.075857,0.20592 -0.998009,1.87813 0.05622,1.20783 0.04928,1.23735 -0.171772,0.73022 -0.126703,-0.29067 -0.236748,-1.03572 -0.244543,-1.65566 -0.01154,-0.91777 0.04585,-1.19187 0.308895,-1.47554 0.622826,-0.67163 2.326313,-0.14602 4.863099,1.50052 l 1.327757,0.86179 1.3699,-0.62622 c 1.53792,-0.70301 3.6895,-1.26059 4.87084,-1.26225 0.73526,-9e-4 0.84055,-0.0553 1.63726,-0.84507 1.41123,-1.39881 2.95632,-1.87679 4.13871,-1.28035 1.02984,0.51949 1.90915,2.30147 2.17987,4.41769 0.11235,0.87824 0.19835,1.0278 1.28906,2.24178 0.64279,0.71542 1.53403,1.8159 1.98054,2.44553 l 0.81185,1.14475 -1.69361,-1.61719 c -1.5922,-1.52035 -2.1528,-1.88894 -2.1528,-1.41542 0,0.11097 0.47932,0.66122 1.06518,1.22275 3.23401,3.09987 4.76252,7.06396 4.29587,11.14112 -0.65477,5.72092 -4.87082,10.10835 -10.90292,11.34613 -1.89901,0.38967 -2.14181,0.29442 -0.84693,-0.33228 z m -11.0833,-3.94668 c -0.08676,-0.2226 -0.157739,-0.54726 -0.157739,-0.72148 0,-0.28713 0.05644,-0.2714 0.602948,0.16804 0.682289,0.54861 1.667776,0.65463 2.437741,0.26224 0.45946,-0.23414 1.43281,-1.15696 1.31455,-1.24629 -0.038,-0.0288 -0.62982,-0.16731 -1.31517,-0.30801 -0.68535,-0.1407 -1.68753,-0.42976 -2.227066,-0.64234 l -0.980976,-0.38652 -0.239497,0.33355 c -0.459234,0.63956 -0.27742,1.94265 0.372451,2.66941 0.336066,0.37583 0.378364,0.34761 0.192758,-0.1286 z m -0.974481,-6.84055 0.558062,-0.28988 -1.411905,0.0204 c -1.370007,0.0198 -1.401635,0.0286 -1.065804,0.2965 0.442464,0.35298 1.208892,0.3422 1.919647,-0.027 z m 13.374831,7.32414 c -0.31089,-0.30326 -0.21849,-0.87868 0.24502,-1.52587 1.30662,-1.82443 3.08978,-1.54553 2.06209,0.32251 -0.62285,1.13216 -1.76787,1.72939 -2.30711,1.20336 z m 3.7239,-3.02403 c -0.0593,-0.0579 -0.10782,-0.39619 -0.10782,-0.75187 0,-0.79702 0.59131,-1.92321 1.19493,-2.27585 0.41937,-0.245 0.45656,-0.24242 0.67576,0.047 0.33169,0.43794 0.28529,0.99531 -0.16058,1.92949 -0.45563,0.95458 -1.20043,1.44323 -1.60229,1.05124 z m -14.098475,-0.99925 c -0.280267,-0.11748 -0.260039,-0.13707 0.151407,-0.14668 0.700608,-0.0164 2.508978,-0.48101 3.204738,-0.82343 0.66666,-0.3281 0.8175,-0.51969 0.24261,-0.30815 -0.45744,0.16833 -2.30125,0.44619 -3.679626,0.55452 -1.024955,0.0806 -1.002643,0.0694 0.889576,-0.44582 2.43053,-0.66174 3.19961,-0.93621 3.27965,-1.17043 0.11552,-0.33808 -1.31765,-0.20001 -3.10133,0.29877 -0.950361,0.26576 -1.925144,0.4598 -2.166186,0.43119 -0.429163,-0.0509 -0.424832,-0.0588 0.208711,-0.38246 0.355831,-0.18175 1.483985,-0.59763 2.506995,-0.92416 1.02302,-0.32655 1.91989,-0.64681 1.99303,-0.71169 0.0731,-0.0649 -0.21529,-0.5353 -0.64097,-1.04534 l -0.77398,-0.92736 0.66558,0.51379 c 1.55764,1.20244 2.1085,2.214 1.79972,3.30488 -0.21547,0.76124 -1.03416,1.54756 -1.83791,1.76522 -0.74746,0.20244 -2.27717,0.21201 -2.742015,0.0172 z m 17.333315,-1.68294 c -0.24549,-0.23947 -0.0926,-1.5929 0.25609,-2.26746 0.50453,-0.97598 0.83575,-0.93078 0.89796,0.12254 0.0759,1.28536 -0.65072,2.63591 -1.15405,2.14492 z m -10.21669,-0.99925 c -0.16077,-0.25374 0.0688,-0.47333 0.49477,-0.47333 0.47328,0 0.51558,0.24141 0.082,0.46778 -0.38797,0.20255 -0.45153,0.20316 -0.57673,0.005 z m 1.15915,-1.20961 c -0.23919,-0.23332 -0.0847,-0.70077 0.28621,-0.86559 0.50072,-0.22255 0.8999,-0.0765 0.8999,0.32917 0,0.45281 -0.86895,0.8458 -1.18611,0.53642 z m 2.74961,-0.31555 c -0.21544,-0.21015 -0.10033,-0.79918 0.20964,-1.07282 0.40402,-0.35667 0.81472,-0.20847 0.81472,0.29401 0,0.60099 -0.67812,1.11656 -1.02436,0.77881 z m -7.27705,-0.88092 c -0.23564,-0.16828 -0.16302,-0.19906 0.49475,-0.2098 0.42399,-0.007 1.00745,-0.133 1.29657,-0.28016 0.65265,-0.33222 0.6916,-0.0807 0.0559,0.36089 -0.52589,0.36528 -1.42817,0.42833 -1.84722,0.12907 z m -2.92206,-1.22595 c -0.37098,-0.90443 -0.32493,-1.45836 0.20668,-2.48628 0.25678,-0.49649 0.55865,-1.20192 0.67084,-1.56763 0.11219,-0.36571 0.37597,-0.82253 0.58618,-1.01519 0.36301,-0.33266 0.52102,-0.35076 3.14717,-0.36061 l 2.76497,-0.0103 -1.17886,0.34992 c -0.9415,0.27945 -1.33413,0.49909 -1.94994,1.09076 -0.58433,0.56144 -1.03657,0.82478 -1.8674,1.08738 -0.84595,0.26739 -1.20793,0.48103 -1.58502,0.93551 -0.4301,0.51837 -0.4887,0.71022 -0.4887,1.59991 0,0.55598 -0.0103,1.01089 -0.0229,1.01089 -0.0126,0 -0.13995,-0.28543 -0.28305,-0.6343 z m 3.48304,-3.72456 c 0.18438,-0.16254 0.47791,-0.49079 0.65228,-0.72941 l 0.31704,-0.43388 h -0.49624 c -0.33976,0 -0.49624,0.0769 -0.49624,0.24383 0,0.70246 -1.41031,1.31507 -1.90855,0.82904 -0.15096,-0.14725 -0.19409,-0.0803 -0.19409,0.30131 v 0.49066 l 0.89527,-0.20301 c 0.49241,-0.11165 1.04615,-0.336 1.23053,-0.49854 z m 3.3195,3.93811 c -0.243,-0.23703 -0.0819,-0.702 0.3025,-0.87283 0.3338,-0.14836 0.4577,-0.13617 0.66429,0.0654 0.2308,0.22514 0.22288,0.27808 -0.0868,0.58019 -0.34312,0.33472 -0.68049,0.42185 -0.87995,0.22727 z m 10.17408,-0.25026 c -0.47126,-0.7016 -0.53496,-2.64229 -0.0867,-2.64229 0.0886,0 0.307,0.23075 0.48539,0.51277 0.24753,0.39132 0.31401,0.73404 0.28067,1.44691 -0.0483,1.03234 -0.28478,1.27 -0.67933,0.68261 z m -22.634368,-0.68224 c -0.33339,-0.95445 -0.347462,-2.58019 -0.02592,-2.99488 0.366649,-0.47287 0.298056,-0.6666 -0.358774,-1.01337 l -0.606531,-0.32021 0.646966,0.0947 c 1.194878,0.17491 1.826099,0.38212 1.924269,0.63168 0.123061,0.31282 0.122569,1.29813 -8.69e-4,1.74704 -0.09297,0.33808 -0.09806,0.33726 -0.484537,-0.0789 -0.214818,-0.23131 -0.496756,-0.56256 -0.626529,-0.73611 -0.212563,-0.28427 -0.236458,-0.15527 -0.241093,1.30165 -0.0029,0.88947 0.0552,1.6172 0.12895,1.6172 0.07376,0 0.304446,-0.35478 0.512652,-0.78842 0.208208,-0.43363 0.407503,-0.76019 0.442877,-0.72567 0.06049,0.059 -0.578455,1.34042 -0.900608,1.80616 -0.107138,0.15489 -0.219477,0.007 -0.41085,-0.54088 z m 1.23272,-2.54876 c -0.206786,-0.1356 -0.363919,-0.40065 -0.363919,-0.61385 0,-0.20636 -0.08067,-0.37519 -0.179276,-0.37519 -0.282791,0 -0.01471,0.82979 0.370827,1.14782 0.186724,0.15402 0.383777,0.23501 0.437892,0.17997 0.05412,-0.0551 -0.06536,-0.20747 -0.265524,-0.33875 z m 6.781258,3.13367 c -0.13468,-0.0833 0.16039,-0.16551 0.79569,-0.22171 0.67119,-0.0594 1.33206,-0.25146 1.97096,-0.57289 0.89493,-0.45024 0.94487,-0.45926 0.72428,-0.13086 -0.48008,0.7147 -1.23202,1.06286 -2.28989,1.06027 -0.54284,-0.002 -1.0833,-0.062 -1.20104,-0.13481 z m 8.01622,-1.47997 c -0.11929,-0.30586 0.15143,-0.86864 0.50719,-1.05436 0.24669,-0.12879 0.38036,-0.11024 0.57521,0.0799 0.31542,0.30768 0.31561,0.38442 0.003,0.82108 -0.27142,0.37801 -0.95893,0.47529 -1.08446,0.15343 z m -2.9898,-0.44808 c -0.18934,-0.29887 -0.51638,-0.70113 -0.72673,-0.89389 l -0.38246,-0.35049 -1.18854,0.55563 c -0.65369,0.30559 -1.2454,0.53553 -1.31489,0.51095 -0.22095,-0.0782 2.3947,-1.70132 2.7415,-1.70132 0.4642,0 0.92108,0.5309 1.15335,1.34017 0.27023,0.94145 0.13564,1.19847 -0.28223,0.53895 z m 1.15803,0.0943 c -0.2949,-0.43904 -0.20872,-0.86899 0.17419,-0.86899 0.30589,0 0.64706,0.67513 0.51317,1.01548 -0.14009,0.35613 -0.38477,0.30398 -0.68736,-0.14649 z m 6.90039,-2.24539 c -0.48327,-0.57192 -0.80764,-1.5292 -0.59007,-1.74144 0.32823,-0.32018 1.37905,1.11889 1.38381,1.89508 0.004,0.58588 -0.20256,0.54597 -0.79374,-0.15364 z m -6.23662,-0.0406 c -0.23733,-0.25581 -0.25297,-0.35612 -0.0862,-0.55222 0.11212,-0.13179 0.3364,-0.23962 0.49837,-0.23962 0.3558,0 0.80736,0.58171 0.6877,0.88588 -0.12623,0.32087 -0.76573,0.26621 -1.09993,-0.094 z m -13.609376,-1.18109 c -0.05008,-0.1273 -0.01715,-0.42905 0.07318,-0.67054 0.157137,-0.42013 0.164781,-0.41013 0.176999,0.23146 0.013,0.68246 -0.08605,0.8563 -0.250176,0.43908 z m 1.941502,-0.51659 c 0.0715,-0.50884 0.239873,-0.87462 0.52656,-1.14386 l 0.421453,-0.39583 -0.108078,0.47332 c -0.188352,0.82488 -0.615541,1.81442 -0.783291,1.81442 -0.09988,0 -0.121545,-0.28615 -0.05665,-0.74805 z m 1.827397,0.49279 c -0.104727,-0.29754 0.139209,-1.30079 0.278927,-1.14716 0.0307,0.0337 0.007,0.38082 -0.0528,0.77132 -0.08644,0.56542 -0.13249,0.64195 -0.226157,0.37584 z m 1.748577,-0.45472 c 0.0387,-0.26034 0.11255,-0.801 0.16415,-1.20147 0.0516,-0.40047 0.1818,-0.84551 0.28935,-0.98899 0.16836,-0.2246 0.19873,-0.18918 0.2185,0.2548 0.0126,0.28362 0.0712,0.69317 0.13015,0.91011 0.0825,0.3035 -0.006,0.52175 -0.38265,0.94666 l -0.48984,0.5522 z m -4.434454,-0.34569 c -0.0062,-0.27691 0.06141,-0.54734 0.150374,-0.60097 0.193987,-0.11696 0.193987,0.34852 0,0.78888 -0.117174,0.26599 -0.140791,0.23648 -0.150374,-0.18791 z m 1.767791,0.1115 c 0,-0.0854 0.218121,-0.38715 0.484715,-0.67055 l 0.484714,-0.51525 -0.363408,0.66924 c -0.344587,0.63458 -0.606021,0.85743 -0.606021,0.51656 z m 4.727093,-0.50398 c 0.0887,-0.25941 0.57164,-0.53554 0.70654,-0.40395 0.15388,0.15011 -0.2441,0.5899 -0.5338,0.5899 -0.12996,0 -0.20768,-0.0837 -0.17274,-0.18595 z m 4.49327,-0.0494 c -0.1614,-0.18972 -0.16813,-0.2959 -0.0274,-0.43315 0.24571,-0.23969 1.07765,0.0357 1.07765,0.35678 0,0.32737 -0.78793,0.38467 -1.05023,0.0764 z m -11.161263,-1.16015 c 0,-0.15459 0.53789,-0.65555 0.703866,-0.65555 0.06177,0 -0.0069,0.17749 -0.152644,0.39443 -0.259772,0.38674 -0.551222,0.52481 -0.551222,0.26112 z m 2.597754,-0.96017 c 0.508439,-0.88971 2.006029,-2.34872 2.917179,-2.842 l 0.71212,-0.38553 -0.76827,0.83648 c -0.42255,0.46007 -0.76827,0.89037 -0.76827,0.95623 0,0.0658 -0.28702,0.30502 -0.63782,0.53148 -0.35079,0.22646 -0.91042,0.67765 -1.243607,1.00267 l -0.605799,0.59095 z m 3.979739,0.51498 c -0.17574,-0.17143 -0.12296,-0.7636 0.0863,-0.96769 0.2729,-0.26621 0.41537,-0.23695 0.61461,0.12622 0.29091,0.53022 -0.29672,1.23571 -0.70087,0.84147 z m 3.33274,-0.0858 c -0.44716,-0.21053 -0.64489,-0.74495 -0.34435,-0.9307 0.34892,-0.21567 0.57527,-0.1661 1.04626,0.22908 0.74953,0.62892 0.23535,1.14288 -0.70191,0.70162 z m -8.6163,-0.17364 c 0,-0.29435 0.635982,-0.92277 0.820989,-0.81123 0.165861,0.1 0.08305,0.30175 -0.304563,0.74202 -0.288018,0.32716 -0.516426,0.35777 -0.516426,0.0692 z m 2.26438,-0.0871 c 0,-0.25422 0.85117,-0.96817 1.15425,-0.96817 0.40794,0 0.37986,0.13955 -0.13318,0.66191 -0.41135,0.41883 -1.02107,0.60171 -1.02107,0.30626 z m 2.42613,-2.22143 c 0,-0.2147 0.66884,-0.64005 1.00644,-0.64005 0.36895,0 0.36584,0.19749 -0.008,0.52776 -0.31788,0.28062 -0.99815,0.35716 -0.99815,0.11229 z m -2.26438,-0.40339 c 0.20893,-0.21694 0.43996,-0.39443 0.51341,-0.39443 0.26151,0 0.12823,0.465 -0.1793,0.62555 -0.55717,0.29088 -0.72501,0.17478 -0.33411,-0.23112 z m 3.48877,-0.88564 c 0.16234,-0.25622 1.50127,-0.80406 1.68882,-0.69099 0.27992,0.16877 0.17373,0.37822 -0.31732,0.62593 -0.56329,0.28415 -1.53965,0.33046 -1.3715,0.065 z m -1.5355,-0.38145 c 0.42233,-0.41198 1.76641,-0.77187 1.53835,-0.41192 -0.15859,0.2503 -1.30773,0.81125 -1.66191,0.81125 -0.24072,0 -0.22122,-0.063 0.12356,-0.39933 z m 2.73723,-0.70252 c 0,-0.16954 0.94393,-0.63369 1.28874,-0.63369 0.30925,0 0.17013,0.32221 -0.19699,0.45617 -0.85241,0.31107 -1.09175,0.34999 -1.09175,0.17752 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "#000000");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x - 12, y));
    return wrapper;
  }

  /*
   * Capricorn symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  capricorn(x: number, y: number): Element {
    // center symbol
    const xShift = -110; // px
    const yShift = -130; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_CAPRICORN),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        //" 1.8047633,-3.6095267 4.5119084,9.0238168 m -4.5119084,-7.2190534 4.5119084,9.0238167 2.707145,-6.3166717 4.5119084,0 2.707145,-0.9023817 0.9023817,-1.8047633 0,-1.8047634 -0.9023817,-1.8047633 -1.8047634,-0.9023817 -0.9023816,0 -1.8047634,0.9023817 -0.9023817,1.8047633 0,1.8047634 0.9023817,2.707145 0.9023817,1.80476336 0.9023817,2.70714504 0,2.707145 -1.8047634,1.8047633 m 1.8047634,-16.2428701 -0.9023817,0.9023817 -0.9023817,1.8047633 0,1.8047634 1.8047634,3.6095267 0.9023816,2.707145 0,2.707145 -0.9023816,1.8047634 -1.8047634,0.9023816",
        //"m 101.95729,160.43896 c -2.041586,-0.46764 -3.606295,-1.22014 -5.258267,-2.52881 l -1.421807,-1.12633 1.411651,-0.49713 c 1.917911,-0.67542 2.685531,-0.63032 5.259303,0.30899 2.49099,0.9091 5.38691,1.57561 6.83944,1.57414 1.34175,-0.001 2.63402,-0.83192 2.74176,-1.76217 0.0699,-0.60336 0.55461,-1.04666 2.69308,-2.46288 1.9781,-1.31002 2.73906,-1.98266 3.15115,-2.78542 0.70321,-1.36987 0.90276,-0.76407 0.33102,1.00492 -1.29639,4.01104 -5.41439,7.58226 -9.67485,8.39024 -1.81718,0.34462 -4.26704,0.29801 -6.07248,-0.11555 z m 4.10104,-3.44188 c -0.7276,-0.18423 -2.27542,-0.64435 -3.43958,-1.02247 -3.13034,-1.01674 -3.728516,-1.06457 -5.945868,-0.47539 -1.087414,0.28894 -1.989706,0.50223 -2.005094,0.47399 -0.01539,-0.0282 -0.332398,-0.46808 -0.704468,-0.9774 -1.162018,-1.59068 -1.887543,-4.22576 -1.730046,-6.28348 0.153373,-2.00382 0.95628,-4.31323 1.898499,-5.46068 0.597098,-0.72715 0.733757,-0.76497 2.837352,-0.78529 2.294498,-0.0222 2.880537,0.15909 4.281035,1.32411 0.41144,0.34227 1.20555,0.69545 1.76467,0.78486 0.58962,0.0943 1.24704,0.4276 1.56528,0.7936 0.44606,0.51302 0.8088,0.63238 1.93949,0.63816 l 1.39081,0.007 -0.86228,0.72049 c -1.46632,1.22519 -0.98103,2.73675 1.35826,4.23063 0.92202,0.5888 1.37914,0.69456 2.94361,0.68104 1.01864,-0.009 2.5576,-0.21021 3.41991,-0.44758 2.55949,-0.70454 2.30039,-0.12384 -0.83241,1.86562 -2.54457,1.6159 -3.88965,2.84664 -3.68733,3.37388 0.35031,0.91288 -1.70919,1.18742 -4.19184,0.55879 z m 3.30729,-6.41984 c -0.5645,-0.20406 -2.38125,-1.982 -2.38125,-2.33039 0,-0.35854 2.79619,-3.04063 3.16998,-3.04063 0.14828,0 0.26961,-0.17859 0.26961,-0.39687 0,-0.50489 -0.54478,-0.50869 -1.2062,-0.008 -0.6766,0.51174 -3.70861,0.54963 -4.00618,0.0501 -0.34235,-0.57477 -1.6183,-1.29347 -1.94162,-1.09365 -0.16395,0.10133 -0.81824,-0.1893 -1.45397,-0.64585 -1.49521,-1.07378 -3.044335,-1.60944 -4.654465,-1.60944 -0.709309,0 -1.285009,-0.0893 -1.279333,-0.19844 0.01221,-0.23488 2.254326,-1.91749 2.558245,-1.91986 0.115259,-9e-4 0.566749,-0.18835 1.003311,-0.41657 2.242392,-1.17222 6.602772,-1.52245 9.514002,-0.76417 4.71226,1.22739 8.35979,4.91524 9.16393,9.26524 0.29938,1.61946 0.13739,2.5461 -0.40846,2.33663 -0.19612,-0.0753 -0.43637,-0.008 -0.53391,0.15011 -0.0975,0.15782 -0.28159,0.22251 -0.40901,0.14375 -0.12743,-0.0787 -1.10147,0.0383 -2.16453,0.26005 -1.89583,0.39552 -4.45514,0.5022 -5.24015,0.21844 z",
        "m 117.31776,144.40974 c 0.54575,-0.12378 1.43044,-0.41994 1.96598,-0.65814 0.84209,-0.37455 1.05921,-0.59928 1.60636,-1.6626 0.74764,-1.45296 0.69886,-2.19949 -0.25297,-3.87161 l -0.60719,-1.06668 -1.08046,-0.003 c -0.59425,-0.002 -1.40294,-0.13738 -1.7971,-0.30175 -0.39415,-0.16437 -0.71664,-0.25345 -0.71664,-0.19794 0,0.20042 1.89009,0.77869 2.55749,0.78246 0.59587,0.003 0.73146,0.0993 1.06076,0.75035 0.60268,1.19156 0.70658,2.52756 0.25458,3.27336 -0.21158,0.34909 -0.50317,0.83231 -0.64798,1.07382 -0.41595,0.69371 -2.52024,1.29393 -4.54789,1.29723 -2.13914,0.003 -3.00274,-0.24612 -4.19243,-1.2117 -0.53406,-0.43346 -1.09571,-0.7881 -1.24811,-0.7881 -0.48438,0 -0.75736,-0.68001 -0.68932,-1.71711 0.0623,-0.94957 0.10363,-1.01512 0.74462,-1.18102 l 0.67867,-0.17564 -1.39531,-0.55157 c -1.55362,-0.61415 -1.79125,-0.63804 -0.62229,-0.0626 l 0.77302,0.38055 -0.44226,0.44786 c -0.79837,0.80847 -0.49803,3.06152 0.43971,3.29859 0.20572,0.052 0.68281,0.40062 1.0602,0.77469 0.97929,0.97067 2.33189,1.43943 4.40021,1.52494 1.00193,0.0414 2.11562,-0.0223 2.69835,-0.15452 z m -7.38694,-0.50148 c -1.07135,-0.32835 -2.32348,-1.09274 -3.96319,-2.41943 -0.84569,-0.68425 -1.62523,-1.24409 -1.73231,-1.24409 -0.10708,0 -0.38982,0.1976 -0.62831,0.43911 -0.66806,0.67651 -0.949,0.53897 -1.24707,-0.61052 -0.33269,-1.28302 -1.71664,-4.57242 -2.62519,-6.23959 -1.141268,-2.0942 -2.314286,-3.96929 -2.426964,-3.87953 -0.297084,0.23664 0.688764,4.83898 1.401826,6.54429 0.143162,0.34238 -1.935076,-2.00596 -2.446639,-2.76462 -0.167315,-0.24813 -0.559526,-1.82892 -0.87158,-3.51288 -0.312054,-1.68395 -0.666224,-3.29885 -0.787044,-3.58866 -0.217865,-0.52259 -0.218692,-0.52187 -0.100509,0.0878 0.06554,0.33812 0.316322,1.99455 0.557293,3.68096 0.498088,3.48581 0.227603,2.96169 3.811017,7.38461 2.62575,3.2409 2.74196,3.35652 2.11827,2.10772 -1.266479,-2.53582 -2.748254,-6.4944 -2.580786,-6.89459 0.170755,-0.40805 2.588676,4.62364 3.355316,6.98242 0.58123,1.7883 0.82616,1.94441 1.87605,1.19575 l 0.69161,-0.49318 1.27783,0.99078 c 1.52541,1.18274 3.40715,2.2008 4.32038,2.33742 l 0.66152,0.099 z m 7.57793,-0.76135 c 0.61786,-0.22284 2.89609,-1.90402 2.89609,-2.13711 0,-0.12069 -1.18659,0.51822 -1.72309,0.92777 -0.83933,0.64074 -2.3157,0.95552 -3.58338,0.76402 -0.59836,-0.0904 -1.39457,-0.29066 -1.76936,-0.44504 -0.62519,-0.25752 -0.65321,-0.30555 -0.33938,-0.58178 0.31074,-0.2735 0.294,-0.38373 -0.18276,-1.20343 -0.65578,-1.12745 -1.44677,-1.59107 -2.22975,-1.3069 -0.63308,0.22977 -0.91524,0.67287 -0.59229,0.93012 0.23314,0.1857 1.82029,0.52228 1.82029,0.38601 0,-0.0431 -0.29768,-0.16112 -0.66152,-0.26215 -0.68242,-0.18949 -0.83241,-0.39575 -0.43135,-0.59319 0.3289,-0.16191 0.89068,0.26077 1.24567,0.93724 0.28483,0.54279 0.27165,0.60298 -0.19954,0.91112 -0.66884,0.43739 -0.38331,0.82876 1.01127,1.38619 1.33666,0.53428 3.66304,0.67522 4.7391,0.28713 z m 2.69932,-7.425 c 0.24699,-0.45887 0.78487,-1.58518 1.19529,-2.50292 0.41042,-0.91774 1.38511,-2.671 2.16598,-3.89613 2.82378,-4.43032 4.10487,-8.73541 3.65565,-12.28485 -0.16713,-1.32062 -0.97338,-3.93567 -1.30904,-4.24586 -0.0833,-0.077 -0.21463,0.87149 -0.29183,2.10772 -0.30011,4.80556 -2.32383,9.66506 -5.1604,12.39154 -1.32164,1.27035 -3.32191,2.47257 -4.96513,2.98419 l -1.26791,0.39476 v 0.80333 c 0,2.06612 1.38405,3.77044 3.46355,4.26501 0.58125,0.13823 1.14046,0.18959 1.2427,0.11412 0.26085,-0.19256 1.68385,-3.52464 1.68739,-3.95116 0.002,-0.19321 0.30515,-0.70697 0.67455,-1.14169 0.72687,-0.85538 1.36727,-1.75644 1.24835,-1.75644 -0.0407,0 -0.49787,0.50983 -1.01592,1.13295 -0.55582,0.66855 -1.286,1.93486 -1.78134,3.08929 -0.46169,1.07599 -0.95355,2.04724 -1.09302,2.15834 -0.44079,0.35111 -2.22365,-0.54598 -2.94535,-1.48202 -0.82406,-1.06881 -1.09032,-2.72859 -0.46387,-2.89162 1.26587,-0.32943 3.29293,-1.27667 4.37306,-2.04351 2.95427,-2.09739 5.14046,-5.51562 6.26743,-9.79948 l 0.43897,-1.66862 0.0157,1.5532 c 0.0291,2.88297 -1.31764,6.80349 -3.63417,10.57984 -0.65645,1.07013 -1.43953,2.61141 -1.74018,3.42505 -0.30064,0.81365 -0.741,1.87456 -0.97856,2.35759 l -0.43194,0.87821 -1.07689,-0.0216 c -0.59229,-0.0119 -1.41883,-0.15402 -1.83676,-0.31588 -0.62372,-0.24156 -0.68267,-0.24526 -0.32904,-0.0207 0.53442,0.33939 1.76104,0.61936 2.71922,0.62065 0.65466,8.9e-4 0.76776,-0.0794 1.17355,-0.83333 z m -12.39687,-1.66163 c -0.14346,-0.21352 -0.27549,-0.84151 -0.2934,-1.39553 -0.0379,-1.17137 -0.43741,-1.63632 -1.63187,-1.89903 -0.95094,-0.20915 -1.1121,-0.11776 -0.595,0.33739 0.26856,0.23637 0.34759,0.48716 0.25057,0.79507 -0.17684,0.56124 0.19511,1.14516 0.72943,1.14516 0.22699,0 0.65965,0.30778 0.98765,0.70258 0.62474,0.75198 0.98393,0.95631 0.55262,0.31436 z m -1.95974,-1.95179 c 0,-0.44552 0.32324,-0.21014 0.55829,0.40654 0.14933,0.39179 0.12879,0.41258 -0.19572,0.19805 -0.19941,-0.13182 -0.36257,-0.40389 -0.36257,-0.60459 z m 9.84538,-2.1411 c 1.19716,-0.47519 1.45794,-0.85907 1.72867,-2.54465 l 0.12695,-0.7904 -0.40887,0.96604 c -0.62817,1.48418 -0.83787,1.69886 -1.95583,2.00229 -1.33294,0.36178 -1.52637,0.35454 -2.06855,-0.0773 l -0.44995,-0.35841 1.20699,-0.65154 c 1.7549,-0.9473 2.45993,-1.74321 3.61114,-4.0766 0.19218,-0.38951 0.23562,-0.32142 0.3847,0.6029 0.094,0.5827 0.0703,1.55049 -0.0538,2.19555 -0.12204,0.63445 -0.19258,1.18071 -0.15677,1.21392 0.18536,0.17186 0.59626,-1.47395 0.69478,-2.78286 0.10445,-1.38772 0.0604,-1.59822 -0.62461,-2.98595 l -0.73698,-1.49297 -0.14295,1.40515 c -0.0786,0.77284 -0.35857,1.85581 -0.62209,2.40661 -0.5751,1.20204 -2.11332,2.61918 -3.55473,3.27491 -1.04157,0.47384 -1.04569,0.47936 -0.76056,1.01953 0.61764,1.17006 1.93919,1.40549 3.78248,0.67381 z m -2.14944,-2.50074 c 0.41492,-0.33082 0.75699,-0.92956 1.08556,-1.90013 0.63875,-1.8868 0.62278,-2.41976 -0.0858,-2.86373 -0.4444,-0.27844 -0.51958,-0.42226 -0.35101,-0.67141 0.36435,-0.53849 1.18881,-1.04604 2.63293,-1.62085 1.8012,-0.71695 2.25079,-1.28508 2.25189,-2.84568 4.6e-4,-0.63993 -0.15137,-1.50711 -0.33738,-1.92708 -0.31056,-0.70112 -1.0926,-1.56396 -1.41751,-1.56396 -0.0744,0 -0.54957,0.5019 -1.05589,1.11534 -1.02157,1.23768 -1.87955,1.89489 -4.13979,3.17107 l -1.52556,0.86135 1.31678,0.93868 c 0.72423,0.51627 1.4029,0.93882 1.50817,0.93899 0.10527,1.8e-4 0.53065,-0.23695 0.94529,-0.52694 0.41464,-0.28999 1.23935,-0.72321 1.83268,-0.9627 0.59333,-0.23949 1.13161,-0.50353 1.19617,-0.58674 0.12759,-0.16445 -3.0441,1.05845 -3.66268,1.41221 -0.32202,0.18415 -0.49653,0.12624 -1.15766,-0.38419 -0.42816,-0.33056 -0.77848,-0.65116 -0.77848,-0.71244 0,-0.0613 0.79795,-0.53977 1.77323,-1.06332 1.07383,-0.57646 2.16757,-1.35108 2.77305,-1.96398 0.5499,-0.55665 1.08785,-0.96875 1.19543,-0.91579 0.30986,0.15254 0.65038,1.32368 0.65173,2.24142 0.002,1.10833 -0.4514,1.6173 -1.99027,2.23608 -0.69322,0.27874 -1.56298,0.74782 -1.9328,1.0424 -0.36982,0.29458 -0.7507,0.5356 -0.8464,0.5356 -0.0957,0 -0.59946,-0.33262 -1.11949,-0.73915 -0.52002,-0.40653 -0.94549,-0.6405 -0.94549,-0.51993 0,0.51791 0.95385,1.63326 2.08133,2.43372 l 1.21587,0.86322 -0.22541,1.1327 c -0.37818,1.90032 -0.64583,2.52048 -1.26551,2.93219 -0.32642,0.21688 -0.51145,0.39472 -0.41116,0.3952 0.10029,4.8e-4 0.45496,-0.21649 0.78817,-0.48215 z m -9.6132,-5.40651 c 0.34021,-0.23841 1.05427,-0.52086 1.5868,-0.62767 l 0.96824,-0.19421 -0.53948,-0.68072 c -0.76796,-0.96902 -1.27123,-2.04443 -1.11172,-2.37555 0.19582,-0.40647 -0.54969,-1.26282 -1.89446,-2.1761 l -1.16382,-0.7904 1.26408,1.18796 c 1.0764,1.01158 1.26408,1.29165 1.26408,1.88629 0,0.38408 0.1961,1.10942 0.43578,1.61187 0.23968,0.50245 0.41333,0.92082 0.38589,0.9297 -0.0274,0.009 -0.39356,0.1393 -0.81359,0.28981 -0.71197,0.25513 -0.81303,0.25047 -1.49245,-0.0688 -0.95713,-0.44983 -2.59584,-1.95083 -3.185318,-2.91764 -0.419215,-0.68756 -0.4439,-0.87729 -0.232142,-1.7843 0.130325,-0.55821 0.418311,-1.33186 0.63997,-1.71921 l 0.40301,-0.70428 2.20505,1.53452 c 2.31506,1.61108 2.57438,1.88886 2.98284,3.19509 0.13867,0.44347 0.48712,1.03627 0.77433,1.31733 l 0.52219,0.51102 -0.54101,-0.86408 c -0.29755,-0.47524 -0.54138,-1.10756 -0.54183,-1.40515 -0.001,-0.81944 -0.70708,-1.59037 -3.33424,-3.64173 l -2.39635,-1.87115 -0.456064,0.81728 c -1.48466,2.66061 -1.637609,3.86906 -0.661297,5.22493 0.858249,1.1919 2.745741,2.81672 3.431301,2.95378 0.3556,0.0711 0.5509,0.23349 0.5509,0.45808 0,0.45206 0.1946,0.43225 0.94931,-0.0966 z m 6.62519,-2.20914 c -0.23691,-0.54773 -0.25102,-0.78026 -0.0585,-0.96499 0.2026,-0.19445 -0.0952,-0.52996 -1.48126,-1.66886 -2.81271,-2.31116 -4.55945,-3.27536 -6.4463,-3.55835 -0.71597,-0.10738 -0.67238,-0.053 1.22589,1.52862 2.14407,1.78645 2.71202,2.53213 2.71719,3.56749 0.002,0.37182 0.0766,0.76766 0.16603,0.87965 0.0895,0.11199 0.15948,-0.37147 0.15561,-1.07437 -0.006,-1.09305 -0.0943,-1.38306 -0.61017,-2.00397 -0.33172,-0.39929 -0.54216,-0.72598 -0.46764,-0.72598 0.34681,0 4.29319,2.88269 4.20292,3.07009 -0.0981,0.20367 0.616,1.6723 0.81316,1.6723 0.0524,0 -0.0452,-0.32473 -0.21688,-0.72163 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /*
   * Aquarius symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  aquarius(x: number, y: number): Element {
    // center symbol
    const xShift = -105; // px
    const yShift = -160; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_AQUARIUS),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        //" 2.8866035,-2.8866035 3.8488047,1.9244023 m -4.8110059,-0.9622011 3.8488047,1.9244023 2.8866035,-2.8866035 2.8866035,1.9244023 m -3.84880467,-0.9622011 2.88660347,1.9244023 2.8866035,-2.8866035 1.9244024,1.9244023 m -2.8866035,-0.9622011 1.9244023,1.9244023 2.8866035,-2.8866035 m -17.319621,8.6598105 2.8866035,-2.88660348 3.8488047,1.92440238 m -4.8110059,-0.96220121 3.8488047,1.92440231 2.8866035,-2.88660348 2.8866035,1.92440238 m -3.84880467,-0.96220121 2.88660347,1.92440231 2.8866035,-2.88660348 1.9244024,1.92440238 m -2.8866035,-0.96220121 1.9244023,1.92440231 2.8866035,-2.88660348",
        //"m 101.42812,160.12199 c -1.668244,-0.31369 -5.246618,-2.02989 -5.673887,-2.72123 -0.366928,-0.5937 5.013167,-3.46329 6.493167,-3.46328 0.49528,1e-5 2.65706,0.71439 4.80395,1.5875 2.14689,0.87312 4.19408,1.58749 4.54931,1.58749 0.35523,0 0.96061,-0.27072 1.3453,-0.60162 0.61907,-0.5325 0.67702,-0.72103 0.50443,-1.64105 -0.12742,-0.6792 -0.58024,-1.45644 -1.30658,-2.24265 -1.18844,-1.28642 -4.58438,-5.82143 -5.16806,-6.90153 -0.19369,-0.35843 -0.38451,-0.94379 -0.42404,-1.3008 -0.19847,-1.7924 -3.18661,-4.43576 -5.0433,-4.46138 -0.55679,-0.008 -1.34617,-0.14089 -1.754168,-0.29601 -0.935734,-0.35577 -2.030286,-0.3647 -2.030286,-0.0166 0,0.33959 2.203459,2.54221 3.556174,3.55483 1.30984,0.98052 0.88151,1.14162 -1.10731,0.41646 -1.275806,-0.46518 -1.677814,-0.51065 -2.326328,-0.26312 -0.66492,0.25379 -0.723716,0.34647 -0.387119,0.6102 0.403086,0.31583 1.322917,2.102 1.322917,2.5689 0,0.14058 -0.130835,0.2556 -0.290743,0.2556 -0.159909,0 -0.665924,0.1641 -1.124479,0.36465 -0.458555,0.20056 -1.399284,0.56759 -2.090507,0.81564 -0.696011,0.24976 -1.256771,0.6183 -1.256771,0.82597 0,0.20625 0.04533,0.37499 0.100729,0.37499 0.287023,0 5.354041,-1.91641 5.533858,-2.09297 0.115846,-0.11376 -0.03702,-0.83512 -0.339702,-1.60303 l -0.550331,-1.3962 0.604285,0.15503 c 2.585951,0.6634 4.463321,1.03405 4.590971,0.90639 0.17592,-0.17592 -2.17367,-2.61243 -3.7221,-3.85978 l -1.058335,-0.85255 0.926045,0.17052 c 1.0667,0.19642 4.59078,3.48184 6.27468,5.84974 2.57537,3.62149 3.48185,4.83316 4.77167,6.37814 1.4822,1.77542 1.83735,3.06846 0.93762,3.41372 -0.43012,0.16506 -4.38059,-1.05994 -5.00478,-1.55192 -0.16327,-0.12869 -1.1753,-0.54137 -2.24896,-0.91708 -2.85146,-0.99781 -4.82072,-0.56343 -8.394842,1.85172 -0.778608,0.52614 -1.512744,0.95661 -1.631413,0.95661 -0.396855,0 -1.82897,-2.0295 -2.636205,-3.73585 -0.699344,-1.47829 -0.798632,-1.97659 -0.798815,-4.00902 -1.8e-4,-1.999 0.106845,-2.55702 0.771607,-4.02312 1.415751,-3.12237 3.555056,-5.13269 6.968437,-6.54828 2.460541,-1.02042 6.061191,-1.289 8.591251,-0.64083 5.04674,1.29292 8.55312,4.70716 9.50051,9.25086 1.04155,4.99529 -2.0007,10.16478 -7.29216,12.39107 -1.78313,0.75022 -2.32338,0.85034 -4.91381,0.91056 -1.60073,0.0372 -3.20807,0.0117 -3.57188,-0.0567 z m 2.63478,-17.74319 c -0.69255,-0.72799 -0.9141,-1.07477 -0.5366,-0.8399 0.58377,0.3632 2.09196,2.07982 1.82728,2.07982 -0.0611,0 -0.64192,-0.55796 -1.29068,-1.23992 z",
        "m 106.57722,170.39095 c -0.29609,-0.088 -0.69288,-0.28938 -0.88176,-0.44741 -0.30324,-0.25372 -0.21337,-0.25185 0.76859,0.016 1.02981,0.28089 1.20064,0.28118 2.31143,0.003 1.19196,-0.29764 1.1962,-0.29726 0.67999,0.0612 -0.59427,0.41266 -2.08465,0.60239 -2.87825,0.36641 z m 0.39984,-1.57974 c -0.36038,-0.13629 -0.8663,-0.29338 -1.12426,-0.34908 -0.59821,-0.12917 -0.87867,-0.62521 -0.50155,-0.88708 0.2107,-0.14631 0.53386,-0.0169 1.1784,0.47167 0.48844,0.37028 0.99023,0.67325 1.11509,0.67325 0.12485,0 0.62664,-0.30297 1.11509,-0.67325 0.64453,-0.48863 0.9677,-0.61798 1.1784,-0.47167 0.37696,0.26176 0.0969,0.75764 -0.50155,0.88791 -0.25797,0.0562 -0.76948,0.21324 -1.1367,0.34909 -0.55938,0.20692 -0.77395,0.20678 -1.32292,-7e-4 z m -1.58128,-3.39507 c -0.56171,-0.24752 -0.50292,-2.46885 0.0861,-3.25317 1.13777,-1.51502 3.18794,-1.51502 4.32572,0 0.58901,0.78432 0.6478,3.00565 0.0861,3.25317 -0.21828,0.0962 -1.23032,0.17489 -2.24896,0.17489 -1.01865,0 -2.03068,-0.0787 -2.24896,-0.17489 z m -2.40493,-2.2922 c -0.82265,-1.62507 -0.95116,-1.76595 -1.78516,-1.95708 -0.49428,-0.11327 -1.509876,-0.16506 -2.256896,-0.11507 -1.64097,0.1098 -2.40145,-0.0694 -3.56629,-0.84034 -0.84851,-0.56158 -2.42214,-2.00813 -2.42214,-2.22653 0,-0.0576 0.8632,-0.10288 1.91823,-0.10066 2.21151,0.005 3.42794,0.32265 5.211236,1.36228 0.85335,0.49748 1.36524,0.66654 1.86429,0.61568 0.68233,-0.0695 0.69393,-0.05 1.42071,2.39141 0.40301,1.35384 0.68094,2.49751 0.61762,2.54148 -0.0633,0.044 -0.51404,-0.70806 -1.0016,-1.67117 z m -3.415906,-3.04318 c 0.3363,-0.15444 0.29591,-0.23752 -0.26458,-0.54425 -1.06509,-0.58286 -2.40522,-0.9688 -3.69354,-1.06368 l -1.20125,-0.0885 0.79375,0.59786 c 1.32336,0.99677 3.4319,1.52734 4.36562,1.09854 z m 11.654266,4.55134 c 0.007,-0.12631 0.33435,-1.2631 0.7276,-2.52621 0.70245,-2.25621 0.72707,-2.29559 1.40132,-2.24119 0.47955,0.0387 1.0375,-0.14938 1.85208,-0.62429 1.77253,-1.0334 2.99241,-1.3515 5.20067,-1.35615 1.05503,-0.002 1.91823,0.0431 1.91823,0.10066 0,0.2184 -1.57363,1.66495 -2.42213,2.22653 -1.16485,0.77094 -1.92532,0.95014 -3.56629,0.84034 -0.74702,-0.05 -1.76263,0.002 -2.25691,0.11507 -0.83364,0.19105 -0.96261,0.33223 -1.78179,1.95043 -0.84049,1.66029 -1.10093,2.02806 -1.07278,1.51481 z m 6.99886,-4.71177 c 0.58208,-0.18714 1.41552,-0.60929 1.85208,-0.93811 l 0.79375,-0.59786 -1.20125,0.0885 c -1.28831,0.0949 -2.62844,0.48082 -3.69354,1.06368 -0.56049,0.30673 -0.60087,0.38981 -0.26458,0.54425 0.5853,0.26879 1.32536,0.22156 2.51354,-0.16043 z m -12.30522,-0.25826 c -2.13496,-0.59172 -2.48859,-0.76765 -2.28469,-1.13661 0.14964,-0.27078 0.36528,-0.29706 1.42994,-0.17427 0.68955,0.0795 1.84903,0.1446 2.57664,0.1446 0.7276,0 1.88709,-0.0651 2.57664,-0.1446 1.06465,-0.12279 1.28029,-0.0965 1.42994,0.17427 0.116,0.20993 0.005,0.38957 -0.32558,0.52579 -0.67116,0.27674 -3.34823,1.01472 -3.681,1.01472 -0.14552,0 -0.92037,-0.18176 -1.72189,-0.4039 z m -1.95844,-1.9457 c -0.9754,-0.10534 -1.06322,-0.16945 -1.53725,-1.12221 -2.40005,-4.82393 -4.461456,-12.00185 -4.430546,-15.42736 0.008,-0.94364 0.0827,-0.81977 1.04138,1.73989 1.087206,2.90275 3.298066,7.79562 5.495666,12.16253 1.05755,2.10149 1.23911,2.62852 0.93357,2.70993 -0.20862,0.0556 -0.39934,0.0893 -0.42382,0.075 -0.0245,-0.0143 -0.51003,-0.0763 -1.079,-0.13779 z m 5.76872,0.0385 c -0.1864,-0.0455 0.18486,-1.0207 1.02136,-2.68296 2.19894,-4.36964 4.40957,-9.26189 5.497,-12.16519 0.95871,-2.55966 1.03285,-2.68354 1.04137,-1.7399 0.0192,2.1296 -1.03923,6.95039 -2.27791,10.37494 -0.74589,2.06212 -2.43852,5.81839 -2.70088,5.99376 -0.21841,0.146 -2.19347,0.31385 -2.58094,0.21935 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "#000000");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /*
   * Pisces symbol path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGPathElement} path
   */
  pisces(x: number, y: number): Element {
    // center symbol
    const xShift = -95; // px
    const yShift = -170; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getSignWrapperId(this.settings.SYMBOL_PISCES),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        // " 4,2 2,2 1,3 0,3 -1,3 -2,2 -4,2 m 0,-17 3,1 2,1 2,2 1,3 m 0,3 -1,3 -2,2 -2,1 -3,1 m 16,-17 -3,1 -2,1 -2,2 -1,3 m 0,3 1,3 2,2 2,1 3,1 m 0,-17 -4,2 -2,2 -1,3 0,3 1,3 2,2 4,2 m -17,-9 18,0 m -18,1 18,0",
        //"m 99.797668,158.86501 c -2.043638,-0.84677 -4.313042,-2.41186 -4.069235,-2.80635 0.07244,-0.11721 0.580835,-0.28822 1.129764,-0.38002 0.548928,-0.0918 1.295707,-0.33532 1.659509,-0.54115 3.409224,-1.92885 3.036194,-1.85312 9.657154,-1.96057 3.34691,-0.0543 6.29371,-0.2103 6.54844,-0.34663 0.59662,-0.3193 0.5967,-1.19761 1.4e-4,-1.51639 -1.07821,-0.57614 -6.02042,-1.62328 -7.66147,-1.62328 -3.51422,0 -1.31307,-0.31825 3.46118,-0.50043 4.23889,-0.16176 4.97437,-0.25337 5.44364,-0.67805 0.54696,-0.495 0.6991,-1.34506 0.34009,-1.90026 -0.12861,-0.1989 -1.76106,-0.33469 -4.82459,-0.40132 -4.20257,-0.0914 -4.74017,-0.15708 -5.82083,-0.71114 -2.23692,-1.14689 -7.207743,-0.99683 -11.112504,0.33545 -1.091406,0.37239 -2.081695,0.67789 -2.200642,0.67891 -0.272712,0.002 -0.03586,-0.80672 0.751789,-2.56797 2.226212,-4.978 8.035477,-7.84062 14.177707,-6.98632 4.90111,0.68168 9.21147,4.16163 10.4556,8.44127 0.62223,2.14041 0.40614,5.29431 -0.49791,7.26712 -1.29049,2.81609 -4.04417,5.17904 -7.60529,6.52616 -1.1946,0.4519 -2.02382,0.54694 -4.63021,0.53073 -2.94098,-0.0183 -3.32443,-0.0817 -5.202332,-0.85976 z m -5.59222,-4.08834 c -1.157881,-1.27944 -2.468936,-5.5824 -2.114199,-6.93892 0.221396,-0.84662 4.811486,-2.07469 8.569621,-2.29279 2.69634,-0.15648 2.8649,-0.13395 4.36563,0.58349 1.48653,0.71066 1.77872,0.75156 6.12506,0.85748 3.58654,0.0874 4.56406,0.18727 4.56406,0.4663 0,0.19529 -0.13848,0.44067 -0.30774,0.54528 -0.16926,0.1046 -2.61155,0.28684 -5.4273,0.40497 -6.02253,0.25265 -7.15339,0.59386 -5.40034,1.62941 0.46274,0.27335 1.59963,0.51471 2.84427,0.60383 2.97163,0.21279 6.70361,1.00612 6.70361,1.42503 0,0.12819 -2.7682,0.27243 -6.15156,0.32054 l -6.15156,0.0875 -1.71979,0.88646 c -0.945889,0.48755 -1.838858,0.98256 -1.984379,1.10003 -0.191249,0.15438 -2.966176,0.79163 -3.447169,0.79163 -0.02348,0 -0.234177,-0.21159 -0.468214,-0.4702 z",
        "m 94.827126,175.71255 c -1.192135,-0.11616 -2.468654,-0.37966 -3.375507,-0.69676 l -0.730394,-0.2554 -1.563847,0.25964 c -0.860117,0.1428 -1.722291,0.27043 -1.915943,0.28363 -0.938318,0.0639 -3.204484,-1.84342 -3.971912,-3.34304 -0.214803,-0.41975 -0.509561,-1.12097 -0.655016,-1.55828 -0.145456,-0.4373 -0.294709,-0.8257 -0.331675,-0.8631 -0.119088,-0.12051 -0.06798,0.65524 0.09488,1.44016 0.349736,1.68557 1.448442,3.21326 2.953055,4.10607 l 0.672835,0.39925 -0.735735,0.0682 c -0.404654,0.0375 -1.004522,0.0945 -1.33304,0.12671 l -0.597306,0.0585 -0.504443,-0.54569 c -1.077942,-1.16609 -2.069425,-3.05191 -2.405897,-4.57605 -0.264802,-1.1995 -0.168512,-3.19982 0.202378,-4.2042 0.333906,-0.90423 0.463496,-1.04855 1.036788,-1.15463 0.55697,-0.10306 0.566254,0.007 0.06442,0.76122 -0.537504,0.80821 -0.466418,0.90546 0.182154,0.24918 0.51868,-0.52483 0.560152,-0.60565 0.57154,-1.11375 0.01844,-0.8227 0.594289,-1.33538 1.120929,-0.99797 0.232422,0.14891 -0.31014,1.78281 -0.795696,2.3962 -0.463733,0.58582 -0.671065,1.20329 -0.502582,1.49677 0.102523,0.17858 0.11786,0.16002 0.12072,-0.14612 0.0024,-0.25788 0.130354,-0.49547 0.483432,-0.89774 0.264086,-0.30088 0.53775,-0.65594 0.608143,-0.78904 0.187387,-0.35429 0.417376,-1.28782 0.418849,-1.70012 0.0033,-0.92537 0.673926,-1.5357 1.943331,-1.76862 0.348729,-0.064 0.769585,-0.18788 0.935236,-0.27531 0.16565,-0.0874 0.37391,-0.16024 0.462799,-0.16179 0.08889,-0.002 0.642163,-0.29622 1.229496,-0.65482 0.587333,-0.35859 1.099626,-0.65199 1.13843,-0.65199 0.0388,0 0.178877,-0.26446 0.311276,-0.58769 0.361,-0.88132 0.527246,-0.99052 1.505653,-0.98904 0.724659,0.001 0.903143,0.0441 1.463943,0.35289 l 0.638665,0.35165 h 1.6581 c 1.601163,0 1.670185,0.009 2.010078,0.27165 0.193589,0.14941 0.505508,0.30273 0.693152,0.3407 0.381702,0.0772 0.434848,0.20144 0.151798,0.35472 -0.137304,0.0744 -0.25909,0.0454 -0.442916,-0.10518 -0.294613,-0.2414 -1.110788,-0.27878 -1.791966,-0.0821 l -0.430979,0.12446 0.323234,0.0987 c 0.177779,0.0543 0.638388,0.0728 1.023575,0.0412 0.83473,-0.0686 1.128415,0.0482 0.741488,0.29482 -0.14115,0.09 -0.402092,0.24055 -0.579871,0.33464 l -0.323234,0.17107 0.409394,0.004 c 0.503932,0.005 0.879066,-0.18597 1.362594,-0.695 0.313235,-0.32975 0.443832,-0.39088 0.835022,-0.39088 0.457196,0 0.556203,0.0749 0.367476,0.27801 -0.05293,0.057 -0.146814,0.34899 -0.208627,0.64894 -0.06181,0.29995 -0.144176,0.64337 -0.183028,0.76317 -0.05096,0.15713 0.02216,0.11862 0.262499,-0.13825 0.183227,-0.19582 0.33314,-0.4706 0.33314,-0.61062 0,-0.14001 0.053,-0.40841 0.11778,-0.59644 0.09391,-0.27259 0.208552,-0.36651 0.565662,-0.46342 0.24633,-0.0668 0.47501,-0.13822 0.50817,-0.1586 0.0332,-0.0204 0.0401,0.24574 0.0154,0.59139 -0.0247,0.34565 -0.0251,0.723 -9.9e-4,0.83854 0.0717,0.34276 0.41019,-0.40695 0.41019,-0.90842 0,-0.23137 0.0606,-0.4986 0.13468,-0.59383 0.0741,-0.0952 0.7106,-0.36218 1.41451,-0.59322 l 1.27982,-0.42006 0.41135,-0.61225 c 0.84015,-1.25049 1.29859,-1.4437 3.43981,-1.44971 1.61341,-0.005 1.92477,0.0786 2.62477,0.70047 0.49158,0.43674 0.5839,0.60577 0.71609,1.3111 0.0814,0.43438 0.0685,0.6411 -0.0592,0.9505 -0.13485,0.32657 -0.14157,0.49348 -0.0386,0.95893 0.0842,0.38056 0.0898,0.62651 0.0174,0.75745 -0.0969,0.17527 -0.13111,0.16123 -0.35562,-0.14603 -0.18101,-0.24775 -0.28445,-0.30964 -0.38141,-0.22822 -0.0991,0.0832 -0.16525,0.013 -0.25911,-0.27483 -0.0694,-0.2126 -0.16111,-0.38655 -0.20392,-0.38655 -0.16015,0 -0.33643,0.27027 -0.33643,0.51583 0,0.1398 -0.0718,0.28207 -0.15964,0.31617 -0.12155,0.0472 -0.13322,0.11196 -0.0489,0.27139 0.18235,0.34477 0.007,0.4481 -0.33776,0.19945 l -0.31567,-0.22745 -0.008,0.47078 c -0.009,0.56651 -0.13468,0.95144 -0.2492,0.76394 -0.0432,-0.0707 -0.18028,-0.18359 -0.30472,-0.25098 -0.22199,-0.12022 -0.22501,-0.10889 -0.15967,0.59904 0.0811,0.87859 -0.0567,0.94209 -0.50086,0.23078 -0.1684,-0.26973 -0.35022,-0.49042 -0.40404,-0.49042 -0.0538,0 -0.0999,0.18398 -0.10245,0.40884 l -0.005,0.40884 -0.4143,-0.47734 c -0.40586,-0.46763 -0.64511,-0.51931 -0.66247,-0.14311 -0.005,0.11351 -0.0294,0.13199 -0.0629,0.0481 -0.0658,-0.16505 -0.64212,-0.18215 -0.73996,-0.022 -0.048,0.0786 -0.11587,0.0757 -0.21713,-0.009 -0.21287,-0.17877 -0.37223,-0.0325 -0.37223,0.34172 0,0.28922 -0.0324,0.32133 -0.2963,0.29339 -0.25238,-0.0267 -0.30135,0.0131 -0.33039,0.26843 -0.0345,0.30321 -0.16705,0.39069 -0.28914,0.19079 -0.15209,-0.249 -0.26936,-0.0774 -0.26936,0.39413 v 0.50315 l -0.2588,-0.17159 c -0.24821,-0.16456 -0.26167,-0.16001 -0.32897,0.11133 l -0.0702,0.2829 -0.29646,-0.2874 c -0.35723,-0.34631 -0.44629,-0.35872 -0.44629,-0.0622 0,0.28217 -0.18756,0.64698 -0.33263,0.64698 -0.0602,0 -0.16026,-0.14718 -0.22224,-0.32707 l -0.11268,-0.32708 h -0.94308 c -0.5187,0 -1.107897,0.0568 -1.309334,0.12632 -0.487044,0.16798 -1.282078,0.72167 -1.282078,0.89289 0,0.23559 1.047527,1.33803 1.666233,1.75358 0.325771,0.2188 0.813689,0.48085 1.084269,0.58232 0.43187,0.16197 0.50449,0.16475 0.59464,0.0228 0.0906,-0.14268 0.11515,-0.14246 0.20868,0.002 0.0583,0.0899 0.12111,0.20701 0.13958,0.26016 0.0185,0.0531 0.14195,0.0286 0.2744,-0.0545 0.20759,-0.13028 0.25464,-0.12864 0.34102,0.0119 0.0861,0.14012 0.1215,0.13353 0.25189,-0.0469 0.14807,-0.20489 0.15481,-0.20401 0.28219,0.0368 0.1268,0.23973 0.13667,0.2411 0.34715,0.0483 0.20987,-0.19218 0.22179,-0.19161 0.3809,0.0182 0.0966,0.12737 0.18295,0.16683 0.20964,0.0958 0.025,-0.0665 0.10999,-0.21021 0.18894,-0.31947 0.13705,-0.18964 0.14925,-0.18787 0.26927,0.0391 0.2116,0.40007 0.44137,0.29679 0.44137,-0.1984 0,-0.56413 0.21881,-0.57504 0.54658,-0.0273 l 0.24463,0.40884 0.11618,-0.39992 c 0.17313,-0.59592 0.24423,-0.60256 0.51063,-0.0477 0.23585,0.4912 0.24641,0.49849 0.3748,0.25849 0.1278,-0.23893 0.13953,-0.2301 0.35988,0.2709 0.23617,0.53695 0.36595,0.63435 0.47214,0.35433 0.0876,-0.23102 0.24896,-0.20292 0.31561,0.055 0.0377,0.14576 0.11359,0.19632 0.22805,0.15187 0.0944,-0.0366 0.17159,-0.0123 0.17159,0.0541 0,0.0695 0.19411,0.12008 0.45792,0.11925 0.33279,-0.001 0.67514,-0.12334 1.25296,-0.44757 l 0.79506,-0.44612 -0.06,-0.58817 c -0.033,-0.32349 -0.0185,-0.58816 0.0321,-0.58816 0.1681,0 0.53633,0.56719 0.6531,1.00598 0.10649,0.40016 0.1289,0.41972 0.30063,0.26246 0.24236,-0.22194 0.66248,-0.11538 0.66248,0.16802 0,0.11648 0.0485,0.18145 0.10775,0.14439 0.15352,-0.096 0.13555,0.52788 -0.0197,0.68501 -0.0741,0.075 -0.1163,0.37298 -0.10079,0.71177 0.0244,0.53313 -0.01,0.62931 -0.39994,1.12891 -0.48593,0.62204 -1.28065,1.24681 -1.98969,1.56417 -0.52082,0.23312 -2.32633,0.68859 -4.49326,1.1335 -4.56607,0.93748 -7.516404,1.20206 -10.338134,0.92711 z m 11.059184,-3.60358 c 0.37208,-0.12717 0.73781,-0.30762 0.81275,-0.40099 0.11343,-0.14135 0.10822,-0.15918 -0.0311,-0.1065 -0.11358,0.0429 -0.21188,-0.0385 -0.30593,-0.25353 -0.0762,-0.17424 -0.22945,-0.36601 -0.34051,-0.42615 -0.18171,-0.0984 -0.20915,-0.0541 -0.27422,0.4422 l -0.0723,0.55154 -0.19226,-0.31989 c -0.26672,-0.4438 -0.42762,-0.52144 -0.50003,-0.24128 -0.0555,0.21486 -0.0753,0.21968 -0.24879,0.0608 -0.17209,-0.15759 -0.19433,-0.15719 -0.25567,0.005 -0.0369,0.0974 -0.0672,0.29579 -0.0672,0.4408 0,0.37111 -0.18428,0.32853 -0.26909,-0.0622 -0.098,-0.45157 -0.24779,-0.50674 -0.39115,-0.14409 l -0.12111,0.30638 -0.0867,-0.30679 c -0.12603,-0.44597 -0.32745,-0.66939 -0.44066,-0.4888 -0.0488,0.0778 -0.0894,0.25183 -0.0903,0.38675 -0.002,0.29218 0.048,0.28773 -0.80236,0.0716 -0.67236,-0.1709 -0.68447,-0.18057 -0.7507,-0.59963 -0.079,-0.50013 -0.23886,-0.54701 -0.42013,-0.12324 -0.18972,0.44351 -0.46466,0.33349 -0.55228,-0.221 -0.12716,-0.80464 -0.40688,-0.95572 -0.605437,-0.327 -0.140025,0.44338 -0.27971,0.64804 -0.375883,0.55073 -0.03349,-0.0339 -0.119152,-0.30046 -0.190349,-0.59237 -0.0712,-0.29191 -0.177934,-0.52326 -0.237193,-0.51411 -0.05926,0.009 -0.195991,0.29124 -0.303848,0.62689 -0.173591,0.54021 -0.229248,0.61018 -0.484851,0.60957 -0.211609,-5e-4 -0.341074,-0.0937 -0.484612,-0.3488 -0.156014,-0.27728 -0.215961,-0.31596 -0.294648,-0.1901 -0.05433,0.0869 -0.09953,0.29292 -0.100435,0.45782 -0.0022,0.39454 -0.157557,0.38151 -0.324885,-0.0273 -0.07364,-0.17989 -0.196881,-0.32708 -0.273872,-0.32708 -0.07699,0 -0.171932,0.14719 -0.210979,0.32708 -0.08802,0.40551 -0.321745,0.4293 -0.353911,0.036 -0.02917,-0.3566 -0.07483,-0.40822 -0.287911,-0.32549 -0.09144,0.0355 -0.166264,0.19284 -0.166264,0.34963 0,0.32823 -0.246848,0.31644 -0.307892,-0.0147 -0.09404,-0.51016 -0.50811,-0.6503 -0.617566,-0.20901 -0.03718,0.14991 -0.112045,0.27256 -0.166359,0.27256 -0.220638,0 -1.694772,-0.82335 -2.255877,-1.25998 -0.794307,-0.6181 -1.116277,-1.0676 -1.284078,-1.7927 -0.07632,-0.3298 -0.179238,-0.76859 -0.228706,-0.97509 -0.04947,-0.2065 -0.07871,-0.38682 -0.06498,-0.40071 0.01373,-0.0139 0.226312,0.0291 0.472406,0.0956 0.363814,0.0983 0.45879,0.17825 0.508147,0.42796 0.07519,0.38042 0.254833,0.39841 0.345081,0.0346 0.03718,-0.14991 0.137938,-0.27256 0.223901,-0.27256 0.08596,0 0.127549,0.0471 0.09241,0.10458 -0.06905,0.11306 0.160595,0.54956 0.28913,0.54956 0.04311,0 0.146687,-0.13191 0.230167,-0.29312 l 0.151782,-0.29313 0.188271,0.3684 c 0.177957,0.34822 0.196394,0.35716 0.336511,0.16326 0.08153,-0.11282 0.148421,-0.30614 0.148642,-0.4296 3.25e-4,-0.1806 0.04357,-0.15282 0.221296,0.14216 0.248106,0.41179 0.311314,0.39592 0.412264,-0.10354 l 0.07026,-0.3476 0.315844,0.50561 c 0.173714,0.27808 0.373316,0.50561 0.44356,0.50561 0.074,0 0.158855,-0.25218 0.201757,-0.59963 0.04072,-0.3298 0.106915,-0.59926 0.147095,-0.5988 0.04018,4.6e-4 0.183595,0.19671 0.318699,0.4361 0.135104,0.23939 0.287025,0.43526 0.337604,0.43526 0.127946,0 0.221625,-0.4036 0.223367,-0.96233 l 0.0015,-0.47172 0.278939,0.33544 c 0.390048,0.46905 0.495776,0.42173 0.46279,-0.20714 -0.03493,-0.66589 0.03222,-0.74979 0.312005,-0.38987 0.294413,0.37873 0.346948,0.35261 0.346948,-0.1725 v -0.4508 l 0.224117,0.2883 c 0.284792,0.36636 0.422351,0.27994 0.422351,-0.26533 0,-0.23631 0.04848,-0.42966 0.107745,-0.42966 0.05926,0 0.107745,0.0682 0.107745,0.15146 0,0.0833 0.09337,0.26728 0.207485,0.40884 0.223009,0.27664 0.242099,0.25771 0.379961,-0.37675 0.07978,-0.36717 0.417606,-0.36685 0.469533,4.4e-4 0.01837,0.12995 0.103217,0.2949 0.188545,0.36655 0.12747,0.10705 0.18304,0.0627 0.31163,-0.24871 0.15565,-0.37694 0.16104,-0.37934 0.99665,-0.44465 0.46209,-0.0361 0.94221,-0.0962 1.06694,-0.13353 0.1798,-0.0538 0.27391,0.013 0.45428,0.32228 0.12512,0.21459 0.27595,0.39017 0.33517,0.39017 0.0592,0 0.14011,-0.24747 0.17976,-0.54992 0.0621,-0.47343 0.11877,-0.57364 0.40775,-0.72051 0.18461,-0.0938 0.54036,-0.37037 0.79054,-0.61452 0.43124,-0.42087 0.46527,-0.43441 0.65495,-0.26071 0.35738,0.32726 0.48866,0.23415 0.41689,-0.29569 -0.0609,-0.44938 -0.046,-0.48681 0.24076,-0.60701 0.28102,-0.11779 0.33929,-0.0968 0.72363,0.26037 l 0.418,0.38847 0.0325,-0.48148 c 0.0319,-0.47314 0.0403,-0.48283 0.48343,-0.55858 0.24801,-0.0424 0.6236,-0.13873 0.83463,-0.21407 0.31621,-0.1129 0.41957,-0.11044 0.58768,0.0139 0.33257,0.24607 0.48603,0.18374 0.48603,-0.19744 0,-0.23071 0.10006,-0.45512 0.29629,-0.66449 l 0.2963,-0.31613 -0.38437,0.22742 c -0.55546,0.32865 -1.5031,0.6385 -2.56654,0.83918 -1.25181,0.23623 -1.50335,0.35776 -2.30768,1.11491 -1.42511,1.34152 -2.19432,1.62494 -4.73914,1.7462 l -1.680535,0.0801 -0.76127,0.54128 c -1.333207,0.94792 -1.872164,1.25253 -2.630246,1.48655 -0.637315,0.19675 -0.913284,0.21974 -1.993278,0.16604 -1.636147,-0.0813 -2.55386,-0.29613 -3.283661,-0.76852 -1.220538,-0.79004 -2.091788,-1.05034 -2.827562,-0.84477 -0.359567,0.10046 -1.922132,1.20066 -1.833139,1.29071 0.0218,0.0221 0.420993,-0.19446 0.887096,-0.48115 0.766954,-0.47173 0.908873,-0.52088 1.493929,-0.51737 0.80994,0.005 1.703932,0.43208 1.974877,0.94374 0.09901,0.18698 0.339939,0.51534 0.535397,0.7297 l 0.35538,0.38975 -0.218122,-0.42962 c -0.253346,-0.49899 -0.212182,-0.61933 0.110763,-0.3238 0.260386,0.23829 0.570101,0.82452 0.680427,1.28792 l 0.07534,0.31645 -0.276206,-0.18312 c -0.151913,-0.10072 -0.409241,-0.23111 -0.571839,-0.28975 -0.260107,-0.0938 -0.244878,-0.0642 0.126732,0.24645 0.232301,0.19419 0.549819,0.55643 0.705596,0.80499 0.54535,0.87013 2.227485,2.12174 3.506076,2.60871 0.580299,0.22102 0.898197,0.26823 1.806213,0.26823 0.60608,0 1.441342,-0.0727 1.856137,-0.16164 1.105673,-0.23698 1.79717,-0.20782 2.675705,0.11285 0.41933,0.15306 1.27369,0.39597 1.89857,0.53981 0.62489,0.14383 1.23313,0.28521 1.35165,0.31417 0.35401,0.0865 1.13237,-0.0292 1.85237,-0.27525 z m 1.9995,-0.60596 c 0.18802,-0.10673 0.0545,-0.49793 -0.30883,-0.90488 -0.55622,-0.62298 -0.73536,-0.58736 -0.64163,0.12757 0.10521,0.80256 0.22002,0.98019 0.57767,0.89375 0.16059,-0.0388 0.32835,-0.0912 0.37279,-0.11644 z m 1.27388,0.0718 c 0.20506,-0.11105 0.20438,-0.12182 -0.034,-0.54429 -0.13377,-0.23704 -0.27739,-0.43137 -0.31915,-0.43183 -0.10761,-0.001 -0.22959,0.72779 -0.15478,0.92505 0.0732,0.19292 0.21894,0.20758 0.50795,0.0511 z m -21.10538,-0.37458 c 0.355269,-0.16611 0.354064,-0.16652 -0.314363,-0.10686 -0.755849,0.0674 -0.946858,-0.004 -1.591641,-0.59369 -0.237038,-0.21686 -0.571657,-0.5049 -0.743598,-0.64009 l -0.31262,-0.24581 0.420365,-0.38642 c 0.2312,-0.21253 0.370898,-0.37134 0.310439,-0.3529 -0.06046,0.0184 -0.630159,0.22792 -1.266001,0.46552 -1.158381,0.43286 -1.48544,0.66553 -0.778969,0.55415 1.198054,-0.18887 1.051732,-0.23009 1.70052,0.479 1.032727,1.12872 1.565162,1.29968 2.575868,0.8271 z m 22.46232,0.0981 c 0.0769,-0.2027 -0.14743,-1.02755 -0.27942,-1.02755 -0.15826,0 -0.45468,0.75926 -0.38417,0.98404 0.0824,0.2626 0.56842,0.29447 0.66359,0.0435 z m 0.6613,-0.57599 c 0.1138,-0.073 0.10645,-0.17655 -0.0386,-0.54345 -0.0986,-0.24928 -0.21678,-0.45323 -0.26269,-0.45323 -0.10495,0 -0.21296,0.39731 -0.21489,0.79042 -0.002,0.30978 0.21815,0.39755 0.51622,0.20626 z m -5.30234,-0.21714 c -0.0311,-0.051 -0.45823,-0.12529 -0.94912,-0.16516 -1.69913,-0.13803 -2.99987,-0.52257 -5.633303,-1.66539 -0.959552,-0.41642 -0.983802,-0.42072 -2.316512,-0.41158 -1.141589,0.008 -1.494569,0.0546 -2.316513,0.30699 -1.023758,0.31434 -1.814541,0.70086 -1.806628,0.88304 0.0058,0.13365 1.259949,0.57531 2.057004,0.72441 0.446921,0.0836 0.880579,0.0664 1.837353,-0.073 0.688797,-0.10034 1.26703,-0.1965 1.284962,-0.21369 0.01793,-0.0172 -0.136887,-0.13725 -0.344041,-0.2668 -0.499441,-0.31234 -1.551734,-0.47894 -2.52563,-0.39987 -0.912941,0.0741 -1.025895,-0.10158 -0.225468,-0.35072 1.186074,-0.36917 3.136555,-0.10213 5.379046,0.73646 1.63737,0.61229 2.23704,0.79419 2.90672,0.88166 0.86282,0.11271 2.71847,0.12226 2.65213,0.0137 z m -20.113923,-3.39863 c 0.439205,-0.26001 1.045269,-0.53336 1.34681,-0.60744 0.466761,-0.11466 0.500209,-0.13858 0.225022,-0.16091 -0.775884,-0.063 -1.248906,0.0844 -2.269194,0.70693 -0.479132,0.29234 -0.761737,0.39093 -1.124766,0.39239 -0.365488,0.001 -0.445064,0.0296 -0.323234,0.11407 0.08889,0.0617 0.428285,0.0931 0.754213,0.0699 0.458055,-0.0326 0.773897,-0.14954 1.391149,-0.51496 z m 0.894291,-2.94115 c 0.05371,0 0.0677,0.0491 0.03107,0.10902 -0.130131,0.21306 0.183737,0.1041 0.664717,-0.23075 0.518064,-0.36067 2.632583,-1.40461 2.845063,-1.40461 0.08995,0 0.08568,-0.0492 -0.01489,-0.17185 -0.216169,-0.26356 0.03183,-0.35394 0.684636,-0.24952 0.464395,0.0743 0.62867,0.0523 0.974811,-0.13023 0.228962,-0.12076 0.588709,-0.25581 0.799437,-0.30011 0.377989,-0.0795 0.68162,-0.3747 0.536439,-0.52161 -0.09392,-0.095 -1.005908,0.24694 -1.399132,0.52466 -0.243103,0.17169 -0.445767,0.20296 -1.13132,0.17458 -0.821054,-0.034 -0.8357,-0.03 -0.866973,0.23798 -0.02644,0.22657 -0.190079,0.34615 -0.969703,0.70866 -0.515841,0.23985 -1.024771,0.42404 -1.130957,0.40931 -0.519396,-0.072 -2.959281,1.52746 -2.981531,1.95458 -0.0021,0.0409 0.415647,-0.19213 0.928397,-0.51786 0.512749,-0.32574 0.976219,-0.59225 1.029934,-0.59225 z m 5.202821,-0.56589 c 0.444238,-0.11112 1.230835,-0.82658 1.775154,-1.6146 0.303082,-0.43878 0.228637,-0.39524 -0.751579,0.43953 -0.794573,0.67668 -1.037721,0.81876 -1.660184,0.97008 -0.290875,0.0707 -0.627209,0.19827 -0.747407,0.28346 -0.19687,0.13953 -0.16045,0.14867 0.367247,0.0921 0.322184,-0.0345 0.77973,-0.11129 1.016769,-0.17059 z m -0.07719,-2.16075 c 0.51667,-0.31876 0.550649,-0.52357 0.147351,-0.8882 -0.473485,-0.42808 -0.701684,-0.4225 -0.487506,0.0119 0.141006,0.28601 0.139774,0.35907 -0.01103,0.65415 -0.205636,0.40237 -0.301989,0.41393 -0.52894,0.0634 -0.221664,-0.34232 -0.220399,-0.58895 0.0043,-0.84019 0.158158,-0.17684 0.159241,-0.19938 0.0096,-0.19938 -0.224115,0 -0.745538,0.63613 -0.704499,0.85948 0.03689,0.20075 0.678209,0.55762 1.001456,0.55726 0.118519,-1.3e-4 0.374695,-0.0985 0.569278,-0.2185 z m 0.821317,-1.02199 c -0.202359,-0.5336 -1.667108,-0.94321 -1.985352,-0.5552 -0.19123,0.23315 -0.08084,0.29646 0.276938,0.15882 0.262311,-0.10092 0.402935,-0.0671 1.011582,0.24308 0.388805,0.19816 0.720182,0.35467 0.736391,0.34781 0.01621,-0.007 -0.0016,-0.0944 -0.03956,-0.19451 z m 14.995055,-2.37057 c 0.12027,-0.19691 -0.18655,-0.3098 -0.84685,-0.31157 -0.44026,-0.001 -0.64015,0.0438 -0.6817,0.15335 -0.06,0.15819 0.12814,0.61131 0.30159,0.72638 0.11205,0.0743 1.11947,-0.39217 1.22696,-0.56816 z",
    );
    node.setAttribute("stroke", this.settings.SIGNS_COLOR);
    node.setAttribute("stroke-width", this.settings.SIGNS_STROKE.toString());
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /**
   * Draw As symbol
   */
  ascendant(x: number, y: number): Element {
    // center symbol
    const xShift = 12; // px
    const yShift = -2; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        " -0.563078,-1.1261527 -1.689228,-0.5630765 -1.689229,0 -1.68923,0.5630765 -0.563076,1.1261527 0.563076,1.12615272 1.126154,0.56307636 2.815381,0.56307635 1.126152,0.56307647 0.563078,1.1261526 0,0.5630763 -0.563078,1.1261528 -1.689228,0.5630764 -1.689229,0 -1.68923,-0.5630764 -0.563076,-1.1261528 m -6.756916,-10.135374 -4.504611,11.8246032 m 4.504611,-11.8246032 4.504611,11.8246032 m -7.3199925,-3.94153457 5.6307625,0",
    );
    node.setAttribute("stroke", this.settings.SYMBOL_AXIS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (
        this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE
      ).toString(),
    );
    node.setAttribute("fill", "none");

    wrapper.appendChild(node);

    return wrapper;
  }

  /**
   * Draw Ds symbol
   */
  descendant(x: number, y: number): Element {
    // center symbol
    const xShift = 22; // px
    const yShift = -1; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        " -0.5625,-1.125 -1.6875,-0.5625 -1.6875,0 -1.6875,0.5625 -0.5625,1.125 0.5625,1.125 1.125,0.5625 2.8125,0.5625 1.125,0.5625 0.5625,1.125 0,0.5625 -0.5625,1.125 -1.6875,0.5625 -1.6875,0 -1.6875,-0.5625 -0.5625,-1.125 m -11.25,-10.125 0,11.8125 m 0,-11.8125 3.9375,0 1.6875,0.5625 1.125,1.125 0.5625,1.125 0.5625,1.6875 0,2.8125 -0.5625,1.6875 -0.5625,1.125 -1.125,1.125 -1.6875,0.5625 -3.9375,0",
    );
    node.setAttribute("stroke", this.settings.SYMBOL_AXIS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (
        this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE
      ).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /**
   * Draw MC symbol
   */
  mediumCoeli(x: number, y: number): Element {
    // center symbol
    const xShift = 19; // px
    const yShift = -4; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        " -1.004085,-1.0040845 -1.004084,-0.5020423 -1.506127,0 -1.004085,0.5020423 -1.004084,1.0040845 -0.502043,1.50612689 0,1.00408458 0.502043,1.50612683 1.004084,1.0040846 1.004085,0.5020423 1.506127,0 1.004084,-0.5020423 1.004085,-1.0040846 m -17.57148,-9.0367612 0,10.5428881 m 0,-10.5428881 4.016338,10.5428881 m 4.016338,-10.5428881 -4.016338,10.5428881 m 4.016338,-10.5428881 0,10.5428881",
    );
    node.setAttribute("stroke", this.settings.SYMBOL_AXIS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (
        this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE
      ).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  /**
   * Draw IC symbol
   */
  immumCoeli(x: number, y: number): Element {
    // center symbol
    const xShift = 19; // px
    const yShift = 2; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m " +
        x +
        ", " +
        y +
        " -1.208852,-1.2088514 -1.208851,-0.6044258 -1.813278,0 -1.208852,0.6044258 -1.20885,1.2088514 -0.604426,1.81327715 0,1.20885135 0.604426,1.8132772 1.20885,1.2088513 1.208852,0.6044259 1.813278,0 1.208851,-0.6044259 1.208852,-1.2088513 m -11.4840902,-10.8796629 0,12.6929401",
    );
    node.setAttribute("stroke", this.settings.SYMBOL_AXIS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (
        this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE
      ).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    return wrapper;
  }

  number1(x: number, y: number): Element {
    // center symbol
    const xShift = 0; // px
    const yShift = -3; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_1),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.5128753,7.7578884 1.00515009,0 m 3.01545031,-9.5832737 -1.0051501,1.8253853 -2.51287527,7.7578884 m 3.51802537,-9.5832737 -3.01545031,9.5832737 m 3.01545031,-9.5832737 -1.5077251,1.3690388 -1.50772521,0.9126929 -1.00515009,0.4563463 m 2.5128753,-0.9126927 -1.00515016,0.4563464 -1.50772514,0.4563463",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number2(x: number, y: number): Element {
    // center symbol
    const xShift = -2; // px
    const yShift = -3; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_2),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number3(x: number, y: number): Element {
    // center symbol
    const xShift = -2; // px
    const yShift = -3; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_3),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " 0,-0.4545454 0.45454549,0 0,0.9090909 -0.90909089,0 0,-0.9090909 0.4545454,-0.9090909 0.45454549,-0.4545455 1.36363636,-0.4545454 1.36363635,0 1.3636364,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.4545455,0.4545454 -0.9090909,0.4545455 -1.36363635,0.4545454 m 2.27272725,-4.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.4545454,0.4545454 m -0.4545455,-3.6363636 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -0.90909095,0.4545454 m -0.9090909,0 0.9090909,0 1.36363635,0.4545455 0.4545455,0.45454542 0.4545454,0.90909091 0,1.36363637 -0.4545454,0.9090909 -0.9090909,0.4545455 -1.3636364,0.4545454 -1.3636364,0 -1.3636363,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.90909091 0.9090909,0 0,0.90909091 -0.4545455,0 0,-0.45454546 m 5,-1.81818182 0.4545455,0.90909091 0,1.36363637 -0.4545455,0.9090909 m -1.36363635,-4.0909091 0.90909095,0.4545455 0.4545454,0.90909088 0,1.81818182 -0.4545454,0.9090909 -0.45454549,0.4545455 -0.90909091,0.4545454",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number4(x: number, y: number): Element {
    // center symbol
    const xShift = 1; // px
    const yShift = -4; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_4),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.28678383,7.7750651 0.91471356,0 m 2.74414057,-9.6044922 -0.9147135,1.8294271 -2.28678386,7.7750651 m 3.20149736,-9.6044922 -2.74414057,9.6044922 m 2.74414057,-9.6044922 -7.3177083,6.8603516 7.3177083,0",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number5(x: number, y: number): Element {
    // center symbol
    const xShift = -2; // px
    const yShift = -5; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_5),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.27272725,4.5454545 m 2.27272725,-4.5454545 4.54545455,0 m -4.54545455,0.4545454 3.63636365,0 m -4.0909091,0.4545455 2.2727273,0 1.8181818,-0.4545455 0.9090909,-0.4545454 m -6.8181818,4.5454545 0.4545454,-0.4545454 1.3636364,-0.4545455 1.36363636,0 1.36363634,0.4545455 0.4545455,0.4545454 0.4545454,0.90909092 0,1.36363638 -0.4545454,1.3636364 -0.9090909,0.9090909 -1.81818185,0.4545454 -1.36363635,0 -0.9090909,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.9090909 0.9090909,0 0,0.9090909 -0.4545455,0 0,-0.45454545 m 5,-2.72727275 0.4545455,0.90909092 0,1.36363638 -0.4545455,1.3636364 -0.9090909,0.9090909 m -0.45454544,-5.4545455 0.90909094,0.4545455 0.4545454,0.9090909 0,1.8181818 -0.4545454,1.3636364 -0.90909094,0.9090909 -0.90909091,0.4545454",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number6(x: number, y: number): Element {
    // center symbol
    const xShift = 3; // px
    const yShift = -3; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_6),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " 0,-0.4545455 -0.4545455,0 0,0.9090909 0.9090909,0 0,-0.9090909 -0.4545454,-0.9090909 -0.909091,-0.4545454 -1.3636363,0 -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 1.36363637,0 1.36363633,-0.4545454 0.9090909,-0.9090909 0.4545455,-0.90909096 0,-1.36363636 -0.4545455,-0.90909088 -0.4545454,-0.4545455 -0.9090909,-0.4545454 -1.36363638,0 -0.90909092,0.4545454 -0.4545454,0.4545455 -0.4545455,0.90909088 m 1.36363636,-4.54545458 -0.90909086,1.3636364 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 4.0909091,-0.4545454 0.4545454,-0.90909096 0,-1.36363636 -0.4545454,-0.90909088 m -0.9090909,-5 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 1.36363637,0 0.90909093,-0.4545454 0.4545454,-0.4545455 0.4545455,-1.36363636 0,-1.81818182 -0.4545455,-0.90909092 -0.4545454,-0.4545454",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number7(x: number, y: number): Element {
    // center symbol
    const xShift = -4; // px
    const yShift = -4; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_7),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -0.9090909,2.7272727 m 6.8181818,-2.7272727 -0.4545454,1.3636363 -0.909091,1.3636364 -1.8181818,2.2727273 -0.90909088,1.36363633 -0.45454546,1.36363637 -0.45454545,1.8181818 m 0.90909091,-3.63636362 -0.90909091,1.81818182 -0.45454546,1.8181818 m 4.09090905,-6.8181818 -2.72727268,2.72727272 -0.90909091,1.36363637 -0.45454546,0.90909091 -0.45454545,1.8181818 0.90909091,0 m -1.36363641,-8.1818182 1.36363641,-1.3636363 0.90909091,0 2.27272728,1.3636363 m -3.63636365,-0.9090909 1.36363637,0 2.27272728,0.9090909 m -4.5454546,0 0.90909095,-0.4545454 1.36363637,0 2.27272728,0.4545454 0.9090909,0 0.4545455,-0.4545454 0.4545454,-0.9090909",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number8(x: number, y: number): Element {
    // center symbol
    const xShift = -1; // px
    const yShift = -5; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_8),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -1.3631244,0.4543748 -0.4543748,0.4543748 -0.4543748,0.9087496 0,1.3631244 0.4543748,0.9087496 0.9087496,0.4543748 1.3631244,0 1.3631244,-0.4543748 0.9087496,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 -0.9087496,-0.4543748 -1.8174992,0 m 0.9087496,0 -2.271874,0.4543748 m 0,0.4543748 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.4543748 m -0.4543748,0 1.3631244,0.4543748 m 0.4543748,0 1.8174992,-0.4543748 m 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 m 0.4543748,0 -1.8174992,-0.4543748 m -0.9087496,0 -0.9087496,0.9087496 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.9087496 m 1.3631244,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.8174992 -0.4543748,-0.9087496 m -2.7262488,4.543748 -1.8174992,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 1.3631244,0.4543748 1.8174992,0 1.8174992,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 -0.4543748,-0.45437484 -0.9087496,-0.4543748 m -0.9087496,0 -2.271874,0.4543748 m 0.4543748,0 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 m -0.4543748,0 2.271874,0.4543748 2.7262488,-0.4543748 m 0,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 m 0,-0.45437484 -1.3631244,-0.4543748 m -0.9087496,0 -0.9087496,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 0.4543748,0.4543748 m 1.8174992,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.81749916 -0.4543748,-0.90874964 -0.4543748,-0.4543748",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number9(x: number, y: number): Element {
    // center symbol
    const xShift = 1; // px
    const yShift = -2; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_9),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const node = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    node.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -0.4545455,0.9090909 -0.4545454,0.4545455 -0.9090909,0.45454542 -1.36363638,0 -0.90909092,-0.45454542 -0.4545454,-0.4545455 -0.4545455,-0.9090909 0,-1.3636364 0.4545455,-0.9090909 0.90909086,-0.9090909 1.36363637,-0.4545454 1.36363637,0 0.9090909,0.4545454 0.4545455,0.4545455 0.4545454,1.3636363 0,1.3636364 -0.4545454,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 -0.9090909,0.9090909 -1.36363638,0.4545454 -1.36363632,0 -0.909091,-0.4545454 -0.4545454,-0.9090909 0,-0.90909096 0.9090909,0 0,0.90909096 -0.4545455,0 0,-0.4545455 m 1.3636364,-3.1818182 -0.4545454,-0.9090909 0,-1.3636364 0.4545454,-0.9090909 m 4.0909091,-0.4545454 0.4545455,0.9090909 0,1.8181818 -0.4545455,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 m -1.81818178,-2.72727278 -0.45454546,-0.45454542 -0.45454546,-0.9090909 0,-1.8181819 0.45454546,-1.3636363 0.45454546,-0.4545455 0.90909091,-0.4545454 m 1.36363637,0 0.4545454,0.4545454 0.4545455,0.9090909 0,2.2727273 -0.4545455,1.81818182 -0.4545454,1.36363637 -0.4545455,0.90909091 -0.90909087,1.3636364 -0.90909091,0.4545454",
    );
    node.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    node.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    node.setAttribute("fill", "none");
    wrapper.appendChild(node);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number10(x: number, y: number): Element {
    // center symbol
    const xShift = -3; // px
    const yShift = -3.5; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_10),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const one = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    one.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915",
    );
    one.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    one.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    one.setAttribute("fill", "none");
    wrapper.appendChild(one);

    const numberXShift = 6.5; // px
    const numberYShift = -1.5; // px
    const zero = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    zero.setAttribute(
      "d",
      "m" +
        (x + numberXShift) +
        ", " +
        (y + numberYShift) +
        " -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 0.90909092,0 1.36363638,-0.4545454 0.9090909,-0.9090909 0.9090909,-1.36363641 0.4545455,-1.36363637 0.4545454,-1.81818182 0,-1.3636364 -0.4545454,-1.3636363 -0.4545455,-0.4545455 -0.9090909,-0.4545454 -0.9090909,0 m -1.36363638,0.9090909 -0.90909092,0.9090909 -0.4545454,0.9090909 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 3.1818182,0 0.9090909,-0.9090909 0.4545454,-0.90909091 0.4545455,-1.36363637 0.4545455,-1.81818182 0,-1.8181818 -0.4545455,-0.9090909 m -1.8181818,-0.9090909 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 0.90909092,0 0.90909091,-0.4545454 0.90909087,-1.3636364 0.4545455,-0.90909091 0.4545454,-1.36363637 0.4545455,-1.81818182 0,-2.2727273 -0.4545455,-0.9090909 -0.4545454,-0.4545454",
    );
    zero.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    zero.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    zero.setAttribute("fill", "none");
    wrapper.appendChild(zero);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number11(x: number, y: number): Element {
    // center symbol
    const xShift = -3; // px
    const yShift = -3; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_11),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const one = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    one.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915",
    );
    one.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    one.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    one.setAttribute("fill", "none");
    wrapper.appendChild(one);

    const numberXShift = 6; // px
    const numberYShift = 0; // px
    const one2 = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    one2.setAttribute(
      "d",
      "m" +
        (x + numberXShift) +
        ", " +
        (y + numberYShift) +
        " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915",
    );
    one2.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    one2.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    one2.setAttribute("fill", "none");
    wrapper.appendChild(one2);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  number12(x: number, y: number): Element {
    // center symbol
    const xShift = -3; // px
    const yShift = -3; // px
    x = Math.round(x + xShift * this.settings.SYMBOL_SCALE);
    y = Math.round(y + yShift * this.settings.SYMBOL_SCALE);

    const wrapper = document.createElementNS(
      this.context.root.namespaceURI,
      "g",
    );
    wrapper.setAttribute(
      "id",
      this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_12),
    );
    wrapper.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );

    const one = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    one.setAttribute(
      "d",
      "m" +
        x +
        ", " +
        y +
        " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915",
    );
    one.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    one.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    one.setAttribute("fill", "none");
    wrapper.appendChild(one);

    const numberXShift = 4; // px
    const numberYShift = 1; // px
    const two = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    two.setAttribute(
      "d",
      "m" +
        (x + numberXShift) +
        ", " +
        (y + numberYShift) +
        " 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455",
    );
    two.setAttribute("stroke", this.settings.CUSPS_FONT_COLOR);
    two.setAttribute(
      "stroke-width",
      (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString(),
    );
    two.setAttribute("fill", "none");
    wrapper.appendChild(two);

    if (this.settings.ADD_CLICK_AREA)
      wrapper.appendChild(this.createRectForClick(x, y));
    return wrapper;
  }

  /**
   * Draw circular sector
   *
   * @param {int} x - circle x center position
   * @param {int} y - circle y center position
   * @param {int} radius - circle radius in px
   * @param {int} a1 - angleFrom in degree
   * @param {int} a2 - angleTo in degree
   * @param {int} thickness - from outside to center in px
   *
   * @return {SVGElement} segment
   *
   * @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
   */
  segment(
    x: number,
    y: number,
    radius: number,
    a1: number,
    a2: number,
    thickness: number,
    lFlag?: number,
    sFlag?: number,
  ): Element {
    // @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
    const LARGE_ARC_FLAG = lFlag || 0;
    const SWEET_FLAG = sFlag || 0;

    a1 = (((this.settings.SHIFT_IN_DEGREES - a1) % 360) * Math.PI) / 180;
    a2 = (((this.settings.SHIFT_IN_DEGREES - a2) % 360) * Math.PI) / 180;

    const segment = document.createElementNS(
      this.context.root.namespaceURI,
      "path",
    );
    segment.setAttribute(
      "d",
      "M " +
        (x + thickness * Math.cos(a1)) +
        ", " +
        (y + thickness * Math.sin(a1)) +
        " l " +
        (radius - thickness) * Math.cos(a1) +
        ", " +
        (radius - thickness) * Math.sin(a1) +
        " A " +
        radius +
        ", " +
        radius +
        ",0 ," +
        LARGE_ARC_FLAG +
        ", " +
        SWEET_FLAG +
        ", " +
        (x + radius * Math.cos(a2)) +
        ", " +
        (y + radius * Math.sin(a2)) +
        " l " +
        (radius - thickness) * -Math.cos(a2) +
        ", " +
        (radius - thickness) * -Math.sin(a2) +
        " A " +
        thickness +
        ", " +
        thickness +
        ",0 ," +
        LARGE_ARC_FLAG +
        ", " +
        1 +
        ", " +
        (x + thickness * Math.cos(a1)) +
        ", " +
        (y + thickness * Math.sin(a1)),
    );
    segment.setAttribute("fill", "none");
    return segment;
  }

  /**
   * Draw line in circle
   *
   * @param {int} x1
   * @param {int} y2
   * @param {int} x2
   * @param {int} y2
   * @param {String} color - HTML rgb
   *
   * @return {SVGElement} line
   */
  line(x1: number, y1: number, x2: number, y2: number): Element {
    const line = document.createElementNS(
      this.context.root.namespaceURI,
      "line",
    );
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    return line;
  }

  /**
   * Draw a circle
   *
   * @param {int} cx
   * @param {int} cy
   * @param {int} radius
   *
   * @return {SVGElement} circle
   */
  circle(cx: number, cy: number, radius: number): Element {
    const circle = document.createElementNS(
      this.context.root.namespaceURI,
      "circle",
    );
    circle.setAttribute("cx", cx.toString());
    circle.setAttribute("cy", cy.toString());
    circle.setAttribute("r", radius.toString());
    circle.setAttribute("fill", "none");
    return circle;
  }

  /**
   * Draw a text
   *
   * @param {String} text
   * @param {int} x
   * @param {int} y
   * @param {String} size - etc. "13px"
   * @param {String} color - HTML rgb
   *
   * @return {SVGElement} text
   */
  text(
    txt: string,
    x: number,
    y: number,
    size: string,
    color: string,
  ): Element {
    const text = document.createElementNS(
      this.context.root.namespaceURI,
      "text",
    );
    text.setAttribute("x", x.toString());
    text.setAttribute("y", y.toString());
    text.setAttribute("font-size", size);
    text.setAttribute("fill", color);
    text.setAttribute("font-family", "serif");
    text.setAttribute("dominant-baseline", "central");
    text.appendChild(document.createTextNode(txt));
    text.setAttribute(
      "transform",
      "translate(" +
        -x * (this.settings.SYMBOL_SCALE - 1) +
        "," +
        -y * (this.settings.SYMBOL_SCALE - 1) +
        ") scale(" +
        this.settings.SYMBOL_SCALE +
        ")",
    );
    return text;
  }
}

export default SVG;
