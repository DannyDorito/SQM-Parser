export class TemplateClass {
  // Use Object.getPrototypeOf(x) to get the base class
  constructor() {}
}

export class NPCTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'NPC';
  }
}

export class PlayerTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'Player';
  }
}

export class VehicleTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'Vehicle';
  }
}

export class WeatherTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'Weather';
  }
}

export class IntroTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'Intro';
  }
}

export class OutroTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'Outro';
  }
}

export class SquadTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'Squad';
  }
}

export class ObjectTemplate extends TemplateClass {
  constructor() {
    super();
  }

  toString() {
    return 'Object';
  }
}
